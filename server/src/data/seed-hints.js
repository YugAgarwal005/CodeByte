/**
 * seed-hints.js
 *
 * Seeds progressive hints for all 15 track-aligned problems.
 * NO complete code solutions are revealed — strictly Socratic guidance.
 *
 * Run:
 *   node server/src/data/seed-hints.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Hint } from "../models/hint.model.js";
import { connectDB } from "../config/db.js";

const hints = [
  // ── C++ Track Hints ────────────────────────────────────────────────────────
  {
    slug: "cpp-basics-sum-and-average",
    hints: [
      { level: 1, title: "Nudge", content: "You need to accumulate numbers in a loop. Think about what variable type you need for the running sum." },
      { level: 2, title: "Approach", content: "Read `n` first. Initialize `long long sum = 0`. In a loop running `n` times, read each number `x` and do `sum += x`. Afterwards, calculate `int avg = sum / n`." },
      { level: 3, title: "Details", content: "Output with `cout << sum << \" \" << (sum / n) << endl;`. Use integer division (`/`) as requested by the problem description." },
    ],
  },
  {
    slug: "cpp-pointer-swap",
    hints: [
      { level: 1, title: "Nudge", content: "Remember that dereferencing a pointer with `*ptr` accesses the value stored at that memory address." },
      { level: 2, title: "Approach", content: "In `swapWithPointers(int* x, int* y)`, use a temporary variable: `int temp = *x; *x = *y; *y = temp;`. Then in `main`, call it using the address-of operator `&a` and `&b`." },
      { level: 3, title: "Details", content: "Pass addresses with `swapWithPointers(&a, &b)`. Print the swapped variables: `cout << a << \" \" << b << endl;`." },
    ],
  },
  {
    slug: "cpp-oop-rectangle-area",
    hints: [
      { level: 1, title: "Nudge", content: "Encapsulate the dimensions inside private variables in your class, and provide public methods for calculations." },
      { level: 2, title: "Approach", content: "Inside `class Rectangle`: `public: int getArea() { return length * width; } int getPerimeter() { return 2 * (length + width); }`." },
      { level: 3, title: "Details", content: "Instantiate the class: `Rectangle rect(l, w);`. Output `cout << rect.getArea() << \" \" << rect.getPerimeter() << endl;`." },
    ],
  },
  {
    slug: "cpp-stl-vector-sort",
    hints: [
      { level: 1, title: "Nudge", content: "`<algorithm>` provides `std::sort()` which takes an iterator range `(begin, end)`." },
      { level: 2, title: "Approach", content: "Fill the vector with `for (int i = 0; i < n; i++) cin >> vec[i];`. Call `sort(vec.begin(), vec.end());`." },
      { level: 3, title: "Details", content: "Iterate over the sorted vector and print each element with a trailing space: `for (int x : vec) cout << x << \" \";`." },
    ],
  },
  {
    slug: "cpp-generic-find-max",
    hints: [
      { level: 1, title: "Nudge", content: "A template function starts with `template <typename T>` and works with any type that supports the `>` comparison operator." },
      { level: 2, title: "Approach", content: "In `findMax`, set `T maxVal = arr[0]`. Loop from `i = 1` to `arr.size() - 1`. If `arr[i] > maxVal`, update `maxVal = arr[i]`. Return `maxVal`." },
      { level: 3, title: "Details", content: "Call `findMax(arr)` from `main()`. This keeps your search logic completely decoupled from the underlying data type." },
    ],
  },

  // ── Java Track Hints ───────────────────────────────────────────────────────
  {
    slug: "java-fundamentals-multiplication-table",
    hints: [
      { level: 1, title: "Nudge", content: "A simple `for` loop counting from 1 to 5 will give you the multipliers you need." },
      { level: 2, title: "Approach", content: "Use `Scanner sc = new Scanner(System.in); int n = sc.nextInt();`. Loop `for (int i = 1; i <= 5; i++) System.out.print((n * i) + (i < 5 ? \" \" : \"\"));`." },
      { level: 3, title: "Details", content: "Ensure output is on a single line separated by spaces. Don't add a trailing newline before each number." },
    ],
  },
  {
    slug: "java-oop-bank-account",
    hints: [
      { level: 1, title: "Nudge", content: "Look at the `BankAccount` class structure in the starter code. Methods like `deposit` and `withdraw` mutate `this.balance`." },
      { level: 2, title: "Approach", content: "In `main`, read `init`, `dep`, and `with`. Create `BankAccount acc = new BankAccount(init);`. Call `acc.deposit(dep); acc.withdraw(with);`." },
      { level: 3, title: "Details", content: "Print the final balance using `System.out.println(account.getBalance());`." },
    ],
  },
  {
    slug: "java-collections-frequency-count",
    hints: [
      { level: 1, title: "Nudge", content: "You can count matches while scanning the collection or use `Collections.frequency()`." },
      { level: 2, title: "Approach", content: "Read each word into an `ArrayList<String>`. Read the query word. Loop through the list and increment a counter whenever `word.equals(query)` is true." },
      { level: 3, title: "Details", content: "Remember to compare strings using `.equals()` in Java, not `==`! Output the integer count with `System.out.println(count);`." },
    ],
  },
  {
    slug: "java-exceptions-safe-division",
    hints: [
      { level: 1, title: "Nudge", content: "When integer division by zero happens in Java, the JVM throws an `ArithmeticException`." },
      { level: 2, title: "Approach", content: "Wrap the division `int res = a / b;` inside `try { ... } catch (ArithmeticException e) { System.out.println(\"DIV_BY_ZERO\"); }`." },
      { level: 3, title: "Details", content: "If no exception occurs, print `res`. This ensures your program never crashes with an unhandled exception." },
    ],
  },
  {
    slug: "java-streams-filter-even-sum",
    hints: [
      { level: 1, title: "Nudge", content: "Stream operations allow chained functional transformations like `.filter()` and `.mapToInt()`." },
      { level: 2, title: "Approach", content: "Convert your list: `numbers.stream().filter(x -> x % 2 == 0).mapToInt(Integer::intValue).sum()`." },
      { level: 3, title: "Details", content: "If you prefer traditional loops: `int sum = 0; for (int x : numbers) { if (x % 2 == 0) sum += x; } System.out.println(sum);`." },
    ],
  },

  // ── Python Track Hints ─────────────────────────────────────────────────────
  {
    slug: "python-basics-grade-calculator",
    hints: [
      { level: 1, title: "Nudge", content: "Use an `if` - `elif` - `else` ladder in descending order of score thresholds." },
      { level: 2, title: "Approach", content: "If `score >= 90`: print('A'); `elif score >= 80`: print('B'); `elif score >= 70`: print('C'); `elif score >= 60`: print('D'); `else`: print('F')." },
      { level: 3, title: "Details", content: "Testing scores in descending order ensures each range is checked accurately without needing compound `and` conditions." },
    ],
  },
  {
    slug: "python-ds-list-comprehension-squares",
    hints: [
      { level: 1, title: "Nudge", content: "List comprehensions have the syntax `[expression for item in iterable if condition]`." },
      { level: 2, title: "Approach", content: "`evens = [x**2 for x in nums if x % 2 == 0]`. Check `if evens:` print with `print(*evens)` else `print(\"NONE\")`." },
      { level: 3, title: "Details", content: "The `*` unpacking operator prints list items space-separated: `print(*evens)`." },
    ],
  },
  {
    slug: "python-oop-car-speed",
    hints: [
      { level: 1, title: "Nudge", content: "Instance methods in Python take `self` as their first parameter to access instance variables." },
      { level: 2, title: "Approach", content: "In `Car`: `self.speed += amount` inside `accelerate()`, and `self.speed = max(0, self.speed - amount)` inside `brake()`." },
      { level: 3, title: "Details", content: "Using `max(0, ...)` guarantees the speed never drops below zero even when braking hard." },
    ],
  },
  {
    slug: "python-exceptions-safe-int-parser",
    hints: [
      { level: 1, title: "Nudge", content: "Python uses `try` and `except` to catch runtime errors without crashing the script." },
      { level: 2, title: "Approach", content: "Wrap the conversion: `try: val = int(token); print(f'INT: {val}') except ValueError: print('INVALID')`." },
      { level: 3, title: "Details", content: "Make sure you catch `ValueError` specifically, which is raised when passing non-numeric strings to `int()`." },
    ],
  },
  {
    slug: "python-advanced-generator-countdown",
    hints: [
      { level: 1, title: "Nudge", content: "A function containing the `yield` keyword produces a generator object." },
      { level: 2, title: "Approach", content: "In `countdown(n)`: `while n >= 1: yield n; n -= 1`. Or `for i in range(n, 0, -1): yield i`." },
      { level: 3, title: "Details", content: "To print all values yielded by the generator: `print(*countdown(n))`." },
    ],
  },
];

async function run() {
  console.log("Connecting to MongoDB...");
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

run().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
