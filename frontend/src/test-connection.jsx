import React, { useState, useEffect } from 'react';
import api from './api';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing...');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing API connection...');
        const response = await api.get('/orders', {
          params: { limit: 5 }
        });
        console.log('API Response:', response);
        setStatus('✅ Connection successful!');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Connection failed:', error);
        setStatus(`❌ Connection failed: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Connection Test</h1>
      <p><strong>Status:</strong> {status}</p>
      {orders.length > 0 && (
        <div>
          <h2>Retrieved Orders:</h2>
          <ul>
            {orders.map(order => (
              <li key={order._id}>
                Order #{order.orderNumber} - {order.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestConnection;