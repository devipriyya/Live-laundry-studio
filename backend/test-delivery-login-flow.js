require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Test the complete delivery boy login flow
const testDeliveryLoginFlow = async () => {
  try {
    // First, let's check if we have a delivery boy in the database
    const deliveryBoy = await User.findOne({ role: 'deliveryBoy' });
    if (!deliveryBoy) {
      console.log('No delivery boy found in database');
      return;
    }
    
    console.log('Found delivery boy:', deliveryBoy.name, deliveryBoy.email);
    
    // Test the login endpoint
    console.log('Testing login with email:', deliveryBoy.email);
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: deliveryBoy.email,
        password: 'delivery123' // Assuming this is the password
      });
      
      console.log('Login successful!');
      console.log('Response data:', response.data);
      console.log('User role in response:', response.data.user.role);
      
      // Check if the role matches what's expected
      if (response.data.user.role === 'deliveryBoy') {
        console.log('✓ Role is correct');
      } else {
        console.log('✗ Role mismatch. Expected: deliveryBoy, Got:', response.data.user.role);
      }
    } catch (error) {
      console.log('Login failed:');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else {
        console.log('Error:', error.message);
      }
      
      // Let's also check what's actually in the database for this user
      const dbUser = await User.findById(deliveryBoy._id);
      console.log('Database user role:', dbUser.role);
      console.log('Database user password (hashed):', dbUser.password);
    }
  } catch (err) {
    console.error('Error testing delivery login flow:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

testDeliveryLoginFlow();