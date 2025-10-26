const axios = require('axios');
const fs = require('fs');

async function testBackend() {
  const log = [];

  try {
    log.push('Testing backend connection...');

    // Test basic connectivity
    const response = await axios.get('http://localhost:5000/api/auth/users', {
      headers: { Authorization: 'Bearer dummy' },
      timeout: 5000
    });

    log.push('✅ Backend is responding, status:', response.status);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log.push('❌ Backend server is not running on port 5000');
    } else if (error.response) {
      log.push('✅ Backend is running, got response:', error.response.status);
      log.push('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      log.push('❌ Error connecting to backend:', error.message);
    }
  }

  // Test registration endpoint
  try {
    log.push('\nTesting registration endpoint...');

    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'password123',
      role: 'customer',
      firebaseUid: 'test-firebase-uid-' + Date.now()
    }, {
      timeout: 10000
    });

    log.push('✅ Registration successful!');
    log.push('Status:', registerResponse.status);
    log.push('Response:', JSON.stringify(registerResponse.data, null, 2));
  } catch (error) {
    log.push('❌ Registration failed!');
    if (error.response) {
      log.push('Status:', error.response.status);
      log.push('Response data:', JSON.stringify(error.response.data, null, 2));
    } else {
      log.push('Error:', error.message);
    }
  }

  // Write to file
  fs.writeFileSync('backend_test.log', log.join('\n'));
  console.log('Test completed, check backend_test.log');
}

testBackend();