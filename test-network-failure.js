// Test what happens when there are network issues
const axios = require('axios');

async function testNetworkFailure() {
  console.log('Testing network failure scenarios...\n');
  
  try {
    console.log('1. Testing with completely unreachable backend...');
    try {
      const badApi = axios.create({
        baseURL: 'http://unreachable-server:5000/api',
        timeout: 5000 // 5 second timeout
      });
      
      await badApi.post('/auth/register', {
        name: 'Network Test',
        email: 'network@example.com',
        password: 'TestPassword123!',
        role: 'customer'
      });
      
      console.log('   ❌ Unexpected success with unreachable server');
    } catch (error) {
      console.log('   ✅ Expected network failure');
      console.log('   Message:', error.message);
      console.log('   Code:', error.code);
      
      if (error.code === 'ECONNABORTED') {
        console.log('   Status: Timeout - request took too long');
      } else if (error.code === 'ENOTFOUND') {
        console.log('   Status: DNS lookup failed - server not found');
      } else {
        console.log('   Status: Other network error');
      }
    }
    
    console.log('\n2. Testing with timeout...');
    try {
      // Create a request that will timeout
      const timeoutApi = axios.create({
        baseURL: 'http://localhost:5000/api',
        timeout: 1 // 1 millisecond timeout
      });
      
      await timeoutApi.post('/auth/register', {
        name: 'Timeout Test',
        email: 'timeout@example.com',
        password: 'TestPassword123!',
        role: 'customer'
      });
      
      console.log('   ❌ Unexpected success with timeout');
    } catch (error) {
      console.log('   ✅ Expected timeout');
      console.log('   Message:', error.message);
      if (error.code === 'ECONNABORTED') {
        console.log('   Status: Request timeout');
      }
    }
    
    console.log('\n3. What happens in frontend during network failures:');
    console.log('   - Firebase user gets created successfully');
    console.log('   - Backend API call fails or times out');
    console.log('   - Frontend should show network error message');
    console.log('   - Firebase user should be deleted to prevent mismatch');
    console.log('   - If Firebase cleanup fails, user exists in Firebase but not MongoDB');
    
    console.log('\n4. Common causes of cleanup failures:');
    console.log('   - Network error prevents Firebase delete operation');
    console.log('   - Firebase auth token expired during registration process');
    console.log('   - Firebase API rate limiting');
    console.log('   - Browser security restrictions');
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testNetworkFailure();