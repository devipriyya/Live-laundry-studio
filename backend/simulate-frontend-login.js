require('dotenv').config();
const axios = require('axios');

// Simulate the exact frontend login process
const simulateFrontendLogin = async () => {
  try {
    console.log('=== Simulating Frontend Login Process ===');
    
    // Step 1: Try Firebase login first (this will fail for delivery boys)
    console.log('\n1. Simulating Firebase login (will fail for delivery boys)...');
    try {
      // This would normally use Firebase SDK, but we'll skip it since it will fail
      console.log('Firebase login would fail for delivery boys - skipping');
    } catch (firebaseError) {
      console.log('Firebase login failed (expected for delivery boys)');
    }
    
    // Step 2: Try backend login for delivery boys
    console.log('\n2. Simulating backend login for delivery boy...');
    
    // First, create a test delivery boy
    console.log('  a. Creating test delivery boy...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    
    // Create delivery boy
    const deliveryBoyData = {
      name: 'Frontend Simulation Delivery Boy',
      email: 'frontend.simulation@example.com',
      phone: '4445556666',
      password: 'testpassword123'
    };
    
    await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('  b. Attempting delivery boy login...');
    const deliveryLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'frontend.simulation@example.com',
      password: 'testpassword123'
    });
    
    console.log('✅ Delivery boy login successful!');
    console.log('- Token length:', deliveryLoginResponse.data.token.length);
    console.log('- User ID:', deliveryLoginResponse.data.user.id);
    console.log('- User email:', deliveryLoginResponse.data.user.email);
    console.log('- User role:', deliveryLoginResponse.data.user.role);
    
    // Verify role is correct
    if (deliveryLoginResponse.data.user.role === 'deliveryBoy') {
      console.log('✅ Role verification passed');
    } else {
      console.log('❌ Role verification failed. Expected: deliveryBoy, Got:', deliveryLoginResponse.data.user.role);
    }
    
    // Test with wrong password
    console.log('\n3. Testing with wrong password...');
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'frontend.simulation@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ Wrong password test failed - should have gotten an error');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Wrong password correctly rejected');
      } else {
        console.log('❓ Unexpected error with wrong password:', error.response?.status || error.message);
      }
    }
    
  } catch (err) {
    console.error('Error in frontend simulation:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  } finally {
    // Clean up - delete the test user
    const mongoose = require('mongoose');
    const User = require('./src/models/User');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteOne({ email: 'frontend.simulation@example.com' });
    console.log('\n🧹 Test user deleted');
    mongoose.connection.close();
  }
};

simulateFrontendLogin();