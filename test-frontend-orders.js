// Simple frontend test to check if orders are visible
const axios = require('axios');

async function testFrontendOrders() {
  try {
    console.log('Testing frontend orders visibility...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch orders with proper pagination
    console.log('Fetching orders...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        page: 1,
        limit: 50 // Get more orders
      }
    });
    
    console.log('✅ Orders fetch successful');
    console.log(`📊 Total orders: ${ordersResponse.data.total}`);
    console.log(`📄 Orders in response: ${ordersResponse.data.orders.length}`);
    
    // Check if we have orders with userId now
    const ordersWithUser = ordersResponse.data.orders.filter(order => order.userId);
    const ordersWithoutUser = ordersResponse.data.orders.filter(order => !order.userId);
    
    console.log(`\n✅ Orders with user association: ${ordersWithUser.length}`);
    console.log(`❌ Orders without user association: ${ordersWithoutUser.length}`);
    
    if (ordersWithUser.length > 0) {
      console.log('\n🎉 SUCCESS: Orders are now properly associated with users!');
      console.log('📋 You should now be able to see orders in the admin dashboard.');
    } else {
      console.log('\n⚠️  Orders still need to be fixed.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testFrontendOrders();