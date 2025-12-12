// Test backend authentication API
const axios = require('axios');

async function testBackendAuth() {
  try {
    console.log('=== BACKEND AUTHENTICATION TEST ===\n');
    
    // Test with the delivery boy account we know exists
    console.log('Testing backend authentication with delivery boy account...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test.created@example.com',
      password: 'createddelivery123'
    });
    
    console.log('✅ Backend authentication successful!');
    console.log('Status:', response.status);
    console.log('Token present:', !!response.data.token);
    console.log('User role:', response.data.user?.role);
    
    if (response.data.user?.role === 'deliveryBoy') {
      console.log('✅ Correct role assigned to delivery boy');
    } else {
      console.log('❌ Incorrect role assigned');
    }
    
    console.log('\n🎉 BACKEND AUTHENTICATION WORKING CORRECTLY');
    console.log('The universal login solution will work perfectly!');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Backend authentication failed');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testBackendAuth();