// Test authorization flow
const axios = require('axios');

async function testAuthorizationFlow() {
  try {
    console.log('=== TESTING AUTHORIZATION FLOW ===');
    
    // Login as admin
    console.log('\n1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('   Token:', token.substring(0, 20) + '...');
    
    // Test token validity by accessing a protected endpoint
    console.log('\n2. Testing token validity...');
    const userResponse = await axios.get('http://localhost:5000/api/auth/users/68ce619df382852caa1abd3f', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Token is valid');
    console.log('   User role:', userResponse.data.role);
    console.log('   User email:', userResponse.data.email);
    
    // Test orders endpoint
    console.log('\n3. Testing orders endpoint...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 5
      }
    });
    
    console.log('✅ Orders endpoint accessible');
    console.log('   Total orders:', ordersResponse.data.total);
    console.log('   Orders in response:', ordersResponse.data.orders.length);
    
    // Check first order
    if (ordersResponse.data.orders.length > 0) {
      const firstOrder = ordersResponse.data.orders[0];
      console.log('\n4. First order details:');
      console.log('   Order Number:', firstOrder.orderNumber);
      console.log('   Customer:', firstOrder.customerInfo.name);
      console.log('   Status:', firstOrder.status);
      console.log('   Amount: ₹', firstOrder.totalAmount);
      
      if (firstOrder.userId) {
        console.log('   User:', firstOrder.userId.name, '<' + firstOrder.userId.email + '>');
      }
    }
    
    console.log('\n🎉 ALL AUTHORIZATION TESTS PASSED');
    console.log('   The backend is working correctly.');
    console.log('   If you\'re not seeing orders in the frontend,');
    console.log('   the issue is likely in the React component state management.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testAuthorizationFlow();