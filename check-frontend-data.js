// Check what the frontend is actually receiving
const axios = require('axios');

async function checkFrontendData() {
  try {
    console.log('=== CHECKING FRONTEND DATA ===');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
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
      
      // Check first order details
      if (ordersResponse.data.orders.length > 0) {
        const firstOrder = ordersResponse.data.orders[0];
        console.log('\n📋 FIRST ORDER DETAILS:');
        console.log(`   Order Number: ${firstOrder.orderNumber}`);
        console.log(`   Customer Name: ${firstOrder.customerInfo?.name}`);
        console.log(`   Customer Email: ${firstOrder.customerInfo?.email}`);
        console.log(`   Status: ${firstOrder.status}`);
        console.log(`   Total Amount: ${firstOrder.totalAmount}`);
        console.log(`   Created At: ${firstOrder.createdAt}`);
        console.log(`   User ID: ${JSON.stringify(firstOrder.userId)}`);
        
        // Check if userId is populated
        if (firstOrder.userId && typeof firstOrder.userId === 'object') {
          console.log(`   📦 User ID is populated: ${firstOrder.userId.name} <${firstOrder.userId.email}>`);
        } else if (firstOrder.userId === null) {
          console.log(`   ❌ User ID is null`);
        } else {
          console.log(`   🔢 User ID: ${firstOrder.userId}`);
        }
      }
    }
    
    // Check if there are any orders with valid user associations
    const orders = ordersResponse.data.orders || [];
    let validUserCount = 0;
    let nullUserCount = 0;
    
    orders.forEach(order => {
      if (order.userId && typeof order.userId === 'object') {
        validUserCount++;
      } else if (order.userId === null) {
        nullUserCount++;
      }
    });
    
    console.log('\n📊 USER ASSOCIATION STATISTICS:');
    console.log(`   ✅ Orders with valid user data: ${validUserCount}`);
    console.log(`   ❌ Orders with null user data: ${nullUserCount}`);
    console.log(`   🔢 Total orders checked: ${orders.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

checkFrontendData();