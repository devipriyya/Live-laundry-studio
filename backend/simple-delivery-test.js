// Simple test to create and login a delivery boy directly using Mongoose
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test creating and logging in a delivery boy
const testDirectDeliveryBoy = async () => {
  try {
    console.log('=== Direct Delivery Boy Test ===');
    
    // Clean up any existing test user
    await User.deleteOne({ email: 'direct.test@example.com' });
    console.log('Cleaned up existing test user');
    
    // Create a delivery boy with hashed password (like the working predefined ones)
    console.log('Creating delivery boy with hashed password...');
    const password = 'directtest123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const deliveryBoy = new User({
      name: 'Direct Test Delivery Boy',
      email: 'direct.test@example.com',
      phone: '5559998888',
      password: hashedPassword,
      role: 'deliveryBoy'
    });
    
    await deliveryBoy.save();
    console.log('Delivery boy created successfully');
    
    // Test login by finding user and verifying password
    console.log('Testing password verification...');
    const foundUser = await User.findOne({ email: 'direct.test@example.com' });
    if (!foundUser) {
      console.log('User not found');
      return;
    }
    
    console.log('Found user:', foundUser.email, foundUser.role);
    console.log('Password hash length:', foundUser.password.length);
    
    const isMatch = await foundUser.matchPassword(password);
    console.log('Password match result:', isMatch);
    
    if (isMatch) {
      console.log('✅ Direct delivery boy test PASSED');
    } else {
      console.log('❌ Direct delivery boy test FAILED');
    }
    
    // Clean up
    await User.deleteOne({ email: 'direct.test@example.com' });
    console.log('Test user cleaned up');
    
  } catch (err) {
    console.error('Error in direct delivery boy test:', err.message);
    console.error('Stack:', err.stack);
  } finally {
    mongoose.connection.close();
  }
};

testDirectDeliveryBoy();