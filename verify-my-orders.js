const axios = require('axios');

async function verifyMyOrders() {
  console.log('=== VERIFYING MY ORDERS FUNCTIONALITY ===\n');
  
  try {
    // Test fetching orders by email
    const email = 'john.doe@gmail.com';
    console.log(`Fetching orders for email: ${email}`);
    
    const response = await axios.get(`http://localhost:5000/api/orders/my?email=${email}`);
    
    console.log('✅ Successfully fetched orders from backend');
    console.log(`Found ${response.data.length} orders for ${email}\n`);
    
    if (response.data.length > 0) {
      console.log('Recent orders:');
      response.data.slice(0, 3).forEach((order, index) => {
        console.log(`${index + 1}. Order #${order.orderNumber}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total Amount: ₹${order.totalAmount}`);
        console.log(`   Items: ${order.totalItems}`);
        console.log(`   Date: ${new Date(order.createdAt).toLocaleDateString()}\n`);
      });
    } else {
      console.log('No orders found for this email');
    }
    
  } catch (error) {
    console.error('❌ Error fetching orders:', error.response ? error.response.data : error.message);
  }
  
  console.log('=== VERIFICATION COMPLETE ===');
}

verifyMyOrders();