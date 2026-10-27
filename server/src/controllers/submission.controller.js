import { Problem }    from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { executeCode } from "../executor/index.js";

// ─── Allowed values ────────────────────────────────────────────────────────────
const ALLOWED_LANGUAGES = ["cpp", "java", "python"];
const ALLOWED_MODES     = ["run", "submit"];
const MAX_CODE_BYTES    = 64 * 1024; // 64 KB — reject absurdly large payloads

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * deriveVerdict — inspect per-test results and pick the worst overall verdict.
 *
 * Priority (highest to lowest): CE > TLE > RE > WA > AC
 * The logic: the first failing verdict in priority order "wins".
 */
function deriveVerdict(results) {
  const priority = ["CE", "TLE", "RE", "WA", "AC"];
  const verdictSet = new Set(results.map((r) => r.verdict));

  for (const v of priority) {
    if (verdictSet.has(v)) return v;
  }
  return "WA"; // fallback (should never hit this)
}

/**
 * safeTestResults — removes hidden test case details from the results array
 * before sending to the client.
 *
 * When mode="submit", hidden tests are run but the client should NOT see their
 * input/expected. We only tell them pass/fail + verdict for those tests.
 *
 * @param {Array}  rawResults - full results from the executor
 * @param {Array}  testCases  - the problem's test cases (with hidden flag)
 * @returns {Array}           - results safe to expose to the client
 */
function safeTestResults(rawResults, testCases) {
  return rawResults.map((r) => {
    const tc = testCases[r.testCaseIndex];
    if (tc && tc.hidden) {
      // For hidden tests: expose only pass/fail and verdict — no input/output
      return {
        testCaseIndex: r.testCaseIndex,
        passed:  r.passed,
        verdict: r.verdict,
        hidden:  true,
        // Deliberately omit stdout, stderr, time, memory for hidden tests
      };
    }
    // Visible tests: full info is fine
    return r;
  });
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * createSubmission
 * POST /api/submissions
 *
 * Accepts code, runs it against test cases via the executor, and returns
 * the full result. Auth required (protect middleware in route file).
 *
 * Body: { problemSlug, language, code, mode }
 *   mode="run"    → only visible test cases (quick feedback)
 *   mode="submit" → all test cases (official verdict)
 */
export const createSubmission = async (req, res, next) => {
  try {
    const { problemSlug, language, code, mode = "submit" } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!problemSlug || !language || !code) {
      return res.status(400).json({
        status: false,
        message: "problemSlug, language, and code are required",
      });
    }

    if (!ALLOWED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        status: false,
        message: `Language must be one of: ${ALLOWED_LANGUAGES.join(", ")}`,
      });
    }

    if (!ALLOWED_MODES.includes(mode)) {
      return res.status(400).json({
        status: false,
        message: `Mode must be "run" or "submit"`,
      });
    }

    // Reject extremely large code (basic abuse prevention)
    if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
      return res.status(400).json({
        status: false,
        message: "Code is too large (max 64 KB)",
      });
    }

    // ── Find the problem ──────────────────────────────────────────────────────
    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) {
      return res.status(404).json({ status: false, message: "Problem not found" });
    }

    // ── Decide which test cases to run ────────────────────────────────────────
    // mode="run"    → visible test cases only (faster, no official verdict)
    // mode="submit" → ALL test cases (hidden ones determine the real verdict)
    const testCasesToRun =
      mode === "run"
        ? problem.testCases.filter((tc) => !tc.hidden)
        : problem.testCases;

    // ── Create a "pending" submission doc ────────────────────────────────────
    // We save it now so the client has an ID to reference even if something fails
    const submission = await Submission.create({
      userId:    req.user.userId,  // set by protect middleware
      problemId: problem._id,
      language,
      code,
      mode,
      status:  "pending",
      verdict: "PENDING",
    });

    // ── Run the code ──────────────────────────────────────────────────────────
    await Submission.findByIdAndUpdate(submission._id, { status: "processing" });

    let rawResults;
    try {
      rawResults = await executeCode({
        language,
        code,
        testCases: testCasesToRun.map((tc) => ({
          input:    tc.input,
          expected: tc.expected,
        })),
        timeLimitMs: problem.timeLimitMs,
        memLimitMb:  problem.memLimitMb,
      });
    } catch (execError) {
      // If the executor itself crashes (e.g. network down), mark as RE
      await Submission.findByIdAndUpdate(submission._id, {
        status:      "done",
        verdict:     "RE",
        errorOutput: execError.message,
      });
      return res.status(200).json({
        status: true,
        submission: {
          _id:         submission._id,
          status:      "done",
          verdict:     "RE",
          errorOutput: execError.message,
          testResults: [],
        },
      });
    }

    // ── Map raw results back to test case indexes in the full array ───────────
    // rawResults[i] corresponds to testCasesToRun[i].
    // We need to store the correct index relative to problem.testCases.
    const allTestCases = problem.testCases;
    const visibleTCs   = allTestCases.filter((tc) => !tc.hidden);

    rawResults = rawResults.map((r, i) => {
      // Find the original index in problem.testCases
      const originalTC = testCasesToRun[i];
      const originalIndex = allTestCases.findIndex(
        (tc) =>
          tc.input === originalTC.input && tc.expected === originalTC.expected
      );
      return { ...r, testCaseIndex: originalIndex >= 0 ? originalIndex : i };
    });

    // ── Compute overall verdict ───────────────────────────────────────────────
    const verdict = deriveVerdict(rawResults);

    // ── Collect error output for CE/RE ────────────────────────────────────────
    const errorOutput =
      verdict === "CE" || verdict === "RE"
        ? rawResults.find((r) => r.stderr)?.stderr || ""
        : undefined;

    // ── Aggregate performance stats ────────────────────────────────────────────
    const runtimeMs = Math.max(...rawResults.map((r) => r.time  || 0));
    const memoryKb  = Math.max(...rawResults.map((r) => r.memory || 0));

    // ── Update the submission document ────────────────────────────────────────
    await Submission.findByIdAndUpdate(submission._id, {
      status:      "done",
      verdict,
      testResults: rawResults,
      runtimeMs,
      memoryKb,
      errorOutput,
    });

    // ── Build the client-safe response ────────────────────────────────────────
    // Strip hidden test case details from what we send to the client
    const safeResults = safeTestResults(rawResults, allTestCases);

    return res.json({
      status: true,
      submission: {
        _id:         submission._id,
        language,
        mode,
        status:      "done",
        verdict,
        testResults: safeResults,
        runtimeMs,
        memoryKb,
        errorOutput,
        createdAt:   submission.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * getSubmission
 * GET /api/submissions/:id
 *
 * Returns a single submission by ID.
 * Auth required — users can only see their own submissions.
 */
export const getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).lean();

    if (!submission) {
      return res.status(404).json({ status: false, message: "Submission not found" });
    }

    // Ownership check — prevent users from peeking at others' submissions
    if (submission.userId.toString() !== req.user.userId) {
      return res.status(403).json({ status: false, message: "Not authorised to view this submission" });
    }

    // Fetch the problem so we know which test cases were hidden
    const problem = await Problem.findById(submission.problemId).lean();
    const safeResults = problem
      ? safeTestResults(submission.testResults, problem.testCases)
      : submission.testResults;

    return res.json({ status: true, submission: { ...submission, testResults: safeResults } });
  } catch (error) {
    next(error);
  }
};

/**
 * getMySubmissions
 * GET /api/submissions/me
 *
 * Returns the current user's full submission history.
 * Auth required. Code is included, test results are stripped to save bandwidth.
 */
export const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ userId: req.user.userId })
      .select("problemId language mode verdict status runtimeMs memoryKb createdAt")
      .populate("problemId", "title slug difficulty") // join problem title + slug
      .sort({ createdAt: -1 })
      .limit(100) // cap to prevent huge payloads
      .lean();

    return res.json({ status: true, submissions });
  } catch (error) {
    next(error);
  }
};

/**
 * getProblemSubmissions
 * GET /api/submissions/problem/:slug
 *
 * Returns the current user's submissions for ONE specific problem.
 * Used to populate the history tab on the problem page.
 * Auth required.
 */
export const getProblemSubmissions = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const problem = await Problem.findOne({ slug }).select("_id").lean();
    if (!problem) {
      return res.status(404).json({ status: false, message: "Problem not found" });
    }

    const submissions = await Submission.find({
      userId:    req.user.userId,
      problemId: problem._id,
    })
      .select("language mode verdict status runtimeMs memoryKb createdAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({ status: true, submissions });
  } catch (error) {
    next(error);
  }
};
