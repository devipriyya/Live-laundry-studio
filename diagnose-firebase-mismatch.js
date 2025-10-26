const axios = require('axios');

async function diagnoseFirebaseMismatch() {
  console.log('Diagnosing Firebase-MongoDB mismatch...\n');
  
  try {
    // Test 1: Check if backend is responsive
    console.log('1. Testing backend connectivity...');
    try {
      const healthCheck = await axios.get('http://localhost:5000/api/auth/users');
      console.log('   ✅ Backend is responsive (but requires authentication)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('   ✅ Backend is responsive but requires authentication');
      } else {
        console.log('   ❌ Backend connectivity issue:', error.message);
        return;
      }
    }
    
    // Test 2: Try a registration that should fail
    console.log('\n2. Testing registration with intentional duplicate...');
    const email = `test${Date.now()}@example.com`;
    
    // First registration
    const firstResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    console.log('   ✅ First registration successful');
    
    // Second registration (should fail)
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: email,
        password: 'TestPassword123!',
        role: 'customer'
      });
      console.log('   ❌ Unexpected success on duplicate registration');
    } catch (error) {
      console.log('   ✅ Expected failure on duplicate registration');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message);
    }
    
    // Test 3: Check if we can find the user in MongoDB
    console.log('\n3. Verifying user in MongoDB...');
    const { MongoClient } = require('mongodb');
    
    try {
      const client = new MongoClient('mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
      await client.connect();
      console.log('   ✅ Connected to MongoDB');
      
      const db = client.db('ecowashdb');
      const user = await db.collection('users').findOne({ email: email });
      
      if (user) {
        console.log('   ✅ User found in MongoDB');
        console.log('   Name:', user.name);
        console.log('   Email:', user.email);
      } else {
        console.log('   ❌ User NOT found in MongoDB');
      }
      
      await client.close();
    } catch (dbError) {
      console.log('   ❌ MongoDB connection failed:', dbError.message);
    }
    
    console.log('\n4. Possible causes for Firebase-MongoDB mismatch:');
    console.log('   - Network issues preventing backend API calls');
    console.log('   - Backend server overload or downtime');
    console.log('   - Authentication middleware issues');
    console.log('   - Database connection problems');
    console.log('   - Firebase cleanup process failing');
    
  } catch (error) {
    console.error('Diagnostic error:', error.message);
  }
}

diagnoseFirebaseMismatch();