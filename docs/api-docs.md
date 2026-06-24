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
