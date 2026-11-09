import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";

// Import routes
import authRoutes       from "./routes/auth.routes.js";
import userRoutes       from "./routes/user.routes.js";
import quizRoutes       from "./routes/quiz.routes.js";
import problemRoutes    from "./routes/problem.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import hintRoutes       from "./routes/hint.routes.js";

// Import error middleware
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Database connection middleware (lazy connection with user-friendly error output)
// Keep this list in sync whenever a new route prefix is added
app.use(["/api", "/auth", "/quiz", "/problems", "/submissions", "/hints"], async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed in middleware:", err);
    res.status(500).json({
      success: false,
      error: "Database Connection Failed",
      message: "The server failed to connect to the database. If you are using MongoDB Atlas, make sure you have allowed access from all IP addresses (0.0.0.0/0) in your MongoDB Atlas Security -> Network Access settings, as Vercel uses dynamic IP addresses that cannot be easily whitelisted individually.",
      details: err.message
    });
  }
});

// API Routes
app.use("/api/auth",        authRoutes);
app.use("/api/auth",        userRoutes);
app.use("/api/quiz",        quizRoutes);
app.use("/api/problems",    problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/hints",        hintRoutes);

// Vercel Serverless compatibility (Vercel strips /api prefix before routing to Express)
app.use("/auth",        authRoutes);
app.use("/auth",        userRoutes);
app.use("/quiz",        quizRoutes);
app.use("/problems",    problemRoutes);
app.use("/submissions", submissionRoutes);
app.use("/hints",        hintRoutes);

// Vite Integration for frontend (Dev vs Prod)
const setupFrontend = async () => {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: path.join(process.cwd(), "client"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server middleware mounted targeting 'client' folder");
  } else {
    const distPath = path.join(process.cwd(), "client/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from:", distPath);
  }
};

if (!process.env.VERCEL) {
  await setupFrontend();
}

// Centralized error handler
app.use(errorHandler);

export default app;
