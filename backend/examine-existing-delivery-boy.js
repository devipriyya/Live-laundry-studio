require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Examine an existing delivery boy account
const examineExistingDeliveryBoy = async () => {
  try {
    console.log('=== Examining Existing Delivery Boy Account ===');
    
    // Find an existing delivery boy
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
      console.log('- Password sample:', deliveryBoy.password.substring(0, 30) + '...');
      
      // Check if it looks like a bcrypt hash
      const isBcryptHash = deliveryBoy.password.startsWith('$2b$') || deliveryBoy.password.startsWith('$2a$') || deliveryBoy.password.startsWith('$2y$');
      console.log('- Is bcrypt hash:', isBcryptHash);
      
      if (isBcryptHash) {
        console.log('- Hash rounds:', deliveryBoy.password.substring(4, 6));
      }
    }
    
    // Try to verify with common passwords
    console.log('\nTesting password verification with common passwords:');
    const commonPasswords = ['delivery123', 'password', '123456', 'admin123', deliveryBoy.email.split('@')[0]];
    
    for (const password of commonPasswords) {
      console.log(`\nTesting password: "${password}"`);
      
      try {
        const isMatch = await deliveryBoy.matchPassword(password);
        console.log(`- matchPassword result: ${isMatch}`);
        
        // Also try direct bcrypt comparison
        if (deliveryBoy.password) {
          const directMatch = await bcrypt.compare(password, deliveryBoy.password);
          console.log(`- Direct bcrypt compare: ${directMatch}`);
        }
      } catch (err) {
        console.log(`Error verifying password: ${err.message}`);
      }
    }
    
  } catch (err) {
    console.error('Error examining delivery boy:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

examineExistingDeliveryBoy();