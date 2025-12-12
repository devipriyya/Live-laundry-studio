require('dotenv').config();
const axios = require('axios');

// Test direct delivery boy login through API
const testDirectDeliveryLogin = async () => {
  try {
    console.log('=== Testing Direct Delivery Boy Login ===');
    
    // Test with the predefined account
    console.log('\nTesting login for mike.delivery@fabrico.com...');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'mike.delivery@fabrico.com',
        password: 'delivery123'
      });
      
      console.log('✅ Login successful through API');
      console.log('- Status:', response.status);
      console.log('- Token:', response.data.token.substring(0, 20) + '...');
      console.log('- User role:', response.data.user.role);
      console.log('- User name:', response.data.user.name);
      
      // Verify role
      if (response.data.user.role === 'deliveryBoy') {
        console.log('✅ Role verification passed');
        return true;
      } else {
        console.log('❌ Role verification failed');
        return false;
      }
    } catch (error) {
      console.log('❌ Login failed through API');
      if (error.response) {
        console.log('- Status:', error.response.status);
        console.log('- Data:', JSON.stringify(error.response.data));
      } else {
        console.log('- Error:', error.message);
      }
      return false;
    }
    
  } catch (err) {
    console.error('Error in direct login test:', err.message);
    return false;
  }
};

// Run the test
testDirectDeliveryLogin().then(success => {
  if (success) {
    console.log('\n🎉 SUCCESS: The backend API is working correctly.');
    console.log('The issue is likely in the frontend implementation.');
  } else {
    console.log('\n❌ FAILURE: Even the backend API is not working.');
    console.log('There may be an issue with the database or user accounts.');
  }
});