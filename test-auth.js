// Test authentication flow
const axios = require('axios');

const testAuth = async () => {
  try {
    console.log('Testing admin authentication...');
    
    // Try to login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    
    // Use the token to fetch orders
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    
    console.log('✅ Orders fetch successful');
    console.log('Orders count:', ordersResponse.data.orders ? ordersResponse.data.orders.length : 'Unknown');
    
  } catch (error) {
    console.error('❌ Authentication test failed');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testAuth();