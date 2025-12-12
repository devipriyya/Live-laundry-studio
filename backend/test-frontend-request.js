require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test simulating the exact frontend request
const testFrontendRequest = async () => {
  try {
    console.log('Testing frontend request simulation...');
    
    // This simulates what the frontend is sending
    const frontendData = {
      name: 'Frontend Test Delivery Boy',
      email: 'frontend.test@example.com',
      phone: '0987654321',
      password: 'delivery123',
      isBlocked: false  // Extra field that shouldn't affect the process
    };
    
    console.log('Frontend data being sent:', frontendData);
    
    // Make a request to the backend API (simulating the frontend)
    const response = await axios.post('http://localhost:5000/api/auth/delivery-boys', frontendData, {
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real scenario, there would also be authorization headers
      }
    });
    
    console.log('API Response:', response.data);
    
    // Now check if the user was created correctly
    const createdUser = await User.findOne({ email: 'frontend.test@example.com' });
    console.log('Created user password:', createdUser.password);
    console.log('Password length:', createdUser.password.length);
    
    // Test password verification
    console.log('\nTesting password verification...');
    const isMatch = await createdUser.matchPassword('delivery123');
    console.log('Password match result:', isMatch);
    
    // Clean up - delete the test user
    await User.deleteOne({ email: 'frontend.test@example.com' });
    console.log('Test user deleted');
    
  } catch (err) {
    console.error('Error testing frontend request:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    }
  } finally {
    mongoose.connection.close();
  }
};

testFrontendRequest();