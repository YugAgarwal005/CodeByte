import { judge0Adapter } from "./judge0.adapter.js";

/**
 * executeCode — the single entry point for running user code.
 *
 * This function is the "interface" that all controllers call.
 * In Phase 1 it always delegates to Judge0.
 * In Phase 4, setting EXECUTOR_ADAPTER=docker will swap it to
 * our own BullMQ + Docker worker — no controller or route changes needed.
 *
 * @param {Object} params
 * @param {string}   params.language    - "cpp" | "java" | "python"
 * @param {string}   params.code        - user's source code
 * @param {Array}    params.testCases   - [{ input, expected }, ...]
 * @param {number}   params.timeLimitMs - per-test time limit in milliseconds
 * @param {number}   params.memLimitMb  - per-test memory limit in megabytes
 *
 * @returns {Promise<Array>} - array of result objects, one per test case:
 *   { testCaseIndex, passed, verdict, stdout, stderr, time, memory }
 */
export async function executeCode({ language, code, testCases, timeLimitMs, memLimitMb }) {
  const adapter = getAdapter();
  return adapter.run({ language, code, testCases, timeLimitMs, memLimitMb });
}

/**
 * getAdapter — picks the right adapter based on the EXECUTOR_ADAPTER env var.
 *
 * Phase 1: 'judge0' (default)
 * Phase 4: 'docker'
 *
 * Adding a new adapter in the future means:
 *   1. Create server/src/executor/myAdapter.adapter.js
 *   2. Import it here
 *   3. Add a new `if` branch below
 *   → Zero changes needed in routes, controllers, or the frontend.
 */
function getAdapter() {
  const which = process.env.EXECUTOR_ADAPTER || "judge0";

  if (which === "judge0") {
    return judge0Adapter; // imported at top of file
  }

  // Future: if (which === 'docker') return dockerAdapter;

  throw new Error(
    `Unknown executor adapter: "${which}". ` +
    `Set EXECUTOR_ADAPTER to "judge0" (or "docker" in Phase 4).`
  );
}
