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

// ─── Starter code templates ───────────────────────────────────────────────────

const CPP_IO = `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`;

const JAVA_IO = `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
        
    }
}`;

const PY_IO = `# Write your solution here
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}` },
      { language: "java",   code: `public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}` },
      { language: "python", code: `print("Hello, World!")` },
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong();\n        long b = sc.nextLong();\n        System.out.println(a + b);\n    }\n}` },
      { language: "python", code: `a, b = map(int, input().split())\nprint(a + b)` },
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n    long long result = 1;\n    for (long long i = 2; i <= n; i++) result *= i;\n    cout << result << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        long result = 1;\n        for (long i = 2; i <= n; i++) result *= i;\n        System.out.println(result);\n    }\n}` },
      { language: "python", code: `n = int(input())\nresult = 1\nfor i in range(2, n + 1):\n    result *= i\nprint(result)` },
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n == 0) { cout << 0; return 0; }\n    long long a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        long long c = a + b;\n        a = b; b = c;\n    }\n    cout << b << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n == 0) { System.out.println(0); return; }\n        long a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            long c = a + b; a = b; b = c;\n        }\n        System.out.println(b);\n    }\n}` },
      { language: "python", code: `n = int(input())\nif n == 0:\n    print(0)\nelse:\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    print(b)` },
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
      { language: "cpp",    code: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    string rev = s;\n    reverse(rev.begin(), rev.end());\n    cout << (s == rev ? "YES" : "NO") << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(rev) ? "YES" : "NO");\n    }\n}` },
      { language: "python", code: `s = input()\nprint("YES" if s == s[::-1] else "NO")` },
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
      { language: "cpp",    code: `#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    string vowels = "aeiouAEIOU";\n    int count = 0;\n    for (char c : s) {\n        if (vowels.find(c) != string::npos) count++;\n    }\n    cout << count << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        String vowels = "aeiouAEIOU";\n        int count = 0;\n        for (char c : s.toCharArray()) {\n            if (vowels.indexOf(c) >= 0) count++;\n        }\n        System.out.println(count);\n    }\n}` },
      { language: "python", code: `s = input()\nprint(sum(1 for c in s if c in "aeiouAEIOU"))` },
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
      { language: "cpp",    code: `#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}` },
      { language: "python", code: `s = input()\nprint(s[::-1])` },
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
      { language: "cpp",    code: `#include <iostream>\n#include <climits>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int maxVal = INT_MIN;\n    for (int i = 0; i < n; i++) {\n        int x; cin >> x;\n        if (x > maxVal) maxVal = x;\n    }\n    cout << maxVal << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int max = Integer.MIN_VALUE;\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            if (x > max) max = x;\n        }\n        System.out.println(max);\n    }\n}` },
      { language: "python", code: `n = int(input())\narr = list(map(int, input().split()))\nprint(max(arr))` },
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    for (int i = 1; i <= n; i++) {\n        if (i % 15 == 0) cout << "FizzBuzz";\n        else if (i % 3 == 0) cout << "Fizz";\n        else if (i % 5 == 0) cout << "Buzz";\n        else cout << i;\n        cout << "\\n";\n    }\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) System.out.println("FizzBuzz");\n            else if (i % 3 == 0) System.out.println("Fizz");\n            else if (i % 5 == 0) System.out.println("Buzz");\n            else System.out.println(i);\n        }\n    }\n}` },
      { language: "python", code: `n = int(input())\nfor i in range(1, n + 1):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)` },
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int arr[n];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) { cout << i; return 0; }\n    }\n    cout << -1;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            if (arr[i] == target) { System.out.println(i); return; }\n        }\n        System.out.println(-1);\n    }\n}` },
      { language: "python", code: `n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\ntry:\n    print(arr.index(target))\nexcept ValueError:\n    print(-1)` },
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int arr[n];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) { cout << mid; return 0; }\n        else if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    cout << -1;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        int lo = 0, hi = n - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (arr[mid] == target) { System.out.println(mid); return; }\n            else if (arr[mid] < target) lo = mid + 1;\n            else hi = mid - 1;\n        }\n        System.out.println(-1);\n    }\n}` },
      { language: "python", code: `n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\nlo, hi = 0, n - 1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n        print(mid)\n        break\n    elif arr[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nelse:\n    print(-1)` },
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
      { language: "cpp",    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int arr[n];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    // Bubble sort\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - i - 1; j++)\n            if (arr[j] > arr[j + 1]) swap(arr[j], arr[j + 1]);\n    for (int i = 0; i < n; i++)\n        cout << arr[i] << (i < n - 1 ? " " : "\\n");\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        for (int i = 0; i < n - 1; i++)\n            for (int j = 0; j < n - i - 1; j++)\n                if (arr[j] > arr[j + 1]) { int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t; }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < n; i++) sb.append(arr[i]).append(i < n-1 ? " " : "");\n        System.out.println(sb);\n    }\n}` },
      { language: "python", code: `n = int(input())\narr = list(map(int, input().split()))\nfor i in range(n - 1):\n    for j in range(n - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]\nprint(*arr)` },
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
      { language: "cpp",    code: `#include <iostream>\n#include <string>\n#include <cstdlib>\nusing namespace std;\n\nint main() {\n    string s; cin >> s;\n    if (s[0] == '-') s = s.substr(1);\n    cout << s.size() << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.next();\n        if (s.charAt(0) == '-') s = s.substring(1);\n        System.out.println(s.length());\n    }\n}` },
      { language: "python", code: `n = input().strip()\nif n.startswith('-'):\n    n = n[1:]\nprint(len(n))` },
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
      { language: "cpp",    code: `#include <iostream>\n#include <cmath>\nusing namespace std;\n\nbool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i <= sqrt(n); i++)\n        if (n % i == 0) return false;\n    return true;\n}\n\nint main() {\n    int n; cin >> n;\n    cout << (isPrime(n) ? "YES" : "NO") << endl;\n    return 0;\n}` },
      { language: "java",   code: `import java.util.Scanner;\n\npublic class Solution {\n    static boolean isPrime(int n) {\n        if (n < 2) return false;\n        for (int i = 2; i * i <= n; i++)\n            if (n % i == 0) return false;\n        return true;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(isPrime(n) ? "YES" : "NO");\n    }\n}` },
      { language: "python", code: `import math\nn = int(input())\nif n < 2:\n    print("NO")\nelse:\n    prime = all(n % i != 0 for i in range(2, int(math.sqrt(n)) + 1))\n    print("YES" if prime else "NO")` },
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
      { language: "cpp",    code: `#include <iostream>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n; cin >> n;\n    int arr[n];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target; cin >> target;\n    unordered_map<int, int> seen;\n    for (int i = 0; i < n; i++) {\n        int complement = target - arr[i];\n        if (seen.count(complement)) {\n            cout << seen[complement] << " " << i;\n            return 0;\n        }\n        seen[arr[i]] = i;\n    }\n    return 0;\n}` },
      { language: "java",   code: `import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - arr[i];\n            if (seen.containsKey(comp)) {\n                System.out.println(seen.get(comp) + " " + i);\n                return;\n            }\n            seen.put(arr[i], i);\n        }\n    }\n}` },
      { language: "python", code: `n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\nseen = {}\nfor i, v in enumerate(arr):\n    comp = target - v\n    if comp in seen:\n        print(seen[comp], i)\n        break\n    seen[v] = i` },
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
