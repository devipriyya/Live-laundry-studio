// Simulate frontend component data processing
const axios = require('axios');

// Simulate the fixed frontend component logic
function processOrdersData(apiResponse) {
  // This is what the fixed frontend components now do
  const ordersData = apiResponse.data.orders || [];
  console.log('✅ Extracted orders from API response');
  console.log(`📊 Found ${ordersData.length} orders`);
  
  // Ensure it's an array
  const validOrders = Array.isArray(ordersData) ? ordersData : [];
  console.log(`✅ Validated orders array: ${validOrders.length} items`);
  
  return validOrders;
}

async function testComponentProcessing() {
  try {
    console.log('=== TESTING FRONTEND COMPONENT PROCESSING ===');
    
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
    
    // Process data like the frontend components do
    const processedOrders = processOrdersData(ordersResponse);
    
    // Show sample data
    if (processedOrders.length > 0) {
      console.log('\n📋 SAMPLE PROCESSED ORDER:');
      const sampleOrder = processedOrders[0];
      console.log(`   Order #: ${sampleOrder.orderNumber}`);
      console.log(`   Customer: ${sampleOrder.customerInfo?.name}`);
      console.log(`   Status: ${sampleOrder.status}`);
      console.log(`   Amount: ₹${sampleOrder.totalAmount}`);
      
      // Check user data
      if (sampleOrder.userId) {
        if (typeof sampleOrder.userId === 'object') {
          console.log(`   👤 User: ${sampleOrder.userId.name} (${sampleOrder.userId.email})`);
        } else {
          console.log(`   🔢 User ID: ${sampleOrder.userId}`);
        }
      } else {
        console.log(`   ❌ No user data`);
      }
    }
    
    console.log('\n🎉 FRONTEND COMPONENT PROCESSING SUCCESSFUL!');
    console.log(`   The admin order management page should now display ${processedOrders.length} orders.`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testComponentProcessing();