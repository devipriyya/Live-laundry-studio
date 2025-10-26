// This script will simulate what happens in the frontend during registration
const axios = require('axios');

async function debugFrontendRegistration() {
  console.log('Debugging frontend registration process...\n');
  
  // Simulate the exact steps the frontend does
  try {
    // Step 1: Register with the backend API (this is what should store the user in MongoDB)
    console.log('1. Attempting backend registration...');
    const email = `debugtest${Date.now()}@example.com`;
    
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Debug Frontend User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('   Backend registration response status:', registerResponse.status);
    console.log('   Backend registration successful!');
    console.log('   User ID:', registerResponse.data.user.id);
    console.log('   User email:', registerResponse.data.user.email);
    
    // Step 2: Verify the user was actually stored in MongoDB
    console.log('\n2. Verifying user in database...');
    const User = require('./backend/src/models/User');
    
    // Connect to database
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
    console.log('   Connected to MongoDB');
    
    // Check if user exists
    const userInDb = await User.findOne({ email: email });
    if (userInDb) {
      console.log('   ✅ User found in database!');
      console.log('   Name:', userInDb.name);
      console.log('   Email:', userInDb.email);
      console.log('   Role:', userInDb.role);
      console.log('   Created at:', userInDb.createdAt);
    } else {
      console.log('   ❌ User NOT found in database');
    }
    
    mongoose.connection.close();
    
    // Step 3: Try to login with the user
    console.log('\n3. Attempting login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: 'TestPassword123!'
    });
    
    console.log('   Login response status:', loginResponse.status);
    console.log('   Login successful!');
    
  } catch (error) {
    console.error('Error during debugging:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

debugFrontendRegistration();