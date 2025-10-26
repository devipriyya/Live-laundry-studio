const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

async function testProfileEndpoint() {
  console.log('Testing profile endpoint...');
  
  try {
    // First, let's register a test user
    const email = `profiletest${Date.now()}@example.com`;
    console.log('Registering test user with email:', email);
    
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Profile Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('Registration successful. Token:', registerResponse.data.token);
    
    // Now let's try to access the profile endpoint with the token
    console.log('\nTesting profile endpoint with authentication...');
    const profileResponse = await axios.get('http://localhost:5000/api/profile', {
      headers: {
        'Authorization': `Bearer ${registerResponse.data.token}`
      }
    });
    
    console.log('Profile endpoint response:', profileResponse.status, profileResponse.data);
    
    // Let's also test updating the profile
    console.log('\nTesting profile update...');
    const updateResponse = await axios.put('http://localhost:5000/api/profile', {
      name: 'Updated Profile Test User',
      phone: '+1 234 567 8900'
    }, {
      headers: {
        'Authorization': `Bearer ${registerResponse.data.token}`
      }
    });
    
    console.log('Profile update response:', updateResponse.status, updateResponse.data);
    
  } catch (error) {
    console.error('Error testing profile endpoint:', error.response?.data || error.message);
  }
}

testProfileEndpoint();