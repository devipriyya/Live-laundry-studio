const axios = require('axios');

// Test the fixed orders API endpoint
async function testFixedOrdersAPI() {
  try {
    console.log('Testing fixed orders API...');
    
    // Test with an email that should now have orders
    const email = 'amalaa@gmail.com';
    
    console.log(`Fetching orders for email: ${email}`);
    
    const response = await axios.get(`http://localhost:5000/api/orders/my?email=${encodeURIComponent(email)}`);
    
    console.log('Response status:', response.status);
    console.log('Number of orders:', response.data.length);
    
    if (response.data.length > 0) {
      console.log('First order details:');
      console.log('  Order Number:', response.data[0].orderNumber);
      console.log('  Customer Email:', response.data[0].customerInfo.email);
      console.log('  Status:', response.data[0].status);
    }
    
    // Test with another email
    const email2 = 'jeevaa@gmail.com';
    console.log(`\nFetching orders for email: ${email2}`);
    
    const response2 = await axios.get(`http://localhost:5000/api/orders/my?email=${encodeURIComponent(email2)}`);
    
    console.log('Response status:', response2.status);
    console.log('Number of orders:', response2.data.length);
    
  } catch (error) {
    console.error('Error testing orders API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFixedOrdersAPI();