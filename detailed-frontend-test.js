// Detailed frontend test to see exactly what data is being returned
const axios = require('axios');

async function detailedFrontendTest() {
  try {
    console.log('=== DETAILED FRONTEND TEST ===');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch a single order to see the raw data
    console.log('\n🔍 Fetching orders with detailed logging...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 5 // Just get a few orders
      }
    });
    
    console.log('📊 Response structure:');
    console.log('   Keys:', Object.keys(ordersResponse.data));
    
    if (ordersResponse.data.orders) {
      console.log(`   Orders array length: ${ordersResponse.data.orders.length}`);
      
      // Check the first order in detail
      if (ordersResponse.data.orders.length > 0) {
        const firstOrder = ordersResponse.data.orders[0];
        console.log('\n📋 FIRST ORDER DETAILS:');
        console.log(`   Order Number: ${firstOrder.orderNumber}`);
        console.log(`   Customer: ${firstOrder.customerInfo?.name} <${firstOrder.customerInfo?.email}>`);
        console.log(`   User ID: ${JSON.stringify(firstOrder.userId)}`);
        console.log(`   User ID Type: ${typeof firstOrder.userId}`);
        console.log(`   User ID Value: ${firstOrder.userId}`);
        
        // Check if userId is actually null or just missing
        if (firstOrder.userId === null) {
          console.log(`   ❌ User ID is explicitly null`);
        } else if (firstOrder.userId === undefined) {
          console.log(`   ❓ User ID is undefined`);
        } else if (firstOrder.userId === '') {
          console.log(`   🔢 User ID is empty string`);
        } else {
          console.log(`   ✅ User ID is valid: ${firstOrder.userId}`);
        }
        
        // Check if userId is a populated object
        if (typeof firstOrder.userId === 'object' && firstOrder.userId !== null) {
          console.log(`   📦 User ID is populated object:`, firstOrder.userId);
        }
      }
    }
    
    // Count orders with different userId states
    const orders = ordersResponse.data.orders || [];
    let nullCount = 0;
    let undefinedCount = 0;
    let validCount = 0;
    let emptyStringCount = 0;
    
    orders.forEach(order => {
      if (order.userId === null) {
        nullCount++;
      } else if (order.userId === undefined) {
        undefinedCount++;
      } else if (order.userId === '') {
        emptyStringCount++;
      } else {
        validCount++;
      }
    });
    
    console.log('\n📊 ORDER USER ID STATISTICS:');
    console.log(`   ✅ Valid userId: ${validCount}`);
    console.log(`   ❌ Null userId: ${nullCount}`);
    console.log(`   ❓ Undefined userId: ${undefinedCount}`);
    console.log(`   🔢 Empty string userId: ${emptyStringCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }
  }
}

detailedFrontendTest();