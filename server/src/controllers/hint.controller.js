/**
 * hint.controller.js
 *
 * GET /api/hints/:slug?level=1|2|3
 *
 * Returns hints progressively. The client tracks which level it's on.
 * - level 1 → return hint 1 (gentle nudge)
 * - level 2 → return hints 1 + 2
 * - level 3 → return hints 1 + 2 + 3
 *
 * Rate limiting: a user can reveal each level only once per problem per day.
 * We track this in-memory (resets on server restart) to avoid DB overhead.
 * For production you'd use Redis, but for dev/free tier this is fine.
 *
 * Auth required.
 */

import { Hint } from "../models/hint.model.js";

// ── In-memory rate-limit store ────────────────────────────────────────────────
// key: `${userId}:${slug}`  → { levels: Set, date: "YYYY-MM-DD" }
const hintUsage = new Map();

const todayStr = () => new Date().toISOString().slice(0, 10); // "2026-10-30"

function canReveal(userId, slug, level) {
  const key  = `${userId}:${slug}`;
  const today = todayStr();
  const entry = hintUsage.get(key);

  // New day or new problem → reset
  if (!entry || entry.date !== today) {
    hintUsage.set(key, { levels: new Set(), date: today });
    return true;
  }

  // Already revealed this level today — idempotent (allow re-read, not a new reveal)
  // Each level can only be unlocked forward: can't skip to level 3 without 1 and 2
  if (level > (entry.levels.size + 1)) {
    return false; // trying to skip a level
  }
  return true;
}

function markRevealed(userId, slug, level) {
  const key   = `${userId}:${slug}`;
  const today = todayStr();
  if (!hintUsage.has(key) || hintUsage.get(key).date !== today) {
    hintUsage.set(key, { levels: new Set(), date: today });
  }
  hintUsage.get(key).levels.add(level);
}

function getRevealedLevels(userId, slug) {
  const key   = `${userId}:${slug}`;
  const today = todayStr();
  const entry = hintUsage.get(key);
  if (!entry || entry.date !== today) return new Set();
  return entry.levels;
}

// ── Controller ────────────────────────────────────────────────────────────────

/**
 * getHint
 * GET /api/hints/:slug?level=1
 *
 * Returns the requested hint level (and all previously revealed levels).
 * Enforces sequential unlock: you must reveal level N before N+1.
 */
export const getHint = async (req, res, next) => {
  try {
    const { slug }    = req.params;
    const level       = parseInt(req.query.level, 10) || 1;
    const userId      = req.user.userId;

    if (level < 1 || level > 3) {
      return res.status(400).json({ status: false, message: "Level must be 1, 2, or 3." });
    }

    // Fetch hints for this problem
    const doc = await Hint.findOne({ slug }).lean();
    if (!doc || doc.hints.length === 0) {
      return res.json({ status: true, hints: [], message: "No hints available for this problem." });
    }

    // Check sequential unlock
    const already = getRevealedLevels(userId, slug);
    if (level > 1 && !already.has(level - 1)) {
      return res.status(403).json({
        status:  false,
        message: `Please reveal hint ${level - 1} before unlocking hint ${level}.`,
      });
    }

    // Mark this level as revealed
    markRevealed(userId, slug, level);

    // Return all hints up to and including the requested level
    const toReturn = doc.hints
      .filter((h) => h.level <= level)
      .sort((a, b) => a.level - b.level);

    return res.json({ status: true, hints: toReturn, totalAvailable: doc.hints.length });
  } catch (error) {
    next(error);
  }
};

/**
 * getHintMeta
 * GET /api/hints/:slug/meta
 *
 * Returns how many hints exist for this problem and which levels the user
 * has already revealed today (without revealing new ones).
 * Used by the frontend to show "Hint 2 of 3" without another click.
 */
export const getHintMeta = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId   = req.user.userId;

    const doc = await Hint.findOne({ slug }).select("hints.level").lean();
    const totalAvailable = doc ? doc.hints.length : 0;

    const already = getRevealedLevels(userId, slug);
    const revealedLevel = already.size > 0 ? Math.max(...already) : 0;

    return res.json({ status: true, totalAvailable, revealedLevel });
  } catch (error) {
    next(error);
  }
};

