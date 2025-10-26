const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Connect to MongoDB
async function connectDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

const Order = require('./backend/src/models/Order');
const User = require('./backend/src/models/User');

async function fixOrderUserAssociations() {
  try {
    const connected = await connectDB();
    if (!connected) {
      return;
    }
    
    console.log('Finding orders without userId...');
    
    // Find orders with null userId
    const ordersWithoutUser = await Order.find({ userId: null });
    console.log(`Found ${ordersWithoutUser.length} orders without userId`);
    
    if (ordersWithoutUser.length === 0) {
      console.log('No orders need fixing');
      mongoose.connection.close();
      return;
    }
    
    // Find users by email to associate with orders
    let fixedCount = 0;
    for (const order of ordersWithoutUser) {
      try {
        // Try to find user by email
        const user = await User.findOne({ email: order.customerInfo.email });
        if (user) {
          console.log(`Associating order ${order.orderNumber} with user ${user.email}`);
          order.userId = user._id;
          await order.save();
          fixedCount++;
        } else {
          console.log(`No user found for order ${order.orderNumber} with email ${order.customerInfo.email}`);
        }
      } catch (error) {
        console.error(`Error fixing order ${order.orderNumber}:`, error.message);
      }
    }
    
    console.log(`Fixed ${fixedCount} orders`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error fixing order user associations:', error);
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

fixOrderUserAssociations();