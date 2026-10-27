import express from "express";
import {
  createSubmission,
  getSubmission,
  getMySubmissions,
  getProblemSubmissions,
} from "../controllers/submission.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All submission routes require a valid JWT (protect middleware)

// POST /api/submissions  — submit/run code, get back a verdict
router.post("/", protect, createSubmission);

// GET /api/submissions/me  — current user's submission history
// NOTE: this route must be declared BEFORE /:id so Express matches "me" first
router.get("/me", protect, getMySubmissions);

// GET /api/submissions/problem/:slug  — history for one problem (for the history tab)
router.get("/problem/:slug", protect, getProblemSubmissions);

// GET /api/submissions/:id  — single submission (ownership-checked in controller)
router.get("/:id", protect, getSubmission);

export default router;
