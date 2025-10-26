// Test the fix endpoint
const axios = require('axios');

async function testFixEndpoint() {
  try {
    console.log('Testing fix endpoint...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin login successful');
    
    // Test the fix endpoint with detailed error handling
    console.log('Calling fix endpoint...');
    const response = await axios.post('http://localhost:5000/api/orders/fix-user-associations', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('Fix endpoint response:', response.data);
    
  } catch (error) {
    console.error('Error calling fix endpoint:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }
    
    if (error.request) {
      console.error('Request:', error.request);
    }
  }
}

testFixEndpoint();