/**
 * seed-problems.js
 *
 * Populates the 15 track-aligned coding challenges (5 for C++, 5 for Java, 5 for Python).
 * Each challenge is directly aligned with the concepts taught in that unit's quiz,
 * and locked to that track's specific programming language.
 *
 * Run:
 *   node server/src/data/seed-problems.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Problem } from "../models/problem.model.js";

const problems = [
  // ═══════════════════════════════════════════════════════════════════════════
  // C & C++ TRACK (Locked to C++)
  // ═══════════════════════════════════════════════════════════════════════════

  // Unit 1: C & C++ Basics
  {
    title: "C++ Basics: Sum and Average",
    slug: "cpp-basics-sum-and-average",
    difficulty: "easy",
    tags: ["basics", "I/O", "loops"],
    requiredLanguage: "cpp",
    statement: `## C++ Basics: Sum and Average

Given an integer **N** followed by **N** space-separated integers, compute their total sum and their integer average (\`sum / N\`).

### Input Format
- Line 1: An integer **N** (1 ≤ N ≤ 1000).
- Line 2: **N** space-separated integers.

### Output Format
Print the **Sum** and **Average** separated by a single space.

### Example
\`\`\`
Input:
4
10 20 30 40

Output:
100 25
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "4\n10 20 30 40", expected: "100 25", hidden: false },
      { input: "3\n5 5 5", expected: "15 5", hidden: false },
      { input: "1\n42", expected: "42 42", hidden: true },
      { input: "5\n-10 10 -20 20 5", expected: "5 1", hidden: true },
      { input: "4\n1 2 3 5", expected: "11 2", hidden: true },
    ],
    starterCode: [
      {
        language: "cpp",
        code: `#include <iostream>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    
    // Read n integers, calculate sum and integer average (sum / n)
    // Print sum and average separated by a space
    
    return 0;
}`,
      },
    ],
  },

  // Unit 2: Pointers & Memory Management
  {
    title: "Pointers: Swap Two Values",
    slug: "cpp-pointer-swap",
    difficulty: "easy",
    tags: ["pointers", "memory"],
    requiredLanguage: "cpp",
    statement: `## Pointers: Swap Two Values

Given two integers **A** and **B**, swap their values using pointers and print the swapped values.

### Input Format
A single line containing two space-separated integers **A** and **B**.

### Output Format
Print the swapped values separated by a space (**B** then **A**).

### Example
\`\`\`
Input:
10 20

Output:
20 10
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "10 20", expected: "20 10", hidden: false },
      { input: "-5 15", expected: "15 -5", hidden: false },
      { input: "0 100", expected: "100 0", hidden: true },
      { input: "999 -999", expected: "-999 999", hidden: true },
    ],
    starterCode: [
      {
        language: "cpp",
        code: `#include <iostream>
using namespace std;

void swapWithPointers(int* x, int* y) {
    // Implement pointer swap logic
}

int main() {
    int a, b;
    if (cin >> a >> b) {
        swapWithPointers(&a, &b);
        cout << a << " " << b << endl;
    }
    return 0;
}`,
      },
    ],
  },

  // Unit 3: Object-Oriented C++ (OOP)
  {
    title: "OOP in C++: Rectangle Area & Perimeter",
    slug: "cpp-oop-rectangle-area",
    difficulty: "easy",
    tags: ["oop", "classes"],
    requiredLanguage: "cpp",
    statement: `## OOP in C++: Rectangle Area & Perimeter

Create a \`Rectangle\` class with private member variables for \`length\` and \`width\`. Implement member functions:
- \`getArea()\`: returns \`length * width\`
- \`getPerimeter()\`: returns \`2 * (length + width)\`

Given **length** and **width** from standard input, print the Area and Perimeter separated by a space.

### Input Format
A single line with two positive integers: length and width.

### Output Format
Print \`Area Perimeter\` separated by a space.

### Example
\`\`\`
Input:
5 4

Output:
20 18
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "5 4", expected: "20 18", hidden: false },
      { input: "10 10", expected: "100 40", hidden: false },
      { input: "1 1", expected: "1 4", hidden: true },
      { input: "12 8", expected: "96 40", hidden: true },
    ],
    starterCode: [
      {
        language: "cpp",
        code: `#include <iostream>
using namespace std;

class Rectangle {
private:
    int length;
    int width;
public:
    Rectangle(int l, int w) : length(l), width(w) {}
    // Implement getArea() and getPerimeter()
};

int main() {
    int l, w;
    if (cin >> l >> w) {
        Rectangle rect(l, w);
        // Print area and perimeter
    }
    return 0;
}`,
      },
    ],
  },

  // Unit 4: Data Structures & STL
  {
    title: "STL Vector: Sort Elements",
    slug: "cpp-stl-vector-sort",
    difficulty: "easy",
    tags: ["stl", "vector", "sorting"],
    requiredLanguage: "cpp",
    statement: `## STL Vector: Sort Elements

Given an integer **N** and **N** space-separated integers, store them in a \`std::vector<int>\`, sort them in ascending order using \`std::sort\`, and output the sorted list space-separated.

### Input Format
- Line 1: Integer **N** (1 ≤ N ≤ 1000).
- Line 2: **N** space-separated integers.

### Output Format
Print the sorted integers on a single line separated by spaces.

### Example
\`\`\`
Input:
5
4 1 5 2 3

Output:
1 2 3 4 5
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "5\n4 1 5 2 3", expected: "1 2 3 4 5", hidden: false },
      { input: "3\n9 2 7", expected: "2 7 9", hidden: false },
      { input: "1\n88", expected: "88", hidden: true },
      { input: "6\n-3 10 -8 0 5 2", expected: "-8 -3 0 2 5 10", hidden: true },
    ],
    starterCode: [
      {
        language: "cpp",
        code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> vec(n);
    for (int i = 0; i < n; i++) cin >> vec[i];
    
    // Sort vec using std::sort and print elements space-separated
    
    return 0;
}`,
      },
    ],
  },

  // Unit 5: Advanced C/C++ Concepts
  {
    title: "C++ Templates: Generic Max Element",
    slug: "cpp-generic-find-max",
    difficulty: "medium",
    tags: ["templates", "generics"],
    requiredLanguage: "cpp",
    statement: `## C++ Templates: Generic Max Element

Write a C++ template function \`findMax\` that finds and returns the largest value in an array or vector of **N** elements.

### Input Format
- Line 1: An integer **N** (1 ≤ N ≤ 1000).
- Line 2: **N** space-separated integers.

### Output Format
Print the single maximum integer.

### Example
\`\`\`
Input:
4
12 45 7 23

Output:
45
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "4\n12 45 7 23", expected: "45", hidden: false },
      { input: "3\n-10 -5 -20", expected: "-5", hidden: false },
      { input: "1\n100", expected: "100", hidden: true },
      { input: "5\n3 3 3 3 3", expected: "3", hidden: true },
    ],
    starterCode: [
      {
        language: "cpp",
        code: `#include <iostream>
#include <vector>
using namespace std;

template <typename T>
T findMax(const vector<T>& arr) {
    // Implement generic maximum search
}

int main() {
    int n;
    if (!(cin >> n)) return 0;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    
    cout << findMax(arr) << endl;
    return 0;
}`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JAVA TRACK (Locked to Java)
  // ═══════════════════════════════════════════════════════════════════════════

  // Unit 1: Java Fundamentals
  {
    title: "Java Fundamentals: First 5 Multiples",
    slug: "java-fundamentals-multiplication-table",
    difficulty: "easy",
    tags: ["basics", "Scanner", "loops"],
    requiredLanguage: "java",
    statement: `## Java Fundamentals: First 5 Multiples

Given an integer **N**, write a Java program using \`Scanner\` and a loop to compute and print the first 5 multiples of **N** (\`N*1\`, \`N*2\`, \`N*3\`, \`N*4\`, \`N*5\`) on a single line separated by spaces.

### Input Format
A single integer **N**.

### Output Format
The first 5 multiples of **N** separated by a space.

### Example
\`\`\`
Input:
3

Output:
3 6 9 12 15
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "3", expected: "3 6 9 12 15", hidden: false },
      { input: "5", expected: "5 10 15 20 25", hidden: false },
      { input: "1", expected: "1 2 3 4 5", hidden: true },
      { input: "10", expected: "10 20 30 40 50", hidden: true },
    ],
    starterCode: [
      {
        language: "java",
        code: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        // Print first 5 multiples of n space-separated
        
    }
}`,
      },
    ],
  },

  // Unit 2: Java Object-Oriented OOP
  {
    title: "Java OOP: Bank Account Balance",
    slug: "java-oop-bank-account",
    difficulty: "easy",
    tags: ["oop", "classes", "methods"],
    requiredLanguage: "java",
    statement: `## Java OOP: Bank Account Balance

Design a \`BankAccount\` class in Java with:
- A private field \`balance\`.
- A constructor initializing the balance.
- Methods: \`deposit(int amount)\`, \`withdraw(int amount)\`, and \`getBalance()\`.

Given **initialBalance**, **depositAmount**, and **withdrawalAmount**, calculate and output the final balance.

### Input Format
A single line with three space-separated integers:
\`initialBalance depositAmount withdrawalAmount\`

### Output Format
A single integer: the final account balance.

### Example
\`\`\`
Input:
1000 500 200

Output:
1300
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "1000 500 200", expected: "1300", hidden: false },
      { input: "500 100 600", expected: "0", hidden: false },
      { input: "100 50 0", expected: "150", hidden: true },
      { input: "2000 1000 500", expected: "2500", hidden: true },
    ],
    starterCode: [
      {
        language: "java",
        code: `import java.util.Scanner;

class BankAccount {
    private int balance;
    public BankAccount(int initial) {
        this.balance = initial;
    }
    public void deposit(int amt) { balance += amt; }
    public void withdraw(int amt) { balance -= amt; }
    public int getBalance() { return balance; }
}

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int init = sc.nextInt();
        int dep  = sc.nextInt();
        int with = sc.nextInt();
        
        BankAccount account = new BankAccount(init);
        account.deposit(dep);
        account.withdraw(with);
        System.out.println(account.getBalance());
    }
}`,
      },
    ],
  },

  // Unit 3: Java Collections Framework
  {
    title: "Java Collections: Element Occurrence Count",
    slug: "java-collections-frequency-count",
    difficulty: "medium",
    tags: ["collections", "ArrayList", "HashMap"],
    requiredLanguage: "java",
    statement: `## Java Collections: Element Occurrence Count

Given an integer **N**, followed by **N** space-separated words, and a target word **query**, use a Java Collection (\`ArrayList\` or \`HashMap\`) to count and print how many times **query** occurs in the list.

### Input Format
- Line 1: Integer **N**
- Line 2: **N** space-separated strings
- Line 3: String **query**

### Output Format
A single integer count.

### Example
\`\`\`
Input:
5
apple banana apple orange apple
apple

Output:
3
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "5\napple banana apple orange apple\napple", expected: "3", hidden: false },
      { input: "4\nred blue green yellow\nblack", expected: "0", hidden: false },
      { input: "3\njava java java\njava", expected: "3", hidden: true },
      { input: "1\ncode\ncode", expected: "1", hidden: true },
    ],
    starterCode: [
      {
        language: "java",
        code: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<String> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            list.add(sc.next());
        }
        String query = sc.next();
        
        // Count occurrences of query in list and print
        
    }
}`,
      },
    ],
  },

  // Unit 4: Exceptions & String Validation
  {
    title: "Java Exceptions: Safe Integer Division",
    slug: "java-exceptions-safe-division",
    difficulty: "easy",
    tags: ["exceptions", "try-catch"],
    requiredLanguage: "java",
    statement: `## Java Exceptions: Safe Integer Division

Given two integers **A** and **B**, perform integer division \`A / B\`. Use a \`try-catch\` block to catch \`ArithmeticException\` (division by zero).
- If division succeeds, print the integer quotient.
- If division by zero occurs, print \`DIV_BY_ZERO\`.

### Input Format
Two space-separated integers **A** and **B**.

### Output Format
The quotient or \`DIV_BY_ZERO\`.

### Examples
\`\`\`
Input: 10 2
Output: 5
\`\`\`
\`\`\`
Input: 8 0
Output: DIV_BY_ZERO
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "10 2", expected: "5", hidden: false },
      { input: "8 0", expected: "DIV_BY_ZERO", hidden: false },
      { input: "0 5", expected: "0", hidden: true },
      { input: "-20 4", expected: "-5", hidden: true },
      { input: "100 0", expected: "DIV_BY_ZERO", hidden: true },
    ],
    starterCode: [
      {
        language: "java",
        code: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        try {
            int result = a / b;
            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("DIV_BY_ZERO");
        }
    }
}`,
      },
    ],
  },

  // Unit 5: Java Modern Features
  {
    title: "Java Streams: Sum of Even Numbers",
    slug: "java-streams-filter-even-sum",
    difficulty: "medium",
    tags: ["streams", "lambdas"],
    requiredLanguage: "java",
    statement: `## Java Streams: Sum of Even Numbers

Given an integer **N** followed by **N** integers, filter only the even integers and output their sum using Java Streams / Lambdas. If no even numbers exist, print **0**.

### Input Format
- Line 1: Integer **N**
- Line 2: **N** space-separated integers

### Output Format
A single integer: the sum of all even numbers.

### Example
\`\`\`
Input:
5
1 2 3 4 5

Output:
6
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "5\n1 2 3 4 5", expected: "6", hidden: false },
      { input: "3\n1 3 5", expected: "0", hidden: false },
      { input: "4\n2 4 6 8", expected: "20", hidden: true },
      { input: "1\n10", expected: "10", hidden: true },
    ],
    starterCode: [
      {
        language: "java",
        code: `import java.util.*;
import java.util.stream.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < n; i++) numbers.add(sc.nextInt());
        
        // Use Java Stream API to filter even numbers and sum
        
    }
}`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PYTHON TRACK (Locked to Python)
  // ═══════════════════════════════════════════════════════════════════════════

  // Unit 1: Python Basics & Control Flow
  {
    title: "Python Basics: Score to Grade",
    slug: "python-basics-grade-calculator",
    difficulty: "easy",
    tags: ["basics", "conditionals"],
    requiredLanguage: "python",
    statement: `## Python Basics: Score to Grade

Given an integer score from 0 to 100, print the letter grade according to these criteria:
- **A**: 90 to 100
- **B**: 80 to 89
- **C**: 70 to 79
- **D**: 60 to 69
- **F**: below 60

### Input Format
A single integer score.

### Output Format
A single letter: A, B, C, D, or F.

### Example
\`\`\`
Input:
95

Output:
A
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "95", expected: "A", hidden: false },
      { input: "72", expected: "C", hidden: false },
      { input: "85", expected: "B", hidden: true },
      { input: "60", expected: "D", hidden: true },
      { input: "45", expected: "F", hidden: true },
      { input: "100", expected: "A", hidden: true },
    ],
    starterCode: [
      {
        language: "python",
        code: `score = int(input().strip())

# Determine letter grade using if / elif / else
`,
      },
    ],
  },

  // Unit 2: Data Structures in Python
  {
    title: "Python Data Structures: Even Squares",
    slug: "python-ds-list-comprehension-squares",
    difficulty: "easy",
    tags: ["lists", "comprehensions"],
    requiredLanguage: "python",
    statement: `## Python Data Structures: Even Squares

Given a list of space-separated integers, use a **list comprehension** to square only the even numbers. Print the resulting squares separated by spaces. If there are no even numbers, print \`NONE\`.

### Input Format
A single line with space-separated integers.

### Output Format
Space-separated squares of the even numbers, or \`NONE\`.

### Examples
\`\`\`
Input:
1 2 3 4 5

Output:
4 16
\`\`\`
\`\`\`
Input:
1 3 5

Output:
NONE
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "1 2 3 4 5", expected: "4 16", hidden: false },
      { input: "1 3 5", expected: "NONE", hidden: false },
      { input: "2 4 6", expected: "4 16 36", hidden: true },
      { input: "10", expected: "100", hidden: true },
    ],
    starterCode: [
      {
        language: "python",
        code: `nums = list(map(int, input().split()))

# Use list comprehension to find squares of even numbers
# Print space-separated squares, or "NONE" if empty
`,
      },
    ],
  },

  // Unit 3: Object-Oriented Python (OOP)
  {
    title: "Python OOP: Vehicle Speed Tracker",
    slug: "python-oop-car-speed",
    difficulty: "easy",
    tags: ["oop", "classes", "__init__"],
    requiredLanguage: "python",
    statement: `## Python OOP: Vehicle Speed Tracker

Create a Python class \`Car\` with:
- An \`__init__(self)\` method initializing \`self.speed = 0\`.
- \`accelerate(self, amount)\`: increases \`self.speed\` by amount.
- \`brake(self, amount)\`: decreases \`self.speed\` by amount (speed cannot fall below 0).

Given acceleration **A** and braking **B**, output the final speed.

### Input Format
Two space-separated integers: **A** and **B**.

### Output Format
A single integer representing the final speed.

### Example
\`\`\`
Input:
50 20

Output:
30
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "50 20", expected: "30", hidden: false },
      { input: "10 25", expected: "0", hidden: false },
      { input: "100 0", expected: "100", hidden: true },
      { input: "0 50", expected: "0", hidden: true },
    ],
    starterCode: [
      {
        language: "python",
        code: `class Car:
    def __init__(self):
        self.speed = 0
        
    def accelerate(self, amount):
        self.speed += amount
        
    def brake(self, amount):
        self.speed = max(0, self.speed - amount)

a, b = map(int, input().split())
car = Car()
car.accelerate(a)
car.brake(b)
print(car.speed)
`,
      },
    ],
  },

  // Unit 4: Modules & Exception Handling
  {
    title: "Python Exceptions: Safe Integer Parser",
    slug: "python-exceptions-safe-int-parser",
    difficulty: "easy",
    tags: ["exceptions", "try-except"],
    requiredLanguage: "python",
    statement: `## Python Exceptions: Safe Integer Parser

Read a string token from input. Try to parse it as an integer using \`int(token)\`.
- If parsing succeeds, print \`INT: <value>\`.
- If a \`ValueError\` is raised, catch it and print \`INVALID\`.

### Input Format
A single line string.

### Output Format
\`INT: <value>\` or \`INVALID\`.

### Examples
\`\`\`
Input:
42

Output:
INT: 42
\`\`\`
\`\`\`
Input:
hello

Output:
INVALID
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "42", expected: "INT: 42", hidden: false },
      { input: "hello", expected: "INVALID", hidden: false },
      { input: "-10", expected: "INT: -10", hidden: true },
      { input: "3.14", expected: "INVALID", hidden: true },
      { input: "0", expected: "INT: 0", hidden: true },
    ],
    starterCode: [
      {
        language: "python",
        code: `token = input().strip()

# Use try-except block to safely parse int
`,
      },
    ],
  },

  // Unit 5: Advanced Python Features
  {
    title: "Python Advanced: Countdown Generator",
    slug: "python-advanced-generator-countdown",
    difficulty: "medium",
    tags: ["generators", "yield"],
    requiredLanguage: "python",
    statement: `## Python Advanced: Countdown Generator

Write a generator function \`countdown(n)\` that yields integers from **N** down to 1 using the \`yield\` keyword.
Read **N** from input and print all yielded numbers space-separated on a single line.

### Input Format
A single positive integer **N**.

### Output Format
Numbers from **N** down to 1 separated by spaces.

### Example
\`\`\`
Input:
5

Output:
5 4 3 2 1
\`\`\``,
    timeLimitMs: 2000,
    memLimitMb: 256,
    testCases: [
      { input: "5", expected: "5 4 3 2 1", hidden: false },
      { input: "1", expected: "1", hidden: false },
      { input: "3", expected: "3 2 1", hidden: true },
      { input: "10", expected: "10 9 8 7 6 5 4 3 2 1", hidden: true },
    ],
    starterCode: [
      {
        language: "python",
        code: `def countdown(n):
    # Use yield to produce numbers from n down to 1
    pass

n = int(input().strip())
# Print numbers yielded by countdown(n) space-separated
`,
      },
    ],
  },
];

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
      { slug: p.slug },
      { $set: p },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      created++;
      console.log(`  ✓ Created: ${p.title} [${p.requiredLanguage}]`);
    } else {
      updated++;
      console.log(`  ↺ Updated: ${p.title} [${p.requiredLanguage}]`);
    }
  }

  console.log(`\nDone. ${created} created, ${updated} updated.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
