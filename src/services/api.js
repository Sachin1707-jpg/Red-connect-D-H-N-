import axios from 'axios';

// Base Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.redconnect.org/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('redconnect_token');
    }
    return Promise.reject(error);
  }
);

// Utility mock helper function to simulate asynchronous backend network delay
export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
