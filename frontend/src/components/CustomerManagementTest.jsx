import React, { useState, useEffect } from 'react';
import api from '../api';

const CustomerManagementTest = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/users');
        console.log('API Response:', response.data);
        setCustomers(response.data.users);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Customer Management Test</h1>
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Customer Management Test</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management Test</h1>
      <p>Found {customers.length} customers</p>
      <div className="mt-4">
        {customers.map(customer => (
          <div key={customer._id} className="border-b py-2">
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Role:</strong> {customer.role}</p>
            <p><strong>Blocked:</strong> {customer.isBlocked ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerManagementTest;