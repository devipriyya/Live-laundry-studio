// Test script to check delivery boy login
import axios from 'axios';

async function testDeliveryLogin() {
  try {
    console.log('Testing delivery boy login...');
    
    // Test with the predefined account
    const email = 'mike.delivery@fabrico.com';
    const password = 'delivery123';
    
    console.log(`Attempting login with ${email}`);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    
    console.log('Login successful!');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.data.token) {
      console.log('Token received:', response.data.token.substring(0, 20) + '...');
    }
    
    if (response.data.user) {
      console.log('User role:', response.data.user.role);
    }
    
  } catch (error) {
    console.log('Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testDeliveryLogin();