const axios = require('axios');

async function testRegisterJeevaa() {
  try {
    console.log('Attempting to register user with email: jeevaa@gmail.com');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Jeevaa Test User',
      email: 'jeevaa@gmail.com',
      password: 'TestPassword123!',
      role: 'customer'
    });
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
    
    // Now let's verify the user exists in the database
    console.log('\nVerifying user in database...');
    const verifyResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'jeevaa@gmail.com',
      password: 'TestPassword123!'
    });
    
    console.log('Login successful!');
    console.log('User verified:', verifyResponse.data.user);
    
  } catch (error) {
    if (error.response) {
      console.error('Registration failed with status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegisterJeevaa();