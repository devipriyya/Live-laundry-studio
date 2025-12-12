require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test the full flow: admin login -> create delivery boy -> delivery boy login
const testFullFlow = async () => {
  try {
    console.log('=== Testing Full Flow ===');
    
    // Step 1: Login as admin
    console.log('\n1. Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('Token length:', adminToken.length);
    
    // Step 2: Create a delivery boy using admin token
    console.log('\n2. Creating delivery boy with admin token...');
    const deliveryBoyData = {
      name: 'Test Delivery Boy Full Flow',
      email: 'test.fullflow@example.com',
      phone: '1112223333',
      password: 'delivery123'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Delivery boy created successfully');
    console.log('Response:', createResponse.data);
    
    // Step 3: Check if the delivery boy was created correctly in the database
    console.log('\n3. Checking database for created delivery boy...');
    const createdDeliveryBoy = await User.findOne({ email: 'test.fullflow@example.com' });
    console.log('Delivery boy found in DB:', !!createdDeliveryBoy);
    if (createdDeliveryBoy) {
      console.log('Password in DB:', createdDeliveryBoy.password);
      console.log('Password length:', createdDeliveryBoy.password.length);
      
      // Test password verification
      console.log('\n4. Testing password verification...');
      const isMatch = await createdDeliveryBoy.matchPassword('delivery123');
      console.log('Password match result:', isMatch);
      
      if (isMatch) {
        console.log('✅ Password verification successful');
      } else {
        console.log('❌ Password verification failed');
      }
    }
    
    // Step 5: Try to login as the delivery boy
    console.log('\n5. Attempting to login as delivery boy...');
    try {
      const deliveryBoyLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test.fullflow@example.com',
        password: 'delivery123'
      });
      
      console.log('✅ Delivery boy login successful');
      console.log('Token received:', deliveryBoyLoginResponse.data.token.length, 'characters');
    } catch (loginError) {
      console.log('❌ Delivery boy login failed');
      if (loginError.response) {
        console.log('Status:', loginError.response.status);
        console.log('Data:', loginError.response.data);
      } else {
        console.log('Error:', loginError.message);
      }
    }
    
    // Clean up - delete the test user
    await User.deleteOne({ email: 'test.fullflow@example.com' });
    console.log('\n🧹 Test user deleted');
    
  } catch (err) {
    console.error('Error in full flow test:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  } finally {
    mongoose.connection.close();
  }
};

testFullFlow();