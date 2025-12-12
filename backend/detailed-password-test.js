// Detailed test to check password hashing and verification
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test password hashing and verification in detail
const testPasswordDetails = async () => {
  try {
    console.log('=== Detailed Password Test ===');
    
    // Clean up any existing test user
    await User.deleteOne({ email: 'password.test@example.com' });
    console.log('Cleaned up existing test user');
    
    // Test 1: Manual hashing
    console.log('\n--- Test 1: Manual Hashing ---');
    const plainPassword = 'testpassword123';
    console.log('Plain password:', plainPassword);
    console.log('Plain password length:', plainPassword.length);
    
    const salt = await bcrypt.genSalt(10);
    console.log('Generated salt:', salt);
    
    const manualHash = await bcrypt.hash(plainPassword, salt);
    console.log('Manual hash:', manualHash);
    console.log('Manual hash length:', manualHash.length);
    
    const manualVerify = await bcrypt.compare(plainPassword, manualHash);
    console.log('Manual verification result:', manualVerify);
    
    // Test 2: Using User model with pre-save hook
    console.log('\n--- Test 2: User Model with Pre-Save Hook ---');
    const user = new User({
      name: 'Password Test User',
      email: 'password.test@example.com',
      phone: '5551112222',
      password: plainPassword,
      role: 'deliveryBoy'
    });
    
    console.log('User password before save:', user.password);
    console.log('User password length before save:', user.password.length);
    
    await user.save();
    console.log('User saved');
    
    console.log('User password after save:', user.password);
    console.log('User password length after save:', user.password.length);
    
    // Test 3: Retrieve and verify
    console.log('\n--- Test 3: Retrieve and Verify ---');
    const retrievedUser = await User.findOne({ email: 'password.test@example.com' });
    console.log('Retrieved user password:', retrievedUser.password);
    console.log('Retrieved user password length:', retrievedUser.password.length);
    
    const modelVerify = await retrievedUser.matchPassword(plainPassword);
    console.log('Model verification result:', modelVerify);
    
    // Test 4: Direct bcrypt comparison on retrieved password
    console.log('\n--- Test 4: Direct Bcrypt Comparison ---');
    const directVerify = await bcrypt.compare(plainPassword, retrievedUser.password);
    console.log('Direct bcrypt verification result:', directVerify);
    
    // Clean up
    await User.deleteOne({ email: 'password.test@example.com' });
    console.log('\nTest user cleaned up');
    
  } catch (err) {
    console.error('Error in password test:', err.message);
    console.error('Stack:', err.stack);
  } finally {
    mongoose.connection.close();
  }
};

testPasswordDetails();