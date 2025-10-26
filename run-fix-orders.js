const axios = require('axios');

async function fixOrderUserAssociations() {
  try {
    console.log('🔧 Starting order-user association fix via API...');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Call the fix endpoint
    console.log('🔧 Calling fix endpoint...');
    const fixResponse = await axios.post('http://localhost:5000/api/orders/fix-user-associations', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Fix operation completed');
    console.log('📊 Result:', fixResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

fixOrderUserAssociations();