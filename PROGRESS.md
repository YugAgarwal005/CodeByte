# CodeByte � Online Judge Integration Progress

> Updated after every meaningful commit. Resume from here in a fresh session.

---

## Status at a Glance

| Phase | Status |
|---|---|
| Phase 0 � Exploration & Plan | ? Done |
| Phase 1 � Judge core (Judge0) | ?? In Progress |
| Phase 2 � Learning integration | ? Not started |
| Phase 3 � Smart feedback | ? Not started |
| Phase 4 � Own runner | ? Not started |
| Phase 5 � Daily challenge / duels | ? Not started |

---

## Phase 1 � What is Done

| Commit | Description |
|---|---|
| models | `problem.model.js` and `submission.model.js` created |
| executor | `executor/index.js` (interface) + `executor/judge0.adapter.js` (Judge0 CE) |
| controllers | `problem.controller.js` + `submission.controller.js` |
| routes | `problem.routes.js` + `submission.routes.js` |
| app.js | New routes registered; DB middleware list expanded |
| quiz.routes.js | `protect` + `requireAdmin` added to createunit/createquestion (Risk R2 fix) |
| admin.middleware.js | `requireAdmin` middleware created |
| seed-problems.js | 15 problems (easy?medium) with visible + hidden test cases |
| ProblemList.jsx | Problem browse page with search + difficulty filter |
| ProblemPage.jsx | Full-screen Monaco editor, Run/Submit, verdict, history tab |
| SideNavbar.jsx | "Practice" nav item added (both laptop + mobile layouts) |
| Apiroutes.js | Judge API route constants appended |
| App.jsx | `/problems` and `/problems/:slug` routes registered |
| .env.example | `EXECUTOR_ADAPTER`, `JUDGE0_BASE_URL`, `JUDGE0_API_KEY` added |

## Phase 1 � Still To Do

- [x] Run seed script against real DB and verify (`node server/src/data/seed-problems.js`)
- [x] Manual end-to-end test (see PLAN.md § 4.12)
- [x] Update `docs/api-docs.md` and `docs/db-schema.md`
- [x] Commit to `feature/judge-phase1` branch

---

## Key Decisions Made

| Decision | Rationale |
|---|---|
| Judge0 CE public free instance (`https://ce.judge0.com`) | Free, no Docker setup required, no API key for basic use |
| `wait=true` on Judge0 � synchronous execution | Simpler in Phase 1; avoids polling loop; Phase 4 moves to async queue |
| Executor interface (`executor/index.js`) | Single function to call � swapping to Docker runner in Phase 4 needs zero API/frontend changes |
| ProblemPage as standalone route (no sidebar) | Full screen needed for editor; same pattern as existing Quiz page |
| ProblemList inside CodeByte layout (sidebar visible) | Consistent with the rest of the app for a list-only view |
| `requireAdmin` does a DB lookup, not JWT claim | Avoids stale isAdmin=true in old tokens; real-time accuracy |
| `safeTestResults` strips hidden test case input/expected | Core security requirement � users must not see hidden test data |
| `/api/submissions/me` declared before `/:id` | Prevents Express treating the literal string "me" as an ObjectId |
| npm only (bun.lock deleted) | Vercel uses npm; eliminates lock file conflict |

---

## Open Risks (from Phase 0 � still relevant)

| ID | Risk | Status |
|---|---|---|
| R1 | `postDataString` double-encoding in quiz submit | Deferred to Phase 2 |
| R2 | No server-side admin guard on createunit/createquestion | ? Fixed in Phase 1 |
| R3 | Hardcoded fallback JWT secrets | Documented in .env.example; not changed (would log out users) |
| R4 | Vercel serverless can't run code execution | N/A for Phase 1 � Judge0 is a remote HTTP call |
| R7 | Hidden test case exposure | Mitigated by `stripHiddenTestCases` + `safeTestResults` helpers |

---

## Phase 2 Preview

- Attach a `codingExercise` field to each quiz unit (reference to a Problem slug)
- A unit is "complete" only when its quiz AND coding exercise are solved
- Solving a problem awards XP, updates streak, feeds leaderboard
- Move hard-coded quiz questions into MongoDB

---

## How to Resume in a Fresh Session

1. Read `PLAN.md` for the full architecture
2. Read this file for current status
3. Check the git log on `feature/judge-phase1`
4. Ask the user which phase to work on next

---

## Environment Setup (for a new developer)

```bash
# 1. Clone and install
npm install

# 2. Copy and fill env vars
cp .env.example .env
# Fill in MONGO_URL, JWT_SECRET, JWT_REFRESH_SECRET
# JUDGE0_BASE_URL defaults to https://ce.judge0.com � no change needed

# 3. Seed problems
node server/src/data/seed-problems.js

# 4. Start dev server
npm run dev
# App is at http://localhost:3000
# Problems list at http://localhost:3000/problems
```
