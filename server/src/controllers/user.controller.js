import { Users } from '../models/user.model.js';
import _ from 'lodash';
import ImageKit from 'imagekit';
import { calculateStreak, calculateMaxStreak } from '../utils/streak.js';

export const getImageKit = () => {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.VITE_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT;

    if (publicKey && privateKey && urlEndpoint) {
        return new ImageKit({ publicKey, privateKey, urlEndpoint });
    }
    return null;
};

export const setavatar = async (req, res, next) => {
    try {
        const id = req.params.id;
        let avatarUrl = req.body.image;

        const ik = getImageKit();
        if (ik && avatarUrl) {
            try {
                const uploadRes = await ik.upload({
                    file: avatarUrl,
                    fileName: `avatar_${id}_${Date.now()}.png`,
                    folder: "/avatars"
                });
                if (uploadRes && uploadRes.url) {
                    avatarUrl = uploadRes.url;
                }
            } catch (ikErr) {
                console.error("ImageKit upload error in setavatar:", ikErr.message || ikErr);
            }
        }

        const user = await Users.findByIdAndUpdate(id, {
            IsAvatarImageSet: true,
            AvatarImage: avatarUrl,
            profilePic: avatarUrl
        }, { new: true });

        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        return res.json({ isSet: user.IsAvatarImageSet, setimage: user.AvatarImage });

    } catch (error) {
        next(error);
    }
}


export const getallusers = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { selectedTab } = req.query;
        const idList = await Users.findOne({ _id: id }).select([selectedTab]);
        var List = [];

        if (selectedTab === 'following') {
            List = idList.following;
        } else if (selectedTab === 'followers') {
            List = idList.followers;
        }

        const users = await Users.find({ _id: { $in: List } }).select(
            [
                "username",
                "IsAvatarImageSet",
                "AvatarImage",
                "_id",
                'userData'
            ]
        ).sort({ 'username': 1 });
        return res.json(users);
    } catch (error) {
        next(error);
    }
}

export const follow = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const followingId = req.body.id;
        const user = await Users.findOne({ _id: followingId }).select("username");
        // Update the 'following' array of the user who is following
        await Users.findByIdAndUpdate(userId, { $addToSet: { following: followingId } });
        // Update the 'followers' array of the user who is being followed
        await Users.findByIdAndUpdate(followingId, { $addToSet: { followers: userId } });
        return res.json({ msg: `Started Following ${user.username} ` });
    }
    catch (error) {
        next(error);
    }
}

export const followunfollow = async (req, res, next) => {
    try {
        const userId = req.body.user._id;
        const userData = req.body.user;
        const currentuser = req.body.currentuser;
        if (!userData.isFollowing) {
            const user = await Users.findOne({ _id: userId }).select("username");
            // Update the 'following' array of the user who is following
            await Users.findByIdAndUpdate(currentuser._id, { $addToSet: { following: userId } });
            // Update the 'followers' array of the user who is being followed
            await Users.findByIdAndUpdate(userId, { $addToSet: { followers: currentuser._id } });
            return res.json({ msg: `Started Following ${user.username} ` });
        }
        else {
            const user = await Users.findOne({ _id: userId }).select("username");
            await Users.findByIdAndUpdate(currentuser._id, { $pull: { following: userId } });
            // Remove the 'userId' from the 'followers' array of the user being unfollowed
            await Users.findByIdAndUpdate(userId, { $pull: { followers: currentuser._id } });
            return res.json({ msg: `Unfollowed ${user.username}` });
        }

    } catch (error) {
        next(error)
    }
}

export const getMatchingUsers = async (req, res, next) => {
    try {
        const { searchQuery } = req.query;
        const id = req.params.id;
        let users;
        const user = await Users.findOne({ _id: id }).select("following");
        const { following } = user;
        if (searchQuery === "") {
            users = await Users.find({ _id: { $ne: id } }).select([
                "username",
                "IsAvatarImageSet",
                "AvatarImage",
                "_id",
                'userData'
            ]).sort({ 'username': 1 });
        }
        else {
            users = await Users.find({
                username: { $regex: new RegExp(searchQuery, 'i') }, // Search for usernames that include the provided string (case-insensitive)
                _id: { $ne: id } // Exclude the current user by ID
            }).select([
                "username",
                "IsAvatarImageSet",
                "AvatarImage",
                "_id",
                'userData'
            ]);
        }
        // Adding the isFollowing field for each user
        users = users.map(user => ({
            ...user.toObject(),
            isFollowing: following.includes(user._id)
        }));
        return res.json(users);

    } catch (error) {
        next(error);
    }
};

export const getuser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const currentUserId = req.headers.id;
        let user = await Users.findOne({ _id: userId });
        
        // Validate and clean up followers and following arrays dynamically
        const followerIds = (user.followers || []).filter(id => typeof id === 'string' && id.length === 24);
        const followingIds = (user.following || []).filter(id => typeof id === 'string' && id.length === 24);
        
        const validFollowers = await Users.find({ _id: { $in: followerIds } }).select('_id');
        const validFollowings = await Users.find({ _id: { $in: followingIds } }).select('_id');
        
        const validFollowerIds = validFollowers.map(u => u._id.toString());
        const validFollowingIds = validFollowings.map(u => u._id.toString());
        
        let needsSave = false;
        if (user.followers.length !== validFollowerIds.length) {
            user.followers = validFollowerIds;
            needsSave = true;
        }
        if (user.following.length !== validFollowingIds.length) {
            user.following = validFollowingIds;
            needsSave = true;
        }

        let { password, ...userWithoutSensitiveInfo } = user.toObject();

        // Find all users sorted by XP in descending order
        const allUsers = await Users.find().sort({ 'userData.xp': -1 });
        const userRank = allUsers.findIndex(user => user._id.toString() === userId);
        const actualRank = userRank + 1;

        //dailychallenges update
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000;
        const today = (new Date(now.getTime() + offset)).toISOString().split('T')[0];

        if (!user.userData.dailyChallenges.claimedQuests) {
            user.userData.dailyChallenges.claimedQuests = [];
        }

        if (new Date(user.userData.dailyChallenges.date).toISOString().split('T')[0] !== today) {
            user.userData.dailyChallenges.xp = 0;
            user.userData.dailyChallenges.lessonsNumber = 0;
            user.userData.dailyChallenges.correctQuestions = 0;
            user.userData.dailyChallenges.claimedQuests = [];
            user.userData.dailyChallenges.date = today;
        }

        //add streak to user data
        user.userData.streak.days = calculateStreak(user.userData.streak.dates);
        user.userData.streak.maxStreak = calculateMaxStreak(user.userData.streak.dates);
        await user.save();

        // Adding the isFollowing field for each user
        userWithoutSensitiveInfo = { ...userWithoutSensitiveInfo, followers: validFollowerIds, following: validFollowingIds, isFollowing: user.followers.includes(currentUserId), rank: actualRank }
        return res.json(userWithoutSensitiveInfo);
    } catch (error) {
        next(error)
    }
}

export const leaderboard = async (req, res, next) => {
    try {
        // Find all users sorted by XP in descending order
        const allUsers = await Users.find()
        .select('AvatarImage username userData.xp _id')
        .sort({ 'userData.xp': -1 });
        return res.json(allUsers);
    } 
    catch (error) {
        next(error)
    }
}

export const updateusername = async (req, res, next) => {
    try {
        const id = req.params.id;
        let { username } = req.body;
        if (!username) {
            return res.json({ msg: "Username is required", status: false });
        }
        username = _.toLower(username.trim());

        // Check if username already exists
        const usernamecheck = await Users.findOne({ username });
        if (usernamecheck && usernamecheck._id.toString() !== id) {
            return res.json({ msg: "Username already exists", status: false });
        }

        const updatedUser = await Users.findByIdAndUpdate(id, { username }, { new: true });
        
        // Return updated user object
        const { password, followers, following, ...userWithoutSensitiveInfo } = updatedUser.toObject();
        return res.json({ status: true, user: userWithoutSensitiveInfo });

    } catch (error) {
        next(error);
    }
};

export const claimquest = async (req, res, next) => {
    try {
        const { userId, questId } = req.body;
        if (!userId || !questId) {
            return res.status(400).json({ status: false, msg: "userId and questId are required" });
        }
        let user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }

        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000;
        const today = (new Date(now.getTime() + offset)).toISOString().split('T')[0];

        if (!user.userData) {
            user.userData = {};
        }
        if (!user.userData.dailyChallenges) {
            user.userData.dailyChallenges = { xp: 0, correctQuestions: 0, lessonsNumber: 0, claimedQuests: [], date: today };
        }
        if (!user.userData.dailyChallenges.claimedQuests) {
            user.userData.dailyChallenges.claimedQuests = [];
        }

        if (new Date(user.userData.dailyChallenges.date).toISOString().split('T')[0] !== today) {
            user.userData.dailyChallenges.xp = 0;
            user.userData.dailyChallenges.lessonsNumber = 0;
            user.userData.dailyChallenges.correctQuestions = 0;
            user.userData.dailyChallenges.claimedQuests = [];
            user.userData.dailyChallenges.date = today;
        }

        if (user.userData.dailyChallenges.claimedQuests.includes(questId)) {
            return res.json({ status: false, msg: "Quest already claimed today!" });
        }

        let isEligible = false;
        if (questId === 'earn100xp' && user.userData.dailyChallenges.xp >= 100) {
            isEligible = true;
        } else if (questId === 'solve10ques' && user.userData.dailyChallenges.correctQuestions >= 10) {
            isEligible = true;
        } else if (questId === 'score3lessons' && user.userData.dailyChallenges.lessonsNumber >= 3) {
            isEligible = true;
        }

        if (!isEligible) {
            return res.json({ status: false, msg: "Quest requirement not completed yet!" });
        }

        // Award 50 XP to total user XP
        user.userData.xp = (user.userData.xp || 0) + 50;

        // Note: user.userData.dailyChallenges.xp is NOT incremented by this reward,
        // so this +50 XP reward does NOT count towards the "Earn 100 XP" progress.

        user.userData.dailyChallenges.claimedQuests.push(questId);
        user.markModified('userData');

        await user.save();

        const allUsers = await Users.find().sort({ 'userData.xp': -1 });
        const userRank = allUsers.findIndex(u => u._id.toString() === userId) + 1;

        let { password, ...userObj } = user.toObject();
        userObj.rank = userRank;

        return res.json({ status: true, msg: "Quest completed! +50 XP awarded.", user: userObj });
    } catch (error) {
        next(error);
    }
};
