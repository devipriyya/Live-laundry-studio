// Test the exact registration flow to see what happens when backend fails
const axios = require('axios');

async function testRegistrationFlow() {
  console.log('Testing registration flow with backend failure simulation...\n');
  
  try {
    console.log('1. Registering a user through backend API...');
    const email = `flowtest${Date.now()}@example.com`;
    
    // First, successful registration
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Flow Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('✅ Initial registration successful');
    console.log('   User ID:', registerResponse.data.user.id);
    
    // Now, try to register the same user again to simulate backend failure
    console.log('\n2. Attempting to register the same user (should fail)...');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Flow Test User',
        email: email,
        password: 'TestPassword123!',
        role: 'customer'
      });
      
      console.log('❌ Unexpected success on duplicate registration');
    } catch (error) {
      console.log('✅ Expected failure on duplicate registration');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
      
      // This is the exact scenario that should happen in the frontend
      // The backend returns an error, which should be handled properly
      console.log('\n3. This is what should happen in the frontend:');
      console.log('   - Backend API call fails with "User exists" error');
      console.log('   - Frontend should show error message to user');
      console.log('   - Firebase user should NOT be created (since backend failed first)');
    }
    
    // Now test what happens if we can't reach the backend at all
    console.log('\n4. Testing network failure scenario...');
    try {
      const badApi = axios.create({
        baseURL: 'http://localhost:9999/api', // Wrong port
      });
      
      await badApi.post('/auth/register', {
        name: 'Network Test User',
        email: `network${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'customer'
      });
      
      console.log('❌ Unexpected success with bad API');
    } catch (error) {
      console.log('✅ Expected network failure');
      console.log('   Message:', error.message);
      console.log('   Code:', error.code);
      
      console.log('\n5. In this case, the frontend should:');
      console.log('   - Show network error message to user');
      console.log('   - Firebase user should NOT be created (since backend call failed)');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

testRegistrationFlow();