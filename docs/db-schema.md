# Database Schema Documentation

CodeByte utilizes MongoDB (via Mongoose ODM) to persist user accounts, course structures, question banks, and gamified progress. To keep the learning process pristine and high-focus, virtual currencies and health pools (gems, shops, and hearts) have been completely removed from the active user interface, leaving a lean, consistency-focused progression system.

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
