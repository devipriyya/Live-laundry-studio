const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../src/models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const testAdminAuth = async () => {
  try {
    // First, login as admin to get token
    console.log('Attempting to login as admin...');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token received.');
    
    // Test accessing order management endpoint
    console.log('Testing access to order management endpoint...');
    
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Order management access successful!');
    console.log(`Total orders: ${ordersResponse.data.total}`);
    console.log(`Total pages: ${ordersResponse.data.totalPages}`);
    
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

const run = async () => {
  await connectDB();
  await testAdminAuth();
  process.exit();
};

run();