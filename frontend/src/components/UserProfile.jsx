import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  StarIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user's profile from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/profile');
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchUserProfile}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-600">No user data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-full">
              <UserIcon className="h-12 w-12 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-blue-100">{user.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white mt-2">
                {user.role === 'customer' ? 'Customer' : user.role === 'admin' ? 'Administrator' : 'Delivery Person'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="font-medium">{user.stats?.totalOrders || 0}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Spent</p>
                    <p className="font-medium">₹{user.stats?.totalSpent?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Loyalty Points</p>
                    <p className="font-medium">{user.stats?.loyaltyPoints || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {user.stats?.memberSince ? new Date(user.stats.memberSince).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            {user.addresses && user.addresses.length > 0 && (
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((address, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {address.type}
                            {address.isDefault && ' (Default)'}
                          </span>
                          <p className="font-medium mt-2">{address.address}</p>
                          <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                        </div>
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences */}
            {user.preferences && (
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-medium">{user.preferences.language?.toUpperCase() || 'EN'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Currency</p>
                    <p className="font-medium">{user.preferences.currency || 'INR'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Theme</p>
                    <p className="font-medium capitalize">{user.preferences.theme || 'Light'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Edit Button */}
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;