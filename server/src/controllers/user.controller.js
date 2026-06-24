import { Users } from '../models/user.model.js';
import _ from 'lodash';

export const setavatar = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await Users.findByIdAndUpdate(id, {
            IsAvatarImageSet: true,
            AvatarImage: req.body.image
        }, { new: true });
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

        if (new Date(user.userData.dailyChallenges.date).toISOString().split('T')[0] !== today) {
            user.userData.dailyChallenges.xp = 0;
            user.userData.dailyChallenges.lessonsNumber = 0;
            user.userData.dailyChallenges.correctQuestions = 0;
            user.userData.dailyChallenges.date = today;
        }

        //add streak to user data
        user.userData.streak.days = calculateStreak(user.userData.streak.dates);
        await user.save();

        // Adding the isFollowing field for each user
        userWithoutSensitiveInfo = { ...userWithoutSensitiveInfo, followers: validFollowerIds, following: validFollowingIds, isFollowing: user.followers.includes(currentUserId), rank: actualRank }
        return res.json(userWithoutSensitiveInfo);
    } catch (error) {
        next(error)
    }
}

export const shop = async (req, res, next) => {
    try {
        const id = req.params.id;
        const User = await Users.findOne({ _id: id });

        if (!User) {
            return res.send({ status: false, message: "User not found." });
        }

        // Find today's date
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000;
        const today = (new Date(now.getTime() + offset)).toISOString().split('T')[0];
        // Find yesterday's date
        const yesterday = (new Date(now.getTime() + offset));
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayWithoutTime = yesterday.toISOString().split('T')[0];

        const dateStrings = (User.userData.streak.dates || []).map(date => new Date(date).toISOString().split('T')[0]);
        const hasToday = dateStrings.includes(today);
        const hasYesterday = dateStrings.includes(yesterdayWithoutTime);

        if (User.userData.gems < 200) {
            return res.send({ status: false, message: "You don't have enough gems! Complete more lessons to earn gems." });
        }

        if (hasToday && hasYesterday) {
            return res.send({ status: false, message: "Your streak is already active and safe for yesterday and today! You don't need a Streak Freeze right now." });
        }

        let purchased = false;
        let message = "";

        if (!hasYesterday) {
            User.userData.streak.dates.push(yesterdayWithoutTime);
            User.userData.gems -= 200;
            purchased = true;
            message = "Streak Freeze purchased successfully! Yesterday's date has been frozen to protect your streak.";
        } else if (!hasToday) {
            User.userData.streak.dates.push(today);
            User.userData.gems -= 200;
            purchased = true;
            message = "Streak Freeze purchased successfully! Today's date has been frozen to protect your streak.";
        }

        if (purchased) {
            // add streak to user data
            User.userData.streak.days = calculateStreak(User.userData.streak.dates);
            // Save the changes to the database
            await User.save();
            return res.send({ status: true, message });
        } else {
            return res.send({ status: false, message: "Your streak is already safe! You don't need a Streak Freeze right now." });
        }
    } catch (error) {
        next(error)
    }
}

const calculateStreak = (dates) => {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;
    const today = (new Date(now.getTime() + offset)).toISOString().split('T')[0];

    const todayIndex = dates.findIndex(date => {
        const dateWithoutTime = new Date(date).toISOString().split('T')[0];
        return dateWithoutTime === today;
    });

    // Find yesterday's date
    const yesterday = (new Date(now.getTime() + offset));
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayWithoutTime = yesterday.toISOString().split('T')[0];

    // Find yesterday's index
    const yesterdayIndex = dates.findIndex(date => {
        const dateWithoutTime = new Date(date).toISOString().split('T')[0];
        return dateWithoutTime === yesterdayWithoutTime;
    });

    // Check if today is part of the dates
    if (yesterdayIndex === -1 && todayIndex === -1) {
        return 0; // Streak is broken if yesterday is not in the array
    }

    let streak = 1;
    // Iterate through the dates starting from today's index
    for (let i = yesterdayIndex; i >= 0; i--) {
        // Check if the dates are consecutive
        if (new Date(dates[i]) - new Date(dates[i - 1]) === 24 * 60 * 60 * 1000) {
            streak++;
        } else {
            break; // Streak is broken
        }
    }

    if (todayIndex != -1 && yesterdayIndex != -1) {
        streak++;
    }

    return streak;
};

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
