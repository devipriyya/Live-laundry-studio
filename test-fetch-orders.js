const axios = require('axios');

async function testFetchOrders() {
  console.log('Testing fetch orders API...\n');

  try {
    const email = 'john.doe@example.com';
    console.log(`Fetching orders for email: ${email}`);

    const response = await axios.get(`http://localhost:5000/api/orders/my?email=${encodeURIComponent(email)}`);

    console.log('✅ Orders fetched successfully!');
    console.log(`Found ${response.data.length} orders:`);
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ Fetch orders failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);

    if (error.response?.data) {
      console.log('Full error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFetchOrders();