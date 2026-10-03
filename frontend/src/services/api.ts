import axios from 'axios';

// In production (Netlify), API calls go to /api on the same origin.
// For local dev, set VITE_API_URL=http://localhost:5000/api in frontend/.env
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('petconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-clear if it was a failed login attempt
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/demo-login')) {
        localStorage.removeItem('petconnect_token');
        localStorage.removeItem('petconnect_user');
      }
    }
    return Promise.reject(error);
  }
);
