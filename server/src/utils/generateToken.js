import jwt from 'jsonwebtoken';

// Manual static secret keys
const JWT_SECRET = process.env.JWT_SECRET || 'codebyte_jwt_manual_access_secret_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'codebyte_jwt_manual_refresh_secret_key_2026';

// Generate short-lived access token (15 minutes)
export const generateAccessToken = (userId, username) => {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate refresh token (1 day by default, 30 days if rememberMe is true or for Google login)
export const generateRefreshToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : '1d';
  return jwt.sign(
    { userId, rememberMe },
    JWT_REFRESH_SECRET,
    { expiresIn }
  );
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
