const axios = require('axios');

async function testProfileUpdate() {
  try {
    console.log('Testing profile update functionality...\n');
    
    // First, let's register a test user with a unique email
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('Registration successful. Token:', registerResponse.data.token.substring(0, 20) + '...');
    
    const token = registerResponse.data.token;
    
    // Now let's update the profile
    console.log('\nUpdating profile...');
    const updateResponse = await axios.put('http://localhost:5000/api/profile', {
      name: 'Updated Test User',
      phone: '+1 234 567 8900',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      bio: 'This is a test user for profile updates',
      addresses: [
        {
          type: 'Home',
          name: 'Home Address',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          isDefault: true
        }
      ],
      preferences: {
        fabricCare: 'gentle',
        detergentType: 'eco-friendly',
        starchLevel: 'light',
        specialInstructions: 'Handle with care',
        notifications: {
          email: true,
          sms: true,
          orderUpdates: true,
          promotions: false
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile update response:', updateResponse.status, updateResponse.data.message);
    console.log('Updated user data:', updateResponse.data.user);
    
    console.log('\n✅ Profile update test passed!');
    
  } catch (error) {
    console.error('❌ Error in profile update test:', error.response?.data || error.message);
  }
}

testProfileUpdate();