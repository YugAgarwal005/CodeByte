import mongoose from "mongoose";

// ─── Sub-schema: one per test case result ────────────────────────────────────

/**
 * The result of running the user's code against a single test case.
 * We store this so the user can see which tests passed and which failed.
 */
const testResultSchema = new mongoose.Schema({
  testCaseIndex: { type: Number },   // 0-based index into the problem's testCases array
  passed:        { type: Boolean },  // true if stdout.trim() === expected.trim()
  stdout:        { type: String },   // what the program actually printed
  stderr:        { type: String },   // runtime error output (if any)
  time:          { type: Number },   // execution time in ms
  memory:        { type: Number },   // memory used in KB
});

// ─── Main schema ─────────────────────────────────────────────────────────────

const submissionSchema = new mongoose.Schema(
  {
    // ref: 'users' lets us use Mongoose's .populate() to get user details
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // ref: 'Problem' lets us populate problem details
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    language: { type: String, required: true }, // "cpp" | "java" | "python"

    // The actual source code submitted by the user
    code: { type: String, required: true },

    // "run"    → only visible test cases (quick feedback, no official verdict)
    // "submit" → ALL test cases (determines the real verdict)
    mode: {
      type: String,
      enum: ["run", "submit"],
      default: "submit",
    },

    // Lifecycle of the submission
    // pending → processing → done
    status: {
      type: String,
      enum: ["pending", "processing", "done"],
      default: "pending",
    },

    // The final verdict after all tests are run
    // AC  = All Correct
    // WA  = Wrong Answer
    // TLE = Time Limit Exceeded
    // RE  = Runtime Error
    // CE  = Compilation Error
    verdict: {
      type: String,
      enum: ["AC", "WA", "TLE", "RE", "CE", "PENDING"],
      default: "PENDING",
    },

    // Per-test results (only for visible tests when mode="run")
    testResults: { type: [testResultSchema], default: [] },

    // Aggregate stats across all test cases
    runtimeMs: { type: Number }, // maximum execution time across all tests
    memoryKb:  { type: Number }, // maximum memory used across all tests

    // Compiler or runtime error message (set when verdict is CE or RE)
    errorOutput: { type: String },
  },
  { timestamps: true } // createdAt, updatedAt
);

export const Submission =
  mongoose.models.Submission ||
  mongoose.model("Submission", submissionSchema);
