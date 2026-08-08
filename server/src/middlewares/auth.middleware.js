import { verifyAccessToken } from '../utils/generateToken.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: false, message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return res.status(401).json({ status: false, message: "Not authorized, access token expired or invalid" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ status: false, message: "Not authorized, token failed" });
  }
};
