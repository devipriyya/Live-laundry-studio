// Check what the frontend is actually receiving in detail
const axios = require('axios');

async function checkFrontendDetailed() {
  try {
    console.log('=== DETAILED FRONTEND DATA CHECK ===');
    
    // Login as admin with correct credentials
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123' // Correct password from the script
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch orders with full details
    console.log('\n🔍 Fetching orders with full details...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 5
      }
    });
    
    console.log('📊 Response structure:');
    console.log('   Status:', ordersResponse.status);
    console.log('   Keys:', Object.keys(ordersResponse.data));
    
    if (ordersResponse.data.orders) {
      console.log(`   Total orders: ${ordersResponse.data.total}`);
      console.log(`   Orders in response: ${ordersResponse.data.orders.length}`);
      console.log(`   Current page: ${ordersResponse.data.currentPage}`);
      console.log(`   Total pages: ${ordersResponse.data.totalPages}`);
      
      // Check first few orders details
      console.log('\n📋 FIRST FEW ORDERS:');
      ordersResponse.data.orders.slice(0, 3).forEach((order, index) => {
        console.log(`\n   Order ${index + 1}:`);
        console.log(`     Order Number: ${order.orderNumber}`);
        console.log(`     Customer Name: ${order.customerInfo?.name}`);
        console.log(`     Customer Email: ${order.customerInfo?.email}`);
        console.log(`     Status: ${order.status}`);
        console.log(`     Total Amount: ${order.totalAmount}`);
        console.log(`     User ID: ${JSON.stringify(order.userId)}`);
        
        // Check if userId is populated
        if (order.userId && typeof order.userId === 'object') {
          console.log(`     📦 User ID is populated: ${order.userId.name} <${order.userId.email}>`);
        } else if (order.userId === null) {
          console.log(`     ❌ User ID is null`);
        } else {
          console.log(`     🔢 User ID: ${order.userId}`);
        }
      });
    }
    
    // Check authentication status
    console.log('\n🔍 Checking authentication status...');
    const authCheck = await axios.get('http://localhost:5000/api/auth/users/68ce619df382852caa1abd3f', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log(`   Auth check status: ${authCheck.status}`);
    console.log(`   User role: ${authCheck.data.role}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

checkFrontendDetailed();