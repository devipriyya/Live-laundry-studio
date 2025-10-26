// Test token handling
const axios = require('axios');

async function testTokenHandling() {
  try {
    console.log('=== TESTING TOKEN HANDLING ===');
    
    // Test admin login
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('   Token length:', token.length);
    
    // Test using token for API request
    console.log('\n2. Testing API request with token...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders?limit=3', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ API request with token successful');
    console.log('   Status:', ordersResponse.status);
    console.log('   Orders count:', ordersResponse.data.orders.length);
    
    console.log('\n🎉 TOKEN HANDLING TEST PASSED');
    console.log('   The token is working correctly for API authentication.');
    
  } catch (error) {
    console.error('❌ TOKEN HANDLING TEST FAILED');
    console.error('   Message:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testTokenHandling();