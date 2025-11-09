import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(true);

  // Debug logging
  console.log('AuthContext: Initializing AuthProvider');
  console.log('AuthContext: Initial user state:', user);
  console.log('AuthContext: Initial loading state:', loading);

  // Function to verify user exists in backend database
  const verifyUserInDatabase = async (userData) => {
    try {
      console.log('AuthContext: Verifying user in database:', userData);
      // Try to get user details from backend
      const response = await api.get(`/auth/users/${userData.uid}`);
      console.log('AuthContext: User verification response:', response.data);
      if (response.data) {
        return {
          ...userData,
          ...response.data,
          id: response.data._id || response.data.id
        };
      }
      return userData;
    } catch (error) {
      console.warn('AuthContext: User not found in backend database:', error);
      return userData;
    }
  };

  useEffect(() => {
    console.log('AuthContext: useEffect triggered');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Firebase user state changed:', firebaseUser);
      if (firebaseUser) {
        let userRole = 'customer';
        let needsToken = false;
        
        if (firebaseUser.email === 'admin@gmail.com') {
          userRole = 'admin';
          needsToken = true;
          console.log('AuthContext: Admin user detected');
        } else if (firebaseUser.email && firebaseUser.email.includes('delivery')) {
          userRole = 'deliveryBoy';
          needsToken = true;
          console.log('AuthContext: Delivery boy detected');
        }
        
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          role: userRole,
        };
        
        // For all users (including regular customers), ensure we have a valid token for API calls
        let currentToken = localStorage.getItem('token');
        console.log('AuthContext: Current token in localStorage:', currentToken);
        console.log('AuthContext: Current token length:', currentToken ? currentToken.length : 0);
        
        if (!currentToken) {
          console.log('AuthContext: No token found, attempting to exchange Firebase credentials for JWT');
          try {
            // Exchange Firebase user for backend JWT token
            const response = await api.post('/auth/firebase-login', {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
            });
            console.log('AuthContext: Firebase login response:', response.data);
            if (response.data.token) {
              currentToken = response.data.token;
              console.log('AuthContext: Setting token in localStorage:', currentToken);
              console.log('AuthContext: Token to set length:', currentToken.length);
              localStorage.setItem('token', currentToken);
              // Dispatch a custom event to notify other components that the token has been set
              window.dispatchEvent(new CustomEvent('tokenReady', { detail: { token: currentToken } }));
            }
          } catch (error) {
            console.log('AuthContext: Firebase login failed, using demo token:', error);
            // Fallback to demo token
            currentToken = 'demo-jwt-token-' + Date.now();
            console.log('AuthContext: Setting demo token in localStorage:', currentToken);
            localStorage.setItem('token', currentToken);
            // Dispatch a custom event to notify other components that the token has been set
            window.dispatchEvent(new CustomEvent('tokenReady', { detail: { token: currentToken } }));
          }
        } else {
          // If we have a token, verify it's still valid
          try {
            // We could verify the token here, but for now we'll just log it
            console.log('AuthContext: Using existing token');
          } catch (error) {
            console.log('AuthContext: Existing token invalid, removing it');
            localStorage.removeItem('token');
            // Try to get a new token
            try {
              const response = await api.post('/auth/firebase-login', {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
              });
              if (response.data.token) {
                currentToken = response.data.token;
                localStorage.setItem('token', currentToken);
                window.dispatchEvent(new CustomEvent('tokenReady', { detail: { token: currentToken } }));
              }
            } catch (refreshError) {
              console.log('AuthContext: Failed to refresh token:', refreshError);
            }
          }
        }
        
        const verifiedUser = await verifyUserInDatabase(userData);
        console.log('AuthContext: Setting user data:', verifiedUser);
        setUser(verifiedUser);
        localStorage.setItem('user', JSON.stringify(verifiedUser));
        setLoading(false);
      } else {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        console.log('AuthContext: No Firebase user, checking stored session', { storedToken, storedUser });
        if (storedToken && storedUser) {
          console.log('AuthContext: Preserving stored user session');
          setUser(JSON.parse(storedUser));
        } else {
          console.log('AuthContext: No user, clearing state');
          setUser(null);
          localStorage.removeItem('user');
        }
        setLoading(false);
      }
    });
    
    // Set loading to false after a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (loading) {
        console.log('AuthContext: Loading timeout reached');
        setLoading(false);
      }
    }, 2000);
    
    return () => {
      console.log('AuthContext: Cleaning up');
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const logout = () => {
    console.log('AuthContext: Logging out');
    auth.signOut();
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

  const deliveryBoyDemoLogin = async () => {
    console.log("AuthContext: deliveryBoyDemoLogin called");
    
    // Option 1: Use real database login
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'mike.delivery@fabrico.com',
          password: 'delivery123'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        const deliveryBoyUser = {
          uid: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
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

  // Debug logging
  console.log('AuthContext: Rendering children with user:', user, 'loading:', loading);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, demoLogin, adminDemoLogin, deliveryBoyDemoLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};