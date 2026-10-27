import { Problem } from "../models/problem.model.js";

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * stripHiddenTestCases — remove test cases where hidden === true.
 *
 * This is called before sending any problem data to the client.
 * We never expose the input/expected of hidden test cases — that would
 * let users hard-code outputs instead of writing real algorithms.
 *
 * @param {Object} problem - a plain JS object (from .lean() or .toObject())
 * @returns {Object}       - problem with hidden test cases removed
 */
function stripHiddenTestCases(problem) {
  return {
    ...problem,
    testCases: problem.testCases.filter((tc) => !tc.hidden),
  };
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * listProblems
 * GET /api/problems
 *
 * Returns all problems with title, slug, difficulty, and tags.
 * Does NOT include test cases or starter code (not needed for the list view).
 * No auth required.
 */
export const listProblems = async (req, res, next) => {
  try {
    // .select() limits which fields are returned, reducing payload size
    const problems = await Problem.find()
      .select("title slug difficulty tags createdAt")
      .sort({ difficulty: 1, title: 1 }) // easy first, then alphabetical
      .lean(); // returns plain JS objects (faster than Mongoose Documents)

    return res.json({ status: true, problems });
  } catch (error) {
    next(error);
  }
};

/**
 * getProblem
 * GET /api/problems/:slug
 *
 * Returns a single problem by its URL slug.
 * Includes statement, starter code, and VISIBLE test cases only.
 * Hidden test cases are stripped before the response is sent.
 * No auth required.
 */
export const getProblem = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const problem = await Problem.findOne({ slug }).lean();

    if (!problem) {
      return res.status(404).json({ status: false, message: "Problem not found" });
    }

    // ⚠ Security: strip hidden test cases BEFORE sending to client
    const safeProb = stripHiddenTestCases(problem);

    return res.json({ status: true, problem: safeProb });
  } catch (error) {
    next(error);
  }
};
