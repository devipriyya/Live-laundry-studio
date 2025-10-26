const axios = require('axios');

async function simulateFullFrontendFlow() {
  const email = `fullflowtest${Date.now()}@example.com`;
  console.log('Simulating full frontend flow with email:', email);
  
  // Clear any existing token to simulate a fresh registration
  console.log('\n1. Clearing any existing token...');
  
  try {
    // Simulate what the frontend API does - create an axios instance
    const api = axios.create({
      baseURL: 'http://localhost:5000/api',
    });
    
    // Add interceptor to attach token (like the frontend does)
    api.interceptors.request.use((config) => {
      // In a real scenario, this would get a token from localStorage
      // We're simulating a case where there might be an invalid token
      const token = null; // Simulate no token
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    
    console.log('\n2. Attempting registration...');
    const registerResponse = await api.post('/auth/register', {
      name: 'Full Flow Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer',
      firebaseUid: `firebase_${Date.now()}` // Simulate Firebase UID
    });
    console.log('Registration response:', registerResponse.status, registerResponse.data);
    
    console.log('\nFull flow completed successfully!');
  } catch (error) {
    console.error('Error in full flow:', error.response?.data || error.message);
    
    // Let's also try without any interceptors to see if that's the issue
    console.log('\n3. Trying without interceptors...');
    try {
      const directApi = axios.create({
        baseURL: 'http://localhost:5000/api',
      });
      
      const directResponse = await directApi.post('/auth/register', {
        name: 'Direct Test User',
        email: `directtest${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'customer',
        firebaseUid: `firebase_${Date.now()}_direct`
      });
      console.log('Direct registration response:', directResponse.status, directResponse.data);
    } catch (directError) {
      console.error('Direct registration failed:', directError.response?.data || directError.message);
    }
  }
}

simulateFullFrontendFlow();