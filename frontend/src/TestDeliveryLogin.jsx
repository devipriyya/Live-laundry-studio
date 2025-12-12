import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const TestDeliveryLogin = () => {
  const { deliveryBoyLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleTestLogin = async () => {
    console.log('Testing delivery boy login...');
    try {
      const result = await deliveryBoyLogin('mike.delivery@fabrico.com', 'delivery123');
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating to delivery dashboard');
        navigate('/delivery-dashboard');
      } else {
        console.log('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Delivery Boy Login</h2>
      <button onClick={handleTestLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test Login as Mike Johnson
      </button>
    </div>
  );
};

export default TestDeliveryLogin;