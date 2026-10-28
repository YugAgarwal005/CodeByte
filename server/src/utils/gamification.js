import { Users } from "../models/user.model.js";
import { calculateStreak, calculateMaxStreak } from "./streak.js";

/**
 * awardXPAndStreak
 *
 * Centralized helper called by BOTH:
 *   - quiz.controller.js  (on quiz lesson completion)
 *   - submission.controller.js (on first-AC coding exercise)
 *
 * What it does:
 *   1. Awards `xp` points to the user.
 *   2. Pushes today's date into streak.dates (deduped).
 *   3. Recalculates streak.days and streak.maxStreak.
 *   4. Updates dailyChallenges.xp and dailyChallenges.correctQuestions.
 *   5. Increments dailyChallenges.lessonsNumber if lessonsCompleted=1.
 *
 * @param {string} userId          - Mongoose ObjectId string of the user
 * @param {number} xp              - XP to award (e.g. 50 for a coding exercise AC)
 * @param {number} correctAnswers  - Number of correct answers (for daily challenge tracking)
 * @param {number} lessonsCompleted - 1 if a full lesson/exercise was completed, 0 otherwise
 * @returns {Promise<void>}
 */
export async function awardXPAndStreak(userId, xp, correctAnswers = 0, lessonsCompleted = 0) {
  // Fetch fresh from DB — don't rely on a possibly stale in-memory doc
  const user = await Users.findById(userId);
  if (!user) return;

  // ── Ensure userData sub-docs exist (safety for old accounts) ────────────────
  if (!user.userData) {
    user.userData = { xp: 100, gems: 200, correctQues: 0, streak: { dates: [], days: 0, maxStreak: 0 }, dailyChallenges: {} };
  }
  if (!user.userData.streak) {
    user.userData.streak = { dates: [], days: 0, maxStreak: 0 };
  }
  if (!user.userData.streak.dates) {
    user.userData.streak.dates = [];
  }

  // Get today's date in IST (UTC+5:30)
  const now = new Date();
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const today = new Date(now.getTime() + IST_OFFSET).toISOString().split("T")[0];

  if (!user.userData.dailyChallenges) {
    user.userData.dailyChallenges = { xp: 0, correctQuestions: 0, lessonsNumber: 0, claimedQuests: [], date: today };
  }

  // ── Push today's date into streak (deduped) ──────────────────────────────────
  const alreadyToday = user.userData.streak.dates.some((d) => {
    try { return new Date(d).toISOString().split("T")[0] === today; }
    catch { return false; }
  });
  if (!alreadyToday) {
    user.userData.streak.dates.push(today);
  }

  // ── Recalculate streaks ───────────────────────────────────────────────────────
  user.userData.streak.days      = calculateStreak(user.userData.streak.dates);
  user.userData.streak.maxStreak = calculateMaxStreak(user.userData.streak.dates);

  // ── Award XP ─────────────────────────────────────────────────────────────────
  user.userData.xp                              += xp;
  user.userData.dailyChallenges.xp              += xp;
  user.userData.dailyChallenges.correctQuestions += correctAnswers;
  user.userData.dailyChallenges.lessonsNumber   += lessonsCompleted;
  user.userData.correctQues                     += correctAnswers;

  await user.save();
}
