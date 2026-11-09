# CodeByte API Documentation

The CodeByte application separates concerns into discrete endpoints. All routes are prefixed by `/api`.

## Authentication Routes (`/api/auth`)

### Register User
* **Method**: `POST`
* **Path**: `/api/auth/register`
* **Request Body**:
  ```json
  {
    "username": "example_user",
    "email": "user@example.com",
    "password": "secure_password"
  }
  ```
* **Response**:
  ```json
  {
    "status": true,
    "user": {
      "username": "example_user",
      "email": "user@example.com",
      "profilePic": "..."
    }
  }
  ```

### Login User
* **Method**: `POST`
* **Path**: `/api/auth/login`
* **Request Body**:
  ```json
  {
    "username": "example_user_or_email",
    "password": "secure_password"
  }
  ```

---

## User Routes (`/api/auth` under user router)

### Get User Profile
* **Method**: `GET`
* **Path**: `/api/auth/getuser/:id`

### Set Avatar
* **Method**: `POST`
* **Path**: `/api/auth/setavatar/:id`

### Get Leaderboard
* **Method**: `GET`
* **Path**: `/api/auth/leaderboard`

---

## Quiz Routes (`/api/quiz`)

### Course Progress & Seed Course
* **Method**: `GET`
* **Path**: `/api/quiz/course/:topic/:id`

### Get Questions for Level
* **Method**: `GET`
* **Path**: `/api/quiz/questions/:unitnum/:levelnum`

### Submit Lesson Quiz Result
* **Method**: `POST`
* **Path**: `/api/quiz/submit`

### Set Coding Exercise for Unit (Admin Only)
* **Method**: `POST`
* **Path**: `/api/quiz/setexercise`
* **Auth**: Admin JWT required
* **Request Body**:
  ```json
  {
    "courseName": "java",
    "unitNumber": 1,
    "problemSlug": "hello-world"
  }
  ```

---

## Problem Routes (`/api/problems`)

### List Problems
* **Method**: `GET`
* **Path**: `/api/problems`
* **Auth**: None required
* **Response**:
  ```json
  {
    "status": true,
    "problems": [
      {
        "_id": "...",
        "title": "Two Sum",
        "slug": "two-sum",
        "difficulty": "medium",
        "tags": ["arrays", "hash-map"],
        "createdAt": "..."
      }
    ]
  }
  ```

### Get Single Problem
* **Method**: `GET`
* **Path**: `/api/problems/:slug`
* **Auth**: None required
* **Note**: Hidden test cases are strictly stripped before returning to client.
* **Response**:
  ```json
  {
    "status": true,
    "problem": {
      "title": "Two Sum",
      "slug": "two-sum",
      "statement": "...",
      "difficulty": "medium",
      "starterCode": [
        { "language": "cpp", "code": "..." },
        { "language": "java", "code": "..." },
        { "language": "python", "code": "..." }
      ],
      "timeLimitMs": 2000,
      "memLimitMb": 256,
      "testCases": [
        { "input": "...", "expected": "...", "hidden": false }
      ]
    }
  }
  ```

---

## Submission Routes (`/api/submissions`)

All submission routes require JWT Bearer token authentication via the `protect` middleware.

### Create Submission (Run or Submit)
* **Method**: `POST`
* **Path**: `/api/submissions`
* **Request Body**:
  ```json
  {
    "problemSlug": "two-sum",
    "language": "python",
    "code": "print('hello')",
    "mode": "run" // or "submit"
  }
  ```
* **Response**:
  ```json
  {
    "status": true,
    "submission": {
      "_id": "...",
      "verdict": "AC", // AC, WA, TLE, RE, CE
      "runtimeMs": 45,
      "memoryKb": 12400,
      "testResults": [
        {
          "testCaseIndex": 0,
          "passed": true,
          "verdict": "AC",
          "stdout": "...",
          "time": 0.04
        }
      ],
      "firstAC": true
    }
  }
  ```

### Check Problem Solved Status
* **Method**: `GET`
* **Path**: `/api/submissions/check/:slug`
* **Response**:
  ```json
  {
    "status": true,
    "solved": true
  }
  ```

### Get Current User's Submissions
* **Method**: `GET`
* **Path**: `/api/submissions/me`

### Get Submissions for Problem
* **Method**: `GET`
* **Path**: `/api/submissions/problem/:slug`

### Get Single Submission
* **Method**: `GET`
* **Path**: `/api/submissions/:id`

---

## Hint Routes (`/api/hints`)

All hint routes require JWT Bearer token authentication via the `protect` middleware.

### Get Hint Metadata
* **Method**: `GET`
* **Path**: `/api/hints/:slug/meta`
* **Response**:
  ```json
  {
    "status": true,
    "totalAvailable": 3,
    "revealedLevel": 1
  }
  ```

### Get Progressive Hint
* **Method**: `GET`
* **Path**: `/api/hints/:slug?level=1` (Query: `level` = 1, 2, or 3)
* **Note**: Sequential unlock enforced — unlocking level N requires level N-1 to be revealed first.
* **Response**:
  ```json
  {
    "status": true,
    "hints": [
      {
        "level": 1,
        "title": "Nudge",
        "content": "..."
      }
    ],
    "totalAvailable": 3
  }
  ```
