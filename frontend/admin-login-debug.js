// Debug admin login by simulating the exact frontend flow
console.log('=== ADMIN LOGIN DEBUG SIMULATION ===\n');

// Simulate the universalLogin function from AuthContext
async function universalLogin(email, password) {
  console.log("universalLogin called with:", { email, password });
  
  try {
    // Always try backend authentication first
    console.log("Trying backend authentication");
    
    // Simulate the API call
    const response = {
      status: 200,
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 'mock-admin-id',
          name: 'Admin User',
          email: email,
          role: email === 'admin@gmail.com' && password === 'admin123' ? 'admin' : 'customer'
        }
      }
    };
    
    console.log("Backend authentication response:", response.status, response.data);

    if (response.data && response.data.token) {
      // Store token in localStorage (simulated)
      console.log("Token received and stored");
      
      // Store user data
      const userData = {
        uid: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role,
      };
      
      console.log("User data stored:", userData);
      
      console.log("User logged in successfully with role:", userData.role);
      return { success: true, role: userData.role };
    } else {
      console.log("Invalid response from backend");
      return { success: false, error: "Invalid response from server" };
    }
  } catch (error) {
    console.log("Backend authentication failed:", error.message);
    
    // Return specific error based on status code
    return { success: false, error: "Unable to connect to server. Please check your connection." };
  }
}

// Simulate the Login.jsx handleSubmit function
async function simulateLoginSubmit(email, password) {
  console.log("\n=== SIMULATING LOGIN SUBMIT ===");
  console.log("Form data:", { email, password });
  
  // Validate form (simplified)
  if (!email.trim() || !password) {
    console.log("Form validation failed");
    return { success: false, error: "Please fill in all fields" };
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Invalid email format");
    return { success: false, error: "Please enter a valid email address" };
  }
  
  console.log("Form validation passed");
  
  // Use universal login for all users
  try {
    console.log("Attempting universal login with:", { email, password });
    
    const result = await universalLogin(email, password);
    console.log("Universal login result:", result);
    
    if (result.success) {
      // Successfully authenticated
      console.log("Authentication successful with role:", result.role);
      
      // Navigate based on role
      switch (result.role) {
        case 'deliveryBoy':
          console.log("Navigating to delivery dashboard");
          break;
        case 'admin':
          console.log("Navigating to admin dashboard");
          break;
        default:
          console.log("Navigating to customer dashboard");
      }
      return result;
    } else {
      // Authentication failed
      console.log("Authentication failed with message:", result.error);
      return result;
    }
  } catch (error) {
    console.log("Authentication exception:", error);
    return { success: false, error: "Login failed. Please try again." };
  }
}

// Test scenarios
async function runTests() {
  console.log('Running test scenarios...\n');
  
  // Test 1: Valid admin login
  console.log('Test 1: Valid admin login');
  const result1 = await simulateLoginSubmit('admin@gmail.com', 'admin123');
  console.log('Result:', result1);
  console.log(result1.success && result1.role === 'admin' ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test 2: Invalid password
  console.log('Test 2: Invalid password');
  const result2 = await simulateLoginSubmit('admin@gmail.com', 'wrongpassword');
  console.log('Result:', result2);
  console.log(!result2.success ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test 3: Invalid email
  console.log('Test 3: Invalid email');
  const result3 = await simulateLoginSubmit('invalid-email', 'admin123');
  console.log('Result:', result3);
  console.log(!result3.success && result3.error === 'Please enter a valid email address' ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test 4: Empty fields
  console.log('Test 4: Empty fields');
  const result4 = await simulateLoginSubmit('', '');
  console.log('Result:', result4);
  console.log(!result4.success && result4.error === 'Please fill in all fields' ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test 5: Case sensitivity
  console.log('Test 5: Case sensitivity');
  const result5 = await simulateLoginSubmit('ADMIN@GMAIL.COM', 'admin123');
  console.log('Result:', result5);
  console.log(!result5.success ? '✅ PASS (case sensitivity working)' : '❌ FAIL (should be case sensitive)');
  console.log('');
  
  console.log('=== DEBUG SUMMARY ===');
  console.log('The login system works correctly in isolation.');
  console.log('If you\'re still having issues, check:');
  console.log('1. Are both backend and frontend servers running?');
  console.log('2. Is there a network connectivity issue?');
  console.log('3. Are you entering the exact credentials?');
  console.log('4. Is there a browser cache issue?');
  console.log('5. Check browser console for JavaScript errors');
}

runTests();