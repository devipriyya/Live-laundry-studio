// Fix orders by updating userId to reference valid users
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './backend/.env' });

async function fixOrderReferences() {
  let mongoClient;
  
  try {
    console.log('=== FIXING ORDER USER REFERENCES ===');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = mongoClient.db('ecowashdb');
    const ordersCollection = db.collection('orders');
    const usersCollection = db.collection('users');
    
    // Get all users to create email mapping
    console.log('\n📋 Getting all users...');
    const users = await usersCollection.find({}).toArray();
    console.log(`✅ Found ${users.length} users`);
    
    // Create email to userId mapping
    const userEmailMap = {};
    users.forEach(user => {
      userEmailMap[user.email] = user._id;
      console.log(`   ${user.email} -> ${user._id}`);
    });
    
    // Get orders with invalid userId references
    console.log('\n🔍 Finding orders with invalid userId references...');
    const orders = await ordersCollection.find({}).toArray();
    console.log(`✅ Found ${orders.length} orders`);
    
    let fixedCount = 0;
    
    // Process each order
    for (const order of orders) {
      try {
        // Check if userId references an existing user
        if (order.userId) {
          const user = await usersCollection.findOne({ _id: order.userId });
          if (!user) {
            // userId references a non-existent user, fix it
            console.log(`\n🔧 Fixing order ${order.orderNumber}...`);
            console.log(`   Current userId: ${order.userId} (invalid reference)`);
            
            // Try to find user by email
            const customerEmail = order.customerInfo?.email;
            if (customerEmail && userEmailMap[customerEmail]) {
              const newUserId = userEmailMap[customerEmail];
              console.log(`   Found user by email: ${customerEmail} -> ${newUserId}`);
              
              // Update the order
              await ordersCollection.updateOne(
                { _id: order._id },
                { $set: { userId: newUserId } }
              );
              
              console.log(`   ✅ Updated order userId to: ${newUserId}`);
              fixedCount++;
            } else {
              console.log(`   ❌ Could not find user for email: ${customerEmail}`);
            }
          } else {
            console.log(`   ✅ Order ${order.orderNumber} already has valid userId reference`);
          }
        } else {
          // Order has no userId, try to set it based on email
          console.log(`\n🔧 Setting userId for order ${order.orderNumber}...`);
          const customerEmail = order.customerInfo?.email;
          if (customerEmail && userEmailMap[customerEmail]) {
            const newUserId = userEmailMap[customerEmail];
            console.log(`   Found user by email: ${customerEmail} -> ${newUserId}`);
            
            // Update the order
            await ordersCollection.updateOne(
              { _id: order._id },
              { $set: { userId: newUserId } }
            );
            
            console.log(`   ✅ Set order userId to: ${newUserId}`);
            fixedCount++;
          } else {
            console.log(`   ❌ Could not find user for email: ${customerEmail}`);
          }
        }
      } catch (error) {
        console.error(`   ❌ Error processing order ${order.orderNumber}:`, error.message);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} orders`);
    
    await mongoClient.close();
    console.log('\n👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

fixOrderReferences();