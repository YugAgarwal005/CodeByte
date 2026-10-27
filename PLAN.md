# CodeByte — Online Judge Integration Plan

> **Phase 0 output** — Read this fully before approving Phase 1 work.
> Status: **AWAITING YOUR APPROVAL**

---

## Table of Contents
1. [Repository Findings](#1-repository-findings)
2. [How Existing Features Work](#2-how-existing-features-work)
3. [Risks and Pre-Phase-1 Decisions](#3-risks-and-pre-phase-1-decisions)
4. [Phase 1 Detailed Plan](#4-phase-1-detailed-plan)
5. [Open Questions](#5-open-questions)

---

## 1. Repository Findings

### 1.1 Project Layout

```
CodeByte/
+-- api/index.js            <- Vercel serverless entry (just re-exports app)
+-- client/                 <- React 19 + Vite 6 SPA
¦   +-- src/
¦   ¦   +-- App.jsx         <- Router: React Router v7
¦   ¦   +-- pages/
¦   ¦   ¦   +-- Dashboard/  <- Quiz, Leaderboard, Profile, Quests, ...
¦   ¦   ¦   +-- Home/Learn.jsx  <- Course map (Duolingo-style path)
¦   ¦   +-- components/     <- layout/ and common/ sub-folders
¦   ¦   +-- utils/
¦   ¦       +-- Apiroutes.js    <- All API base URLs (window.location.origin)
¦   ¦       +-- tokenManager.js <- JWT access + refresh, axios interceptors
+-- server/src/
¦   +-- server.js           <- Entry for local dev (listens on port 3000)
¦   +-- app.js              <- Express app, lazy DB connect middleware
¦   +-- config/db.js        <- Mongoose connect (singleton guard)
¦   +-- models/
¦   ¦   +-- user.model.js
¦   ¦   +-- quiz.model.js
¦   +-- routes/             <- auth, user, quiz
¦   +-- controllers/        <- auth, user, quiz
¦   +-- middlewares/        <- auth.middleware.js (protect), error.middleware.js
¦   +-- utils/
¦       +-- generateToken.js  <- JWT sign/verify (access 15m, refresh 1-30d)
¦       +-- streak.js
+-- docs/                   <- api-docs.md, db-schema.md (minimal/outdated)
+-- package.json            <- Monorepo root; "type": "module" (ES Modules)
+-- vercel.json             <- /api/* -> /api/index.js; SPA fallback
```

### 1.2 Tech Stack Confirmed

| Layer | What is used |
|---|---|
| Runtime | Node.js ES Modules ("type": "module") |
| Framework | Express 4.21 |
| DB | MongoDB + Mongoose 9.7 |
| Auth | JWT (jsonwebtoken 9) + bcryptjs 3 |
| Client | React 19, Vite 6, React Router v7, styled-components |
| File store | ImageKit (avatar uploads) |
| Deployment | Vercel (serverless) for both client and API |
| Package manager | npm (package-lock.json present; bun.lock also present — MIXED) |

### 1.3 Notable Dependencies Already Installed

- `socket.io` — in package.json but currently unused
- `@google/genai` — Google GenAI SDK already pulled in (useful for Phase 3 hints)
- `validator` — available for input sanitisation
- `tailwindcss` — installed but app is mostly styled-components

---

## 2. How Existing Features Work

### 2.1 Authentication

- **Register / Login / Google OAuth** via `POST /api/auth/register|login|googlelogin`
- Returns `{ accessToken, refreshToken, user }` stored in `localStorage` as `codebyte-user`
- **`protect` middleware** reads `Authorization: Bearer <token>`, calls `verifyAccessToken`,
  sets `req.user = { userId, username }`
- **Token refresh** — client polls every 14 minutes; axios 401 interceptor also triggers refresh
- **`req.user`** only has `userId` and `username`. No `isAdmin` flag is in the JWT payload.

### 2.2 Course / Quiz Flow

```
GET /api/quiz/course/:topic/:id
  -> seeds DB from courses.json if needed
  -> returns units list + user progress level for each unit

GET /api/quiz/questions/:unitnum/:levelnum?course=java&id=<userId>
  -> returns questions for that lesson
  -> locked check: levelnum > unit.level+1 returns null

POST /api/quiz/submit  (body has JSON string in postDataString field — quirky!)
  -> increments unit.level by 1 if correct lesson
  -> adds XP, gems, updates streak dates
```

**Locking logic:** A lesson is unlocked only if `levelnum <= unit.level + 1`.

**Unit completion (Learn.jsx line 87):**
`prevUnit.level >= prevUnit.lessons.length` — unit is "done" when level equals lesson count.

### 2.3 Streaks

Stored as array of date strings in `user.userData.streak.dates`.
`calculateStreak` counts consecutive days ending today or yesterday.
Updated on every quiz submit.

### 2.4 Leaderboard

`GET /api/auth/leaderboard` returns all users sorted by `userData.xp` descending.

### 2.5 Daily Quests

Hard-coded thresholds in `claimquest` controller:
- `earn100xp` — dailyChallenges.xp >= 100
- `solve10ques` — dailyChallenges.correctQuestions >= 10
- `score3lessons` — dailyChallenges.lessonsNumber >= 3

Each quest awards 50 XP. Resets daily.

### 2.6 Admin Routes (Current Security Gap)

`/createunit` and `/createques` are rendered in the UI only if `userData.isAdmin === true`,
but **there is no server-side guard on these routes** — anyone can POST to them directly.

### 2.7 Vercel Deployment

`vercel.json` routes all `/api/*` to `/api/index.js` (the serverless function).
SPA is served from `client/dist`. Express checks `process.env.VERCEL` to skip Vite dev middleware.

---

## 3. Risks and Pre-Phase-1 Decisions

### Risk R1 — `postDataString` Anti-Pattern
`POST /api/quiz/submit` receives `req.body.postDataString` as a JSON string inside a JSON body
(double-encoded). We will NOT change this in Phase 1 to avoid breaking existing behaviour.
Clean it up in Phase 2.

### Risk R2 — No Server-Side Admin Guard
`createunit` and `createques` have zero auth protection. We will add `protect` + `requireAdmin`
middleware in Phase 1. Small, safe, non-breaking fix.

### Risk R3 — Hardcoded Fallback JWT Secrets

```js
const JWT_SECRET = process.env.JWT_SECRET || 'codebyte_jwt_manual_access_secret_key_2026';
```

Security hole in production. We document in `.env.example` but do NOT change the fallback
(changing it would log out all existing users).

### Risk R4 — Vercel Serverless Cannot Run Code Execution
Judge0 calls are outbound HTTP requests from our server to Judge0. That is fine on Vercel
serverless — no long-running process needed. Phase 4 is where we move the worker off Vercel.

### Risk R5 — Mixed Package Manager
Both `package-lock.json` and `bun.lock` exist. We will use `npm` consistently (Vercel uses it).

### Risk R6 — `req.user` Has No `isAdmin`
The `protect` middleware puts only `{ userId, username }` in `req.user`. We will add a separate
`requireAdmin` middleware that does ONE extra DB lookup to check `user.isAdmin`. This is cleaner
than adding isAdmin to the JWT (avoids stale admin flags in old tokens).

### Risk R7 — Hidden Test Case Exposure
Test cases with `hidden: true` must NEVER reach the client. We use Mongoose `.select()` and
`.map()` to strip them in every GET response. We will write a test for this.

### Risk R8 — Slug Uniqueness for Problems
Problem slugs (e.g. `two-sum`) are used in URLs. We need a unique index on `slug` to prevent
duplicates. The seed script will use `updateOne` with `upsert: true`.

---

## 4. Phase 1 Detailed Plan

**Branch name:** `feature/judge-phase1`
**Goal:** Standalone judge that works end-to-end; no learning integration yet.

---

### 4.1 New Files to Create

```
server/src/
  models/
    problem.model.js         <- Problem schema
    submission.model.js      <- Submission schema
  routes/
    problem.routes.js        <- /api/problems/*
    submission.routes.js     <- /api/submissions/*
  controllers/
    problem.controller.js
    submission.controller.js
  executor/
    index.js                 <- Pluggable interface (the "executor")
    judge0.adapter.js        <- Judge0 HTTP adapter
  data/
    seed-problems.js         <- Seed script for 15 problems

client/src/
  pages/Judge/
    ProblemList.jsx          <- Browse problems
    ProblemPage.jsx          <- Monaco editor + submission UI
  utils/Apiroutes.js         <- Append new judge routes (no existing lines changed)
```

---

### 4.2 MongoDB Schemas

#### `problems` collection

```js
// A single test case: what goes in (stdin) and what should come out (stdout)
const testCaseSchema = new mongoose.Schema({
  input:    { type: String, required: true },  // stdin sent to the program
  expected: { type: String, required: true },  // expected stdout (trimmed on compare)
  hidden:   { type: Boolean, default: false }, // true = never sent to client
});

// Per-language starter code shown in the editor
const starterCodeSchema = new mongoose.Schema({
  language: { type: String, required: true },  // "cpp", "java", "python"
  code:     { type: String, required: true },  // boilerplate shown in editor
});

const problemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true }, // URL-safe id e.g. "two-sum"
  statement:   { type: String, required: true },               // Markdown text
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  tags:        { type: [String], default: [] },                // e.g. ["arrays", "loops"]
  starterCode: { type: [starterCodeSchema], default: [] },
  timeLimitMs: { type: Number, default: 2000 }, // kill process after this many ms
  memLimitMb:  { type: Number, default: 256 },  // kill process if over this MB
  testCases:   { type: [testCaseSchema], required: true },
}, { timestamps: true }); // adds createdAt, updatedAt automatically
```

#### `submissions` collection

```js
// Result for one test case
const testResultSchema = new mongoose.Schema({
  testCaseIndex: { type: Number },  // 0-indexed position in testCases array
  passed:        { type: Boolean }, // true if stdout === expected (trimmed)
  stdout:        { type: String },  // what the program actually printed
  stderr:        { type: String },  // error output
  time:          { type: Number },  // execution time in ms
  memory:        { type: Number },  // memory used in KB
});

const submissionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'problems', required: true },
  language:  { type: String, required: true },   // "cpp", "java", "python"
  code:      { type: String, required: true },   // the submitted source code
  // mode: "run" only tests visible cases; "submit" tests all cases
  mode:      { type: String, enum: ['run', 'submit'], default: 'submit' },
  // status tracks the async lifecycle of the submission
  status:    { type: String, enum: ['pending', 'processing', 'done'], default: 'pending' },
  verdict:   { type: String, enum: ['AC', 'WA', 'TLE', 'RE', 'CE', 'PENDING'], default: 'PENDING' },
  testResults:  { type: [testResultSchema], default: [] },
  runtimeMs:    { type: Number },  // max time across all test cases
  memoryKb:     { type: Number },  // max memory across all test cases
  errorOutput:  { type: String },  // compiler error or unhandled runtime message
}, { timestamps: true });
```

---

### 4.3 API Endpoints

```
GET  /api/problems
  -> List all problems (title, slug, difficulty, tags only — no test cases)
  -> No auth required

GET  /api/problems/:slug
  -> Single problem detail
  -> Returns: title, statement, starterCode, VISIBLE test cases only
  -> hidden test cases are STRIPPED — never sent to client
  -> No auth required

POST /api/submissions
  -> Submit or run code (auth required — protect middleware)
  -> Body: { problemSlug, language, code, mode }
  -> mode="run": only runs visible test cases (fast feedback)
  -> mode="submit": runs ALL test cases (determines the real verdict)
  -> Returns the full submission result (visible test results only)

GET  /api/submissions/:id
  -> Poll a specific submission (auth required)
  -> Returns only if submission.userId matches req.user.userId (ownership check)
  -> Never returns hidden test case input/expected in results

GET  /api/submissions/me
  -> Current user's submission history (auth required)
  -> Returns: problemSlug, language, verdict, createdAt (code omitted)
```

---

### 4.4 The Executor Interface

The key architectural decision. A clean function contract now means Phase 4 (Docker runner)
only needs a new adapter file — zero changes to routes, controllers, or frontend.

```js
// server/src/executor/index.js

/**
 * executeCode - run source code against an array of test cases
 *
 * @param {string} language    - one of: "cpp", "java", "python"
 * @param {string} code        - the user's source code
 * @param {Array}  testCases   - [{ input: string, expected: string }, ...]
 * @param {number} timeLimitMs - kill process after this many ms
 * @param {number} memLimitMb  - kill process if memory exceeds this
 *
 * @returns {Promise<Array>} - one result per test case:
 *   { passed: bool, stdout: string, stderr: string, time: number, memory: number }
 */
export async function executeCode({ language, code, testCases, timeLimitMs, memLimitMb }) {
  const adapter = getAdapter();
  return adapter.run({ language, code, testCases, timeLimitMs, memLimitMb });
}

// Phase 1: always 'judge0'. Phase 4: read env var to pick 'docker'
function getAdapter() {
  const which = process.env.EXECUTOR_ADAPTER || 'judge0';
  if (which === 'judge0') return judge0Adapter;
  throw new Error(`Unknown executor adapter: ${which}`);
}
```

---

### 4.5 Judge0 Adapter

```js
// server/src/executor/judge0.adapter.js

// Judge0 assigns a fixed integer ID to each language version
const LANGUAGE_IDS = {
  cpp:    54,  // C++ GCC 9.2.0
  java:   62,  // Java OpenJDK 13
  python: 71,  // Python 3.8
};

// Map Judge0 status_id to our internal verdict strings
// Judge0 docs: https://github.com/judge0/judge0/blob/master/docs/api/statuses-and-languages.md
const STATUS_MAP = {
  3: 'AC',   // Accepted
  4: 'WA',   // Wrong Answer
  5: 'TLE',  // Time Limit Exceeded
  6: 'CE',   // Compilation Error
  // 7-12 are runtime errors (SIGSEGV, SIGFPE, etc.) -> all map to 'RE'
};
```

**Required env vars:**
```
JUDGE0_BASE_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key      # omit if self-hosted without auth
EXECUTOR_ADAPTER=judge0               # switch to 'docker' in Phase 4
```

---

### 4.6 Frontend Components

#### `/problems` — ProblemList page
- Card/table grid of all problems
- Each row/card: title, difficulty badge (green/yellow/red), tags chips
- Clicking navigates to `/problems/:slug`

#### `/problems/:slug` — ProblemPage
- **Left panel (40%):** Markdown-rendered statement, constraints, sample test cases
- **Right panel (60%):** Monaco editor
  - Language dropdown: C++, Java, Python
  - Starter code auto-loads when language changes
- **Footer:** "Run" button + "Submit" button
- **Verdict chip:** colour-coded (grey PENDING -> green AC / red WA / orange TLE / red RE / yellow CE)
- **Results panel:** per-test-case pass/fail after Run/Submit
- **History tab:** past submissions for this problem

**New npm packages (client only):**
- `@monaco-editor/react` — the editor component
- `react-markdown` — render Markdown problem statements
- `remark-gfm` — GitHub-flavoured Markdown tables, code blocks

---

### 4.7 Problem Seed List (15 problems)

| # | Title | Difficulty | Tags |
|---|---|---|---|
| 1 | Hello World | easy | I/O |
| 2 | Sum of Two Numbers | easy | math |
| 3 | Factorial | easy | loops, recursion |
| 4 | Fibonacci N-th Term | easy | loops |
| 5 | Check Palindrome | easy | strings |
| 6 | Count Vowels | easy | strings |
| 7 | Reverse a String | easy | strings |
| 8 | Find Maximum in Array | easy | arrays |
| 9 | FizzBuzz | easy | conditions |
| 10 | Linear Search | easy | arrays |
| 11 | Binary Search | medium | arrays, algorithms |
| 12 | Bubble Sort | medium | sorting |
| 13 | Count Digits | medium | math |
| 14 | Check Prime | medium | math |
| 15 | Two Sum (return indices) | medium | arrays, hash |

Each problem: 2-3 visible test cases + 3-5 hidden test cases + starter code in C++, Java, Python.

---

### 4.8 Security Checklist

- [ ] `protect` on `POST /api/submissions`, `GET /api/submissions/:id`, `GET /api/submissions/me`
- [ ] Hidden test cases stripped in every `GET /api/problems/:slug` response
- [ ] Ownership check on `GET /api/submissions/:id` (reject if not the owner)
- [ ] `language` validated against whitelist before calling executor
- [ ] `mode` validated against `["run", "submit"]`
- [ ] Code body rejected if > 64 KB
- [ ] Add `protect` + `requireAdmin` to existing `/api/quiz/createunit` and `/api/quiz/createquestion`
- [ ] `JUDGE0_API_KEY` never logged, never returned in any response

---

### 4.9 Route Registration Changes in app.js

```js
// ADDITIONS to server/src/app.js — nothing existing is deleted or changed

import problemRoutes    from './routes/problem.routes.js';
import submissionRoutes from './routes/submission.routes.js';

// Standard routes
app.use('/api/problems',    problemRoutes);
app.use('/api/submissions', submissionRoutes);

// Vercel strips /api prefix, so we mirror:
app.use('/problems',    problemRoutes);
app.use('/submissions', submissionRoutes);

// Also add to the DB connect middleware array:
// Change: app.use(['/api', '/auth', '/quiz'], ...)
//     to: app.use(['/api', '/auth', '/quiz', '/problems', '/submissions'], ...)
```

---

### 4.10 New Client Routes

```jsx
// Additions to client/src/App.jsx inside <Routes>
import ProblemList from './pages/Judge/ProblemList';
import ProblemPage from './pages/Judge/ProblemPage';

<Route path='/problems' element={<ProblemList />} />
<Route path='/problems/:slug' element={<ProblemPage />} />
```

"Practice" nav item added to SideNavbar pointing to `/problems`.

---

### 4.11 Commit Plan (small, reviewable commits)

```
feat: add Problem and Submission Mongoose models
feat: add executor interface and Judge0 adapter
feat: add problem list and get-by-slug routes + controller
feat: add submission create and poll routes + controller
feat: register problem and submission routes in app.js
feat: add seed script with 15 problems
feat: add ProblemList page (client)
feat: add ProblemPage with Monaco editor (client)
feat: add Practice link to SideNavbar
fix: add protect and requireAdmin guards to createunit/createques routes
chore: update .env.example with JUDGE0 vars
docs: update api-docs.md and db-schema.md for Phase 1
```

---

### 4.12 Manual Test Steps After Phase 1

1. Copy `.env.example` to `.env`, fill in `JUDGE0_BASE_URL` and `JUDGE0_API_KEY`
2. Run `node server/src/data/seed-problems.js` to populate problems
3. Run `npm run dev` and open `http://localhost:3000`
4. Log in with an existing account
5. Navigate to `/problems` — should see 15 problems
6. Click "Hello World" — Monaco editor loads with C++ starter code
7. Click **Run** — should get AC on visible test cases
8. Break the code intentionally — should get WA
9. Click **Submit** — runs all tests, gives final verdict
10. Check history tab — shows the attempt
11. Try `GET /api/submissions/<other-users-id>` — should be rejected
12. Inspect Network tab — confirm no `hidden: true` test case data in any response

---

## 5. Open Questions

**Please answer these before I start coding:**

**Q1 — Judge0 hosting:**
The free RapidAPI-hosted Judge0 has ~50 requests/day (enough for development only). Options:
- A: Free hosted tier for now (dev/demo only)
- B: Self-host Judge0 with Docker locally during development
- C: Paid Judge0 plan

**Q2 — Navigation placement:**
Where should the "Problems" section live?
- A: Add "Practice" to the SideNavbar now
- B: No sidebar link — accessible only from the course map (Phase 2 gates it)
- C: Both (sidebar now, course map integration in Phase 2)

**Q3 — Problem visibility for guests:**
Should non-logged-in users be able to browse and read problems, or require login everywhere in the judge section?

**Q4 — Package manager:**
Both `bun.lock` and `package-lock.json` exist. Do you actively use Bun, or should we delete `bun.lock` and standardize on npm?

---

*Once you approve and answer the questions above, I will create the `feature/judge-phase1` branch and start coding.*
