// Direct database query to understand the issue
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Models
const Order = require('./backend/src/models/Order');

async function directQueryTest() {
  try {
    console.log('=== DIRECT DATABASE QUERY TEST ===');
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Raw database query to bypass Mongoose
    const collection = mongoose.connection.collection('orders');
    
    // Count total orders
    const totalOrders = await collection.countDocuments({});
    console.log(`\n📊 Total orders in collection: ${totalOrders}`);
    
    // Count orders with null userId
    const nullUserIdCount = await collection.countDocuments({ userId: null });
    console.log(`❌ Orders with null userId: ${nullUserIdCount}`);
    
    // Count orders with missing userId field
    const missingUserIdCount = await collection.countDocuments({ userId: { $exists: false } });
    console.log(`❓ Orders with missing userId field: ${missingUserIdCount}`);
    
    // Count orders with valid userId
    const validUserIdCount = await collection.countDocuments({ userId: { $ne: null, $exists: true } });
    console.log(`✅ Orders with valid userId: ${validUserIdCount}`);
    
    // Sample a few orders with null userId
    if (nullUserIdCount > 0) {
      console.log('\n📋 SAMPLE ORDERS WITH NULL USER ID:');
      const sampleOrders = await collection.find({ userId: null }).limit(5).toArray();
      sampleOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order: ${order.orderNumber}`);
        console.log(`      Customer: ${order.customerInfo?.email}`);
        console.log(`      User ID: ${order.userId}`);
        console.log(`      User ID type: ${typeof order.userId}`);
        console.log('      ---');
      });
    }
    
    // Try to update one order as a test
    if (nullUserIdCount > 0) {
      console.log('\n🔧 ATTEMPTING TO FIX ONE ORDER...');
      const sampleOrder = await collection.findOne({ userId: null });
      console.log(`   Order to fix: ${sampleOrder.orderNumber}`);
      
      // This would be where we update the order
      // For now, just show what we would do
      console.log(`   Would set userId to: [USER_ID_HERE]`);
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

directQueryTest();