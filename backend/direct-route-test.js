// Direct test of the delivery boy creation route
const axios = require('axios');

async function testDeliveryBoyRoute() {
  try {
    console.log('=== Testing Delivery Boy Creation Route Directly ===');
    
    // First, login as admin to get token
    console.log('1. Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Test the delivery boy creation endpoint directly
    console.log('\n2. Testing delivery boy creation endpoint...');
    const deliveryBoyData = {
      name: 'Route Test Delivery Boy',
      email: 'route.test2@example.com', // Changed email to avoid conflict
      phone: '5551112233',
      password: 'routetest123'
    };
    
    console.log('Sending request with data:', deliveryBoyData);
    
    const response = await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Delivery boy creation successful!');
    console.log('Response:', response.data);
    
    // Now test login
    console.log('\n3. Testing login with created delivery boy...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'route.test2@example.com',
      password: 'routetest123'
    });
    
    console.log('✅ Login successful!');
    console.log('Login response:', loginResponse.data);
    
  } catch (error) {
    console.log('❌ Test failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else {
      console.log('Error:', error.message);
      console.log('Stack:', error.stack);
    }
  }
}

testDeliveryBoyRoute();