const axios = require('axios');

async function fixOrderUserAssociations() {
  try {
    console.log('🔧 Starting order-user association fix...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch all users to create an email-to-userId mapping
    console.log('📋 Fetching all users...');
    const usersResponse = await axios.get('http://localhost:5000/api/auth/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const users = usersResponse.data.users;
    const userEmailMap = {};
    users.forEach(user => {
      userEmailMap[user.email] = user._id;
    });
    
    console.log(`✅ Found ${users.length} users`);
    console.log('📧 User email mapping created');
    
    // Fetch all orders
    console.log('📋 Fetching all orders...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 100 // Get all orders
      }
    });
    
    const orders = ordersResponse.data.orders;
    console.log(`✅ Found ${orders.length} orders`);
    
    // Count orders without userId
    const ordersWithoutUser = orders.filter(order => !order.userId);
    console.log(`⚠️  Found ${ordersWithoutUser.length} orders without user association`);
    
    if (ordersWithoutUser.length === 0) {
      console.log('✅ All orders are already properly associated with users');
      return;
    }
    
    // For demonstration, let's show what would be fixed
    console.log('\n🔧 Fixing orders (simulation):');
    let fixedCount = 0;
    
    for (const order of ordersWithoutUser) {
      const customerEmail = order.customerInfo.email;
      const userId = userEmailMap[customerEmail];
      
      if (userId) {
        console.log(`   🔄 Order ${order.orderNumber} -> User ${customerEmail} (ID: ${userId})`);
        fixedCount++;
        
        // In a real implementation, we would make an API call to update the order
        // For now, we'll just simulate it
      } else {
        console.log(`   ❌ Order ${order.orderNumber} -> No user found for email ${customerEmail}`);
      }
    }
    
    console.log(`\n✅ Would fix ${fixedCount} orders`);
    console.log('\n📝 To actually fix the orders, we need to:');
    console.log('   1. Create a backend endpoint to update orders');
    console.log('   2. Or run a direct database update script');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

fixOrderUserAssociations();