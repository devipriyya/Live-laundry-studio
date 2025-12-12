// Comprehensive test to replicate the exact frontend login flow
console.log('=== COMPREHENSIVE LOGIN FLOW TEST ===\n');

// Import required modules
const axios = require('axios');

// Simulate the exact API configuration from frontend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add interceptors to match frontend behavior
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// Simulate localStorage
const localStorage = {
  getItem: (key) => {
    return localStorage.data[key] || null;
  },
  setItem: (key, value) => {
    localStorage.data[key] = value;
  },
  removeItem: (key) => {
    delete localStorage.data[key];
  },
  data: {}
};

// Simulate the universalLogin function exactly as in AuthContext
async function universalLogin(email, password) {
  console.log("AuthContext: universalLogin called with:", { email, password });
  
  try {
    // Always try backend authentication first
    console.log("AuthContext: Trying backend authentication");
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    console.log("AuthContext: Backend authentication response:", response.status, response.data);

    if (response.data && response.data.token) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Store user data
      const userData = {
        uid: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name,
        role: response.data.user.role,
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log("AuthContext: User logged in successfully with role:", userData.role);
      return { success: true, role: userData.role };
    } else {
      console.log("AuthContext: Invalid response from backend");
      return { success: false, error: "Invalid response from server" };
    }
  } catch (error) {
    console.log("AuthContext: Backend authentication failed:", error.message);
    
    // Return specific error based on status code
    if (error.response) {
      console.log("AuthContext: Error response:", error.response.status, error.response.data);
      switch (error.response.status) {
        case 401:
          return { success: false, error: "Invalid email or password" };
        case 403:
          return { success: false, error: "Access denied" };
        case 500:
          return { success: false, error: "Server error. Please try again later." };
        default:
          return { success: false, error: error.response.data?.message || "Login failed. Please try again." };
      }
    }
    
    // Network or other error
    return { success: false, error: "Unable to connect to server. Please check your connection." };
  }
}

// Simulate the handleSubmit function from Login.jsx
async function handleSubmit(email, password) {
  console.log("Login.jsx: handleSubmit called");
  console.log("Form data:", { email, password });

  // Validate form
  if (!email.trim()) {
    console.log("Login.jsx: Email validation failed");
    return { success: false, error: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("Login.jsx: Invalid email format");
    return { success: false, error: "Please enter a valid email address" };
  }
  
  if (!password) {
    console.log("Login.jsx: Password validation failed");
    return { success: false, error: "Password is required" };
  } else if (password.length < 6) {
    console.log("Login.jsx: Password too short");
    return { success: false, error: "Password must be at least 6 characters" };
  }

  console.log("Login.jsx: Form validation passed");

  // Set loading state
  console.log("Login.jsx: Setting loading state to true");

  // Use universal login for all users
  try {
    console.log("Login.jsx: Attempting universal login with:", { email, password });
    
    const result = await universalLogin(email, password);
    console.log("Login.jsx: Universal login result:", result);
    
    if (result.success) {
      // Successfully authenticated
      console.log("Login.jsx: Authentication successful with role:", result.role);
      
      // Navigate based on role
      switch (result.role) {
        case 'deliveryBoy':
          console.log("Login.jsx: Navigating to delivery dashboard");
          break;
        case 'admin':
          console.log("Login.jsx: Navigating to admin dashboard");
          break;
        default:
          console.log("Login.jsx: Navigating to customer dashboard");
      }
      return result;
    } else {
      // Authentication failed
      console.log("Login.jsx: Authentication failed with message:", result.error);
      return result;
    }
  } catch (error) {
    console.log("Login.jsx: Authentication exception:", error);
    return { success: false, error: "Login failed. Please try again." };
  } finally {
    console.log("Login.jsx: Setting loading state to false");
  }
}

// Test the exact admin credentials
async function testAdminLogin() {
  console.log('Testing admin login with exact credentials...\n');
  
  const email = 'admin@gmail.com';
  const password = 'admin123';
  
  const result = await handleSubmit(email, password);
  
  console.log('\nFinal result:', result);
  
  if (result.success && result.role === 'admin') {
    console.log('✅ ADMIN LOGIN SUCCESSFUL');
  } else {
    console.log('❌ ADMIN LOGIN FAILED');
    console.log('Error:', result.error);
  }
}

// Run the test
testAdminLogin().then(() => {
  console.log('\n=== TEST COMPLETE ===');
  console.log('If this test passes but the actual frontend fails,');
  console.log('there may be an issue with:');
  console.log('1. Browser cache - try clearing it');
  console.log('2. Network connectivity in the browser');
  console.log('3. JavaScript errors in the browser console');
  console.log('4. Environment variables not loaded properly');
  console.log('5. The actual form data being different from what we simulated');
});