import axios from 'axios';

// Use relative path in development (proxy will handle it)
// Use full URL in production
const API_BASE_URL = import.meta.env.DEV 
  ? '' // Relative path - uses Vite proxy
  : 'https://vibechat-production-24a1.up.railway.app';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Access forbidden. Please check permissions or re-login.');
      console.error('Request URL:', error.config?.url);
      console.error('Request Method:', error.config?.method);
      // Optionally force re-login on 403 as well
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
