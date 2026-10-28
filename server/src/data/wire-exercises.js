/**
 * wire-exercises.js
 *
 * One-off script that attaches seeded problems to specific units in each course.
 * Safe to run multiple times — uses findOne + explicit set, not upsert.
 *
 * Usage:
 *   node server/src/data/wire-exercises.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import Quiz from "../models/quiz.model.js";
import { connectDB } from "../config/db.js";

// Map: { courseName → [ { unitNumber, problemSlug } ] }
// Adjust these pairings to match your course content.
const EXERCISE_MAP = {
  "java": [
    { unitNumber: 1, problemSlug: "hello-world"       },
    { unitNumber: 2, problemSlug: "sum-of-two-numbers" },
    { unitNumber: 3, problemSlug: "factorial"           },
    { unitNumber: 4, problemSlug: "fibonacci-nth-term"  },
    { unitNumber: 5, problemSlug: "check-palindrome"    },
  ],
  "c&c++": [
    { unitNumber: 1, problemSlug: "hello-world"       },
    { unitNumber: 2, problemSlug: "sum-of-two-numbers" },
    { unitNumber: 3, problemSlug: "factorial"           },
    { unitNumber: 4, problemSlug: "fibonacci-nth-term"  },
    { unitNumber: 5, problemSlug: "check-palindrome"    },
  ],
  "python": [
    { unitNumber: 1, problemSlug: "hello-world"       },
    { unitNumber: 2, problemSlug: "sum-of-two-numbers" },
    { unitNumber: 3, problemSlug: "factorial"           },
    { unitNumber: 4, problemSlug: "fibonacci-nth-term"  },
    { unitNumber: 5, problemSlug: "check-palindrome"    },
  ],
};

async function run() {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected.\n");

  let attached = 0;
  let skipped  = 0;

  for (const [courseName, exercises] of Object.entries(EXERCISE_MAP)) {
    const quiz = await Quiz.findOne({ name: courseName });
    if (!quiz) {
      console.warn(`  ⚠ Course "${courseName}" not found in DB — skipping.`);
      skipped++;
      continue;
    }

    for (const { unitNumber, problemSlug } of exercises) {
      const unit = quiz.units.find((u) => u.unitNumber === unitNumber);
      if (!unit) {
        console.warn(`  ⚠ Unit ${unitNumber} not found in "${courseName}" — skipping.`);
        skipped++;
        continue;
      }

      unit.codingExercise = problemSlug;
      console.log(`  ✓ "${courseName}" Unit ${unitNumber} → "${problemSlug}"`);
      attached++;
    }

    await quiz.save();
  }

  console.log(`\nDone. ${attached} exercises attached, ${skipped} skipped.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
