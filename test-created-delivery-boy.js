// Test script to check if delivery boy accounts created through admin panel work
import axios from 'axios';

async function testCreatedDeliveryBoy() {
  try {
    console.log('Testing delivery boy login with created account...');
    
    // First, login as admin to get token
    console.log('Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('Admin login successful');
    
    // Create a new delivery boy
    console.log('Creating test delivery boy...');
    const deliveryBoyData = {
      name: 'Test Created Delivery Boy',
      email: 'test.created@example.com',
      phone: '5551234567',
      password: 'createddelivery123'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Delivery boy created successfully:', createResponse.data);
    
    // Now test login with the created delivery boy
    console.log('Testing login with created delivery boy...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test.created@example.com',
      password: 'createddelivery123'
    });
    
    console.log('Login successful!');
    console.log('Status:', loginResponse.status);
    console.log('Data:', loginResponse.data);
    
    if (loginResponse.data.token) {
      console.log('Token received:', loginResponse.data.token.substring(0, 20) + '...');
    }
    
    if (loginResponse.data.user) {
      console.log('User role:', loginResponse.data.user.role);
    }
    
    // Clean up - delete the test user
    console.log('Cleaning up test user...');
    // We would need to implement a delete endpoint for this
    
  } catch (error) {
    console.log('Test failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCreatedDeliveryBoy();