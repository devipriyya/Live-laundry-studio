// Test direct admin login through Axios
const axios = require('axios');

async function testDirectAdminLogin() {
  console.log('=== DIRECT ADMIN LOGIN TEST ===\n');
  
  try {
    console.log('Testing direct API call to backend...');
    console.log('URL: http://localhost:5000/api/auth/login');
    console.log('Data: { email: "admin@gmail.com", password: "admin123" }');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    console.log('✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Token present:', !!response.data.token);
    console.log('User role:', response.data.user?.role);
    console.log('Full response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.user?.role === 'admin') {
      console.log('✅ Admin role correctly assigned');
    } else {
      console.log('❌ Wrong role assigned');
    }
    
  } catch (error) {
    console.log('❌ FAILED!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else {
      console.log('Error:', error.message);
    }
  }
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('If this test passes but frontend fails, the issue is in the frontend code.');
  console.log('If this test fails, there may be an issue with the backend or credentials.');
}

testDirectAdminLogin();