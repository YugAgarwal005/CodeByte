import express from 'express';
import { googlelogin, login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/googlelogin", googlelogin);

export default router;
