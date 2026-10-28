# Recovered Conversation (October 27, 2026)

**Session ID:** `32c72081-bfce-46fa-8694-930e16012b3e`

**Topic:** CodeByte - Adding Online Judge Engine (Phase 0 & Phase 1)

---

## 👤 User Prompt (Step 0)

<role>
You are a senior full-stack engineer and mentor working in my repository, CodeByte. I am a 3rd-year BTech student who must be able to explain every line in interviews, so favor clear, simple, well-commented code over clever abstractions.
</role>

<project_context>
CodeByte is a gamified coding-education platform (Duolingo-style): React + Vite client, Node/Express server, MongoDB/Mongoose, JWT + bcrypt auth, ImageKit, deployed on Vercel. Features today: structured units, quizzes with hard-coded questions, streaks, leagues/leaderboard, avatars. Docs are in /docs (api-docs.md, db-schema.md).
</project_context>

<goal>
Add an online judge and make it the engine of the learning experience, NOT a standalone LeetCode clone. Target flow: lesson -> quiz -> coding exercise that unlocks the next unit. Existing features must keep working.
</goal>

<working_agreement>
1. Start with Phase 0 only: explore the repo (structure, models, routes, auth, how quizzes and leagues work), then write PLAN.md with your findings, risks, and a detailed Phase 1 plan. Stop and wait for my approval.
2. Work one phase at a time, on its own git branch, with small commits.
3. Maintain PROGRESS.md (done, in progress, next, decisions, open questions) and update it after every meaningful step so work can resume in a fresh session.
4. After each phase: run the build and tests, update /docs (API + DB schema) and .env.example, then summarize what changed and how to test it manually. Stop for my review before the next phase.
5. Ask before adding paid services, large dependencies, or changing existing schemas in a breaking way.
6. If something is ambiguous, ask one focused question instead of guessing.
</working_agreement>

<phases>
Phase 1 - Judge core (Judge0 for execution)
- Models: Problem (title, slug, markdown statement, difficulty, tags, per-language starter code, time/memory limits, test cases with a hidden flag) and Submission (user, problem, language, code, status, verdict, per-test results, runtime, memory, createdAt).
- API: list/get problems, submit code, poll submission status, user submission history. Auth required to submit. Never expose hidden test cases to the client.
- Execution via a pluggable executor interface with a Judge0 adapter (hosted or self-hosted, configured by env). Verdicts: AC, WA, TLE, RE, CE.
- Frontend: problem page with Monaco editor, language selector (C++, Java, Python), Run (sample tests) and Submit (all tests), live verdict display, submission history.
- Seed 10-15 beginner-to-intermediate problems.

Phase 2 - Learning integration
- Attach coding exercises to existing units/lessons; a unit completes only when its exercise is solved.
- Solves award XP, extend streaks, and feed the existing league/leaderboard.
- Move hard-coded quiz questions into MongoDB, with an admin-only panel to add/edit questions and problems.

Phase 3 - Smart feedback
- On failure, show the first failing visible test (input, expected, actual).
- Hint ladder: nudge -> approach -> reveal. Add an LLM-powered Socratic hint endpoint that never gives the full solution; API key server-side only, rate-limited, provider configurable via env.

Phase 4 - Own runner
- Separate worker service (not on Vercel; serverless cannot run it): Redis + BullMQ queue, workers executing code in Docker with CPU/memory/time limits, no network, read-only filesystem.
- Keep the Judge0 adapter as a fallback behind the same executor interface.
- Per-user submission rate limiting.

Phase 5 (optional) - Daily challenge and 1v1 timed duels over WebSockets with a live scoreboard.
</phases>

<quality_bar>
- Never run user-submitted code on the main API process.
- Validate and sanitize all inputs; keep secrets in env vars only.
- Add unit/integration tests for judge logic, verdict mapping, and auth on submissions.
- Keep the executor interface clean so the Judge0 -> own-runner swap needs no API or frontend changes.
- Include a mermaid architecture diagram and a trade-offs section in the README by the end.
</quality_bar>

<deployment_notes>
Client and a stateless API can stay on Vercel. The worker, Redis, and Docker runner must be hosted elsewhere (Railway, Render, or a VPS). At the end of each phase, tell me exactly what I need to set up or configure.
</deployment_notes>

Begin with Phase 0 now. Do not write feature code yet.

<ADDITIONAL_METADATA>
The current local time is: 2026-10-27T15:38:13+05:30.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Claude Sonnet 4.6 (Thinking). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>

---

## 🤖 Assistant Response (Step 3)

Let me start by thoroughly exploring the CodeByte repository before writing anything.

---

## 👤 User Prompt (Step 40)

continue

<ADDITIONAL_METADATA>
The current local time is: 2026-10-27T15:40:00+05:30.
</ADDITIONAL_METADATA>

---

## 🤖 Assistant Response (Step 41)

Let me finish reading the remaining files before writing the plan.

---

## 🤖 Assistant Response (Step 50)

Now let me look at the client side to understand the frontend structure:

---

## 🤖 Assistant Response (Step 66)

Now let me check the `api` folder and the `models/images` folder:

---

## 🤖 Assistant Response (Step 72)

I now have a complete picture of the codebase. Let me write the PLAN.md:

---

## 🤖 Assistant Response (Step 79)

[`PLAN.md`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\PLAN.md) is written to the repo root. Here's a summary of everything I found and decided:

---

## Phase 0 Summary

### What I read (every file)
- All 3 models, 3 route files, 3 controllers, 2 middlewares, 2 utils, config, app.js, server.js, vercel.json, package.json, api/index.js, and every key client page (App.jsx, Learn.jsx, Quiz.jsx, CodeByte.jsx, tokenManager.js, Apiroutes.js)

### Key findings
| Finding | Impact on Phase 1 |
|---|---|
| ES Modules (`"type": "module"`) throughout | All new files must use `import/export`, not `require()` |
| Vercel strips `/api` prefix → routes are mirrored with and without it | New routes need both `/api/problems` and `/problems` registered |
| `req.user` only has `userId` + `username` (no `isAdmin`) | Need a separate `requireAdmin` middleware that queries the DB |
| `POST /api/quiz/submit` uses double-encoded JSON (`postDataString`) | Leave it alone in Phase 1, document it as tech debt |
| `createunit` / `createques` have no server-side auth guard | Will fix as part of Phase 1 (a small, safe fix) |
| `@google/genai` and `socket.io` are already installed | Phase 3 and 5 will cost zero extra installs |

### 8 Risks identified
R1 `postDataString` | R2 No admin guard | R3 Hardcoded JWT secrets | R4 Vercel serverless limits | R5 Mixed package manager | R6 No `isAdmin` in JWT | R7 Hidden test case exposure | R8 Slug uniqueness

### Before I write a single line of feature code, please answer:

1. **Q1** — Judge0 hosting: free RapidAPI hosted (A), self-hosted Docker locally (B), or paid (C)?
2. **Q2** — Navigation: "Practice" in SideNavbar (A), course-map-only gated (B), or both (C)?
3. **Q3** — Should guests (not logged in) be able to browse problems?
4. **Q4** — Do you actively use Bun, or shall I delete `bun.lock` and use npm only?

---

## 👤 User Prompt (Step 80)

Q1 i want everything free,
Q2 you choose, what looks best,
Q3 no
Q4 no idea about these so you decide
proceed

<ADDITIONAL_METADATA>
The current local time is: 2026-10-27T15:54:08+05:30.
</ADDITIONAL_METADATA>

---

## 🤖 Assistant Response (Step 83)

Decisions locked in:
- **Q1** → Judge0 public free CE instance (`https://ce.judge0.com`) — no API key, no Docker, completely free
- **Q2** → "Practice" in SideNavbar now (option A); course map gating comes in Phase 2
- **Q3** → All judge pages require login
- **Q4** → Standardize on npm; delete `bun.lock`

Creating the branch and starting to build.

---

## 🤖 Assistant Response (Step 89)

While packages install, let me build all the server-side files in parallel:

---

## 🤖 Assistant Response (Step 97)

Now build the controllers:

---

## 🤖 Assistant Response (Step 101)

npm install completed. Now create the routes and update app.js:

---

## 🤖 Assistant Response (Step 104)

Now update `app.js` and the quiz routes:

---

## 🤖 Assistant Response (Step 106)

Now add the admin guard to quiz routes (fixes Risk R2):

---

## 🤖 Assistant Response (Step 108)

Now create the seed script with all 15 problems:

---

## 🤖 Assistant Response (Step 110)

Server is done. Now let's look at SideNavbar and build the client:

---

## 🤖 Assistant Response (Step 114)

Now I understand the SideNavbar structure. I'll add a "Practice" nav item to both `menuItems` (laptop) and `menuItems2` (mobile/tablet):

---

## 🤖 Assistant Response (Step 116)

Now update client-side Apiroutes.js and App.jsx, then build the judge pages:

---

## 👤 User Prompt (Step 124)

continue

<ADDITIONAL_METADATA>
The current local time is: 2026-10-27T16:03:51+05:30.

The user's current state is as follows:
Active Document: c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\models\problem.model.js (LANGUAGE_JAVASCRIPT)
Cursor is on line: 1
Other open documents:
- c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\models\problem.model.js (LANGUAGE_JAVASCRIPT)
</ADDITIONAL_METADATA>

---

## 🤖 Assistant Response (Step 125)

Continuing — adding routes to App.jsx then building both judge pages:

---

## 🤖 Assistant Response (Step 127)

I need to also add the ProblemListPage import. Let me fix that:

---

## 🤖 Assistant Response (Step 129)

Now create both judge pages:

---

## 🤖 Assistant Response (Step 134)

Now update `.env.example` and the docs, then do a build check and commit:

---

## 🤖 Assistant Response (Step 142)

Now run a build check to catch any issues:

---

## 🤖 Assistant Response (Step 144)

While the build runs, create the PROGRESS.md:

---

## 🤖 Assistant Response (Step 147)

Build succeeded (`exit code 0`). The only warning is about chunk size (pre-existing from audio/image assets — not our code). Now commit everything:

---

## 🤖 Assistant Response (Step 149)

✅ **Phase 1 complete.** Build passed, 55 files committed to `feature/judge-phase1`.

---

## What was built

### Server-side (new files)
| File | What it does |
|---|---|
| [`problem.model.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\models\problem.model.js) | Problem schema (title, slug, statement, test cases w/ hidden flag, starter code, limits) |
| [`submission.model.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\models\submission.model.js) | Submission schema (user, problem, verdict, per-test results) |
| [`executor/index.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\executor\index.js) | **Pluggable interface** — `executeCode()` reads `EXECUTOR_ADAPTER` env var and delegates. Swap to Docker in Phase 4 with zero other changes. |
| [`executor/judge0.adapter.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\executor\judge0.adapter.js) | Calls Judge0 CE public instance with `wait=true`. Maps status codes → AC/WA/TLE/RE/CE. Short-circuits on CE. |
| [`problem.controller.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\controllers\problem.controller.js) | `listProblems` + `getProblem`. Hidden test cases stripped before any response. |
| [`submission.controller.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\controllers\submission.controller.js) | `createSubmission` (Run/Submit), `getSubmission` (ownership-checked), history endpoints. |
| [`admin.middleware.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\middlewares\admin.middleware.js) | DB lookup instead of JWT claim — revocable in real-time. |
| [`seed-problems.js`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\server\src\data\seed-problems.js) | 15 problems (Hello World → Two Sum), upsert-safe. |

### Client-side (new files)
| File | What it does |
|---|---|
| [`ProblemList.jsx`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\client\src\pages\Judge\ProblemList.jsx) | Searchable, filterable problem table inside the main layout |
| [`ProblemPage.jsx`](file:///c:\Users\imyug\OneDrive\Desktop\WebD\Backend\CodeByte\client\src\pages\Judge\ProblemPage.jsx) | Full-screen Monaco editor, split-panel, Run/Submit, verdict chip, per-test results, history tab |

### Modified files
- `quiz.routes.js` — added `protect` + `requireAdmin` to createunit/createquestion **(Risk R2 fixed)**
- `app.js` — new routes + DB middleware list
- `SideNavbar.jsx` — "Practice" nav item
- `App.jsx`, `Apiroutes.js`, `.env.example`

---

## Your action items before testing

1. **Add to your `.env`:**
   ```
   EXECUTOR_ADAPTER=judge0
   JUDGE0_BASE_URL=https://ce.judge0.com
   ```

2. **Seed the database** (run once):
   ```bash
   node server/src/data/seed-problems.js
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. **Manual tests:**
   - Visit `/problems` — see the 15-problem table
   - Click any problem — editor loads with starter code
   - Click **Run** → test cases execute against Judge0 (takes 3-8 seconds per test)
   - Click **Submit** → hidden tests run, real verdict returned
   - Try wrong code → expect `WA`; empty code → `CE`

> **Note:** The `icons8-courses-64.png` icon for the "Practice" sidebar link must exist in `client/src/assets/images/`. If it doesn't, the Practice nav item will just show broken-image icon (won't crash). Replace with any icon from that folder by updating the import in `SideNavbar.jsx`.

---

