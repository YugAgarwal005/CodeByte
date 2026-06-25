import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import quizRoutes from "./routes/quiz.routes.js";

// Import error middleware
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// URL Normalization Middleware for Vercel Serverless environment
app.use((req, res, next) => {
  const originalUrl = req.headers["x-matched-path"] || req.headers["x-forwarded-url"] || req.headers["x-now-route-api-path"] || req.url;
  
  // If req.url is rewritten to the function's entry point, restore the original path
  if (req.url.includes("api/index.js") || req.url === "/api" || req.url === "/api/") {
    console.log(`[Vercel URL Normalizer] Rewriting req.url from ${req.url} to ${originalUrl}`);
    req.url = originalUrl;
  }
  next();
});

// Standard middlewares
app.use(cors());
app.use(express.json());

// Ensure Database is connected before routing (essential for Vercel Serverless environment)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection error in middleware:", err);
    next(err);
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/quiz", quizRoutes);

// Vercel Serverless compatibility (handles requests when /api prefix is stripped by Vercel function routing)
app.use("/auth", authRoutes);
app.use("/auth", userRoutes);
app.use("/quiz", quizRoutes);

// Vite Integration for frontend (Dev vs Prod)
const setupFrontend = async () => {
  if (process.env.NODE_ENV !== "production") {
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
