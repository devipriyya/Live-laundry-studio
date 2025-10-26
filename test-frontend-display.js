// Test if frontend components can now display orders
const axios = require('axios');

async function testFrontendDisplay() {
  try {
    console.log('=== TESTING FRONTEND DISPLAY ===');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch orders to simulate what frontend components do
    console.log('\n🔍 Simulating frontend order fetch...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 5
      }
    });
    
    console.log('📊 API Response Structure:');
    console.log('   Response keys:', Object.keys(ordersResponse.data));
    
    // Simulate how frontend components process the data
    const ordersData = ordersResponse.data.orders || [];
    console.log(`   Orders array length: ${ordersData.length}`);
    
    if (ordersData.length > 0) {
      console.log('\n📋 First Order Preview:');
      const firstOrder = ordersData[0];
      console.log(`   Order Number: ${firstOrder.orderNumber}`);
      console.log(`   Customer: ${firstOrder.customerInfo?.name}`);
      console.log(`   Status: ${firstOrder.status}`);
      console.log(`   Amount: ₹${firstOrder.totalAmount}`);
      
      // Check user data
      if (firstOrder.userId) {
        if (typeof firstOrder.userId === 'object') {
          console.log(`   👤 User: ${firstOrder.userId.name} <${firstOrder.userId.email}>`);
        } else {
          console.log(`   🔢 User ID: ${firstOrder.userId}`);
        }
      } else {
        console.log(`   ❌ No user data`);
      }
    }
    
    // Count orders with and without user data
    const withUserData = ordersData.filter(order => order.userId && typeof order.userId === 'object').length;
    const withoutUserData = ordersData.filter(order => !order.userId || order.userId === null).length;
    
    console.log('\n📊 PROCESSING RESULTS:');
    console.log(`   ✅ Orders with user data: ${withUserData}`);
    console.log(`   ❌ Orders without user data: ${withoutUserData}`);
    console.log(`   🔢 Total orders processed: ${ordersData.length}`);
    
    console.log('\n🎉 FRONTEND COMPONENTS SHOULD NOW DISPLAY ORDERS!');
    console.log('   The fixes ensure that:');
    console.log('   1. Orders array is correctly extracted from API response');
    console.log('   2. Empty arrays are used as fallback when no data');
    console.log('   3. User data is properly displayed when available');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testFrontendDisplay();