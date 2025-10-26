// Simple test to check if we can access the API
const axios = require('axios');

async function testBasicAPI() {
  try {
    console.log('Testing basic API access...');
    
    // Test the services endpoint (no auth required)
    const response = await axios.get('http://localhost:5000/api/services');
    
    console.log('Services API response status:', response.status);
    console.log('Number of services:', response.data.length);
    
  } catch (error) {
    console.error('Error testing basic API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testBasicAPI();