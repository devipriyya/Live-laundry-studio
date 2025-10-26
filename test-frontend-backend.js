// Test frontend to backend connectivity
const axios = require('axios');

async function testFrontendBackendConnectivity() {
  try {
    console.log('=== TESTING FRONTEND TO BACKEND CONNECTIVITY ===');
    
    // Test if we can access the backend API
    console.log('1. Testing backend API access...');
    const response = await axios.get('http://localhost:5000/api/services');
    console.log('✅ Backend API accessible');
    console.log('   Status:', response.status);
    console.log('   Data type:', Array.isArray(response.data) ? 'Array' : typeof response.data);
    
    // Test admin login
    console.log('\n2. Testing admin login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful');
    const token = loginResponse.data.token;
    console.log('   Token length:', token.length);
    
    // Test orders API with auth
    console.log('\n3. Testing orders API with auth...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 3
      }
    });
    
    console.log('✅ Orders API accessible with auth');
    console.log('   Status:', ordersResponse.status);
    console.log('   Total orders:', ordersResponse.data.total);
    console.log('   Orders in response:', ordersResponse.data.orders.length);
    
    if (ordersResponse.data.orders.length > 0) {
      const firstOrder = ordersResponse.data.orders[0];
      console.log('\n   First order:');
      console.log('     Order #:', firstOrder.orderNumber);
      console.log('     Customer:', firstOrder.customerInfo.name);
      console.log('     Status:', firstOrder.status);
    }
    
    console.log('\n🎉 ALL TESTS PASSED');
    console.log('   The backend is working correctly and accessible.');
    console.log('   The frontend should now be able to connect to the backend.');
    
  } catch (error) {
    console.error('❌ TEST FAILED');
    console.error('   Message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   ❌ CONNECTION REFUSED - Backend might not be running');
    }
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('   1. Make sure backend is running: node backend/src/index.js');
    console.log('   2. Check if ports 5000 and 5175 are available');
    console.log('   3. Verify MongoDB connection');
    console.log('   4. Check firewall settings');
  }
}

testFrontendBackendConnectivity();