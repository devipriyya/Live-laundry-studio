import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TestAdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    console.log('TestAdminDashboard: Component mounted');
    console.log('TestAdminDashboard: User:', user);
    console.log('TestAdminDashboard: Loading:', loading);
    
    // Simple test to see if we can access the user data
    if (user) {
      setTestData({
        userId: user.uid,
        email: user.email,
        role: user.role,
        name: user.name,
        timestamp: new Date().toISOString()
      });
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
        <h1>Test Admin Dashboard - Loading...</h1>
        <p>Authentication context is still loading</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffe4e1', minHeight: '100vh' }}>
        <h1>Test Admin Dashboard - No User</h1>
        <p>No user is currently authenticated</p>
        <button onClick={() => navigate('/admin-login-debug')} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Go to Admin Login
        </button>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div style={{ padding: '20px', backgroundColor: '#fffacd', minHeight: '100vh' }}>
        <h1>Test Admin Dashboard - Not Admin</h1>
        <p>User is authenticated but not an admin</p>
        <p>Current role: {user.role}</p>
        <p>Email: {user.email}</p>
        <button onClick={() => navigate('/admin-login-debug')} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Go to Admin Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#e0ffe0', minHeight: '100vh' }}>
      <h1>Test Admin Dashboard - Success!</h1>
      <p>Admin user is properly authenticated</p>
      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>User Data:</h2>
        <pre>{JSON.stringify(testData, null, 2)}</pre>
      </div>
      <button onClick={() => navigate('/admin-dashboard')} style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
        Go to Real Admin Dashboard
      </button>
    </div>
  );
};

export default TestAdminDashboard;