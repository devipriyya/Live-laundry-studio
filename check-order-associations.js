// Script to fix order user associations
// Run this while the backend server is running

const axios = require('axios');

async function fixOrderUserAssociations() {
  try {
    console.log('Logging in as admin...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin login successful');
    
    // Get all orders
    console.log('Fetching all orders...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 100 // Get all orders
      }
    });
    
    const orders = ordersResponse.data.orders;
    console.log(`Found ${orders.length} orders`);
    
    // Count orders without userId
    const ordersWithoutUser = orders.filter(order => !order.userId);
    console.log(`Found ${ordersWithoutUser.length} orders without userId`);
    
    if (ordersWithoutUser.length === 0) {
      console.log('No orders need fixing');
      return;
    }
    
    // For each order without userId, try to find the user by email
    let fixedCount = 0;
    for (const order of ordersWithoutUser) {
      try {
        console.log(`Checking order ${order.orderNumber}...`);
        
        // Try to find user by email
        const userResponse = await axios.get(`http://localhost:5000/api/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            search: order.customerInfo.email
          }
        });
        
        const users = userResponse.data.users;
        if (users.length > 0) {
          const user = users[0];
          console.log(`Found user ${user.email} for order ${order.orderNumber}`);
          
          // Note: We can't directly update the order through the API
          // This would require a new endpoint or manual database update
          console.log(`Would associate order ${order._id} with user ${user._id}`);
          fixedCount++;
        } else {
          console.log(`No user found for email ${order.customerInfo.email}`);
        }
      } catch (error) {
        console.error(`Error processing order ${order.orderNumber}:`, error.message);
      }
    }
    
    console.log(`Would fix ${fixedCount} orders`);
    console.log('Note: Actual fixing would require a backend endpoint to update orders');
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

fixOrderUserAssociations();