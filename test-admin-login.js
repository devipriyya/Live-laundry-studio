const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Connect to MongoDB to verify user
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

const User = require('./backend/src/models/User');

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    // Try to login with admin credentials
    const loginData = {
      email: 'admin@gmail.com',
      password: 'admin123'
    };
    
    console.log('Attempting login with:', loginData);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
    // Now test the admin orders endpoint with this token
    console.log('\nTesting admin orders endpoint...');
    
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${response.data.token}`
      }
    });
    
    console.log('Orders API response status:', ordersResponse.status);
    console.log('Orders data keys:', Object.keys(ordersResponse.data));
    console.log('Number of orders:', ordersResponse.data.orders?.length || ordersResponse.data.length);
    
    if (ordersResponse.data.orders && ordersResponse.data.orders.length > 0) {
      console.log('First order sample:');
      console.log(JSON.stringify(ordersResponse.data.orders[0], null, 2));
    } else {
      console.log('No orders found in database');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAdminLogin();