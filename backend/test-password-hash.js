require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Test password hashing
const testPasswordHashing = async () => {
  try {
    // Create a test user with a password
    const testUser = new User({
      name: 'Test Delivery Boy',
      email: 'test.delivery@fabrico.com',
      phone: '+1 (555) 123-4567',
      password: 'delivery123',
      role: 'deliveryBoy'
    });
    
    console.log('Original password:', testUser.password);
    
    // Save the user (should trigger the pre-save hook to hash the password)
    await testUser.save();
    
    console.log('Saved user password (should be hashed):', testUser.password);
    
    // Test password matching
    const isMatch = await testUser.matchPassword('delivery123');
    console.log('Password match result:', isMatch);
    
    // Clean up - delete the test user
    await User.deleteOne({ email: 'test.delivery@fabrico.com' });
    console.log('Test user deleted');
  } catch (err) {
    console.error('Error testing password hashing:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

testPasswordHashing();