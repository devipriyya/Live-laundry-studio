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
          userRole = 'delivery';
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
  };

  const demoLogin = () => {
    const demoUser = {
      uid: 'demo-user',
      email: 'demo@fabrico.com',
      name: 'Demo User',
      role: 'customer',
    };
    setUser(demoUser);
    localStorage.setItem('user', JSON.stringify(demoUser));
  };

  const adminDemoLogin = () => {
    console.log("AuthContext: adminDemoLogin called");
    const adminUser = {
      uid: 'admin-demo-user',
      email: 'admin@gmail.com',
      name: 'Admin User',
      role: 'admin',
    };
    console.log("AuthContext: Setting admin user:", adminUser);
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    console.log("AuthContext: Admin user set successfully");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, demoLogin, adminDemoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
