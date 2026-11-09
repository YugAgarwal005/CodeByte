/**
 * seed-problems.js
 *
 * Standalone script to populate the problems collection.
 * Run it once (or again safely — it uses upsert so duplicates are harmless):
 *
 *   node server/src/data/seed-problems.js
 *
 * It reads MONGO_URL from .env automatically.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Problem } from "../models/problem.model.js";

// ─── Blank starter code templates (no solution given to the student) ─────────

const CPP_IO = `#include <iostream>
using namespace std;

int main() {
    // Read input, solve, then print output
    
    return 0;
}`;

// For array/multi-line input problems
const CPP_ARRAY = `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    // Read n elements and solve
    
    return 0;
}`;

const JAVA_IO = `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read input, solve, then print output
        
    }
}`;

const PY_IO = `# Read input, solve, then print output
`;

// ─── Problems data ────────────────────────────────────────────────────────────

const problems = [
  // ── 1. Hello World ─────────────────────────────────────────────────────────
  {
    title:      "Hello World",
    slug:       "hello-world",
    difficulty: "easy",
    tags:       ["I/O"],
    statement: `## Hello World

Print \`Hello, World!\` to the output.

### Input
None.

### Output
\`Hello, World!\`

### Example
\`\`\`
Output: Hello, World!
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "", expected: "Hello, World!", hidden: false },
      { input: "", expected: "Hello, World!", hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 2. Sum of Two Numbers ──────────────────────────────────────────────────
  {
    title:      "Sum of Two Numbers",
    slug:       "sum-of-two-numbers",
    difficulty: "easy",
    tags:       ["math", "I/O"],
    statement: `## Sum of Two Numbers

Given two integers **A** and **B**, print their sum.

### Input
A single line with two space-separated integers A and B.

### Output
A single integer: A + B.

### Constraints
- -10^9 ≤ A, B ≤ 10^9

### Examples
\`\`\`
Input:  3 5
Output: 8
\`\`\`
\`\`\`
Input:  -4 10
Output: 6
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "3 5",    expected: "8",  hidden: false },
      { input: "-4 10",  expected: "6",  hidden: false },
      { input: "0 0",    expected: "0",  hidden: true  },
      { input: "1000000000 -1000000000", expected: "0", hidden: true },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 3. Factorial ───────────────────────────────────────────────────────────
  {
    title:      "Factorial",
    slug:       "factorial",
    difficulty: "easy",
    tags:       ["math", "loops", "recursion"],
    statement: `## Factorial

Given a non-negative integer **N**, compute N! (N factorial).

N! = N × (N-1) × ... × 2 × 1, and 0! = 1.

### Input
A single integer N.

### Output
A single integer: N!

### Constraints
- 0 ≤ N ≤ 12

### Examples
\`\`\`
Input:  5
Output: 120
\`\`\`
\`\`\`
Input:  0
Output: 1
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "5",  expected: "120",        hidden: false },
      { input: "0",  expected: "1",          hidden: false },
      { input: "1",  expected: "1",          hidden: true  },
      { input: "10", expected: "3628800",    hidden: true  },
      { input: "12", expected: "479001600",  hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 4. Fibonacci N-th Term ─────────────────────────────────────────────────
  {
    title:      "Fibonacci N-th Term",
    slug:       "fibonacci-nth-term",
    difficulty: "easy",
    tags:       ["math", "loops"],
    statement: `## Fibonacci N-th Term

Print the **N-th Fibonacci number** (0-indexed).

F(0) = 0, F(1) = 1, F(N) = F(N-1) + F(N-2).

### Input
A single integer N.

### Output
A single integer: F(N).

### Constraints
- 0 ≤ N ≤ 30

### Examples
\`\`\`
Input:  7
Output: 13
\`\`\`
\`\`\`
Input:  0
Output: 0
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "7",  expected: "13",     hidden: false },
      { input: "0",  expected: "0",      hidden: false },
      { input: "1",  expected: "1",      hidden: true  },
      { input: "10", expected: "55",     hidden: true  },
      { input: "30", expected: "832040", hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 5. Check Palindrome ────────────────────────────────────────────────────
  {
    title:      "Check Palindrome",
    slug:       "check-palindrome",
    difficulty: "easy",
    tags:       ["strings"],
    statement: `## Check Palindrome

Given a string **S**, determine if it reads the same forwards and backwards.

### Input
A single line containing a string S (no spaces, only lowercase letters).

### Output
Print \`YES\` if S is a palindrome, \`NO\` otherwise.

### Examples
\`\`\`
Input:  racecar
Output: YES
\`\`\`
\`\`\`
Input:  hello
Output: NO
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "racecar", expected: "YES", hidden: false },
      { input: "hello",   expected: "NO",  hidden: false },
      { input: "a",       expected: "YES", hidden: true  },
      { input: "abba",    expected: "YES", hidden: true  },
      { input: "abcd",    expected: "NO",  hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 6. Count Vowels ────────────────────────────────────────────────────────
  {
    title:      "Count Vowels",
    slug:       "count-vowels",
    difficulty: "easy",
    tags:       ["strings"],
    statement: `## Count Vowels

Count the number of vowels (a, e, i, o, u — both upper and lower case) in a string.

### Input
A single line containing a string S.

### Output
A single integer: the count of vowels.

### Examples
\`\`\`
Input:  Hello World
Output: 3
\`\`\`
\`\`\`
Input:  AEIou
Output: 5
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "Hello World", expected: "3", hidden: false },
      { input: "AEIou",       expected: "5", hidden: false },
      { input: "xyz",         expected: "0", hidden: true  },
      { input: "aeiouAEIOU",  expected: "10", hidden: true },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 7. Reverse a String ────────────────────────────────────────────────────
  {
    title:      "Reverse a String",
    slug:       "reverse-a-string",
    difficulty: "easy",
    tags:       ["strings"],
    statement: `## Reverse a String

Given a string **S**, print it reversed.

### Input
A single line containing the string S (no spaces).

### Output
The reversed string.

### Examples
\`\`\`
Input:  hello
Output: olleh
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "hello",   expected: "olleh",   hidden: false },
      { input: "abcde",   expected: "edcba",   hidden: false },
      { input: "a",       expected: "a",        hidden: true  },
      { input: "racecar", expected: "racecar",  hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 8. Find Maximum in Array ───────────────────────────────────────────────
  {
    title:      "Find Maximum in Array",
    slug:       "find-maximum-in-array",
    difficulty: "easy",
    tags:       ["arrays"],
    statement: `## Find Maximum in Array

Given an array of **N** integers, find and print the maximum element.

### Input
- Line 1: N (the size of the array)
- Line 2: N space-separated integers

### Output
A single integer: the maximum element.

### Examples
\`\`\`
Input:
5
3 1 4 1 5

Output: 5
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "5\n3 1 4 1 5",       expected: "5",    hidden: false },
      { input: "3\n-1 -2 -3",        expected: "-1",   hidden: false },
      { input: "1\n42",              expected: "42",   hidden: true  },
      { input: "6\n9 2 7 3 8 1",     expected: "9",    hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 9. FizzBuzz ────────────────────────────────────────────────────────────
  {
    title:      "FizzBuzz",
    slug:       "fizzbuzz",
    difficulty: "easy",
    tags:       ["conditions", "loops"],
    statement: `## FizzBuzz

For each number from **1 to N**:
- Print \`FizzBuzz\` if divisible by both 3 and 5
- Print \`Fizz\` if divisible by 3 only
- Print \`Buzz\` if divisible by 5 only
- Otherwise, print the number itself

### Input
A single integer N.

### Output
N lines, one per number.

### Example
\`\`\`
Input: 5

Output:
1
2
Fizz
4
Buzz
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "5",  expected: "1\n2\nFizz\n4\nBuzz",                           hidden: false },
      { input: "15", expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", hidden: false },
      { input: "1",  expected: "1",                                              hidden: true  },
      { input: "3",  expected: "1\n2\nFizz",                                     hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 10. Linear Search ─────────────────────────────────────────────────────
  {
    title:      "Linear Search",
    slug:       "linear-search",
    difficulty: "easy",
    tags:       ["arrays", "searching"],
    statement: `## Linear Search

Given an array of **N** integers and a **target**, find the 0-based index of the first occurrence of the target. Print **-1** if not found.

### Input
- Line 1: N
- Line 2: N space-separated integers
- Line 3: target

### Output
A single integer: the index of the first occurrence, or **-1**.

### Example
\`\`\`
Input:
5
10 20 30 40 50
30

Output: 2
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "5\n10 20 30 40 50\n30", expected: "2",  hidden: false },
      { input: "4\n1 2 3 4\n99",        expected: "-1", hidden: false },
      { input: "1\n7\n7",               expected: "0",  hidden: true  },
      { input: "5\n5 5 5 5 5\n5",       expected: "0",  hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 11. Binary Search ─────────────────────────────────────────────────────
  {
    title:      "Binary Search",
    slug:       "binary-search",
    difficulty: "medium",
    tags:       ["arrays", "algorithms", "searching"],
    statement: `## Binary Search

Given a **sorted** array of **N** integers and a **target**, find its 0-based index using binary search. Print **-1** if not found.

### Input
- Line 1: N
- Line 2: N space-separated integers (sorted ascending)
- Line 3: target

### Output
The 0-based index of the target, or **-1**.

### Example
\`\`\`
Input:
6
1 3 5 7 9 11
7

Output: 3
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "6\n1 3 5 7 9 11\n7",  expected: "3",  hidden: false },
      { input: "5\n2 4 6 8 10\n5",    expected: "-1", hidden: false },
      { input: "1\n42\n42",           expected: "0",  hidden: true  },
      { input: "4\n1 2 3 4\n4",       expected: "3",  hidden: true  },
      { input: "7\n1 2 3 4 5 6 7\n1", expected: "0",  hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 12. Bubble Sort ───────────────────────────────────────────────────────
  {
    title:      "Bubble Sort",
    slug:       "bubble-sort",
    difficulty: "medium",
    tags:       ["arrays", "sorting"],
    statement: `## Bubble Sort

Sort an array of **N** integers in ascending order using the Bubble Sort algorithm, then print the sorted array.

### Input
- Line 1: N
- Line 2: N space-separated integers

### Output
N space-separated integers in ascending order.

### Example
\`\`\`
Input:
5
64 34 25 12 22

Output: 12 22 25 34 64
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "5\n64 34 25 12 22", expected: "12 22 25 34 64", hidden: false },
      { input: "3\n3 1 2",          expected: "1 2 3",          hidden: false },
      { input: "1\n5",              expected: "5",               hidden: true  },
      { input: "4\n-3 0 -1 2",     expected: "-3 -1 0 2",      hidden: true  },
      { input: "5\n1 2 3 4 5",     expected: "1 2 3 4 5",      hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 13. Count Digits ──────────────────────────────────────────────────────
  {
    title:      "Count Digits",
    slug:       "count-digits",
    difficulty: "medium",
    tags:       ["math"],
    statement: `## Count Digits

Given an integer **N**, count how many digits it has.

### Input
A single integer N (may be negative).

### Output
A single integer: the number of digits in N (ignore the minus sign for negative numbers).

### Examples
\`\`\`
Input:  12345
Output: 5
\`\`\`
\`\`\`
Input:  -987
Output: 3
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "12345",  expected: "5", hidden: false },
      { input: "-987",   expected: "3", hidden: false },
      { input: "0",      expected: "1", hidden: true  },
      { input: "9999999999", expected: "10", hidden: true },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 14. Check Prime ───────────────────────────────────────────────────────
  {
    title:      "Check Prime",
    slug:       "check-prime",
    difficulty: "medium",
    tags:       ["math", "algorithms"],
    statement: `## Check Prime

Given an integer **N**, determine whether it is a prime number.

### Input
A single integer N.

### Output
Print \`YES\` if N is prime, \`NO\` otherwise.

### Constraints
- 1 ≤ N ≤ 10^6

### Examples
\`\`\`
Input:  7
Output: YES
\`\`\`
\`\`\`
Input:  4
Output: NO
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "7",  expected: "YES", hidden: false },
      { input: "4",  expected: "NO",  hidden: false },
      { input: "1",  expected: "NO",  hidden: true  },
      { input: "2",  expected: "YES", hidden: true  },
      { input: "999983", expected: "YES", hidden: true },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },

  // ── 15. Two Sum ───────────────────────────────────────────────────────────
  {
    title:      "Two Sum",
    slug:       "two-sum",
    difficulty: "medium",
    tags:       ["arrays", "hash-map"],
    statement: `## Two Sum

Given an array of **N** integers and a **target**, find the indices of the two numbers that add up to the target.

- Indices are 0-based.
- Print the smaller index first.
- Exactly one valid answer exists.

### Input
- Line 1: N
- Line 2: N space-separated integers
- Line 3: target

### Output
Two space-separated integers: the two indices.

### Example
\`\`\`
Input:
4
2 7 11 15
9

Output: 0 1
\`\`\`
(Because arr[0] + arr[1] = 2 + 7 = 9)`,
    timeLimitMs: 2000,
    memLimitMb:  256,
    testCases: [
      { input: "4\n2 7 11 15\n9",    expected: "0 1", hidden: false },
      { input: "3\n3 2 4\n6",        expected: "1 2", hidden: false },
      { input: "2\n1 9\n10",         expected: "0 1", hidden: true  },
      { input: "5\n0 4 3 0 -1\n0",   expected: "0 3", hidden: true  },
      { input: "4\n1 5 3 7\n8",      expected: "1 3", hidden: true  },
    ],
    starterCode: [
      { language: "cpp",    code: CPP_IO },
      { language: "java",   code: JAVA_IO },
      { language: "python", code: PY_IO },
    ],
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed() {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) {
    console.error("ERROR: MONGO_URL environment variable is not set.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URL);
  console.log("Connected.");

  let created = 0;
  let updated = 0;

  for (const p of problems) {
    const result = await Problem.updateOne(
      { slug: p.slug },      // find by slug (unique key)
      { $set: p },           // update all fields
      { upsert: true }       // create if not found
    );

    if (result.upsertedCount > 0) {
      created++;
      console.log(`  ✓ Created: ${p.title}`);
    } else {
      updated++;
      console.log(`  ↺ Updated: ${p.title}`);
    }
  }

  console.log(`\nDone. ${created} created, ${updated} updated.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
