import express from 'express';
import { createQuestions, createUnits, getQuestions, getcourse, submitResults, setExercise } from '../controllers/quiz.controller.js';
import { protect }       from '../middlewares/auth.middleware.js';
import { requireAdmin }  from '../middlewares/admin.middleware.js';

const router = express.Router();

// Admin-only: create/update a unit or question
// protect verifies the JWT; requireAdmin checks isAdmin in the DB
router.post("/createunit",     protect, requireAdmin, createUnits);
router.post("/createquestion", protect, requireAdmin, createQuestions);

// Admin-only: attach/detach a coding exercise from a unit (Phase 2)
router.post("/setexercise",    protect, requireAdmin, setExercise);

// Public (or any logged-in user) routes
router.get("/questions/:unitnum/:levelnum", getQuestions);
router.get("/course/:topic/:id",            getcourse);
router.post("/submit",                      submitResults);

export default router;