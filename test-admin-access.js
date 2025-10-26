// Test accessing the admin orders page
const axios = require('axios');

async function testAdminAccess() {
  try {
    console.log('Testing admin access to orders page...');
    
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token.substring(0, 20) + '...');
    
    // 2. Access the orders endpoint
    console.log('2. Accessing orders endpoint...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Orders endpoint response status:', ordersResponse.status);
    console.log('Total orders:', ordersResponse.data.total);
    console.log('Orders in response:', ordersResponse.data.orders.length);
    
    // 3. Check a specific order
    if (ordersResponse.data.orders.length > 0) {
      const firstOrder = ordersResponse.data.orders[0];
      console.log('First order ID:', firstOrder._id);
      console.log('First order number:', firstOrder.orderNumber);
      console.log('First order customer:', firstOrder.customerInfo.name);
      console.log('First order status:', firstOrder.status);
    }
    
    console.log('\n✅ All tests passed! Admin access to orders is working correctly.');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAdminAccess();