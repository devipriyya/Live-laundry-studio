const axios = require('axios');

async function testAnalyticsEndpoints() {
  try {
    console.log('Testing analytics endpoints...');
    
    // First, login as admin to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin login successful');
    
    // Test the order trends endpoint
    console.log('\n1. Testing order trends endpoint:');
    const orderTrendsResponse = await axios.get('http://localhost:5000/api/orders/analytics/orders?days=7', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Order trends data:', orderTrendsResponse.data);
    
    // Test the monthly income endpoint
    console.log('\n2. Testing monthly income endpoint:');
    const monthlyIncomeResponse = await axios.get('http://localhost:5000/api/orders/analytics/income?months=6', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Monthly income data:', monthlyIncomeResponse.data);
    
  } catch (error) {
    console.error('Error testing analytics endpoints:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAnalyticsEndpoints();