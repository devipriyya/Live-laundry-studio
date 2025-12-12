// Script to test delivery boy login with known credentials
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

async function testDeliveryBoyLogin() {
  try {
    console.log('=== TESTING DELIVERY BOY LOGIN ===\n');
    
    // Look for a specific delivery boy
    const deliveryBoy = await User.findOne({ email: 'mike.delivery@fabrico.com' });
    
    if (!deliveryBoy) {
      console.log('❌ Delivery boy account not found in database');
      return;
    }
    
    console.log('✅ Delivery boy account found in database');
    console.log('Email:', deliveryBoy.email);
    console.log('Name:', deliveryBoy.name);
    console.log('Role:', deliveryBoy.role);
    console.log('Is Blocked:', deliveryBoy.isBlocked);
    console.log('Has Password:', !!deliveryBoy.password);
    
    if (deliveryBoy.password) {
      console.log('Password length:', deliveryBoy.password.length);
      
      // Test password verification with a common password
      console.log('\nTesting password verification...');
      const testPasswords = ['delivery123', 'password', '123456', 'admin123'];
      
      for (const password of testPasswords) {
        console.log(`\nTesting password: "${password}"`);
        try {
          const isMatch = await deliveryBoy.matchPassword(password);
          console.log(`- Password match result: ${isMatch}`);
          
          if (isMatch) {
            console.log(`✓ Password matched!`);
            
            // Generate a JWT token
            const payload = {
              id: deliveryBoy._id,
              role: deliveryBoy.role
            };
            
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
            console.log(`✓ JWT token generated: ${token.substring(0, 20)}...`);
            
            // Test the token by decoding it
            try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET);
              console.log(`✓ Token decoded successfully:`);
              console.log(`  - User ID: ${decoded.id}`);
              console.log(`  - Role: ${decoded.role}`);
              console.log(`  - Expires: ${new Date(decoded.exp * 1000)}`);
            } catch (decodeErr) {
              console.log(`❌ Error decoding token: ${decodeErr.message}`);
            }
            
            break;
          } else {
            console.log(`✗ Password did not match`);
          }
        } catch (err) {
          console.log(`Error verifying password: ${err.message}`);
        }
      }
    }
    
    // Also test with another delivery boy
    console.log('\n=== TESTING ANOTHER DELIVERY BOY ===');
    const anotherBoy = await User.findOne({ email: 'anjaly@gmail.com' });
    
    if (anotherBoy) {
      console.log('Found another delivery boy:', anotherBoy.name);
      console.log('Email:', anotherBoy.email);
      console.log('Has Password:', !!anotherBoy.password);
      
      if (anotherBoy.password) {
        console.log('Testing password for this user...');
        const isMatch = await anotherBoy.matchPassword('delivery123');
        console.log(`Password match result: ${isMatch}`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error testing delivery boy login:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

testDeliveryBoyLogin();