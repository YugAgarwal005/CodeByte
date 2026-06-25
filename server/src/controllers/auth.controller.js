import bcrypt from 'bcryptjs';
import { Users } from '../models/user.model.js';
import _ from 'lodash';

export const register = async (req, res, next) => {
    try {
        req.body.username = _.toLower(req.body.username);
        const { username, password: loginPassword, email } = req.body;
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
        await Users.findOneAndUpdate({ username: 'vedantgore1331' }, { $addToSet: { followers: user._id.toString() } });
        await Users.findOneAndUpdate({ username: 'codebyte-admin' }, { $addToSet: { followers: user._id.toString() } });
        await Users.findOneAndUpdate({ username: 'codebyte-admin' }, { $addToSet: { following: user._id.toString() } });
        // Exclude sensitive fields from the response
        const { password, followers, following, courseProgress, isAdmin, userData, ...userWithoutSensitiveInfo } = user.toObject();
        return res.json({ status: true, user: userWithoutSensitiveInfo });

    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        req.body.username = _.toLower(req.body.username);
        const { username, password: loginPassword } = req.body;
        const user = await Users.findOne({ $or: [{ 'username': username }, { 'email': username }] });

        if (!user)
            return res.json({ msg: "User with this Email or Username does not exist", status: false });

        if (!user.password) {
            return res.json({ msg: "Account registered using Google or Facebook, try logging in with the same method", status: false });
        }

        const IsPassValid = await bcrypt.compare(loginPassword, user.password);
        if (!IsPassValid)
            return res.json({ msg: "Incorrect Password", status: false });

        // Exclude sensitive fields from the response
        const { password, followers, following, courseProgress, isAdmin, userData, ...userWithoutSensitiveInfo } = user.toObject();
        return res.json({ status: true, user: userWithoutSensitiveInfo });

    } catch (error) {
        next(error);
    }
}

export const googlelogin = async (req, res, next) => {
    try {
        var { username, email, buffer } = req.body;
        const emailcheck = await Users.findOne({ email });

        if (emailcheck && emailcheck.password)
            return res.json({ msg: "Account with Email already exists, Try logging in with password or use diffrent Email address", status: false });
        else if (emailcheck) {
            const { password, followers, following, courseProgress, ...userWithoutSensitiveInfo } = emailcheck.toObject();
            return res.json({ status: true, user: userWithoutSensitiveInfo });
        }
        username = username + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

        while (await Users.findOne({ username })) {
            username = username + (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
        }

        const user = await Users.create({
            username: username,
            email: email,
            profilePic: buffer
        });

        await Users.findOneAndUpdate({ username: 'vedantgore1331' }, { $addToSet: { followers: user._id.toString() } });
        await Users.findOneAndUpdate({ username: 'codebyte-admin' }, { $addToSet: { followers: user._id.toString() } });
        await Users.findOneAndUpdate({ username: 'codebyte-admin' }, { $addToSet: { following: user._id.toString() } });

        const { password, followers, following, courseProgress, isAdmin, userData, ...userWithoutSensitiveInfo } = user.toObject();
        return res.json({ status: true, user: userWithoutSensitiveInfo });

    } catch (error) {
        next(error)
    }
}
