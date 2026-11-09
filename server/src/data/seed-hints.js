/**
 * seed-hints.js
 *
 * Seeds progressive hints (nudge → approach → deeper) for every problem.
 * NO full solutions are stored here — just conceptual guidance.
 *
 * Run: node server/src/data/seed-hints.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Hint } from "../models/hint.model.js";
import { connectDB } from "../config/db.js";

const hints = [
  {
    slug: "hello-world",
    hints: [
      { level: 1, title: "Nudge",    content: "Every language has a built-in way to print text to the screen. Look up the print/output statement for your chosen language." },
      { level: 2, title: "Approach", content: "In C++ use `cout`, in Java use `System.out.println`, in Python use `print()`. The string to print is `Hello, World!` — note the comma and exclamation mark." },
      { level: 3, title: "Details",  content: "Make sure the output matches **exactly**: `Hello, World!` — capital H, comma after Hello, space, capital W, exclamation mark. A single character difference will give WA." },
    ],
  },
  {
    slug: "sum-of-two-numbers",
    hints: [
      { level: 1, title: "Nudge",    content: "You need to read two numbers from one line of input, then output their sum." },
      { level: 2, title: "Approach", content: "Read both values into integer/long variables. Use `+` to add them. Print the result. Watch for large values — A and B can be up to 10^9, so their sum needs a 64-bit integer (long in Java/C++)." },
      { level: 3, title: "Details",  content: "In C++: `long long a, b; cin >> a >> b; cout << a + b;`. In Python: `a, b = map(int, input().split()); print(a + b)`. The key insight is the data type — `int` overflows for 2×10^9." },
    ],
  },
  {
    slug: "factorial",
    hints: [
      { level: 1, title: "Nudge",    content: "Factorial is a repeated multiplication. Think about iterating from 1 to N and multiplying as you go." },
      { level: 2, title: "Approach", content: "Start with `result = 1`. Loop from `i = 2` to `N` (inclusive), multiplying `result *= i` each step. For N=0 or N=1, the answer is 1 (handle as a base case or the loop naturally gives 1)." },
      { level: 3, title: "Details",  content: "N ≤ 12 so 12! = 479,001,600 which fits in a 32-bit int, but using `long long` is safer. No recursion is needed — a simple loop is cleaner and avoids stack overhead." },
    ],
  },
  {
    slug: "fibonacci-nth-term",
    hints: [
      { level: 1, title: "Nudge",    content: "Each Fibonacci number is the sum of the two before it. You don't need to store the whole sequence — just track the last two values." },
      { level: 2, title: "Approach", content: "Use two variables `a = 0, b = 1`. For each step from 2 to N, compute `c = a + b`, then shift: `a = b, b = c`. After the loop, `b` holds F(N). Handle the edge case N=0 → return 0." },
      { level: 3, title: "Details",  content: "F(30) = 832,040 which fits easily in an int. The loop runs at most 29 times — no memoisation needed. The 'two-pointer slide' approach uses O(1) space." },
    ],
  },
  {
    slug: "check-palindrome",
    hints: [
      { level: 1, title: "Nudge",    content: "A palindrome reads the same forwards and backwards. Can you compare the string to its reverse?" },
      { level: 2, title: "Approach", content: "Create a reversed copy of the string and check if it equals the original. Alternatively, use two pointers — one at the start, one at the end — and walk them inward, comparing characters." },
      { level: 3, title: "Details",  content: "In Python: `s == s[::-1]` is the slickest way. In C++: `string rev = s; reverse(rev.begin(), rev.end()); return s == rev;`. Print `YES` or `NO` (uppercase, as the judge is case-sensitive)." },
    ],
  },
  {
    slug: "count-vowels",
    hints: [
      { level: 1, title: "Nudge",    content: "Iterate through each character of the string and check if it is one of a, e, i, o, u (upper or lower case)." },
      { level: 2, title: "Approach", content: "Maintain a counter starting at 0. For each character, check membership in the set `{a,e,i,o,u,A,E,I,O,U}`. Increment the counter on a match. Print the counter after the loop." },
      { level: 3, title: "Details",  content: "In Python: `sum(1 for c in s if c in 'aeiouAEIOU')`. In C++: use `string::find` on `\"aeiouAEIOU\"`. Use `getline` not `cin >>` so you read the whole line including spaces." },
    ],
  },
  {
    slug: "reverse-a-string",
    hints: [
      { level: 1, title: "Nudge",    content: "Think about how to access a string's characters from the end to the beginning." },
      { level: 2, title: "Approach", content: "Build the reversed string by iterating from the last index to index 0. Or use a built-in reverse function if your language has one." },
      { level: 3, title: "Details",  content: "Python: `s[::-1]`. C++: `reverse(s.begin(), s.end())` from `<algorithm>`. Java: `new StringBuilder(s).reverse().toString()`. All O(n) time, O(n) space." },
    ],
  },
  {
    slug: "find-maximum-in-array",
    hints: [
      { level: 1, title: "Nudge",    content: "Track the largest element seen so far as you scan through the array." },
      { level: 2, title: "Approach", content: "Initialise `max` to the smallest possible integer (or the first element). Loop through the array; whenever you see a value greater than `max`, update `max`. Print `max` after the loop." },
      { level: 3, title: "Details",  content: "In C++: initialise with `INT_MIN` from `<climits>`. In Python: just call `max(arr)`. Watch the input format — N is on line 1, the array on line 2. Read N first, then read N integers." },
    ],
  },
  {
    slug: "fizzbuzz",
    hints: [
      { level: 1, title: "Nudge",    content: "Loop from 1 to N. For each number, check divisibility conditions — check the combined condition first." },
      { level: 2, title: "Approach", content: "For each `i`: if `i % 15 == 0` print `FizzBuzz`; else if `i % 3 == 0` print `Fizz`; else if `i % 5 == 0` print `Buzz`; else print `i`. The order matters — check 15 before 3 or 5." },
      { level: 3, title: "Details",  content: "Each number goes on its own line. The `% 15` check is equivalent to `% 3 == 0 && % 5 == 0`. If you check 3 first, you'll print `Fizz` for numbers like 15 that should be `FizzBuzz`." },
    ],
  },
  {
    slug: "linear-search",
    hints: [
      { level: 1, title: "Nudge",    content: "Scan every element from left to right and stop the moment you find the target." },
      { level: 2, title: "Approach", content: "Iterate from index 0 to N-1. If `arr[i] == target`, print `i` and stop. If you finish the loop without finding it, print `-1`." },
      { level: 3, title: "Details",  content: "Return (or break) as soon as you find the first match — the problem says 'first occurrence'. In Python you can use `arr.index(target)` inside a try/except ValueError for -1." },
    ],
  },
  {
    slug: "binary-search",
    hints: [
      { level: 1, title: "Nudge",    content: "Because the array is sorted, you can eliminate half the remaining candidates with each comparison. Think about maintaining a search window [lo, hi]." },
      { level: 2, title: "Approach", content: "Set `lo = 0, hi = n-1`. While `lo <= hi`: compute `mid = (lo+hi)/2`. If `arr[mid] == target` return `mid`. If `arr[mid] < target` move `lo = mid+1`. Otherwise `hi = mid-1`. Return -1 if the loop ends." },
      { level: 3, title: "Details",  content: "Use `mid = lo + (hi - lo) / 2` instead of `(lo + hi) / 2` to avoid integer overflow when lo and hi are both large. Binary search runs in O(log n) — much faster than O(n) linear search." },
    ],
  },
  {
    slug: "bubble-sort",
    hints: [
      { level: 1, title: "Nudge",    content: "In each pass, compare neighbouring elements and swap them if they are in the wrong order. Repeat until no swaps are needed." },
      { level: 2, title: "Approach", content: "Use two nested loops: outer loop runs N-1 times; inner loop compares `arr[j]` and `arr[j+1]` for j from 0 to N-i-2 and swaps if `arr[j] > arr[j+1]`. After each outer iteration the largest unsorted element 'bubbles' to its correct position." },
      { level: 3, title: "Details",  content: "Output the sorted array space-separated. In Python: `print(*arr)`. After sorting, the array is sorted in-place. An optimisation: track whether any swap happened in the inner loop — if not, the array is already sorted and you can break early." },
    ],
  },
  {
    slug: "count-digits",
    hints: [
      { level: 1, title: "Nudge",    content: "How many characters does the number have when represented as a string? The minus sign doesn't count." },
      { level: 2, title: "Approach", content: "Read the input as a string. If it starts with '-', remove that character. The number of remaining characters is the digit count." },
      { level: 3, title: "Details",  content: "Python: `n = input().strip(); n = n.lstrip('-'); print(len(n))`. Avoid converting to int — very large numbers (the problem says 'up to 10 digits') are fine as strings. Special case: input `0` has 1 digit." },
    ],
  },
  {
    slug: "check-prime",
    hints: [
      { level: 1, title: "Nudge",    content: "A prime has no divisors other than 1 and itself. You only need to check divisors up to the square root of N." },
      { level: 2, title: "Approach", content: "Handle N < 2 → not prime. Then loop i from 2 to √N (inclusive). If `N % i == 0`, N is not prime. If no divisor is found, N is prime." },
      { level: 3, title: "Details",  content: "Why √N? If N = a × b and a ≤ b, then a ≤ √N. So if no factor ≤ √N exists, neither does any factor > √N. This gives O(√N) complexity, fast enough for N ≤ 10^6. Use `int(math.sqrt(n))` in Python or `(int)sqrt(n)` in C++." },
    ],
  },
  {
    slug: "two-sum",
    hints: [
      { level: 1, title: "Nudge",    content: "For each element, you need to know if its 'complement' (target − current value) has appeared earlier in the array. A hash map can answer membership queries in O(1)." },
      { level: 2, title: "Approach", content: "Use a dictionary/map: iterate through the array with index i. Compute `complement = target - arr[i]`. If `complement` is already in the map, you found the pair — print `map[complement]` (the earlier index) and `i`. Otherwise, add `arr[i] → i` to the map and continue." },
      { level: 3, title: "Details",  content: "This is O(n) time, O(n) space. The brute-force O(n²) double loop also works for small N but hash map is the intended approach. The problem guarantees exactly one valid answer, so you don't need to handle the no-answer case." },
    ],
  },
];

async function run() {
  console.log("Connecting…");
  await connectDB();
  console.log("Connected.\n");

  let upserted = 0;
  for (const h of hints) {
    await Hint.updateOne({ slug: h.slug }, { $set: h }, { upsert: true });
    console.log(`  ✓ ${h.slug}`);
    upserted++;
  }

  console.log(`\nDone. ${upserted} hint docs upserted.`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });

