const axios = require('axios');

async function testDashboardStats() {
  try {
    console.log('Testing dashboard stats endpoint...');
    
    // First, login as admin to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin login successful');
    
    // Test the dashboard stats endpoint
    const statsResponse = await axios.get('http://localhost:5000/api/auth/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('Dashboard stats:', statsResponse.data);
    
  } catch (error) {
    console.error('Error testing dashboard stats:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testDashboardStats();