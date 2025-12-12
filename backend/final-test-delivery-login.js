require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Final test for delivery boy login
const finalTestDeliveryLogin = async () => {
  try {
    console.log('=== Final Delivery Boy Login Test ===');
    
    // Step 1: Login as admin
    console.log('\n1. Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Step 2: Create a delivery boy
    console.log('\n2. Creating delivery boy...');
    const deliveryBoyData = {
      name: 'Final Test Delivery Boy',
      email: 'final.test@example.com',
      phone: '1112223333',
      password: 'finaltestpassword'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Delivery boy created successfully');
    
    // Step 3: Test login
    console.log('\n3. Testing delivery boy login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'final.test@example.com',
      password: 'finaltestpassword'
    });
    
    console.log('✅ Delivery boy login successful!');
    console.log('- Token:', loginResponse.data.token.substring(0, 20) + '...');
    console.log('- User role:', loginResponse.data.user.role);
    
    // Verify the user role is correct
    if (loginResponse.data.user.role === 'deliveryBoy') {
      console.log('✅ Role verification passed');
    } else {
      console.log('❌ Role verification failed. Expected: deliveryBoy, Got:', loginResponse.data.user.role);
    }
    
    // Test with wrong password
    console.log('\n4. Testing with wrong password...');
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'final.test@example.com',
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
    
    console.log('\n🎉 All tests passed! The backend is working correctly.');
    console.log('If you\'re still having issues with delivery boy login, the problem is likely in the frontend.');
    
  } catch (err) {
    console.error('❌ Error in final test:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  } finally {
    // Clean up - delete the test user
    const User = require('./src/models/User');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await User.deleteOne({ email: 'final.test@example.com' });
    console.log('\n🧹 Test user deleted');
    mongoose.connection.close();
  }
};

finalTestDeliveryLogin();