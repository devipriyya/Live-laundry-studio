const axios = require('axios');

const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test the base API URL
    const apiUrl = 'http://localhost:5000/api';
    console.log(`Testing API URL: ${apiUrl}`);
    
    // Test a simple endpoint (if available)
    const response = await axios.get(`${apiUrl}/orders`, {
      timeout: 5000
    });
    
    console.log('✅ API Connection Successful');
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
  } catch (error) {
    console.error('❌ API Connection Failed');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.message);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testApiConnection();