import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Debug logging
  console.log('ProtectedRoute: Rendering with user:', user, 'loading:', loading);
  console.log('ProtectedRoute: Required roles:', roles);

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('ProtectedRoute: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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