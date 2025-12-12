// Comprehensive test to trace delivery boy login issues
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function comprehensiveTest() {
  try {
    console.log('=== COMPREHENSIVE DELIVERY BOY LOGIN TEST ===\n');
    
    // Test 1: Check if the user exists in database
    console.log('1. Checking database for delivery boy user...');
    const user = await User.findOne({ email: 'route.test2@example.com' });
    if (!user) {
      console.log('❌ User not found in database');
      return;
    }
    
    console.log('✅ User found in database');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Password hash length:', user.password?.length);
    console.log('   Is Blocked:', user.isBlocked);
    
    // Test 2: Test password verification directly
    console.log('\n2. Testing password verification directly...');
    const isMatch = await user.matchPassword('routetest123');
    console.log('   Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password verification failed');
      return;
    }
    
    console.log('✅ Password verification successful');
    
    // Test 3: Test login via API
    console.log('\n3. Testing login via API...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'route.test2@example.com',
        password: 'routetest123'
      });
      
      console.log('✅ API login successful!');
      console.log('   Status:', loginResponse.status);
      console.log('   Token present:', !!loginResponse.data.token);
      console.log('   User role:', loginResponse.data.user?.role);
      
    } catch (apiError) {
      console.log('❌ API login failed');
      if (apiError.response) {
        console.log('   Status:', apiError.response.status);
        console.log('   Data:', apiError.response.data);
      } else {
        console.log('   Error:', apiError.message);
      }
      return;
    }
    
    console.log('\n🎉 ALL TESTS PASSED - Delivery boy login should work!');
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('Stack:', error.stack);
  } finally {
    mongoose.connection.close();
  }
}

comprehensiveTest();