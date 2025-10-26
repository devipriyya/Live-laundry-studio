const axios = require('axios');

async function simulateFrontendRegistration() {
  const email = `frontendtest${Date.now()}@example.com`;
  console.log('Simulating frontend registration with email:', email);
  
  try {
    // This simulates what the frontend does - first register with backend
    console.log('\n1. Attempting backend registration...');
    const backendResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Frontend Test User',
      email: email,
      password: 'TestPassword123!',
      role: 'customer'
    });
    console.log('Backend registration response:', backendResponse.status, backendResponse.data);
    
    console.log('\nRegistration completed successfully!');
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

simulateFrontendRegistration();