require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Test delivery boy creation through API
const testApiDeliveryBoyCreation = async () => {
  try {
    // First, let's clean up any existing test user
    await User.deleteOne({ email: 'test.api.delivery@fabrico.com' });
    
    // Create an admin user to get a valid token
    let adminUser = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminUser) {
      // Create admin user if it doesn't exist
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
    }
    
    // Generate a token for the admin user
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Data to send to the API
    const deliveryBoyData = {
      name: 'API Test Delivery Boy',
      email: 'test.api.delivery@fabrico.com',
      phone: '+1 (555) 999-8888',
      password: 'delivery123'
    };
    
    console.log('Sending request to create delivery boy with data:', deliveryBoyData);
    
    // Make the API request
    const response = await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API response:', response.data);
    
    // Now test login with the created delivery boy
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test.api.delivery@fabrico.com',
      password: 'delivery123'
    });
    
    console.log('Login response:', loginResponse.data);
    
    // Clean up
    await User.deleteOne({ email: 'test.api.delivery@fabrico.com' });
    console.log('Test user deleted');
  } catch (err) {
    console.error('Error testing API delivery boy creation:');
    console.error('Message:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  } finally {
    mongoose.connection.close();
  }
};

testApiDeliveryBoyCreation();