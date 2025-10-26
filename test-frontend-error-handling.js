// Test the exact error handling flow in the frontend
const axios = require('axios');

async function testFrontendErrorHandling() {
  console.log('Testing frontend error handling flow...\n');
  
  try {
    console.log('1. Simulating successful Firebase registration...');
    console.log('   Firebase user created with UID: test-firebase-uid-12345');
    
    console.log('\n2. Simulating backend registration call...');
    const email = `errorhandling${Date.now()}@example.com`;
    
    try {
      // This should succeed
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Error Handling Test',
        email: email,
        password: 'TestPassword123!',
        role: 'customer',
        firebaseUid: 'test-firebase-uid-12345'
      });
      
      console.log('   ✅ Backend registration successful');
      console.log('   User ID:', response.data.user.id);
      
      // Now test what happens when backend fails
      console.log('\n3. Simulating backend failure (duplicate user)...');
      try {
        await axios.post('http://localhost:5000/api/auth/register', {
          name: 'Error Handling Test',
          email: email,
          password: 'TestPassword123!',
          role: 'customer',
          firebaseUid: 'test-firebase-uid-12345'
        });
        
        console.log('   ❌ Unexpected success');
      } catch (backendError) {
        console.log('   ✅ Backend registration failed as expected');
        console.log('   Status:', backendError.response?.status);
        console.log('   Message:', backendError.response?.data?.message);
        
        console.log('\n4. What should happen in frontend:');
        console.log('   - Show error to user: "User exists"');
        console.log('   - Delete Firebase user with UID: test-firebase-uid-12345');
        console.log('   - NOT show "Registration successful!" message');
        
        // Test the actual error handling logic
        console.log('\n5. Testing error message handling:');
        const errorMessage = backendError.response?.data?.message || "Registration failed. Please try again.";
        console.log('   Error message to show user:', errorMessage);
        
        if (errorMessage === "User exists") {
          console.log('   ✅ Correct error message');
        } else {
          console.log('   ❌ Incorrect error message');
        }
      }
    } catch (initialError) {
      console.log('   ❌ Initial registration failed:', initialError.message);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testFrontendErrorHandling();