require('dotenv').config();
const axios = require('axios');

// Detailed authentication test to diagnose the issue
const detailedAuthTest = async () => {
  try {
    console.log('=== Detailed Authentication Test ===');
    
    // Test 1: Check if we can connect to the backend
    console.log('\n1. Testing backend connectivity...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/health');
      console.log('✅ Backend health check successful');
      console.log('- Status:', healthResponse.status);
      console.log('- Data:', healthResponse.data);
    } catch (error) {
      console.log('❌ Backend health check failed');
      console.log('- Error:', error.message);
      return;
    }
    
    // Test 2: Check if we can access the login endpoint
    console.log('\n2. Testing login endpoint accessibility...');
    try {
      const optionsResponse = await axios.options('http://localhost:5000/api/auth/login');
      console.log('✅ Login endpoint accessible');
      console.log('- Status:', optionsResponse.status);
      console.log('- Methods:', optionsResponse.headers['access-control-allow-methods']);
    } catch (error) {
      console.log('❌ Login endpoint not accessible');
      console.log('- Error:', error.message);
    }
    
    // Test 3: Test with correct credentials
    console.log('\n3. Testing login with correct credentials...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'mike.delivery@fabrico.com',
        password: 'delivery123'
      });
      
      console.log('✅ Login with correct credentials successful');
      console.log('- Status:', loginResponse.status);
      console.log('- Has token:', !!loginResponse.data.token);
      console.log('- Token length:', loginResponse.data.token.length);
      console.log('- User role:', loginResponse.data.user.role);
      console.log('- User name:', loginResponse.data.user.name);
      
      // Verify role
      if (loginResponse.data.user.role === 'deliveryBoy') {
        console.log('✅ Role verification passed');
      } else {
        console.log('❌ Role verification failed');
      }
    } catch (error) {
      console.log('❌ Login with correct credentials failed');
      if (error.response) {
        console.log('- Status:', error.response.status);
        console.log('- Data:', error.response.data);
        console.log('- Headers:', error.response.headers);
      } else {
        console.log('- Error:', error.message);
      }
    }
    
    // Test 4: Test with incorrect credentials
    console.log('\n4. Testing login with incorrect credentials...');
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'mike.delivery@fabrico.com',
        password: 'wrongpassword'
      });
      
      console.log('❌ Login with wrong credentials should have failed but succeeded');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Login with wrong credentials correctly rejected');
        console.log('- Status:', error.response.status);
        console.log('- Data:', error.response.data);
      } else {
        console.log('❓ Unexpected error with wrong credentials');
        if (error.response) {
          console.log('- Status:', error.response.status);
          console.log('- Data:', error.response.data);
        } else {
          console.log('- Error:', error.message);
        }
      }
    }
    
    // Test 5: Test with non-existent user
    console.log('\n5. Testing login with non-existent user...');
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'nonexistent@example.com',
        password: 'password'
      });
      
      console.log('❌ Login with non-existent user should have failed but succeeded');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Login with non-existent user correctly rejected');
        console.log('- Status:', error.response.status);
        console.log('- Data:', error.response.data);
      } else {
        console.log('❓ Unexpected error with non-existent user');
        if (error.response) {
          console.log('- Status:', error.response.status);
          console.log('- Data:', error.response.data);
        } else {
          console.log('- Error:', error.message);
        }
      }
    }
    
    console.log('\n🎉 All backend tests completed!');
    console.log('If the backend tests pass but frontend login fails, the issue is definitely in the frontend.');
    
  } catch (err) {
    console.error('Error in detailed auth test:', err.message);
  }
};

detailedAuthTest();