const axios = require('axios');

async function checkAllOrders() {
  try {
    console.log('Logging in as admin...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin login successful');
    
    // Check different endpoints
    console.log('\n1. Checking /api/orders endpoint:');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { limit: 100 } // Get more orders
    });
    
    console.log(`Total orders found: ${ordersResponse.data.total}`);
    console.log(`Pages: ${ordersResponse.data.totalPages}`);
    console.log(`Current page: ${ordersResponse.data.currentPage}`);
    console.log(`Orders in current page: ${ordersResponse.data.orders.length}`);
    
    // Check if userId is populated
    console.log('\n2. Checking userId population:');
    if (ordersResponse.data.orders.length > 0) {
      const order = ordersResponse.data.orders[0];
      console.log(`First order userId: ${order.userId}`);
      console.log(`First order customerInfo:`, order.customerInfo);
    }
    
    // Check the /api/orders/my endpoint
    console.log('\n3. Checking /api/orders/my endpoint with a customer email:');
    try {
      const myOrdersResponse = await axios.get('http://localhost:5000/api/orders/my?email=parvathy@gmail.com');
      console.log(`My orders found: ${myOrdersResponse.data.length}`);
    } catch (error) {
      console.error('Error with /api/orders/my:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkAllOrders();