// Script to test the delivery boy API endpoints
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

async function testDeliveryAPI() {
  try {
    console.log('=== TESTING DELIVERY BOY API ENDPOINTS ===\n');
    
    // 1. Login as delivery boy to get token
    console.log('1. Logging in as delivery boy...');
    const loginResponse = await axios.post(`http://localhost:5020/api/auth/login`, {
      email: 'mike.delivery@fabrico.com',
      password: 'delivery123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('Token length:', token.length);
    
    // 2. Test the my-deliveries endpoint
    console.log('\n2. Testing /orders/my-deliveries endpoint...');
    try {
      const ordersResponse = await axios.get(`http://localhost:5020/api/orders/my-deliveries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ /orders/my-deliveries endpoint working');
      console.log('Orders count:', ordersResponse.data.orders?.length || 0);
      
      // 3. Test the stats endpoint
      console.log('\n3. Testing /orders/my-deliveries/stats endpoint...');
      const statsResponse = await axios.get(`http://localhost:5020/api/orders/my-deliveries/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ /orders/my-deliveries/stats endpoint working');
      console.log('Stats data:', Object.keys(statsResponse.data));
      
    } catch (apiError) {
      console.log('❌ API endpoint test failed:', apiError.message);
      if (apiError.response) {
        console.log('Status:', apiError.response.status);
        console.log('Data:', apiError.response.data);
      }
    }
    
  } catch (error) {
    console.log('❌ Error testing delivery API:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
  } finally {
    mongoose.connection.close();
  }
}

testDeliveryAPI();