// Simple test to check delivery boy login via API
const axios = require('axios');

async function testDeliveryBoyLogin() {
  try {
    console.log('=== SIMPLE DELIVERY BOY LOGIN TEST ===\n');
    
    // Test login via API with the delivery boy we created earlier
    console.log('Testing login via API with test.created@example.com...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test.created@example.com',
        password: 'createddelivery123'
      });
      
      console.log('✅ API login successful!');
      console.log('   Status:', loginResponse.status);
      console.log('   Token present:', !!loginResponse.data.token);
      console.log('   User ID:', loginResponse.data.user?.id);
      console.log('   User name:', loginResponse.data.user?.name);
      console.log('   User email:', loginResponse.data.user?.email);
      console.log('   User role:', loginResponse.data.user?.role);
      
    } catch (apiError) {
      console.log('❌ API login failed');
      if (apiError.response) {
        console.log('   Status:', apiError.response.status);
        console.log('   Data:', apiError.response.data);
      } else {
        console.log('   Error:', apiError.message);
      }
      return;
    }
    
    console.log('\n🎉 LOGIN TEST COMPLETED SUCCESSFULLY');
    console.log('The backend authentication is working correctly.');
    console.log('If you\'re still having login issues, the problem is likely in the frontend.');
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

testDeliveryBoyLogin();