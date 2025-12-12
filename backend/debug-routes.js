// Script to debug route matching
require('dotenv').config();
const axios = require('axios');

async function debugRoutes() {
  try {
    console.log('=== DEBUGGING ROUTE MATCHING ===\n');
    
    // 1. Login as delivery boy to get token
    console.log('1. Logging in as delivery boy...');
    const loginResponse = await axios.post(`http://localhost:5020/api/auth/login`, {
      email: 'mike.delivery@fabrico.com',
      password: 'delivery123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('Token length:', token.length);
    
    // 2. Test the exact endpoint that's failing
    console.log('\n2. Testing /api/orders/my-deliveries endpoint...');
    try {
      const response = await axios.get(`http://localhost:5020/api/orders/my-deliveries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Request succeeded');
      console.log('Status:', response.status);
      console.log('Data keys:', Object.keys(response.data));
      
    } catch (error) {
      console.log('❌ Request failed');
      console.log('Status:', error.response?.status);
      console.log('Status text:', error.response?.statusText);
      console.log('Data:', error.response?.data);
      
      // Let's also try to see what routes are available
      console.log('\n3. Testing base orders endpoint...');
      try {
        const baseResponse = await axios.get(`http://localhost:5020/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('✅ Base orders endpoint succeeded');
        console.log('Status:', baseResponse.status);
      } catch (baseError) {
        console.log('❌ Base orders endpoint failed');
        console.log('Status:', baseError.response?.status);
        console.log('Data:', baseError.response?.data);
      }
    }
    
  } catch (error) {
    console.log('❌ Error in debug:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  }
}

debugRoutes();