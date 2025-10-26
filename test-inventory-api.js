const axios = require('axios');
require('dotenv').config({ path: __dirname + '/backend/.env' });

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

async function testInventory() {
  try {
    console.log('Testing Inventory API...');
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Connected' : 'Not set');
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');

    // Test 1: Try to fetch without authentication
    console.log('\n1. Testing without authentication...');
    try {
      const response = await api.get('/inventory');
      console.log('Unexpected success:', response.data);
    } catch (error) {
      console.log('Expected error:', error.response?.status, error.response?.data?.message);
    }

    // Test 2: Connect to database and check for admin user
    console.log('\n2. Checking database for admin users...');
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGO_URI);
    
    const User = require('./backend/src/models/User');
    const users = await User.find({ role: 'admin' });
    console.log(`Found ${users.length} admin users`);
    if (users.length > 0) {
      console.log('Admin users:', users.map(u => ({ name: u.name, email: u.email })));
    }

    // Test 3: Check inventory collection
    console.log('\n3. Checking inventory collection...');
    const Inventory = require('./backend/src/models/Inventory');
    const inventoryCount = await Inventory.countDocuments();
    console.log(`Found ${inventoryCount} inventory items`);

    await mongoose.disconnect();
    console.log('\nTest completed!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testInventory();
