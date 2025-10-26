// Direct database update script
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Models
const Order = require('./backend/src/models/Order');
const User = require('./backend/src/models/User');

async function directDatabaseUpdate() {
  try {
    console.log('=== DIRECT DATABASE UPDATE SCRIPT ===');
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Get all users to create email-to-userId mapping
    console.log('\n📋 Fetching all users...');
    const users = await User.find({});
    const userEmailMap = {};
    users.forEach(user => {
      userEmailMap[user.email] = user._id.toString();
    });
    console.log(`✅ Found ${users.length} users`);
    
    // Get all orders
    console.log('\n📋 Fetching all orders...');
    const orders = await Order.find({});
    console.log(`✅ Found ${orders.length} orders`);
    
    // Process each order
    console.log('\n🔧 Processing orders...');
    let updatedCount = 0;
    
    for (const order of orders) {
      try {
        // Check if userId is missing or null
        if (!order.userId || order.userId === null) {
          const customerEmail = order.customerInfo?.email;
          if (customerEmail && userEmailMap[customerEmail]) {
            console.log(`   🔄 Updating order ${order.orderNumber} (${customerEmail}) with userId ${userEmailMap[customerEmail]}`);
            order.userId = userEmailMap[customerEmail];
            await order.save();
            updatedCount++;
          } else {
            console.log(`   ❌ Could not find user for order ${order.orderNumber} (${customerEmail})`);
          }
        }
      } catch (error) {
        console.error(`   ❌ Error updating order ${order.orderNumber}:`, error.message);
      }
    }
    
    console.log(`\n✅ Updated ${updatedCount} orders`);
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const updatedOrders = await Order.find({});
    const ordersWithValidUser = updatedOrders.filter(order => order.userId);
    const ordersWithoutUser = updatedOrders.filter(order => !order.userId);
    
    console.log(`   ✅ Orders with valid userId: ${ordersWithValidUser.length}`);
    console.log(`   ❌ Orders without userId: ${ordersWithoutUser.length}`);
    
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

directDatabaseUpdate();