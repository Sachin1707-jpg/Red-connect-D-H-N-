import axios from 'axios';

// Base Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://red-connect-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds to allow Render free tier cold starts
});

// Request interceptor adding Auth Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('redconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('redconnect_refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
          if (data && data.token) {
            localStorage.setItem('redconnect_token', data.token);
            if (data.refreshToken) {
              localStorage.setItem('redconnect_refresh_token', data.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          console.error('[api interceptor] Refresh token failed:', refreshErr.message);
        }
      }
      localStorage.removeItem('redconnect_token');
      localStorage.removeItem('redconnect_refresh_token');
      localStorage.removeItem('redconnect_user');
    }
    return Promise.reject(error);
  }
);

// Utility mock helper function to simulate asynchronous backend network delay
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
