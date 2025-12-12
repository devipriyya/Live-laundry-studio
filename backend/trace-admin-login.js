// Trace admin login process step by step
const axios = require('axios');

async function traceAdminLogin() {
  try {
    console.log('=== TRACING ADMIN LOGIN PROCESS ===\n');
    
    console.log('Step 1: Checking if admin account exists in database...');
    // First, let's see what users exist
    try {
      // We'll try to get all users (this might fail if we don't have admin rights)
      console.log('Attempting to fetch users list...');
      
      // Try with admin credentials
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@gmail.com',
        password: 'admin123'
      });
      
      console.log('✅ Admin login successful');
      console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
      
      // Try to get users with admin token
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/auth/users', {
          headers: {
            'Authorization': `Bearer ${loginResponse.data.token}`
          }
        });
        
        console.log('✅ Users list fetched successfully');
        console.log('Total users found:', usersResponse.data.users?.length || 0);
        
        // Find admin user
        const adminUser = usersResponse.data.users?.find(user => user.email === 'admin@gmail.com');
        if (adminUser) {
          console.log('✅ Admin user found in database:');
          console.log('  ID:', adminUser._id);
          console.log('  Name:', adminUser.name);
          console.log('  Role:', adminUser.role);
          console.log('  Email:', adminUser.email);
        } else {
          console.log('❌ Admin user not found in users list');
        }
      } catch (usersError) {
        console.log('ℹ️ Cannot fetch users list (expected if not admin route)');
      }
      
    } catch (loginError) {
      console.log('❌ Admin login failed during tracing');
      if (loginError.response) {
        console.log('Status:', loginError.response.status);
        console.log('Data:', loginError.response.data);
      } else {
        console.log('Error:', loginError.message);
      }
      return;
    }
    
    console.log('\nStep 2: Testing different admin credential combinations...');
    
    const testCases = [
      { email: 'admin@gmail.com', password: 'admin123', description: 'Standard admin credentials' },
      { email: 'ADMIN@GMAIL.COM', password: 'admin123', description: 'Uppercase email' },
      { email: 'admin@gmail.com', password: 'ADMIN123', description: 'Uppercase password' },
      { email: 'Admin@gmail.com', password: 'admin123', description: 'Mixed case email' },
      { email: 'admin@gmail.com', password: ' admin123 ', description: 'Password with spaces' },
      { email: ' admin@gmail.com ', password: 'admin123', description: 'Email with spaces' }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\nTest ${i + 1}: ${testCase.description}`);
      console.log(`  Email: "${testCase.email}"`);
      console.log(`  Password: "${testCase.password}"`);
      
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: testCase.email,
          password: testCase.password
        });
        
        console.log(`  ✅ SUCCESS - Role: ${response.data.user?.role}`);
      } catch (error) {
        if (error.response) {
          console.log(`  ❌ FAILED - ${error.response.data.message || error.response.statusText}`);
        } else {
          console.log(`  ❌ FAILED - ${error.message}`);
        }
      }
    }
    
    console.log('\nStep 3: Checking for account blocking...');
    
    // Test with a deliberately wrong password to see if account gets blocked
    try {
      await axios.post('http://localhost:5000/api/auth/login', {
        email: 'admin@gmail.com',
        password: 'wrongpassword'
      });
      console.log('❌ Unexpected success with wrong password');
    } catch (error) {
      if (error.response) {
        console.log('✅ Wrong password correctly rejected');
        console.log('Message:', error.response.data.message);
      }
    }
    
    console.log('\n=== TRACE COMPLETE ===');
    console.log('If all tests failed, there might be an issue with:');
    console.log('1. The admin account being blocked');
    console.log('2. Database connection issues');
    console.log('3. Backend code changes affecting admin login');
    
  } catch (error) {
    console.log('❌ Unexpected error during trace:', error.message);
  }
}

traceAdminLogin();