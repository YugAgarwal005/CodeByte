import express from 'express';
import { setavatar, getallusers, getMatchingUsers, follow, getuser, followunfollow, shop, leaderboard, updateusername } from '../controllers/user.controller.js';
const router=express.Router();

router.post("/setavatar/:id",setavatar);
router.get("/getallusers/:id",getallusers);
router.get("/getmatchingusers/:id",getMatchingUsers);
router.get("/getuser/:id",getuser);
router.post("/follow/:id",follow);
router.post("/followunfollow",followunfollow);
router.post("/shop/:id",shop);
router.get("/leaderboard",leaderboard);
router.post("/updateusername/:id",updateusername);

export default router;