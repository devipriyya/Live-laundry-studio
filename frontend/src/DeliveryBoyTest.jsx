import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const DeliveryBoyTest = () => {
  const [email, setEmail] = useState('mike.delivery@fabrico.com');
  const [password, setPassword] = useState('delivery123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      console.log('Attempting delivery boy login with:', { email, password });
      
      // Log the API configuration
      console.log('API base URL:', api.defaults.baseURL);
      
      // Direct API call to test
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      console.log('API response received:', response);
      
      if (response.data && response.data.token) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setResult('Login successful! Redirecting...');
        
        // Small delay before redirect
        setTimeout(() => {
          navigate('/delivery-dashboard');
        }, 1000);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      setError(`Login failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Delivery Boy Login Test</h2>
      <p>Use this page to test delivery boy login functionality</p>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px', 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login as Delivery Boy'}
        </button>
      </form>
      
      {result && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          borderRadius: '4px' 
        }}>
          {result}
        </div>
      )}
      
      {error && (
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Predefined Test Accounts:</h3>
        <ul>
          <li><strong>mike.delivery@fabrico.com</strong> / delivery123</li>
          <li><strong>sarah.delivery@fabrico.com</strong> / delivery123</li>
          <li><strong>tom.delivery@fabrico.com</strong> / delivery123</li>
        </ul>
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>Open browser developer console (F12)</li>
          <li>Click "Login as Delivery Boy"</li>
          <li>Check console for error messages</li>
          <li>If successful, you'll be redirected to /delivery-dashboard</li>
        </ol>
      </div>
    </div>
  );
};

export default DeliveryBoyTest;