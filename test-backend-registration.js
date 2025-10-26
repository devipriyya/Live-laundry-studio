const axios = require('axios');

async function testBackendRegistration() {
  console.log('Testing backend registration directly...\n');
  
  try {
    // Test the exact same registration that the frontend does
    const email = `backendtest${Date.now()}@example.com`;
    console.log('Registering user with email:', email);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Backend Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer',
      firebaseUid: `test-firebase-uid-${Date.now()}`
    });
    
    console.log('✅ Backend registration successful!');
    console.log('Status:', response.status);
    console.log('User ID:', response.data.user.id);
    console.log('User email:', response.data.user.email);
    console.log('Token:', response.data.token.substring(0, 30) + '...');
    
    // Now check if we can find this user in the database using our simple check
    console.log('\nChecking if user exists in database...');
    const checkResponse = await axios.get(`http://localhost:5000/api/auth/users`);
    // This will likely fail because it requires admin authentication
    
  } catch (error) {
    console.log('❌ Backend registration failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);
    
    if (error.response?.data) {
      console.log('Full error data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testBackendRegistration();