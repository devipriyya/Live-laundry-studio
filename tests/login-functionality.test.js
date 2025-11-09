// Test Case 1: Login Functionality
const axios = require('axios');

const testLoginFunctionality = async () => {
  const baseURL = 'http://localhost:5000/api';
  const api = axios.create({ baseURL });

  console.log('🧪 Running Test Case 1: Login Functionality\n');

  // Test data
  const validAdminCredentials = {
    email: 'admin@gmail.com',
    password: 'admin123'
  };

  const invalidCredentials = {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  };

  try {
    // Test 1: Successful Login with Valid Credentials
    console.log('Test 1: Successful Login with Valid Credentials');
    try {
      const loginResponse = await api.post('/auth/login', validAdminCredentials);
      
      if (loginResponse.status === 200 && loginResponse.data.token && loginResponse.data.user) {
        console.log('✅ Test 1 PASSED: Successful Login with Valid Credentials');
        console.log(`   Token received: ${loginResponse.data.token ? 'Yes' : 'No'}`);
        console.log(`   User ID: ${loginResponse.data.user.id}`);
        console.log(`   User Name: ${loginResponse.data.user.name}`);
        console.log(`   User Email: ${loginResponse.data.user.email}`);
        console.log(`   User Role: ${loginResponse.data.user.role}\n`);
      } else {
        console.log('❌ Test 1 FAILED: Unexpected response format');
        console.log(`   Response: ${JSON.stringify(loginResponse.data)}\n`);
      }
    } catch (error) {
      console.log('❌ Test 1 FAILED: Login request failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}`);
      }
      console.log('');
    }

    // Test 2: Failed Login with Invalid Credentials
    console.log('Test 2: Failed Login with Invalid Credentials');
    try {
      const invalidLoginResponse = await api.post('/auth/login', invalidCredentials);
      console.log('❌ Test 2 FAILED: Login should have failed with invalid credentials');
      console.log(`   Unexpected response: ${JSON.stringify(invalidLoginResponse.data)}\n`);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Test 2 PASSED: Failed Login with Invalid Credentials');
        console.log(`   Error message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ Test 2 FAILED: Unexpected error');
        if (error.response) {
          console.log(`   Response status: ${error.response.status}`);
          console.log(`   Response data: ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`   Error message: ${error.message}`);
          console.log(`   Error code: ${error.code}`);
        }
        console.log('');
      }
    }

    // Test 3: Successful Authentication with Token
    console.log('Test 3: Successful Authentication with Token');
    try {
      // First, login to get a token
      const loginResponse = await api.post('/auth/login', validAdminCredentials);
      const token = loginResponse.data.token;
      
      // Use the token to make an authenticated request
      const ordersResponse = await api.get('/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (ordersResponse.status === 200) {
        console.log('✅ Test 3 PASSED: Successful Authentication with Token');
        console.log(`   Orders count: ${ordersResponse.data.orders ? ordersResponse.data.orders.length : 'Unknown'}\n`);
      } else {
        console.log('❌ Test 3 FAILED: Authenticated request failed');
        console.log(`   Status: ${ordersResponse.status}\n`);
      }
    } catch (error) {
      console.log('❌ Test 3 FAILED: Authentication test failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}`);
      }
      console.log('');
    }

    // Test 4: Failed Login with Missing Email
    console.log('Test 4: Failed Login with Missing Email');
    try {
      const missingEmail = { password: 'password123' };
      await api.post('/auth/login', missingEmail);
      console.log('❌ Test 4 FAILED: Login should have failed with missing email\n');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Test 4 PASSED: Failed Login with Missing Email');
        console.log(`   Error message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ Test 4 FAILED: Unexpected error');
        if (error.response) {
          console.log(`   Response status: ${error.response.status}`);
          console.log(`   Response data: ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`   Error message: ${error.message}`);
          console.log(`   Error code: ${error.code}`);
        }
        console.log('');
      }
    }

    // Test 5: Failed Login with Missing Password
    console.log('Test 5: Failed Login with Missing Password');
    try {
      const missingPassword = { email: 'test@example.com' };
      await api.post('/auth/login', missingPassword);
      console.log('❌ Test 5 FAILED: Login should have failed with missing password\n');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Test 5 PASSED: Failed Login with Missing Password');
        console.log(`   Error message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ Test 5 FAILED: Unexpected error');
        if (error.response) {
          console.log(`   Response status: ${error.response.status}`);
          console.log(`   Response data: ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`   Error message: ${error.message}`);
          console.log(`   Error code: ${error.code}`);
        }
        console.log('');
      }
    }

  } catch (error) {
    console.error('💥 Test Case 1 encountered an unexpected error:');
    console.error(error);
  }
};

// Run the test
testLoginFunctionality();