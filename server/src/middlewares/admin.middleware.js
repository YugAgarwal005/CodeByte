import { Users } from "../models/user.model.js";

/**
 * requireAdmin middleware
 *
 * Must be placed AFTER the `protect` middleware in a route chain, e.g.:
 *   router.post("/createunit", protect, requireAdmin, createUnits);
 *
 * Why a DB lookup instead of reading from the JWT?
 *   If we stored isAdmin in the JWT, a user's admin status could not be
 *   revoked until their token expires. By checking the DB every time, we
 *   get real-time accuracy at the cost of one extra query.
 */
export const requireAdmin = async (req, res, next) => {
  try {
    // req.user.userId is set by the protect middleware
    const user = await Users.findById(req.user.userId).select("isAdmin");

    if (!user || !user.isAdmin) {
      return res.status(403).json({
        status: false,
        message: "Forbidden: admin access required",
      });
    }

    // User is an admin — allow the request to proceed
    next();
  } catch (error) {
    next(error);
  }
};
