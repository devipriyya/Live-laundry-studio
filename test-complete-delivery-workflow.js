// Complete test for the entire delivery boy workflow
const axios = require('axios');

async function testCompleteWorkflow() {
  try {
    console.log('=== COMPLETE DELIVERY BOY WORKFLOW TEST ===\n');
    
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const adminLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful\n');
    
    // Step 2: Create a delivery boy with a non-standard email
    console.log('2. Creating delivery boy with email: john@example.com');
    const deliveryBoyData = {
      name: 'John Smith',
      email: 'john@example.com',  // Note: No "delivery" in email
      phone: '5551234567',
      password: 'deliverypassword123'
    };
    
    const createResponse = await axios.post('http://localhost:5000/api/auth/delivery-boys', deliveryBoyData, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Delivery boy created successfully');
    console.log('   ID:', createResponse.data.deliveryBoy.id);
    console.log('   Name:', createResponse.data.deliveryBoy.name);
    console.log('   Email:', createResponse.data.deliveryBoy.email);
    console.log('   Role:', createResponse.data.deliveryBoy.role);
    console.log('');
    
    // Step 3: Test login with the created delivery boy
    console.log('3. Testing login with created delivery boy...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john@example.com',
      password: 'deliverypassword123'
    });
    
    console.log('✅ Delivery boy login successful!');
    console.log('   Token present:', !!loginResponse.data.token);
    console.log('   User ID:', loginResponse.data.user.id);
    console.log('   User name:', loginResponse.data.user.name);
    console.log('   User email:', loginResponse.data.user.email);
    console.log('   User role:', loginResponse.data.user.role);
    console.log('');
    
    // Step 4: Verify the user has the correct role
    if (loginResponse.data.user.role === 'deliveryBoy') {
      console.log('🎉 SUCCESS: Delivery boy has correct role assigned');
    } else {
      console.log('❌ FAILURE: Delivery boy does not have correct role');
      return;
    }
    
    console.log('\n=== ALL TESTS PASSED ===');
    console.log('Delivery boy accounts created through Admin panel now work correctly!');
    
  } catch (error) {
    console.log('❌ TEST FAILED');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else {
      console.log('   Error:', error.message);
    }
  }
}

testCompleteWorkflow();