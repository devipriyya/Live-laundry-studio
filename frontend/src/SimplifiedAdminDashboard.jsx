import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SimplifiedAdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  // Debug logging
  console.log('SimplifiedAdminDashboard: Component rendering');
  console.log('SimplifiedAdminDashboard: User:', user);
  console.log('SimplifiedAdminDashboard: Loading:', loading);

  // Simple effect to set dashboard data
  useEffect(() => {
    console.log('SimplifiedAdminDashboard: useEffect triggered');
    if (user && user.role === 'admin') {
      setDashboardData({
        message: 'Welcome to the Admin Dashboard!',
        user: user,
        timestamp: new Date().toISOString()
      });
    }
  }, [user]);

  // Show loading state
  if (loading) {
    console.log('SimplifiedAdminDashboard: Showing loading state');
    return (
      <div style={{ padding: '20px', backgroundColor: '#f0f8ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <h1>Loading Admin Dashboard...</h1>
          <p>Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  // Check if user exists and has admin role
  if (!user) {
    console.log('SimplifiedAdminDashboard: No user found');
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffe4e1', minHeight: '100vh' }}>
        <h1>Access Denied</h1>
        <p>No user is currently authenticated.</p>
        <button 
          onClick={() => navigate('/admin-login-debug')}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  if (user.role !== 'admin') {
    console.log('SimplifiedAdminDashboard: User is not admin');
    return (
      <div style={{ padding: '20px', backgroundColor: '#fffacd', minHeight: '100vh' }}>
        <h1>Access Denied</h1>
        <p>You must be logged in as an administrator to access this dashboard.</p>
        <p>Current role: {user.role}</p>
        <button 
          onClick={() => navigate('/admin-login-debug')}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  // Render dashboard content
  console.log('SimplifiedAdminDashboard: Rendering dashboard content');
  return (
    <div style={{ padding: '20px', backgroundColor: '#e0ffe0', minHeight: '100vh' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Dashboard Data:</h2>
        <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
      </div>
      <button 
        onClick={() => navigate('/admin-dashboard')}
        style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
      >
        Go to Full Admin Dashboard
      </button>
    </div>
  );
};

export default SimplifiedAdminDashboard;