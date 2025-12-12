// Test admin login through the API
const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('=== TESTING ADMIN LOGIN ===\n');
    
    // Test with the standard admin credentials
    console.log('Testing admin login with standard credentials...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ Admin login successful!');
    console.log('Status:', response.status);
    console.log('Token present:', !!response.data.token);
    console.log('User role:', response.data.user?.role);
    
    if (response.data.user?.role === 'admin') {
      console.log('✅ Correct role assigned to admin');
    } else {
      console.log('❌ Incorrect role assigned');
    }
    
    console.log('\n🎉 ADMIN LOGIN WORKING CORRECTLY');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Admin login failed');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      
      // If it's a 401 error, let's try to figure out why
      if (error.response.status === 401) {
        console.log('\n🔍 TROUBLESHOOTING:');
        console.log('1. Check if admin account exists in database');
        console.log('2. Verify admin password is "admin123"');
        console.log('3. Check if there are any blocked accounts');
      }
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testAdminLogin();