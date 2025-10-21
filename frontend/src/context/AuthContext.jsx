import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('AuthContext: Firebase user state changed:', firebaseUser);
      if (firebaseUser) {
        // Determine user role based on email or other criteria
        let userRole = 'customer'; // default role
        
        // Check if user is admin (you can modify this logic as needed)
        if (firebaseUser.email === 'admin@gmail.com') {
          userRole = 'admin';
          console.log('AuthContext: Admin user detected');
        } else if (firebaseUser.email && firebaseUser.email.includes('delivery')) {
          userRole = 'deliveryBoy';
          console.log('AuthContext: Delivery boy detected');
        }
        
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          role: userRole,
        };
        console.log('AuthContext: Setting user data:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        console.log('AuthContext: No user, clearing state');
        setUser(null);
        localStorage.removeItem('user');
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = () => {
    auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const demoLogin = async () => {
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
    
    try {
      // Try to login with real credentials first
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@gmail.com',
          password: 'admin123'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("AuthContext: Real admin login successful", data);
        localStorage.setItem('token', data.token);
        
        const adminUser = {
          uid: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
        };
        console.log("AuthContext: Setting admin user:", adminUser);
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        console.log("AuthContext: Admin user set successfully");
        return;
      }
    } catch (error) {
      console.log('Real login failed, using demo mode:', error);
    }
    
    // Fallback to demo mode if real login fails
    const adminUser = {
      uid: 'admin-demo-user',
      email: 'admin@gmail.com',
      name: 'Admin User',
      role: 'admin',
    };
    console.log("AuthContext: Setting admin user (demo):", adminUser);
    
    // Generate a demo JWT token for backend compatibility
    const demoToken = 'demo-jwt-token-' + Date.now();
    localStorage.setItem('token', demoToken);
    
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    console.log("AuthContext: Admin user set successfully (demo)");
  };

  const deliveryBoyDemoLogin = async () => {
    console.log("AuthContext: deliveryBoyDemoLogin called");
    
    // Option 1: Use real database login
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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

  return (
    <AuthContext.Provider value={{ user, setUser, logout, demoLogin, adminDemoLogin, deliveryBoyDemoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};