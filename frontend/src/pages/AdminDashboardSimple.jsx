import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  UserCircleIcon,
  ClockIcon,
  TruckIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  BellIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  HomeIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AdminDashboardSimple = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Debug logging
  console.log('AdminDashboardSimple rendering, user:', user);
  console.log('AdminDashboardSimple user role:', user?.role);
  console.log('AdminDashboardSimple localStorage user:', JSON.parse(localStorage.getItem('user') || 'null'));
  
  // Loading state
  if (!user) {
    console.log('No user found, showing loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Check if user is admin
  if (user.role !== 'admin') {
    console.log('User is not admin, redirecting...', user);
    return <Navigate to="/" replace />;
  }

  console.log('Rendering admin dashboard for user:', user);
  
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Sample stats
  const stats = {
    totalOrders: 1247,
    activeOrders: 38,
    totalCustomers: 456,
    totalRevenue: 45680.50,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FabricSpa Admin
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeSection === 'dashboard'
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-4 border-blue-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveSection('orders')}
            className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeSection === 'orders'
                ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-r-4 border-green-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <ClipboardDocumentListIcon className="h-5 w-5 mr-3" />
            <span className="font-medium text-sm">Orders</span>
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {(user?.name || 'Admin').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {(user?.name || 'Admin').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-700 font-medium text-sm">Total Orders</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.totalOrders.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-200 p-3 rounded-xl">
                        <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-700 font-medium text-sm">Active Orders</p>
                        <p className="text-3xl font-bold text-green-900">{stats.activeOrders}</p>
                      </div>
                      <div className="bg-green-200 p-3 rounded-xl">
                        <ClockIcon className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-700 font-medium text-sm">Total Customers</p>
                        <p className="text-3xl font-bold text-purple-900">{stats.totalCustomers}</p>
                      </div>
                      <div className="bg-purple-200 p-3 rounded-xl">
                        <UsersIcon className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-700 font-medium text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold text-orange-900">₹{stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <div className="bg-orange-200 p-3 rounded-xl">
                        <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">ORD-001</td>
                          <td className="px-6 py-4 text-sm text-gray-900">John Doe</td>
                          <td className="px-6 py-4 text-sm text-gray-900">Wash & Fold</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              In Progress
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">$24.99</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">ORD-002</td>
                          <td className="px-6 py-4 text-sm text-gray-900">Jane Smith</td>
                          <td className="px-6 py-4 text-sm text-gray-900">Dry Cleaning</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">$45.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'orders' && (
            <div className="space-y-6">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Order Management</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-600">Order management functionality will be implemented here.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboardSimple;
