import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request - Token:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request - Adding Authorization header');
  } else {
    console.log('API Request - No token found');
  }
  console.log('API Request - Config:', config.url, config.method);
  return config;
});

// Log responses for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response - Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response - Error:', error.response?.status, error.message, error.config?.url);
    return Promise.reject(error);
  }
);

export default api;