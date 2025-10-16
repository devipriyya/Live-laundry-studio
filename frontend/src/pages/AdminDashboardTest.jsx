import React from 'react';

const AdminDashboardTest = () => {
  console.log('AdminDashboardTest component is rendering');
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard Test</h1>
      <p className="text-gray-600">This is a test version to check if the component renders properly.</p>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Basic Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-700 font-medium">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-900">1,247</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-700 font-medium">Active Orders</h3>
            <p className="text-2xl font-bold text-green-900">38</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-purple-700 font-medium">Customers</h3>
            <p className="text-2xl font-bold text-purple-900">456</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-orange-700 font-medium">Revenue</h3>
            <p className="text-2xl font-bold text-orange-900">$45,680</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardTest;
