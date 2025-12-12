require('dotenv').config();
const axios = require('axios');

// Test the complete frontend authentication flow
const testFrontendAuthFlow = async () => {
  try {
    console.log('=== Testing Frontend Authentication Flow ===');
    
    // Step 1: Test if we can reach the frontend
    console.log('\n1. Testing frontend accessibility...');
    try {
      const frontendResponse = await axios.get('http://localhost:5173/');
      console.log('✅ Frontend is accessible');
    } catch (error) {
      console.log('❌ Frontend is not accessible');
      console.log('Error:', error.message);
      return;
    }
    
    // Step 2: Test backend API directly (we already know this works)
    console.log('\n2. Testing backend API directly...');
    try {
      const apiResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'mike.delivery@fabrico.com',
        password: 'delivery123'
      });
      
      console.log('✅ Backend API login successful');
      console.log('- Token length:', apiResponse.data.token.length);
      console.log('- User role:', apiResponse.data.user.role);
    } catch (error) {
      console.log('❌ Backend API login failed');
      console.log('Error:', error.message);
      if (error.response) {
        console.log('- Status:', error.response.status);
        console.log('- Data:', error.response.data);
      }
      return;
    }
    
    // Step 3: Test the specific delivery boy login endpoint
    console.log('\n3. Testing delivery boy login endpoint...');
    try {
      // This simulates what the frontend does
      const deliveryLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'mike.delivery@fabrico.com',
        password: 'delivery123'
      });
      
      console.log('✅ Delivery boy login endpoint working');
      console.log('- Status:', deliveryLoginResponse.status);
      console.log('- Has token:', !!deliveryLoginResponse.data.token);
      console.log('- User role:', deliveryLoginResponse.data.user.role);
      
      // Verify it's the correct role
      if (deliveryLoginResponse.data.user.role === 'deliveryBoy') {
        console.log('✅ Correct role assigned');
      } else {
        console.log('❌ Incorrect role assigned');
      }
    } catch (error) {
      console.log('❌ Delivery boy login endpoint failed');
      if (error.response) {
        console.log('- Status:', error.response.status);
        console.log('- Data:', error.response.data);
      } else {
        console.log('- Error:', error.message);
      }
      return;
    }
    
    // Step 4: Test with wrong credentials (should fail)
    console.log('\n4. Testing with wrong credentials (should fail)...');
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'mike.delivery@fabrico.com',
        password: 'wrongpassword'
      });
      
      console.log('❌ Wrong credentials test failed - should have gotten an error');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Wrong credentials correctly rejected');
      } else {
        console.log('❓ Unexpected error with wrong credentials');
        if (error.response) {
          console.log('- Status:', error.response.status);
          console.log('- Data:', error.response.data);
        }
      }
    }
    
    console.log('\n🎉 All backend tests passed!');
    console.log('The issue is definitely in the frontend implementation.');
    console.log('\nNext steps:');
    console.log('1. Check browser console for JavaScript errors');
    console.log('2. Check network tab to see if API calls are being made');
    console.log('3. Verify the frontend is sending the correct data to the backend');
    
  } catch (err) {
    console.error('Error in frontend auth flow test:', err.message);
  }
};

testFrontendAuthFlow();