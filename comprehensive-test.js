// Comprehensive test to understand order user associations
const axios = require('axios');

async function comprehensiveTest() {
  try {
    console.log('=== COMPREHENSIVE ORDER USER ASSOCIATION TEST ===');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch all orders
    console.log('\n🔍 Fetching all orders...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 100 // Get all orders
      }
    });
    
    const orders = ordersResponse.data.orders;
    console.log(`📊 Total orders fetched: ${orders.length}`);
    
    // Categorize orders
    const ordersWithValidUser = [];
    const ordersWithNullUser = [];
    const ordersWithUndefinedUser = [];
    const ordersWithEmptyStringUser = [];
    
    orders.forEach(order => {
      if (order.userId && order.userId !== 'null') {
        ordersWithValidUser.push(order);
      } else if (order.userId === null) {
        ordersWithNullUser.push(order);
      } else if (order.userId === undefined) {
        ordersWithUndefinedUser.push(order);
      } else if (order.userId === 'null' || order.userId === '') {
        ordersWithEmptyStringUser.push(order);
      }
    });
    
    console.log(`\n📊 ORDER CATEGORIZATION:`);
    console.log(`   ✅ Orders with valid userId: ${ordersWithValidUser.length}`);
    console.log(`   ❌ Orders with null userId: ${ordersWithNullUser.length}`);
    console.log(`   ❓ Orders with undefined userId: ${ordersWithUndefinedUser.length}`);
    console.log(`   🔢 Orders with empty/string userId: ${ordersWithEmptyStringUser.length}`);
    
    // Show sample orders from each category
    if (ordersWithNullUser.length > 0) {
      console.log(`\n📋 SAMPLE ORDERS WITH NULL USER ID:`);
      ordersWithNullUser.slice(0, 3).forEach(order => {
        console.log(`   Order: ${order.orderNumber} - Customer: ${order.customerInfo.email}`);
      });
    }
    
    if (ordersWithUndefinedUser.length > 0) {
      console.log(`\n📋 SAMPLE ORDERS WITH UNDEFINED USER ID:`);
      ordersWithUndefinedUser.slice(0, 3).forEach(order => {
        console.log(`   Order: ${order.orderNumber} - Customer: ${order.customerInfo.email}`);
      });
    }
    
    // Try to fix orders with null userId
    console.log(`\n🔧 ATTEMPTING TO FIX ORDERS...`);
    let fixedCount = 0;
    
    for (const order of [...ordersWithNullUser, ...ordersWithUndefinedUser]) {
      try {
        const customerEmail = order.customerInfo.email;
        console.log(`   Checking user for email: ${customerEmail}`);
        
        // Search for user by email
        const userResponse = await axios.get(`http://localhost:5000/api/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            search: customerEmail
          }
        });
        
        const users = userResponse.data.users;
        if (users.length > 0) {
          const user = users[0];
          console.log(`   ✅ Found user: ${user.email} (${user._id})`);
          
          // In a real implementation, we would update the order here
          // For now, we'll just count it
          fixedCount++;
        } else {
          console.log(`   ❌ No user found for email: ${customerEmail}`);
        }
      } catch (error) {
        console.error(`   ❌ Error checking user for order ${order.orderNumber}:`, error.message);
      }
    }
    
    console.log(`\n✅ Would fix ${fixedCount} orders`);
    console.log('\n📝 SOLUTION:');
    console.log('   To actually fix the orders, we need to:');
    console.log('   1. Create a proper backend endpoint that updates orders in the database');
    console.log('   2. Or run a direct database update script');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

comprehensiveTest();