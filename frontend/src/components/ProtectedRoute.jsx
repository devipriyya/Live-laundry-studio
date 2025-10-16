import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(false);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  // Show loading spinner while checking authentication
  if (loading && !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to landing page (with login modal) if not authenticated
  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to landing page");
    return <Navigate to="/" replace />;
  }
  
  // Check role permissions
  if (roles && !roles.includes(user.role)) {
    console.log("ProtectedRoute: User role", user.role, "not in allowed roles", roles);
    return <Navigate to="/" replace />;
  }
  
  console.log("ProtectedRoute: Access granted for user", user.email, "with role", user.role);
  
  return children;
};

export default ProtectedRoute;
