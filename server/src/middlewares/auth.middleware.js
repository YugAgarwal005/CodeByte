// Simple auth middleware placeholder for token verification
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }
    // Token verification logic would go here
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
