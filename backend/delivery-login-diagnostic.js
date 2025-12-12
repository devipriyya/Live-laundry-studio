// Diagnostic test to trace delivery boy login issues
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function diagnosticTest() {
  try {
    console.log('=== DELIVERY BOY LOGIN DIAGNOSTIC TEST ===\n');
    
    // Test 1: Check what delivery boy accounts exist
    console.log('1. Checking existing delivery boy accounts...');
    const deliveryBoys = await User.find({ role: 'deliveryBoy' }).select('-password');
    console.log(`   Found ${deliveryBoys.length} delivery boy accounts:`);
    deliveryBoys.forEach((boy, index) => {
      console.log(`   ${index + 1}. ${boy.name} (${boy.email}) - ${boy.isBlocked ? 'Blocked' : 'Active'}`);
    });
    console.log('');
    
    // Test 2: Check a specific delivery boy account in database
    console.log('2. Checking database record for test delivery boy...');
    const testEmail = 'test.created@example.com'; // This should be the one we created earlier
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('   ❌ User not found in database');
      return;
    }
    
    console.log('   ✅ User found in database');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Password hash length:', user.password?.length);
    console.log('   Is Blocked:', user.isBlocked);
    console.log('');
    
    // Test 3: Test password verification directly
    console.log('3. Testing password verification directly...');
    const testPassword = 'createddelivery123';
    const isMatch = await user.matchPassword(testPassword);
    console.log('   Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('   ❌ Password verification failed');
      return;
    }
    
    console.log('   ✅ Password verification successful');
    console.log('');
    
    // Test 4: Test login via API
    console.log('4. Testing login via API...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: testEmail,
        password: testPassword
      });
      
      console.log('   ✅ API login successful!');
      console.log('   Status:', loginResponse.status);
      console.log('   Token present:', !!loginResponse.data.token);
      console.log('   User ID:', loginResponse.data.user?.id);
      console.log('   User role:', loginResponse.data.user?.role);
      
    } catch (apiError) {
      console.log('   ❌ API login failed');
      if (apiError.response) {
        console.log('   Status:', apiError.response.status);
        console.log('   Data:', apiError.response.data);
        console.log('   Headers:', apiError.response.headers);
      } else {
        console.log('   Error:', apiError.message);
      }
      return;
    }
    
    console.log('\n🎉 ALL DIAGNOSTIC TESTS PASSED');
    console.log('If you\'re still having login issues, the problem is likely in the frontend detection logic.');
    
  } catch (error) {
    console.log('❌ Diagnostic test failed with error:', error.message);
    console.log('Stack:', error.stack);
  } finally {
    mongoose.connection.close();
  }
}

diagnosticTest();