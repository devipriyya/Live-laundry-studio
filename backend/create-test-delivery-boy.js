require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test creating a delivery boy through the API
const createTestDeliveryBoy = async () => {
  try {
    console.log('=== Creating Test Delivery Boy ===');
    
    // First, login as admin to get token
    console.log('\n1. Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Create a delivery boy using the API
    console.log('\n2. Creating delivery boy through API...');
    const deliveryBoyData = {
      name: 'API Test Delivery Boy',
      email: 'api.test@example.com',
      phone: '5551234567',
      password: 'delivery123'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Delivery boy created successfully');
    console.log('Response:', createResponse.data);
    
    // Now try to login as this delivery boy
    console.log('\n3. Testing login as delivery boy...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'api.test@example.com',
      password: 'delivery123'
    });
    
    console.log('✅ Delivery boy login successful');
    console.log('Token received:', loginResponse.data.token.length, 'characters');
    console.log('User role:', loginResponse.data.user.role);
    
  } catch (err) {
    console.error('Error:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  } finally {
    // Clean up - delete the test user
    const User = require('./src/models/User');
    await User.deleteOne({ email: 'api.test@example.com' });
    console.log('\n🧹 Test user deleted');
    mongoose.connection.close();
  }
};

createTestDeliveryBoy();