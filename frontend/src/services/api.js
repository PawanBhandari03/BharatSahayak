import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://bharatsahayak.onrender.com').replace(/\/api\/?$/, '') + '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bs_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.warn('API Error (using mock data):', error.message);
    // Return null so services can fall back to mock data
    return Promise.reject(error);
  }
);

export default api;
