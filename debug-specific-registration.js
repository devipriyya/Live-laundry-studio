const axios = require('axios');
const { MongoClient } = require('mongodb');

async function debugSpecificRegistration(emailToTest = 'testuser@example.com') {
  console.log(`Debugging registration for email: ${emailToTest}\n`);
  
  try {
    console.log('1. Attempting to register user...');
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: emailToTest,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('✅ Registration successful!');
    console.log('Status:', response.status);
    console.log('User ID:', response.data.user.id);
    console.log('User email:', response.data.user.email);
    
    // Check if user exists in database directly
    console.log('\n2. Checking if user exists in database...');
    try {
      const client = new MongoClient('mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
      await client.connect();
      console.log('Connected to MongoDB');
      
      const db = client.db('ecowashdb');
      const user = await db.collection('users').findOne({ email: emailToTest });
      
      if (user) {
        console.log('✅ User found in database!');
        console.log('Name:', user.name);
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Created at:', user.createdAt);
      } else {
        console.log('❌ User NOT found in database');
      }
      
      await client.close();
    } catch (dbError) {
      console.log('Database check failed:', dbError.message);
    }
    
    // Try to register the same user again to see what happens
    console.log('\n3. Attempting to register the same user again...');
    try {
      const duplicateResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: emailToTest,
        password: 'TestPassword123!',
        role: 'customer'
      });
      
      console.log('Unexpected: Duplicate registration succeeded');
      console.log('Status:', duplicateResponse.status);
    } catch (duplicateError) {
      console.log('Expected: Duplicate registration failed');
      console.log('Status:', duplicateError.response?.status);
      console.log('Error message:', duplicateError.response?.data?.message);
    }
    
  } catch (error) {
    console.log('❌ Registration failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);
    
    // Check if it's a "user exists" error
    if (error.response?.data?.message === 'User exists') {
      console.log('\nThis means the user already exists in the database.');
      console.log('Let\'s try to login with this user...');
      
      try {
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: emailToTest,
          password: 'TestPassword123!'
        });
        
        console.log('✅ Login successful!');
        console.log('User ID:', loginResponse.data.user.id);
        console.log('User email:', loginResponse.data.user.email);
      } catch (loginError) {
        console.log('❌ Login failed');
        console.log('Status:', loginError.response?.status);
        console.log('Error message:', loginError.response?.data?.message || loginError.message);
      }
    }
  }
}

// Test with a specific email
debugSpecificRegistration('yourtestemail2@example.com');