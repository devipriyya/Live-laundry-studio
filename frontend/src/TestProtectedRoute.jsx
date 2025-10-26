import React from 'react';
import { useNavigate } from 'react-router-dom';

const TestProtectedRoute = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <h1>Test Protected Route</h1>
      <p>This is a test page to verify ProtectedRoute is working.</p>
      <button 
        onClick={() => navigate('/admin-dashboard')}
        style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
      >
        Go to Admin Dashboard
      </button>
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px', marginLeft: '10px' }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default TestProtectedRoute;