import express from 'express';
import { setavatar, getallusers, getMatchingUsers, follow, getuser, followunfollow, leaderboard, updateusername, claimquest } from '../controllers/user.controller.js';
const router=express.Router();

router.post("/setavatar/:id",setavatar);
router.get("/getallusers/:id",getallusers);
router.get("/getmatchingusers/:id",getMatchingUsers);
router.get("/getuser/:id",getuser);
router.post("/follow/:id",follow);
router.post("/followunfollow",followunfollow);
router.get("/leaderboard",leaderboard);
router.post("/updateusername/:id",updateusername);
router.post("/claimquest",claimquest);

export default router;