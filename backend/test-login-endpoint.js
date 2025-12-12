const axios = require('axios');

// Test the login endpoint directly
const testLoginEndpoint = async () => {
  try {
    const email = 'mike.delivery@fabrico.com';
    const password = 'delivery123';
    
    console.log(`Testing login for ${email}`);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Login failed!');
    console.log('Error:', error.response?.data || error.message);
  }
};

testLoginEndpoint();