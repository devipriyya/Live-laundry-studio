// Test frontend component data processing
const axios = require('axios');

// Simulate how frontend components process the API response
function simulateFrontendProcessing(apiResponse) {
  console.log('=== SIMULATING FRONTEND COMPONENT PROCESSING ===');
  
  // This is what the frontend components should do
  console.log('🔧 Processing API response...');
  
  // Extract orders from the response (this is the key fix we made)
  const ordersData = apiResponse.data.orders || [];
  console.log(`✅ Extracted ${ordersData.length} orders from response`);
  
  // Validate it's an array
  if (!Array.isArray(ordersData)) {
    console.log('❌ Orders data is not an array, using empty array');
    return [];
  }
  
  console.log('✅ Orders data is valid array');
  
  // Process each order to ensure it has the required fields
  const processedOrders = ordersData.map(order => {
    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      customerInfo: order.customerInfo,
      status: order.status,
      totalAmount: order.totalAmount,
      userId: order.userId,
      createdAt: order.createdAt
    };
  });
  
  console.log(`✅ Processed ${processedOrders.length} orders`);
  
  // Show sample of processed data
  if (processedOrders.length > 0) {
    console.log('\n📋 SAMPLE PROCESSED ORDER:');
    const sample = processedOrders[0];
    console.log(`   Order #: ${sample.orderNumber}`);
    console.log(`   Customer: ${sample.customerInfo?.name} <${sample.customerInfo?.email}>`);
    console.log(`   Status: ${sample.status}`);
    console.log(`   Amount: ₹${sample.totalAmount}`);
    
    if (sample.userId) {
      if (typeof sample.userId === 'object') {
        console.log(`   👤 User: ${sample.userId.name} (${sample.userId.email})`);
      } else {
        console.log(`   🔢 User ID: ${sample.userId}`);
      }
    } else {
      console.log(`   ❌ No user data`);
    }
  }
  
  return processedOrders;
}

async function testFrontendProcessing() {
  try {
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch orders
    console.log('\n🔍 Fetching orders from API...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 5
      }
    });
    
    console.log('✅ API call successful');
    
    // Process data like frontend components do
    const processedOrders = simulateFrontendProcessing(ordersResponse);
    
    console.log('\n🎉 FRONTEND PROCESSING SIMULATION COMPLETE');
    console.log(`   The frontend components should now be able to display ${processedOrders.length} orders.`);
    console.log(`   If you're still not seeing orders, the issue might be in the React component rendering.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testFrontendProcessing();