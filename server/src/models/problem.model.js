import mongoose from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

/**
 * One test case: what goes in (stdin) and what we expect to come out (stdout).
 * hidden: true means this test case is NEVER sent to the client —
 *         it is only used server-side to determine the final verdict.
 */
const testCaseSchema = new mongoose.Schema({
  input:    { type: String, required: true },  // stdin fed to the program
  expected: { type: String, required: true },  // expected stdout (compared after trim())
  hidden:   { type: Boolean, default: false },  // if true, never expose to the client
});

/**
 * Per-language starter code that is pre-loaded in the Monaco editor
 * when the user opens a problem.
 */
const starterCodeSchema = new mongoose.Schema({
  language: { type: String, required: true },  // "cpp" | "java" | "python"
  code:     { type: String, required: true },  // boilerplate shown in the editor
});

// ─── Main schema ─────────────────────────────────────────────────────────────

const problemSchema = new mongoose.Schema(
  {
    // Human-readable title shown in the problem list
    title: { type: String, required: true },

    // URL-safe identifier used in /problems/:slug
    // unique: true creates a MongoDB unique index automatically
    slug: { type: String, required: true, unique: true },

    // Markdown string rendered on the problem page
    statement: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    // Free-form topic tags, e.g. ["arrays", "loops", "strings"]
    tags: { type: [String], default: [] },

    // One entry per supported language
    starterCode: { type: [starterCodeSchema], default: [] },

    // Execution limits passed to the judge
    timeLimitMs: { type: Number, default: 2000 }, // kill after this many ms
    memLimitMb:  { type: Number, default: 256  }, // kill if memory exceeds this

    // All test cases — some hidden, some visible
    testCases: { type: [testCaseSchema], required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Export — guard against Mongoose "Cannot overwrite model" error in hot-reload
export const Problem =
  mongoose.models.Problem || mongoose.model("Problem", problemSchema);
