// Native MongoDB driver approach
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './backend/.env' });

async function nativeMongoUpdate() {
  let client;
  
  try {
    console.log('=== NATIVE MONGODB UPDATE SCRIPT ===');
    
    console.log('Connecting to MongoDB...');
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('ecowashdb');
    const ordersCollection = db.collection('orders');
    const usersCollection = db.collection('users');
    
    // Get all users to create email-to-userId mapping
    console.log('\n📋 Fetching all users...');
    const users = await usersCollection.find({}).toArray();
    const userEmailMap = {};
    users.forEach(user => {
      userEmailMap[user.email] = user._id.toString();
    });
    console.log(`✅ Found ${users.length} users`);
    
    // Get all orders
    console.log('\n📋 Fetching all orders...');
    const orders = await ordersCollection.find({}).toArray();
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
            await ordersCollection.updateOne(
              { _id: order._id },
              { $set: { userId: userEmailMap[customerEmail] } }
            );
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
    const updatedOrders = await ordersCollection.find({}).toArray();
    const ordersWithValidUser = updatedOrders.filter(order => order.userId);
    const ordersWithoutUser = updatedOrders.filter(order => !order.userId);
    
    console.log(`   ✅ Orders with valid userId: ${ordersWithValidUser.length}`);
    console.log(`   ❌ Orders without userId: ${ordersWithoutUser.length}`);
    
    await client.close();
    console.log('\n👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (client) {
      await client.close();
    }
  }
}

nativeMongoUpdate();