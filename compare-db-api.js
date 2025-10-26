// Compare database values with API values
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

async function compareDatabaseAndAPI() {
  let mongoClient;
  
  try {
    console.log('=== COMPARING DATABASE AND API VALUES ===');
    
    // Connect to MongoDB using native driver
    console.log('Connecting to MongoDB...');
    mongoClient = new MongoClient(process.env.MONGO_URI);
    await mongoClient.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = mongoClient.db('ecowashdb');
    const ordersCollection = db.collection('orders');
    
    // Get a specific order from database
    console.log('\n🔍 Getting order from database...');
    const dbOrder = await ordersCollection.findOne({ orderNumber: 'ORD-1761283903643' });
    console.log(`   Database order userId: ${dbOrder?.userId}`);
    console.log(`   Database order userId type: ${typeof dbOrder?.userId}`);
    console.log(`   Database order userId value: ${JSON.stringify(dbOrder?.userId)}`);
    
    // Check if the userId references an existing user
    if (dbOrder?.userId) {
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ _id: dbOrder.userId });
      console.log(`   Referenced user exists: ${!!user}`);
      if (user) {
        console.log(`   Referenced user email: ${user.email}`);
      }
    }
    
    // Get the same order from API
    console.log('\n🔍 Getting order from API...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    
    const apiResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 1
      }
    });
    
    const apiOrder = apiResponse.data.orders[0];
    console.log(`   API order userId: ${apiOrder?.userId}`);
    console.log(`   API order userId type: ${typeof apiOrder?.userId}`);
    console.log(`   API order userId value: ${JSON.stringify(apiOrder?.userId)}`);
    
    // Compare values
    console.log('\n📊 COMPARISON:');
    console.log(`   Database userId: ${JSON.stringify(dbOrder?.userId)}`);
    console.log(`   API userId: ${JSON.stringify(apiOrder?.userId)}`);
    console.log(`   Match: ${JSON.stringify(dbOrder?.userId) === JSON.stringify(apiOrder?.userId)}`);
    
    await mongoClient.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

compareDatabaseAndAPI();