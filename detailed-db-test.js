// Detailed test of the fix process
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Models
const Order = require('./backend/src/models/Order');
const User = require('./backend/src/models/User');

async function detailedTest() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Check a specific order
    console.log('\n🔍 Checking a specific order...');
    const sampleOrder = await Order.findOne({ orderNumber: 'ORD-1761283903643' });
    if (sampleOrder) {
      console.log(`Order: ${sampleOrder.orderNumber}`);
      console.log(`Customer email: ${sampleOrder.customerInfo.email}`);
      console.log(`User ID: ${sampleOrder.userId}`);
      console.log(`User ID exists: ${sampleOrder.userId !== undefined}`);
      console.log(`User ID is null: ${sampleOrder.userId === null}`);
      
      // Try to find the user
      console.log('\n🔍 Looking for user with email:', sampleOrder.customerInfo.email);
      const user = await User.findOne({ email: sampleOrder.customerInfo.email });
      if (user) {
        console.log(`✅ Found user: ${user.email} (${user._id})`);
        
        // Try to update the order
        console.log('\n🔧 Attempting to update order...');
        sampleOrder.userId = user._id;
        await sampleOrder.save();
        console.log('✅ Order updated successfully');
        
        // Verify the update
        const updatedOrder = await Order.findById(sampleOrder._id);
        console.log(`Verified User ID: ${updatedOrder.userId}`);
      } else {
        console.log('❌ User not found');
      }
    } else {
      console.log('❌ Sample order not found');
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

detailedTest();