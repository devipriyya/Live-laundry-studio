// Test admin orders endpoint
const axios = require('axios');

async function testAdminOrders() {
  try {
    console.log('=== TESTING ADMIN ORDERS ENDPOINT ===');
    
    // Login as admin first
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test fetching orders with admin token
    console.log('\n2. Fetching orders as admin...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 10
      }
    });
    
    console.log('✅ Orders fetched successfully');
    console.log('   Status:', ordersResponse.status);
    console.log('   Total orders:', ordersResponse.data.total);
    console.log('   Orders in response:', ordersResponse.data.orders.length);
    
    if (ordersResponse.data.orders.length > 0) {
      console.log('\n   First few orders:');
      ordersResponse.data.orders.slice(0, 3).forEach((order, index) => {
        console.log(`     ${index + 1}. Order #${order.orderNumber} - ${order.status} - Customer: ${order.customerInfo.name}`);
      });
    }
    
    console.log('\n🎉 ADMIN ORDERS TEST PASSED');
    console.log('   The admin order management page should now be able to display orders.');
    
  } catch (error) {
    console.error('❌ ADMIN ORDERS TEST FAILED');
    console.error('   Message:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testAdminOrders();