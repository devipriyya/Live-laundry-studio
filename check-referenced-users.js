// Check if referenced users exist
const axios = require('axios');

async function checkReferencedUsers() {
  try {
    console.log('=== CHECKING REFERENCED USERS ===');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch orders
    console.log('\n🔍 Fetching orders...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 10 // Get more orders to check
      }
    });
    
    const orders = ordersResponse.data.orders;
    console.log(`📊 Fetched ${orders.length} orders`);
    
    // Check userId values
    console.log('\n📋 USER ID ANALYSIS:');
    const userIds = new Set();
    
    orders.forEach(order => {
      if (order.userId) {
        userIds.add(order.userId);
        console.log(`   ✅ Order ${order.orderNumber}: userId = ${order.userId}`);
      } else {
        console.log(`   ❌ Order ${order.orderNumber}: userId = ${order.userId} (${typeof order.userId})`);
      }
    });
    
    console.log(`\n📊 Unique userIds referenced: ${userIds.size}`);
    
    // Check if these users exist
    if (userIds.size > 0) {
      console.log('\n🔍 Checking if referenced users exist...');
      
      for (const userId of Array.from(userIds)) {
        try {
          const userResponse = await axios.get(`http://localhost:5000/api/auth/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log(`   ✅ User ${userId} exists: ${userResponse.data.email}`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log(`   ❌ User ${userId} does not exist`);
          } else {
            console.log(`   ⚠️  Error checking user ${userId}: ${error.message}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

checkReferencedUsers();