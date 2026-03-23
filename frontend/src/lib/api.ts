import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // This will be run on the client side primarily
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('securecorp_auth');
      if (authStorage) {
        const { token } = JSON.parse(authStorage);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
