require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test delivery boy login
const testDeliveryLogin = async () => {
  try {
    // Find a delivery boy in the database
    const deliveryBoy = await User.findOne({ role: 'deliveryBoy' });
    
    if (!deliveryBoy) {
      console.log('No delivery boy found in database');
      return;
    }
    
    console.log('Found delivery boy:');
    console.log('- Name:', deliveryBoy.name);
    console.log('- Email:', deliveryBoy.email);
    console.log('- Role:', deliveryBoy.role);
    console.log('- Has password:', !!deliveryBoy.password);
    
    if (deliveryBoy.password) {
      console.log('- Password length:', deliveryBoy.password.length);
      console.log('- Password sample:', deliveryBoy.password.substring(0, 20) + '...');
    }
    
    // Test password verification
    console.log('\nTesting password verification...');
    
    // Try to verify with a common password
    const testPasswords = ['delivery123', 'password', '123456', 'admin123'];
    
    for (const password of testPasswords) {
      console.log(`\nTesting password: "${password}"`);
      
      try {
        const isMatch = await deliveryBoy.matchPassword(password);
        console.log(`- matchPassword result: ${isMatch}`);
        
        if (isMatch) {
          console.log(`✓ Password matched!`);
          break;
        } else {
          console.log(`✗ Password did not match`);
        }
      } catch (err) {
        console.log(`Error verifying password: ${err.message}`);
      }
    }
    
    // Also test finding user by email
    console.log('\nTesting user lookup by email...');
    const userByEmail = await User.findOne({ email: deliveryBoy.email });
    console.log('- User found by email:', !!userByEmail);
    if (userByEmail) {
      console.log('- Roles match:', userByEmail.role === deliveryBoy.role);
    }
    
  } catch (err) {
    console.error('Error testing delivery login:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

testDeliveryLogin();