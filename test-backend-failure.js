const axios = require('axios');

// Test what happens when backend API is down or returns an error
async function testBackendFailure() {
  console.log('Testing backend failure scenarios...\n');
  
  // Test 1: Backend server is down
  console.log('1. Testing with incorrect backend URL...');
  try {
    const badApi = axios.create({
      baseURL: 'http://localhost:9999/api', // Intentionally wrong port
    });
    
    const response = await badApi.post('/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('Unexpected success:', response.status);
  } catch (error) {
    console.log('Expected failure:');
    console.log('  Status:', error.response?.status || 'No response');
    console.log('  Message:', error.message);
  }
  
  // Test 2: Backend returns an error
  console.log('\n2. Testing with backend that returns an error...');
  try {
    // We'll simulate this by calling a non-existent endpoint
    const response = await axios.post('http://localhost:5000/api/non-existent-endpoint', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('Unexpected success:', response.status);
  } catch (error) {
    console.log('Expected failure:');
    console.log('  Status:', error.response?.status || 'No response');
    console.log('  Message:', error.message);
  }
  
  console.log('\n3. Testing actual backend with duplicate user...');
  try {
    // First register a user
    const email = `duplicate${Date.now()}@example.com`;
    await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    // Try to register the same user again
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('Unexpected success:', response.status);
  } catch (error) {
    console.log('Expected failure:');
    console.log('  Status:', error.response?.status || 'No response');
    console.log('  Message:', error.response?.data?.message || error.message);
  }
}

testBackendFailure();