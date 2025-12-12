require('dotenv').config();
const axios = require('axios');

// Verify delivery boy login with predefined accounts
const verifyDeliveryLogin = async () => {
  try {
    console.log('=== Verifying Delivery Boy Login ===');
    
    const predefinedDeliveryBoys = [
      { email: 'mike.delivery@fabrico.com', password: 'delivery123' },
      { email: 'sarah.delivery@fabrico.com', password: 'delivery123' },
      { email: 'tom.delivery@fabrico.com', password: 'delivery123' }
    ];
    
    for (const deliveryBoy of predefinedDeliveryBoys) {
      console.log(`\nTesting login for ${deliveryBoy.email}...`);
      
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: deliveryBoy.email,
          password: deliveryBoy.password
        });
        
        console.log(`✅ Login successful for ${deliveryBoy.email}`);
        console.log(`- Token: ${response.data.token.substring(0, 20)}...`);
        console.log(`- User role: ${response.data.user.role}`);
        console.log(`- User name: ${response.data.user.name}`);
        
        // Verify role is correct
        if (response.data.user.role === 'deliveryBoy') {
          console.log('✅ Role verification passed');
        } else {
          console.log(`❌ Role verification failed. Expected: deliveryBoy, Got: ${response.data.user.role}`);
        }
        
        return { email: deliveryBoy.email, password: deliveryBoy.password }; // Return first successful login
      } catch (error) {
        console.log(`❌ Login failed for ${deliveryBoy.email}`);
        if (error.response) {
          console.log(`- Status: ${error.response.status}`);
          console.log(`- Message: ${JSON.stringify(error.response.data)}`);
        } else {
          console.log(`- Error: ${error.message}`);
        }
      }
    }
    
    console.log('\n❌ All predefined delivery boy accounts failed to login');
    return null;
    
  } catch (err) {
    console.error('Error in verification:', err.message);
    return null;
  }
};

verifyDeliveryLogin().then(result => {
  if (result) {
    console.log('\n🎉 SUCCESS: You can login as a delivery boy using:');
    console.log(`   Email: ${result.email}`);
    console.log(`   Password: ${result.password}`);
    console.log('\nGo to http://localhost:5173/ and use these credentials to login.');
  } else {
    console.log('\n❌ FAILED: None of the predefined delivery boy accounts work.');
    console.log('Please check if the backend server is running properly.');
  }
});