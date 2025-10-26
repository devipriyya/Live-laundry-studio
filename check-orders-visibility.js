const axios = require('axios');

async function checkOrdersVisibility() {
  try {
    console.log('Testing admin orders visibility...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch orders
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Orders API call successful');
    console.log(`📊 Total orders in database: ${ordersResponse.data.total}`);
    console.log(`📄 Orders in current response: ${ordersResponse.data.orders.length}`);
    
    if (ordersResponse.data.orders.length > 0) {
      const firstOrder = ordersResponse.data.orders[0];
      console.log('\n📋 First order details:');
      console.log(`   Order Number: ${firstOrder.orderNumber}`);
      console.log(`   Customer: ${firstOrder.customerInfo.name}`);
      console.log(`   Status: ${firstOrder.status}`);
      console.log(`   User ID: ${firstOrder.userId || 'NULL (this is the problem!)'}`);
    }
    
    // Check if we have orders with missing userId
    const ordersWithoutUser = ordersResponse.data.orders.filter(order => !order.userId);
    console.log(`\n⚠️  Orders without user association: ${ordersWithoutUser.length}`);
    
    if (ordersWithoutUser.length > 0) {
      console.log('\n🔧 SOLUTION: Run the fix script to associate orders with users');
    } else {
      console.log('\n✅ All orders are properly associated with users');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

checkOrdersVisibility();