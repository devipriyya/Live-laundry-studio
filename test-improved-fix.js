// Test the improved fix endpoint
const axios = require('axios');

async function testImprovedFixEndpoint() {
  try {
    console.log('Testing improved fix endpoint...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test the improved fix endpoint
    console.log('Calling improved fix endpoint...');
    const response = await axios.post('http://localhost:5000/api/orders/fix-user-associations-improved', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ Improved fix endpoint response:', response.data);
    
  } catch (error) {
    console.error('❌ Error calling improved fix endpoint:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testImprovedFixEndpoint();