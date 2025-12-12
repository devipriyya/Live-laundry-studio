// Detailed debug script to trace route matching
require('dotenv').config();
const axios = require('axios');

async function detailedDebug() {
  try {
    console.log('=== DETAILED DEBUGGING ===\n');
    
    // 1. Login as delivery boy to get token
    console.log('1. Logging in as delivery boy...');
    const loginResponse = await axios.post(`http://localhost:5020/api/auth/login`, {
      email: 'mike.delivery@fabrico.com',
      password: 'delivery123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('Token length:', token.length);
    
    // 2. Test the exact endpoint that's failing with detailed info
    console.log('\n2. Testing /api/orders/my-deliveries endpoint...');
    try {
      const response = await axios.get(`http://localhost:5020/api/orders/my-deliveries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Request succeeded');
      console.log('Status:', response.status);
      console.log('Data keys:', Object.keys(response.data));
      
    } catch (error) {
      console.log('❌ Request failed');
      console.log('Status:', error.response?.status);
      console.log('Status text:', error.response?.statusText);
      console.log('Headers:', error.response?.headers);
      console.log('Data:', JSON.stringify(error.response?.data, null, 2));
      
      // Let's also try to see what routes are available
      console.log('\n3. Testing base orders endpoint...');
      try {
        const baseResponse = await axios.get(`http://localhost:5020/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          timeout: 10000 // 10 second timeout
        });
        
        console.log('✅ Base orders endpoint succeeded');
        console.log('Status:', baseResponse.status);
        console.log('Data:', JSON.stringify(baseResponse.data, null, 2));
      } catch (baseError) {
        console.log('❌ Base orders endpoint failed');
        console.log('Status:', baseError.response?.status);
        console.log('Headers:', baseError.response?.headers);
        console.log('Data:', JSON.stringify(baseError.response?.data, null, 2));
      }
    }
    
    // 4. Test a route that should work for delivery boys
    console.log('\n4. Testing /api/orders/my-deliveries/stats endpoint...');
    try {
      const statsResponse = await axios.get(`http://localhost:5020/api/orders/my-deliveries/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Stats endpoint succeeded');
      console.log('Status:', statsResponse.status);
      console.log('Data:', JSON.stringify(statsResponse.data, null, 2));
    } catch (statsError) {
      console.log('❌ Stats endpoint failed');
      console.log('Status:', statsError.response?.status);
      console.log('Headers:', statsError.response?.headers);
      console.log('Data:', JSON.stringify(statsError.response?.data, null, 2));
    }
    
  } catch (error) {
    console.log('❌ Error in debug:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

detailedDebug();