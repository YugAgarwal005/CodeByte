import express from "express";
import { listProblems, getProblem } from "../controllers/problem.controller.js";

const router = express.Router();

// GET /api/problems  — list all problems (no auth required)
router.get("/", listProblems);

// GET /api/problems/:slug  — single problem detail (no auth, but hidden tests stripped)
router.get("/:slug", getProblem);

export default router;
