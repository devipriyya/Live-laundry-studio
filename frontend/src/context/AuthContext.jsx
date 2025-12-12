import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(true);

  // Check if we have a token and user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    
    // Set loading to false after a short delay to ensure UI renders
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const logout = () => {
    console.log('AuthContext: Logging out');
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const demoLogin = async () => {
    console.log('AuthContext: Demo login called');
    const demoUser = {
      uid: 'demo-user',
      email: 'demo@fabrico.com',
      name: 'Demo User',
      role: 'customer',
    };
    
    // Generate a demo JWT token for backend compatibility
    const demoToken = 'demo-jwt-token-' + Date.now();
    localStorage.setItem('token', demoToken);
    
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
  };

  const adminDemoLogin = async () => {
    console.log("AuthContext: adminDemoLogin called");

    const adminCredentials = {
      email: 'admin@gmail.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    };

    const applyAdminSession = (token, backendUser = {}, fallbackCredentials = adminCredentials) => {
      console.log("AuthContext: Applying admin session with token:", token);
      localStorage.setItem('token', token);
      const adminUser = {
        uid: backendUser.id || backendUser._id || fallbackCredentials.uid || 'admin-demo-user',
        email: backendUser.email || fallbackCredentials.email,
        name: backendUser.name || fallbackCredentials.name,
        role: backendUser.role || fallbackCredentials.role || 'admin'
      };
      console.log("AuthContext: Setting admin user:", adminUser);
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      console.log("AuthContext: Admin user set successfully");
    };

    const tryAdminLogin = async (credentials, label) => {
      try {
        console.log(`AuthContext: Attempting ${label} login with credentials:`, credentials);
        const response = await api.post('/auth/login', {
          email: credentials.email,
          password: credentials.password
        });
        console.log(`AuthContext: ${label} login successful`, response.data);
        applyAdminSession(response.data.token, response.data.user, credentials);
        return true;
      } catch (error) {
        if (error.response) {
          console.log(`AuthContext: ${label} login failed with status`, error.response.status, error.response.data);
        } else {
          console.log(`AuthContext: ${label} login failed`, error);
        }
        return false;
      }
    };

    const tryAdminRegister = async (credentials, label) => {
      try {
        console.log(`AuthContext: Attempting ${label} registration with credentials:`, credentials);
        const response = await api.post('/auth/register', credentials);
        console.log(`AuthContext: ${label} registration successful`, response.data);
        applyAdminSession(response.data.token, response.data.user, credentials);
        return true;
      } catch (error) {
        if (error.response) {
          console.log(`AuthContext: ${label} registration failed with status`, error.response.status, error.response.data);
        } else {
          console.log(`AuthContext: ${label} registration failed`, error);
        }
        return false;
      }
    };

    const attemptWithCredentials = async (credentials, labelPrefix) => {
      if (await tryAdminLogin(credentials, `${labelPrefix} admin`)) return true;
      if (await tryAdminRegister(credentials, `${labelPrefix} admin`)) return true;
      if (await tryAdminLogin(credentials, `${labelPrefix} admin retry`)) return true;
      return false;
    };

    // Try with primary credentials first
    if (await attemptWithCredentials(adminCredentials, 'primary')) {
      console.log("AuthContext: Admin login successful with primary credentials");
      return;
    }

    // Try with unique credentials if primary fails
    const uniqueCredentials = {
      email: `admin${Date.now()}@fabrico.com`,
      password: 'admin123',
      name: 'Admin Demo',
      role: 'admin'
    };

    if (await attemptWithCredentials(uniqueCredentials, 'unique')) {
      console.log("AuthContext: Admin login successful with unique credentials");
      return;
    }

    // Fallback to demo mode if all else fails
    console.log("AuthContext: Falling back to demo admin user");
    const adminUser = {
      uid: 'admin-demo-user',
      email: adminCredentials.email,
      name: adminCredentials.name,
      role: 'admin'
    };
    const demoToken = 'demo-jwt-token-' + Date.now();
    localStorage.setItem('token', demoToken);
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    console.log("AuthContext: Demo admin user set successfully");
  };

  // Universal login function that handles all user types correctly
  const universalLogin = async (email, password) => {
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
        setUser(userData);
        
        console.log("AuthContext: User logged in successfully with role:", userData.role);
        return { success: true, role: userData.role };
      } else {
        console.log("AuthContext: Invalid response from backend");
        return { success: false, error: "Invalid response from server" };
      }
    } catch (error) {
      console.log("AuthContext: Backend authentication failed:", error);
      
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
  };

  const deliveryBoyLogin = async (email, password) => {
    console.log("AuthContext: deliveryBoyLogin called with:", { email, password });
    
    try {
      // Use backend API for delivery boy login
      console.log("AuthContext: Making API call to /auth/login");
      const response = await api.post('/auth/login', {
        email,
        password
      });
      console.log("AuthContext: API response received:", response.status, response.data);

      if (response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Store user data
        const deliveryBoyUser = {
          uid: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        };
        
        localStorage.setItem('user', JSON.stringify(deliveryBoyUser));
        setUser(deliveryBoyUser);
        
        console.log("AuthContext: Delivery boy logged in successfully");
        return { success: true };
      } else {
        console.log("AuthContext: Invalid response from server");
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.log("AuthContext: Delivery boy login failed with error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response) {
        console.log("AuthContext: Error response:", error.response.status, error.response.data);
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 403:
            errorMessage = "Access denied. You may not have delivery boy permissions.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Login failed. Please try again.";
        }
      }

      console.log("AuthContext: Delivery boy login failed:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deliveryBoyDemoLogin = async () => {
    console.log("AuthContext: deliveryBoyDemoLogin called");
    
    // Option 1: Use real database login
    try {
      const response = await api.post('/auth/login', {
        email: 'mike.delivery@fabrico.com',
        password: 'delivery123'
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        const deliveryBoyUser = {
          uid: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
        };
        setUser(deliveryBoyUser);
        localStorage.setItem('user', JSON.stringify(deliveryBoyUser));
        console.log("AuthContext: Delivery boy logged in from database");
        return;
      }
    } catch (error) {
      console.log('Database login failed, using demo mode:', error);
    }
    
    // Option 2: Fallback to demo mode if database login fails
    const deliveryBoyUser = {
      uid: 'delivery-demo-user',
      email: 'delivery@fabrico.com',
      name: 'Delivery Boy',
      role: 'deliveryBoy',
    };
    console.log("AuthContext: Setting delivery boy user:", deliveryBoyUser);
    
    // Generate a demo JWT token for backend compatibility
    const demoToken = 'demo-jwt-token-' + Date.now();
    localStorage.setItem('token', demoToken);
    
    setUser(deliveryBoyUser);
    localStorage.setItem('user', JSON.stringify(deliveryBoyUser));
    console.log("AuthContext: Delivery boy user set successfully");
  };

  // Profile functions
  const getProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return response.data;
    } catch (error) {
      console.error('AuthContext: Error fetching profile:', error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await api.put('/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update user in context and localStorage if successful
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('AuthContext: Error updating profile:', error);
      throw error;
    }
  };

  // Debug logging
  console.log('AuthContext: Rendering children with user:', user, 'loading:', loading);

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      logout, 
      demoLogin, 
      adminDemoLogin, 
      deliveryBoyLogin, 
      deliveryBoyDemoLogin, 
      universalLogin, 
      loading,
      getProfile,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};