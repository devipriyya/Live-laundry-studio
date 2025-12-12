require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Test password verification
const testPasswordVerification = async () => {
  try {
    // Find a delivery boy
    const deliveryBoy = await User.findOne({ role: 'deliveryBoy' });
    if (!deliveryBoy) {
      console.log('No delivery boy found in database');
      return;
    }
    
    console.log('Found delivery boy:', deliveryBoy.name, deliveryBoy.email);
    console.log('Database password (hashed):', deliveryBoy.password);
    console.log('Password length:', deliveryBoy.password.length);
    
    // Test different passwords
    const testPasswords = ['delivery123', 'admin123', 'password', ''];
    
    for (const password of testPasswords) {
      console.log(`\nTesting password: '${password}'`);
      
      try {
        // Test with the User model's matchPassword method
        const isMatch = await deliveryBoy.matchPassword(password);
        console.log(`matchPassword result: ${isMatch}`);
        
        // Also test direct bcrypt comparison
        if (deliveryBoy.password) {
          const directMatch = await bcrypt.compare(password, deliveryBoy.password);
          console.log(`Direct bcrypt compare result: ${directMatch}`);
        }
      } catch (err) {
        console.log(`Error testing password '${password}':`, err.message);
      }
    }
  } catch (err) {
    console.error('Error testing password verification:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

testPasswordVerification();