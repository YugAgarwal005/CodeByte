/**
 * hint.model.js
 *
 * Stores per-problem progressive hints.
 * Each problem can have up to 3 hints (nudge → approach → deeper approach).
 * No solution is ever stored here.
 */

import mongoose from "mongoose";

const hintSchema = new mongoose.Schema(
  {
    // The problem this hint belongs to
    slug: { type: String, required: true, unique: true, trim: true },

    // Up to 3 hints in order: nudge, approach, deeper approach
    // hint[0] = very gentle nudge ("think about what data structure helps here")
    // hint[1] = conceptual approach ("consider iterating through and tracking...")
    // hint[2] = step-by-step approach (still no code, just logic walkthrough)
    hints: [
      {
        level:   { type: Number, required: true }, // 1, 2, or 3
        title:   { type: String, required: true }, // Short label e.g. "Nudge"
        content: { type: String, required: true }, // The hint text (markdown)
      },
    ],
  },
  { timestamps: true }
);

export const Hint = mongoose.model("Hint", hintSchema);

