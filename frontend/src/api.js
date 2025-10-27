import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request - Token:', token ? 'Present' : 'Missing');
  console.log('API Request - Config URL:', config.url);
  console.log('API Request - Config Method:', config.method);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request - Adding Authorization header with token');
    console.log('API Request - Token length:', token.length);
  } else {
    console.log('API Request - No token found in localStorage');
  }
  
  console.log('API Request - Final config:', {
    url: config.url,
    method: config.method,
    headers: { ...config.headers }
  });
  
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
    console.error('API Response - Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    // Log request details if available
    if (error.config) {
      console.error('API Response - Request details:', {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;