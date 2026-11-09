import express from "express";
import { getHint, getHintMeta } from "../controllers/hint.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// GET /api/hints/:slug?level=1   — reveal hint at given level (auth required)
router.get("/:slug",      protect, getHint);

// GET /api/hints/:slug/meta      — check how many hints exist + what's been revealed
router.get("/:slug/meta", protect, getHintMeta);

export default router;

