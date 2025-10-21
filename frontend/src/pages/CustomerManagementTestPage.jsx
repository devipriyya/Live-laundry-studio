import React from 'react';
import CustomerManagementSimple from '../components/CustomerManagementSimple';

const CustomerManagementTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management Test Page</h1>
          <p className="text-gray-600 mt-2">This is a direct test page to verify customer management functionality</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <CustomerManagementSimple />
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementTestPage;