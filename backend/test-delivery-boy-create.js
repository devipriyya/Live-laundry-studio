require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Test delivery boy creation
const testDeliveryBoyCreation = async () => {
  try {
    // First, let's clean up any existing test user
    await User.deleteOne({ email: 'test.delivery@fabrico.com' });
    
    // Simulate the API call that the frontend makes
    const deliveryBoyData = {
      name: 'Test Delivery Boy',
      email: 'test.delivery@fabrico.com',
      phone: '+1 (555) 123-4567',
      password: 'delivery123'
    };
    
    console.log('Creating delivery boy with data:', deliveryBoyData);
    
    // Create the delivery boy directly using the same logic as the route
    const { name, email, phone, password } = deliveryBoyData;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return;
    }
    
    // Create delivery boy
    const deliveryBoy = new User({
      name,
      email,
      phone,
      password,
      role: 'deliveryBoy'
    });
    
    console.log('Before save - password:', deliveryBoy.password);
    
    await deliveryBoy.save();
    
    console.log('After save - password:', deliveryBoy.password);
    
    // Now test login
    const user = await User.findOne({ email: 'test.delivery@fabrico.com' });
    console.log('Retrieved user password:', user.password);
    
    const isMatch = await user.matchPassword('delivery123');
    console.log('Password match result:', isMatch);
    
    // Clean up
    await User.deleteOne({ email: 'test.delivery@fabrico.com' });
    console.log('Test user deleted');
  } catch (err) {
    console.error('Error testing delivery boy creation:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

testDeliveryBoyCreation();