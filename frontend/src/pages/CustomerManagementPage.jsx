import React from 'react';
import CustomerManagement from '../components/CustomerManagement';

const CustomerManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerManagement isAdminView={true} />
    </div>
  );
};

export default CustomerManagementPage;