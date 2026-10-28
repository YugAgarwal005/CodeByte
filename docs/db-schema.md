# Database Schema Documentation

CodeByte utilizes MongoDB (via Mongoose ODM) to persist user accounts, course structures, question banks, and progress. To keep the learning process pristine and high-focus, CodeByte utilizes a lean, consistency-focused progression system.

## 1. Users Collection Schema (`users`)
* **`username`**: (String, required, unique) Minimum 3 characters, lowercase.
* **`email`**: (String, required, unique) User's unique email.
* **`password`**: (String, optional) Encrypted bcrypt hash (absent for OAuth registrations).
* **`profilePic`**: (String) Image URL or base64 avatar representation.
* **`followers`**: (Array of ObjectIds) Lists users following this account.
* **`following`**: (Array of ObjectIds) Lists accounts followed by this user.
* **`userData`**:
  * `xp`: (Number, default: 100) Accumulated experience points from lessons.
  * `streak`:
    * `dates`: Array of Dates matching active learning days.
    * `days`: Number of continuous active streak days.
  * `dailyChallenges`:
    * `xp`: (Number, default: 0)
    * `correctQuestions`: (Number, default: 0)
    * `lessonsNumber`: (Number, default: 0)
    * `date`: (Date, today's date formatted as ISO string)
* **`courseProgress`**:
  * Array of courses:
    * `courseName`: (String) e.g., "java", "c&c++"
    * `units`: Array of progress items:
      * `unitNumber`: (Number)
      * `level`: (Number) Maximum level/lesson completed.

## 2. Quiz Collection Schema (`quizzes`)
* **`name`**: (String, required) Course topic name, e.g., "java", "c&c++".
* **`units`**: Array of units:
  * `unitNumber`: (Number, required)
  * `heading`: (String, required) e.g., "Java Fundamentals".
  * `guideBook`: (String) Informational summary.
  * `lessons`: Array of lessons:
    * `lessonNumber`: (Number, required)
    * `questions`: Array of questions:
      * `question`: (String, required)
      * `options`: (Array of 4 Strings, required)
      * `correctAnswer`: (Number, 1-4, required)

## 3. Problems Collection Schema (`problems`)
* **`title`**: (String, required, trim) Problem title (e.g. "Two Sum").
* **`slug`**: (String, required, unique, lowercase) URL-friendly identifier.
* **`statement`**: (String, required) Markdown-formatted problem statement, constraints, and examples.
* **`difficulty`**: (String, enum: `["easy", "medium", "hard"]`, default: `"easy"`).
* **`tags`**: (Array of Strings) Categories (e.g. `["arrays", "hash-map"]`).
* **`starterCode`**: Array of starter templates:
  * `language`: (String, enum: `["cpp", "java", "python"]`, required)
  * `code`: (String, required)
* **`testCases`**: Array of test cases:
  * `input`: (String, default: `""`) Standard input provided to code.
  * `expected`: (String, required) Expected standard output.
  * `hidden`: (Boolean, default: `false`) When `true`, stripped from public problem view; only evaluated during "submit".
* **`timeLimitMs`**: (Number, default: 2000) Time limit per test case in milliseconds.
* **`memLimitMb`**: (Number, default: 256) Memory limit per test case in megabytes.

## 4. Submissions Collection Schema (`submissions`)
* **`user`**: (ObjectId, ref: `"User"`, required) Submitting user.
* **`problem`**: (ObjectId, ref: `"Problem"`, required) Problem being attempted.
* **`language`**: (String, enum: `["cpp", "java", "python"]`, required).
* **`code`**: (String, required) Source code submitted.
* **`status`**: (String, enum: `["queued", "running", "completed", "error"]`, default: `"completed"`).
* **`verdict`**: (String, enum: `["AC", "WA", "TLE", "CE", "RE", "MLE", "PENDING"]`, default: `"PENDING"`).
* **`runtimeMs`**: (Number) Execution time in milliseconds.
* **`memoryKb`**: (Number) Memory consumed in kilobytes.
* **`testResults`**: Array of individual test evaluations:
  * `testCaseIndex`: (Number)
  * `passed`: (Boolean)
  * `verdict`: (String)
  * `stdout`: (String)
  * `stderr`: (String)
  * `time`: (Number, seconds)
  * `memory`: (Number, kilobytes)
* **`createdAt`**: (Date, default: Date.now)

