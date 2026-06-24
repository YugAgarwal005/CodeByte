import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import quizRoutes from "./routes/quiz.routes.js";

// Import error middleware
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/quiz", quizRoutes);

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
