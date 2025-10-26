import React from 'react';
import UserProfile from '../components/UserProfile';

const UserProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">View and manage your account information</p>
          </div>
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;