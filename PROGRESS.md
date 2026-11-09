# CodeByte — Online Judge Integration Progress

> Updated after every meaningful milestone. Resume from here in a fresh session.

---

## Status at a Glance

| Phase | Status |
|---|---|
| Phase 0 — Exploration & Plan | ✅ Done |
| Phase 1 — Judge core (Judge0) | ✅ Done |
| Phase 2 — Learning integration | ✅ Done |
| Phase 3 — Smart feedback & Hints | ✅ Done |
| Phase 4 — Dedicated runner / Async queue | ⏳ Planned |
| Phase 5 — Daily challenge / Duels | ⏳ Planned |

---

## Phase 1 — Online Judge Core (Delivered)

| Component | Description |
|---|---|
| Models | `problem.model.js` and `submission.model.js` created |
| Executor | `executor/index.js` (interface) + `executor/judge0.adapter.js` (Judge0 CE) |
| Controllers | `problem.controller.js` + `submission.controller.js` |
| Routes | `problem.routes.js` + `submission.routes.js` |
| App Setup | New routes registered; database connection middleware list expanded |
| Admin Security | `protect` + `requireAdmin` added to createunit/createquestion |
| Middleware | `requireAdmin` middleware created with direct DB lookup |
| Seed Data | 15 problems across difficulty levels with visible and hidden test cases |
| ProblemList | Problem browse page with search and difficulty filters |
| ProblemPage | Full-screen Monaco editor, Run/Submit, verdict, test results, history tab |
| SideNavbar | "Practice" navigation item added for both desktop and mobile |
| API Routes | Judge API route constants added to `Apiroutes.js` |
| App Routes | `/problems` and `/problems/:slug` routes registered |

---

## Phase 2 — Learning Integration (Delivered)

| Component | Description |
|---|---|
| Quiz Schema | Added optional `codingExercise` (problem slug) to `unitSchema` |
| User Schema | Added `exerciseSolved` (boolean) to user `courseProgress.units` |
| Gamification Helper | Created `server/src/utils/gamification.js` (`awardXPAndStreak`) |
| Quiz Gating | Unit unlocking requires both lesson completion AND coding exercise completion |
| First-AC Hook | Submitting an AC solution awards +50 XP, updates streaks, and sets `exerciseSolved = true` |
| Celebration Toast | Added animated first-AC celebration toast to `ProblemPage.jsx` |
| Course Map Badges | Added dynamic coding challenge badge (✅ Solved / ⚡ Challenge) to `Learn.jsx` |
| Wire Script | Created and ran `server/src/data/wire-exercises.js` linking problems to courses |
| Admin Route | Added `POST /api/quiz/setexercise` for attaching/detaching exercises to units |
| Solved Check | Added `GET /api/submissions/check/:slug` endpoint |

---

## Phase 3 — Smart Feedback & Progressive Hints (Delivered)

| Component | Description |
|---|---|
| Blank Starters | Replaced pre-filled solutions with empty templates across all 15 problems |
| Solved Indicator | Added Status column (`✓`/`–`), "✓ Solved" filter, and solved counter to `ProblemList.jsx` |
| Hint Model | Created `server/src/models/hint.model.js` for progressive hints |
| Hint Controller | Created `server/src/controllers/hint.controller.js` with sequential unlock enforcement |
| Hint Routes | Created `server/src/routes/hint.routes.js` (`GET /api/hints/:slug/meta` & `GET /api/hints/:slug`) |
| Seed Hints | Created and ran `server/src/data/seed-hints.js` with 3-tier hints for all 15 problems |
| Hint Panel | Created slide-in `HintPanel.jsx` component in `ProblemPage.jsx` |
| Failing Test Card | Detailed card for Wrong Answer (WA) showing Input, Expected, and Your Output |

---

## Key Decisions Made

| Decision | Rationale |
|---|---|
| Judge0 CE public free instance (`https://ce.judge0.com`) | Free, no Docker setup required, no API key for basic use |
| `wait=true` on Judge0 (synchronous execution) | Simpler in Phase 1-3; avoids polling loop; Phase 4 moves to async queue |
| Executor interface (`executor/index.js`) | Single function to call — swapping to Docker runner in Phase 4 needs zero API/frontend changes |
| Pre-written hints in DB | Zero API cost, zero rate-limit errors, instantaneous responses, interview-quality hints |
| ProblemPage as standalone route (no sidebar) | Full screen needed for editor; matches existing Quiz experience |
| ProblemList inside CodeByte layout (sidebar visible) | Consistent with the rest of the application |
| `safeTestResults` strips hidden test case details | Security requirement — users must never see hidden test data |
| `/api/submissions/me` declared before `/:id` | Prevents Express treating the literal string "me" as an ObjectId |

---

## Environment Setup (for developers)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Ensure MONGO_URL, JWT_SECRET, JWT_REFRESH_SECRET are set

# 3. Seed data
npm run seed:all

# 4. Start development server
npm run dev
# Application running at http://localhost:3000
```
