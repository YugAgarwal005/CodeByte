import axios from 'axios';
import { refreshTokenRoute } from './Apiroutes';

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('codebyte-user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const saveAuthData = (userObj) => {
  if (!userObj) {
    localStorage.removeItem('codebyte-user');
    return;
  }
  localStorage.setItem('codebyte-user', JSON.stringify(userObj));
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // Consider expired if less than 60 seconds remaining
    return payload.exp * 1000 < (Date.now() + 60000);
  } catch (e) {
    return true;
  }
};

export const refreshAuthToken = async () => {
  const user = getStoredUser();
  const refreshToken = user?.refreshToken;
  if (!refreshToken) {
    return null;
  }

  try {
    const { data } = await axios.post(refreshTokenRoute, { refreshToken });
    if (data.status && data.accessToken) {
      const updatedUser = {
        ...(user || {}),
        ...(data.user || {}),
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken
      };
      saveAuthData(updatedUser);
      return data.accessToken;
    } else {
      // Refresh token invalid or expired explicitly returned by server
      saveAuthData(null);
      return null;
    }
  } catch (err) {
    console.error("Failed to refresh token:", err);
    // Only wipe stored session if server explicitly responded with 401/403 or expired flag
    if (err.response && (err.response.status === 401 || err.response.status === 403 || err.response.data?.expired)) {
      saveAuthData(null);
    }
    return null;
  }
};

// Start periodic refresh every 14 minutes (before 15m expiration)
let refreshIntervalId = null;

export const startTokenRefreshTimer = () => {
  if (refreshIntervalId) clearInterval(refreshIntervalId);

  // 14 minutes in ms = 14 * 60 * 1000 = 840000 ms
  const REFRESH_INTERVAL = 14 * 60 * 1000;

  refreshIntervalId = setInterval(async () => {
    const user = getStoredUser();
    if (user && user.refreshToken) {
      console.log("Auto-refreshing access token (15min cycle)...");
      await refreshAuthToken();
    } else {
      clearInterval(refreshIntervalId);
    }
  }, REFRESH_INTERVAL);
};

// Setup Axios request & response interceptors
let isInterceptorsSetup = false;

export const setupAxiosInterceptors = () => {
  if (isInterceptorsSetup) return;
  isInterceptorsSetup = true;

  axios.interceptors.request.use(
    (config) => {
      const user = getStoredUser();
      if (user && user.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/api/auth/refreshtoken') &&
        !originalRequest.url.includes('/api/auth/login')
      ) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAuthToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
};
