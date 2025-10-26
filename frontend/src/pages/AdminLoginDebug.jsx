import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, TruckIcon, UserIcon } from '@heroicons/react/24/outline';

const AdminLoginDebug = () => {
  const { user, adminDemoLogin, deliveryBoyDemoLogin, demoLogin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    console.log('AdminLoginDebug: Logging in as admin...');
    await adminDemoLogin();
    // Add a small delay to ensure state updates
    setTimeout(() => {
      console.log('AdminLoginDebug: Navigating to dashboard...');
      navigate('/admin-dashboard');
    }, 500);
  };

  const handleDeliveryBoyLogin = async () => {
    console.log('AdminLoginDebug: Logging in as delivery boy...');
    await deliveryBoyDemoLogin();
    // Add a small delay to ensure state updates
    setTimeout(() => {
      console.log('AdminLoginDebug: Navigating to delivery dashboard...');
      navigate('/delivery-dashboard');
    }, 500);
  };

  const handleCustomerLogin = async () => {
    console.log('AdminLoginDebug: Logging in as customer...');
    await demoLogin();
    // Add a small delay to ensure state updates
    setTimeout(() => {
      console.log('AdminLoginDebug: Navigating to customer dashboard...');
      navigate('/dashboard');
    }, 500);
  };

  const getRoleDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'deliveryBoy':
        return '/delivery-dashboard';
      case 'customer':
        return '/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">WashLab Demo Login</h1>
        <p className="text-gray-600 text-center mb-6">Select a role to explore the system</p>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">Current User Status:</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
              <p className="text-sm"><span className="font-medium">Name:</span> {user.name}</p>
              <p className="text-sm"><span className="font-medium">Role:</span> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{user.role}</span></p>
            </div>
          ) : (
            <p className="text-gray-500 font-medium">Not logged in</p>
          )}
        </div>

        {!user ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Admin Login */}
              <button
                onClick={handleAdminLogin}
                className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-600 p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <ShieldCheckIcon className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-2">Admin</h3>
                <p className="text-purple-100 text-sm">Full system access</p>
              </button>

              {/* Delivery Boy Login */}
              <button
                onClick={handleDeliveryBoyLogin}
                className="group relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <TruckIcon className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-2">Delivery Boy</h3>
                <p className="text-green-100 text-sm">Manage deliveries</p>
              </button>

              {/* Customer Login */}
              <button
                onClick={handleCustomerLogin}
                className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <UserIcon className="w-12 h-12 text-white mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-2">Customer</h3>
                <p className="text-blue-100 text-sm">Place orders</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => navigate(getRoleDashboard())}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg"
            >
              Go to {user.role === 'deliveryBoy' ? 'Delivery' : user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </button>
            <button
              onClick={() => {
                logout();
              }}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-lg"
            >
              Logout
            </button>
          </div>
        )}

        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Role Descriptions:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <ShieldCheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-600" />
              <div>
                <span className="font-semibold">Admin:</span> Manage orders, customers, delivery boys, and view analytics
              </div>
            </li>
            <li className="flex items-start gap-2">
              <TruckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
              <div>
                <span className="font-semibold">Delivery Boy:</span> View assigned orders, update pickup/delivery status
              </div>
            </li>
            <li className="flex items-start gap-2">
              <UserIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
              <div>
                <span className="font-semibold">Customer:</span> Place orders, track deliveries, manage profile
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginDebug;