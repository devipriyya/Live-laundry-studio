require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Test predefined delivery boy accounts
const testPredefinedDeliveryBoys = async () => {
  try {
    console.log('=== Testing Predefined Delivery Boy Accounts ===');
    
    // Check if the predefined delivery boys exist
    const predefinedDeliveryBoys = [
      { email: 'mike.delivery@fabrico.com', password: 'delivery123' },
      { email: 'sarah.delivery@fabrico.com', password: 'delivery123' },
      { email: 'tom.delivery@fabrico.com', password: 'delivery123' }
    ];
    
    for (const deliveryBoy of predefinedDeliveryBoys) {
      console.log(`\nChecking ${deliveryBoy.email}...`);
      
      // Check if user exists
      const user = await User.findOne({ email: deliveryBoy.email });
      if (!user) {
        console.log(`❌ User not found: ${deliveryBoy.email}`);
        continue;
      }
      
      console.log(`✅ User found: ${user.name} (${user.email})`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Has password: ${!!user.password}`);
      
      if (user.password) {
        console.log(`- Password length: ${user.password.length}`);
        console.log(`- Is bcrypt hash: ${user.password.startsWith('$2b$')}`);
      }
      
      // Test login through API
      console.log(`\nTesting login for ${deliveryBoy.email}...`);
      try {
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: deliveryBoy.email,
          password: deliveryBoy.password
        });
        
        console.log(`✅ Login successful for ${deliveryBoy.email}`);
        console.log(`- Token length: ${loginResponse.data.token.length}`);
        console.log(`- User role: ${loginResponse.data.user.role}`);
        
        // Verify role
        if (loginResponse.data.user.role === 'deliveryBoy') {
          console.log('✅ Role verification passed');
        } else {
          console.log(`❌ Role verification failed. Expected: deliveryBoy, Got: ${loginResponse.data.user.role}`);
        }
      } catch (loginError) {
        console.log(`❌ Login failed for ${deliveryBoy.email}`);
        if (loginError.response) {
          console.log(`- Status: ${loginError.response.status}`);
          console.log(`- Data: ${JSON.stringify(loginError.response.data)}`);
        } else {
          console.log(`- Error: ${loginError.message}`);
        }
      }
    }
    
  } catch (err) {
    console.error('Error testing predefined delivery boys:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

testPredefinedDeliveryBoys();