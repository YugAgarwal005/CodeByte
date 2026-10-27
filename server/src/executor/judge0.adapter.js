import axios from "axios";

// ─── Language ID map ───────────────────────────────────────────────────────────
// Judge0 assigns a fixed integer to each language version.
// Full list: https://github.com/judge0/judge0/blob/master/docs/api/statuses-and-languages.md
const LANGUAGE_IDS = {
  cpp:    54, // C++ (GCC 9.2.0)
  java:   62, // Java (OpenJDK 13.0.1)
  python: 71, // Python (3.8.1)
};

// ─── Verdict map ──────────────────────────────────────────────────────────────
// Judge0 returns a numeric status_id in the response.
// We map that to our own verdict strings.
const STATUS_TO_VERDICT = {
  3:  "AC",  // Accepted
  4:  "WA",  // Wrong Answer
  5:  "TLE", // Time Limit Exceeded
  6:  "CE",  // Compilation Error
  7:  "RE",  // Runtime Error (SIGSEGV)
  8:  "RE",  // Runtime Error (SIGXFSZ)
  9:  "RE",  // Runtime Error (SIGFPE)
  10: "RE",  // Runtime Error (SIGABRT)
  11: "RE",  // Runtime Error (NZEC — Non-Zero Exit Code)
  12: "RE",  // Runtime Error (other)
  13: "RE",  // Internal Error (treat as RE for the user)
  14: "RE",  // Exec Format Error
};

// ─── Main adapter export ──────────────────────────────────────────────────────

export const judge0Adapter = {
  /**
   * run() submits each test case to Judge0 one at a time and returns results.
   *
   * Why sequential instead of batch?
   *   The free public CE instance has tighter batch limits.
   *   Sequential is simpler to understand and debug.
   *
   * @param {string}   language    - "cpp" | "java" | "python"
   * @param {string}   code        - the user's source code
   * @param {Array}    testCases   - [{ input, expected }, ...]
   * @param {number}   timeLimitMs - ms → converted to seconds for Judge0
   * @param {number}   memLimitMb  - MB → converted to KB for Judge0
   * @returns {Array}  one result object per test case
   */
  async run({ language, code, testCases, timeLimitMs, memLimitMb }) {
    const langId = LANGUAGE_IDS[language];
    if (!langId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // Judge0 base URL — defaults to the free public CE instance
    const base = (process.env.JUDGE0_BASE_URL || "https://ce.judge0.com").replace(/\/$/, "");

    // Build common headers (RapidAPI key is optional — only needed for hosted tiers)
    const headers = { "Content-Type": "application/json" };
    if (process.env.JUDGE0_API_KEY) {
      headers["X-RapidAPI-Key"]  = process.env.JUDGE0_API_KEY;
      headers["X-RapidAPI-Host"] = new URL(base).hostname;
    }

    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      try {
        // POST to Judge0 with wait=true so it runs synchronously
        // (no need to poll — Judge0 blocks until execution finishes)
        const response = await axios.post(
          `${base}/submissions`,
          {
            source_code:    code,
            language_id:    langId,
            stdin:          tc.input,
            cpu_time_limit: timeLimitMs / 1000,  // Judge0 wants seconds
            memory_limit:   memLimitMb  * 1024,  // Judge0 wants KB
          },
          {
            headers,
            params: { base64_encoded: false, wait: true },
            timeout: 30000, // 30s safety net for our HTTP call
          }
        );

        const data = response.data;

        // data.status.id is the Judge0 status code
        const statusId = data?.status?.id;
        const verdict  = STATUS_TO_VERDICT[statusId] || "RE";

        // For compilation errors, stdout is empty but compile_output has the message
        const stdout = (data.stdout || "").trim();
        const stderr = data.stderr || data.compile_output || data.message || "";

        // A test case passes only when the verdict is AC AND output matches
        const passed =
          verdict === "AC" && stdout === (tc.expected || "").trim();

        results.push({
          testCaseIndex: i,
          passed,
          // If the verdict isn't AC, override: a CE/TLE/RE won't match expected
          verdict: passed ? "AC" : verdict,
          stdout,
          stderr,
          time:   parseFloat(data.time   || 0) * 1000, // convert s → ms
          memory: parseFloat(data.memory || 0),        // already in KB
        });

        // Short-circuit on compilation error: no point running more tests
        if (verdict === "CE") {
          // Fill remaining test cases as CE so caller has a full-length array
          for (let j = i + 1; j < testCases.length; j++) {
            results.push({
              testCaseIndex: j,
              passed: false,
              verdict: "CE",
              stdout: "",
              stderr: `Compilation failed (see test case ${i + 1} for details)`,
              time: 0,
              memory: 0,
            });
          }
          break;
        }
      } catch (err) {
        // Network / timeout errors — treat as Internal Error
        console.error(`Judge0 error on test case ${i}:`, err.message);
        results.push({
          testCaseIndex: i,
          passed: false,
          verdict: "RE",
          stdout: "",
          stderr: `Judge communication error: ${err.message}`,
          time: 0,
          memory: 0,
        });
      }
    }

    return results;
  },
};
