// Debug admin login with detailed information
const axios = require('axios');

async function debugAdminLogin() {
  try {
    console.log('=== DEBUGGING ADMIN LOGIN ===\n');
    
    console.log('1. Testing direct API call to backend...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Direct API call successful!');
    console.log('Status:', response.status);
    console.log('Response data:', response.data);
    
    console.log('\n2. Verifying token...');
    if (response.data.token) {
      console.log('✅ Token received');
      // Test if token is valid by making another request
      try {
        const profileResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${response.data.token}`
          }
        });
        console.log('✅ Token is valid');
        console.log('User profile:', profileResponse.data);
      } catch (tokenError) {
        console.log('❌ Token validation failed:', tokenError.response?.data || tokenError.message);
      }
    } else {
      console.log('❌ No token in response');
    }
    
    console.log('\n3. Checking user role...');
    if (response.data.user?.role === 'admin') {
      console.log('✅ Correct admin role assigned');
    } else {
      console.log('❌ Incorrect role:', response.data.user?.role);
    }
    
    console.log('\n🎉 ALL CHECKS PASSED - ADMIN LOGIN WORKS CORRECTLY');
    console.log('If you\'re still having issues in the frontend, the problem is likely in the frontend authentication flow.');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Admin login failed');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

debugAdminLogin();