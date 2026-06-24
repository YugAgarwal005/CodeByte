# CodeByte 🚀

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://codebyte-by-yug.vercel.app/)

**Live Application Link:** [https://codebyte-by-yug.vercel.app/](https://codebyte-by-yug.vercel.app/)

CodeByte is a gamified full-stack coding education platform that provides a structured, progressive pathway for learning coding languages (such as Java, C/C++, and Python). Designed with an elegant, distraction-free interface, CodeByte helps learners master key computer science concepts through dynamic interactive quizzes, daily streaks, customizable avatars, and a real-time competitive leaderboard league.

To ensure an immersive and high-focus learning environment, CodeByte prioritizes progress and consistency. All distracting gamification mechanics like gems, hearts, and shops have been completely removed, allowing users to focus 100% on what matters most: **learning to code**.

---

## ✨ Features

*   **📚 Structured Progression**: Code-learning units broken down into progressive lessons and quizzes to build foundational and advanced skills.
*   **🔥 Streak & Consistency Tracker**: Tracks active days to encourage daily practice and maintain a continuous learning habit.
*   **🏆 Technical Leagues & Leaderboard**: Compare progress with other developers globally in real-time, encouraging friendly competition.
*   **🎭 Customizable Avatars**: Select and set personalized developer profiles with dynamic avatar fetching.
*   **📱 Responsive & Clean Interface**: A modern, mobile-friendly design featuring seamless navigation and beautiful visual transitions.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React.js (Vite)
*   **Styling**: Tailwind CSS & Styled Components
*   **Routing**: React Router DOM v6
*   **State & Networking**: Axios for API calls, HTML5 LocalStorage for session states
*   **Sounds**: `use-sound` for immersive feedback on correct and incorrect answers

### Backend
*   **Runtime**: Node.js & Express.js
*   **Database**: MongoDB with Mongoose ODM
*   **Authentication**: Secure password hashing with bcrypt, JSON Web Tokens (JWT) for session persistence

---

## 📂 Documentation Directory

To explore detailed specifications of the backend and database architecture, refer to our official documents under the `/docs` folder:

*   **[API Documentation](./docs/api-docs.md)**: Full list of RESTful API endpoints for authentication, profile management, and quiz submission.
*   **[Database Schema Documentation](./docs/db-schema.md)**: Details on the MongoDB Mongoose models, user collections, courses, and unit-progress tracking schemas.

---

## 🚀 Getting Started

Follow these simple steps to run the application locally on your machine.

### Prerequisites
*   **Node.js** (v18 or higher recommended)
*   **npm** (Node Package Manager)

### Step 1: Clone the Repository
```bash
git clone https://github.com/YugAgarwal005/CodeByte.git
cd CodeByte
```

### Step 2: Install Dependencies
Install all package dependencies for both the frontend client and the backend server:
```bash
# Install root/server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory and add your secret keys and connection strings:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 🔑 Google Sign-In Setup & Configuration

To enable the Google Sign-In feature, you need to configure a Google Cloud project and obtain a Client ID.

#### 1. Obtain your Google Client ID
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services** > **Credentials**.
4. Click **Create Credentials** and select **OAuth client ID**.
5. If prompted, configure the **OAuth consent screen** (set App name, User support email, and Developer contact information).
6. Under **Application type**, choose **Web application**.
7. In the **Authorized JavaScript origins** section, add:
   - For local development: `http://localhost:3000`
   - For production (Live): `https://codebyte-by-yug.vercel.app`
8. Click **Create** to receive your **Client ID** (e.g., `123456789-abcde.apps.googleusercontent.com`).

#### 2. Configure the Client ID in the Application
- **For Local Development**:
  Add the environment variable to your root `.env` file:
  ```env
  VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
  ```
- **For Production (Vercel)**:
  1. Go to your Vercel Dashboard and select the **CodeByte** project.
  2. Navigate to **Project Settings** > **Environment Variables**.
  3. Add a new variable with Key: `VITE_GOOGLE_CLIENT_ID` and Value: `your_google_client_id_here`.
  4. Redeploy the application for the environment variable to take effect.

---

### Step 4: Run the Development Server
From the root directory, start the development server using:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to start using CodeByte!
