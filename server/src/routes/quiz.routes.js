import express from 'express';
import { createQuestions, createUnits, getQuestions, getcourse, submitResults } from '../controllers/quiz.controller.js';
const router=express.Router();

router.post("/createunit",createUnits);
router.post("/createquestion",createQuestions)
router.get("/questions/:unitnum/:levelnum",getQuestions)
router.get("/course/:topic/:id",getcourse);
router.post("/submit",submitResults);

export default router;