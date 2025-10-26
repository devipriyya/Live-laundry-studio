const axios = require('axios');

async function testCompleteUserFlow() {
  console.log('Testing complete user flow...');
  
  try {
    // 1. Register a new user
    const email = `flowtest${Date.now()}@example.com`;
    console.log('\n1. Registering user with email:', email);
    
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Flow Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('Registration successful. Token:', registerResponse.data.token.substring(0, 20) + '...');
    
    // 2. Login as the user
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: 'TestPassword123!'
    });
    
    const userToken = loginResponse.data.token;
    console.log('Login successful. Token:', userToken.substring(0, 20) + '...');
    
    // 3. Access user profile
    console.log('\n3. Accessing user profile...');
    const profileResponse = await axios.get('http://localhost:5000/api/profile', {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    console.log('Profile accessed successfully:', {
      name: profileResponse.data.name,
      email: profileResponse.data.email,
      role: profileResponse.data.role
    });
    
    // 4. Update user profile
    console.log('\n4. Updating user profile...');
    const updateResponse = await axios.put('http://localhost:5000/api/profile', {
      phone: '+1 234 567 8900',
      addresses: [
        {
          type: 'Home',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          isDefault: true
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    console.log('Profile updated successfully:', updateResponse.data.message);
    
    // 5. Verify updated profile
    console.log('\n5. Verifying updated profile...');
    const updatedProfileResponse = await axios.get('http://localhost:5000/api/profile', {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    
    console.log('Updated profile:', {
      name: updatedProfileResponse.data.name,
      email: updatedProfileResponse.data.email,
      phone: updatedProfileResponse.data.phone,
      addresses: updatedProfileResponse.data.addresses
    });
    
    console.log('\n✅ Complete user flow test passed!');
    
  } catch (error) {
    console.error('❌ Error in user flow test:', error.response?.data || error.message);
  }
}

testCompleteUserFlow();