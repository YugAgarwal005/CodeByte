import bcrypt from 'bcryptjs';
import { Users } from '../models/user.model.js';
import _ from 'lodash';
import { getImageKit } from './user.controller.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';

export const register = async (req, res, next) => {
    try {
        req.body.username = _.toLower(req.body.username);
        const { username, password: loginPassword, email, rememberMe } = req.body;
        const usernamecheck = await Users.findOne({ username });
        const emailcheck = await Users.findOne({ email });
        if (usernamecheck)
            return res.json({ msg: "Username already taken, Try another", status: false });
        if (emailcheck)
            return res.json({ msg: "Account with Email already exists, Try logging in or use diffrent Email address", status: false });
        const hashedPass = await bcrypt.hash(loginPassword, 10);
        const user = await Users.create({
            username: username,
            email: email,
            password: hashedPass
        });

        const isRemember = Boolean(rememberMe);
        const accessToken = generateAccessToken(user._id, user.username);
        const refreshToken = generateRefreshToken(user._id, isRemember);

        // Exclude sensitive fields from the response
        const { password, followers, following, courseProgress, isAdmin, userData, ...userWithoutSensitiveInfo } = user.toObject();
        userWithoutSensitiveInfo.accessToken = accessToken;
        userWithoutSensitiveInfo.refreshToken = refreshToken;

        return res.json({
            status: true,
            user: userWithoutSensitiveInfo,
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        req.body.username = _.toLower(req.body.username);
        const { username, password: loginPassword, rememberMe } = req.body;
        const user = await Users.findOne({ $or: [{ 'username': username }, { 'email': username }] });

        if (!user)
            return res.json({ msg: "User with this Email or Username does not exist", status: false });

        if (!user.password) {
            return res.json({ msg: "Account registered using Google, try logging in with the same method", status: false });
        }

        const IsPassValid = await bcrypt.compare(loginPassword, user.password);
        if (!IsPassValid)
            return res.json({ msg: "Incorrect Password", status: false });

        const isRemember = Boolean(rememberMe);
        const accessToken = generateAccessToken(user._id, user.username);
        const refreshToken = generateRefreshToken(user._id, isRemember);

        // Exclude sensitive fields from the response
        const { password, followers, following, courseProgress, isAdmin, userData, ...userWithoutSensitiveInfo } = user.toObject();
        userWithoutSensitiveInfo.accessToken = accessToken;
        userWithoutSensitiveInfo.refreshToken = refreshToken;

        return res.json({
            status: true,
            user: userWithoutSensitiveInfo,
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
}

export const googlelogin = async (req, res, next) => {
    try {
        var { username, email, buffer, picture } = req.body;
        let googlePhotoUrl = picture || buffer || "";

        // If buffer was base64 encoded URL, decode if possible
        if (googlePhotoUrl && !googlePhotoUrl.startsWith('http') && !googlePhotoUrl.startsWith('data:')) {
            try {
                const decoded = Buffer.from(googlePhotoUrl, 'base64').toString('utf-8');
                if (decoded.startsWith('http')) {
                    googlePhotoUrl = decoded;
                }
            } catch (e) {
                // ignore
            }
        }

        let finalAvatarUrl = googlePhotoUrl;
        const ik = getImageKit();
        if (ik && googlePhotoUrl && (googlePhotoUrl.startsWith('http') || googlePhotoUrl.startsWith('data:'))) {
            try {
                const uploadRes = await ik.upload({
                    file: googlePhotoUrl,
                    fileName: `google_${Date.now()}.png`,
                    folder: "/avatars"
                });
                if (uploadRes && uploadRes.url) {
                    finalAvatarUrl = uploadRes.url;
                }
            } catch (ikErr) {
                console.error("ImageKit upload error in googlelogin:", ikErr.message || ikErr);
            }
        }

        const emailcheck = await Users.findOne({ email });

        if (emailcheck && emailcheck.password)
            return res.json({ msg: "Account with Email already exists, Try logging in with password or use diffrent Email address", status: false });
        else if (emailcheck) {
            // Ensure avatar is set for Google user
            if (finalAvatarUrl && (!emailcheck.IsAvatarImageSet || !emailcheck.AvatarImage)) {
                emailcheck.AvatarImage = finalAvatarUrl;
                emailcheck.profilePic = finalAvatarUrl;
                emailcheck.IsAvatarImageSet = true;
                await emailcheck.save();
            }

            // Google login default expiration is 1 month (30d)
            const accessToken = generateAccessToken(emailcheck._id, emailcheck.username);
            const refreshToken = generateRefreshToken(emailcheck._id, true);

            const { password, followers, following, courseProgress, ...userWithoutSensitiveInfo } = emailcheck.toObject();
            userWithoutSensitiveInfo.accessToken = accessToken;
            userWithoutSensitiveInfo.refreshToken = refreshToken;

            return res.json({
                status: true,
                user: userWithoutSensitiveInfo,
                accessToken,
                refreshToken
            });
        }

        username = username + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

        while (await Users.findOne({ username })) {
            username = username + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        }

        const user = await Users.create({
            username: username,
            email: email,
            profilePic: finalAvatarUrl,
            AvatarImage: finalAvatarUrl,
            IsAvatarImageSet: true
        });

        // Google login default expiration is 1 month (30d)
        const accessToken = generateAccessToken(user._id, user.username);
        const refreshToken = generateRefreshToken(user._id, true);

        const { password, followers, following, courseProgress, isAdmin, userData, ...userWithoutSensitiveInfo } = user.toObject();
        userWithoutSensitiveInfo.accessToken = accessToken;
        userWithoutSensitiveInfo.refreshToken = refreshToken;

        return res.json({
            status: true,
            user: userWithoutSensitiveInfo,
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error)
    }
}

export const refreshtoken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ status: false, msg: "Refresh token is required", expired: true });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ status: false, msg: "Invalid or expired refresh token", expired: true });
        }

        const user = await Users.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ status: false, msg: "User not found", expired: true });
        }

        const newAccessToken = generateAccessToken(user._id, user.username);
        const rememberMe = Boolean(decoded.rememberMe);
        const newRefreshToken = generateRefreshToken(user._id, rememberMe);

        const { password, followers, following, courseProgress, isAdmin, userData, ...userWithoutSensitiveInfo } = user.toObject();
        userWithoutSensitiveInfo.accessToken = newAccessToken;
        userWithoutSensitiveInfo.refreshToken = newRefreshToken;

        return res.json({
            status: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user: userWithoutSensitiveInfo
        });
    } catch (error) {
        next(error);
    }
};
