const axios = require('axios');

async function testFirebaseLogin() {
  try {
    console.log('Testing Firebase login functionality...\n');
    
    // Test Firebase login
    const response = await axios.post('http://localhost:5000/api/auth/firebase-login', {
      uid: 'test-firebase-uid-' + Date.now(),
      email: 'testfirebase@example.com',
      name: 'Firebase Test User'
    });
    
    console.log('Firebase login response:', response.status, response.data);
    
    // Test profile update with the token
    if (response.data.token) {
      console.log('\nTesting profile update with Firebase login token...');
      const profileResponse = await axios.put('http://localhost:5000/api/profile', {
        name: 'Updated Firebase Test User',
        phone: '+1 234 567 8900',
        dateOfBirth: '1990-01-01',
        gender: 'male',
        bio: 'This is a test user for Firebase login'
      }, {
        headers: {
          'Authorization': `Bearer ${response.data.token}`
        }
      });
      
      console.log('Profile update response:', profileResponse.status, profileResponse.data.message);
      console.log('Updated user data:', profileResponse.data.user);
    }
    
    console.log('\n✅ Firebase login and profile update test passed!');
    
  } catch (error) {
    console.error('❌ Error in Firebase login test:', error.response?.data || error.message);
  }
}

testFirebaseLogin();