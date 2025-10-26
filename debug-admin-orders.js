const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test the admin orders API endpoint
async function testAdminOrdersAPI() {
  try {
    console.log('Testing admin orders API...');
    
    // Create a test admin user token
    const testAdmin = {
      id: '666f6f2d6261722d71757578', // Mock user ID
      name: 'Test Admin',
      email: 'admin@test.com',
      role: 'admin'
    };
    
    // Generate a JWT token (using the same secret as in .env)
    const token = jwt.sign(
      { id: testAdmin.id }, 
      '12345', // JWT_SECRET from .env
      { expiresIn: '7d' }
    );
    
    console.log('Using token:', token);
    
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    console.log('Fetching all orders as admin...');
    
    // Test the admin orders endpoint
    const response = await axios.get('http://localhost:5000/api/orders', config);
    
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
    console.log('Number of orders:', response.data.orders?.length || response.data.length);
    
    if (response.data.orders) {
      console.log('First order sample:', JSON.stringify(response.data.orders[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error testing admin orders API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
  }
}

testAdminOrdersAPI();