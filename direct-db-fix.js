const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Models
const Order = require('./backend/src/models/Order');
const User = require('./backend/src/models/User');

async function connectDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    return false;
  }
}

async function fixOrderUserAssociations() {
  try {
    const connected = await connectDB();
    if (!connected) {
      return;
    }
    
    console.log('🔧 Starting direct database order-user association fix...');
    
    // Get all orders without userId
    const ordersWithoutUser = await Order.find({ userId: { $exists: false } }).lean();
    console.log(`📋 Found ${ordersWithoutUser.length} orders without userId field`);
    
    // Also check for orders with explicit null userId
    const ordersWithNullUserId = await Order.find({ userId: null }).lean();
    console.log(`📋 Found ${ordersWithNullUserId.length} orders with null userId`);
    
    const allOrdersWithoutUser = [...ordersWithoutUser, ...ordersWithNullUserId];
    console.log(`📊 Total orders to fix: ${allOrdersWithoutUser.length}`);
    
    if (allOrdersWithoutUser.length === 0) {
      console.log('✅ All orders are already properly associated with users');
      await mongoose.connection.close();
      return;
    }
    
    let fixedCount = 0;
    
    // For each order, try to find and associate the user
    for (const order of allOrdersWithoutUser) {
      try {
        // Find user by email
        const user = await User.findOne({ email: order.customerInfo.email });
        if (user) {
          console.log(`🔧 Associating order ${order.orderNumber} with user ${user.email} (${user._id})`);
          await Order.findByIdAndUpdate(order._id, { userId: user._id });
          fixedCount++;
        } else {
          console.log(`❌ No user found for order ${order.orderNumber} with email ${order.customerInfo.email}`);
        }
      } catch (error) {
        console.error(`❌ Error fixing order ${order.orderNumber}:`, error.message);
      }
    }
    
    console.log(`\n✅ Successfully fixed ${fixedCount} orders`);
    
    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const remainingOrdersWithoutUser = await Order.find({ userId: null });
    console.log(`📋 Orders still without user association: ${remainingOrdersWithoutUser.length}`);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

fixOrderUserAssociations();