/**
 * wire-exercises.js
 *
 * Attaches the 15 track-specific, concept-aligned coding challenges
 * to the corresponding units in each course.
 *
 * Usage:
 *   node server/src/data/wire-exercises.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import Quiz from "../models/quiz.model.js";
import { connectDB } from "../config/db.js";

const EXERCISE_MAP = {
  "c&c++": [
    { unitNumber: 1, problemSlug: "cpp-basics-sum-and-average"      },
    { unitNumber: 2, problemSlug: "cpp-pointer-swap"                 },
    { unitNumber: 3, problemSlug: "cpp-oop-rectangle-area"           },
    { unitNumber: 4, problemSlug: "cpp-stl-vector-sort"              },
    { unitNumber: 5, problemSlug: "cpp-generic-find-max"             },
  ],
  "java": [
    { unitNumber: 1, problemSlug: "java-fundamentals-multiplication-table" },
    { unitNumber: 2, problemSlug: "java-oop-bank-account"                 },
    { unitNumber: 3, problemSlug: "java-collections-frequency-count"      },
    { unitNumber: 4, problemSlug: "java-exceptions-safe-division"         },
    { unitNumber: 5, problemSlug: "java-streams-filter-even-sum"          },
  ],
  "python": [
    { unitNumber: 1, problemSlug: "python-basics-grade-calculator"        },
    { unitNumber: 2, problemSlug: "python-ds-list-comprehension-squares"  },
    { unitNumber: 3, problemSlug: "python-oop-car-speed"                  },
    { unitNumber: 4, problemSlug: "python-exceptions-safe-int-parser"     },
    { unitNumber: 5, problemSlug: "python-advanced-generator-countdown"  },
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
