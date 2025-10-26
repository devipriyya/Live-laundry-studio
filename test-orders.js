const axios = require('axios');

// Test the orders API endpoint
async function testOrdersAPI() {
  try {
    console.log('Testing orders API...');
    
    // Replace with an actual email that has orders
    const email = 'test@example.com';
    
    console.log(`Fetching orders for email: ${email}`);
    
    const response = await axios.get(`http://localhost:5000/api/orders/my?email=${encodeURIComponent(email)}`);
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Number of orders:', response.data.length);
    
  } catch (error) {
    console.error('Error testing orders API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testOrdersAPI();