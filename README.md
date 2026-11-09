# CodeByte 🚀

### 🔗 Live Link: [https://codebyte-by-yug.vercel.app/](https://codebyte-by-yug.vercel.app/)

CodeByte is an interactive, gamified full-stack coding education platform offering structured, progressive pathways for mastering programming languages (**Java**, **C/C++**, and **Python**). Designed with a distraction-free, Duolingo-style course progression, CodeByte pairs interactive concept quizzes with real, sandboxed coding challenges in a full-screen **Monaco code editor** powered by an **online judge engine**.

---

## ✨ Key Features

* **📚 Gamified Circular Learning Pathways**: Each unit is broken down into progressive quiz lessons followed by an integrated **Coding Challenge** checkpoint at the end of the unit.
* **⚡ Hands-On Coding Challenges & Online Judge**:
  * Write and run real code directly in the browser with syntax highlighting, auto-completion, and dark mode in the **Monaco Editor**.
  * Instant feedback with test case evaluation (runtime, memory, passed/failed tests, and diff output).
  * **Course Track Language Locking**: Challenges are specifically tailored to concepts taught in that unit (e.g. C++ Pointers, Java OOP, Python List Comprehensions) and locked to that track's programming language.
  * **Unit Progression Gating**: Finishing a unit's coding challenge with an Accepted (`AC`) verdict awards **+50 XP** and unlocks the next unit.
* **💡 Progressive Hint Ladder**: Stuck on a coding challenge? Unlock 3-tier hints sequentially (Gentle Nudge 💡 → Conceptual Approach 🗺️ → Step-by-Step Logic 🔍) without spoiling the solution.
* **🔥 Streak & Consistency Tracker**: Tracks daily active learning to encourage steady coding habits.
* **🏆 Leagues & Leaderboards**: Compete against other developers globally in real-time.
* **🎭 Customizable Avatars**: Select and customize personalized developer avatars.
* **📱 Fully Responsive Design**: Seamless experience across mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

### Frontend
* **Core Framework**: React 19 (Vite bundler)
* **Code Editor**: `@monaco-editor/react` (VS Code editor engine in browser)
* **Styling**: Styled Components & Tailwind CSS
* **Icons & Animation**: React Icons, Lucide React, and Motion
* **Routing**: React Router DOM v7
* **Markdown Rendering**: `react-markdown` with `remark-gfm`
* **Audio Feedback**: `use-sound` for immersive success/error sound effects

### Backend & Judge Infrastructure
* **Runtime**: Node.js & Express.js (ES Modules)
* **Database**: MongoDB with Mongoose ODM
* **Code Execution Engine**: Judge0 CE API adapter with pluggable runner interface (`server/src/executor/`)
* **Security & Auth**: JWT (access & refresh tokens with auto-refresh interceptors), bcryptjs password hashing, and admin role verification middleware
* **Asset CDN**: ImageKit for avatar storage and profile media

---

## 📂 Documentation Directory

Explore the architectural specifications and database designs in the `/docs` folder:

* **[API Documentation](./docs/api-docs.md)**: Full RESTful specification for auth, user profiles, course data, online judge submissions, and progressive hints.
* **[Database Schema Documentation](./docs/db-schema.md)**: Detailed Mongoose models for users, courses, quizzes, problem definitions, test cases, submissions, and hint ladders.
* **[Integration Progress](./PROGRESS.md)**: Roadmap, milestone logs, and technical decisions made during the online judge integration.

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* A **MongoDB** database (local or MongoDB Atlas connection string)

### 1. Clone the Repository
```bash
git clone https://github.com/YugAgarwal005/CodeByte.git
cd CodeByte
```

### 2. Install Dependencies
All dependencies for both client and server are managed through the root `package.json`:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
PORT=3000
MONGO_URL=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

# Online Judge Execution (Judge0 CE public instance is free and requires no key)
EXECUTOR_ADAPTER=judge0
JUDGE0_BASE_URL=https://ce.judge0.com
JUDGE0_API_KEY=

# ImageKit Configuration (for avatar uploads)
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
```

### 4. Seed the Database
Populate the course units, coding challenges, and progressive hints into MongoDB:
```bash
npm run seed:all
```
*(Alternatively, run individual seed commands: `npm run seed:problems`, `npm run seed:hints`, or `npm run seed:wire`)*

### 5. Run the Application
Start the development server with Vite middleware:
```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)** to start learning!

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `node server/src/server.js` | Starts server with Vite development middleware |
| `npm run build` | `vite build --config client/vite.config.js` | Builds production frontend assets to `client/dist` |
| `npm run start` | `NODE_ENV=production node server/src/server.js` | Runs production server serving built static assets |
| `npm run seed:all` | Runs all problem, hint, and course-wiring seed scripts |
| `npm run seed:problems` | `node server/src/data/seed-problems.js` | Seeds the 15 track-aligned coding challenges |
| `npm run seed:hints` | `node server/src/data/seed-hints.js` | Seeds 3-tier progressive hints for all challenges |
| `npm run seed:wire` | `node server/src/data/wire-exercises.js` | Wires coding challenges into course unit pathways |

---

## 🤝 Contributing & License
Contributions, feedback, and pull requests are welcome. Distributed under the MIT License.
