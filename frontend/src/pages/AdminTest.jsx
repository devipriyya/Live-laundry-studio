import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminTest = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Information</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>UID:</strong> {user.uid}</p>
            </div>
          ) : (
            <p className="text-red-600">No user logged in</p>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Admin Dashboard Access Test</h3>
          <p className="text-green-700">
            If you can see this page, the admin authentication is working correctly!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
