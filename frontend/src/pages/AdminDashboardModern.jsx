import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminOrderManagement from '../components/AdminOrderManagement';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import InventoryManagement from '../components/InventoryManagement';
import PaymentManagement from '../components/PaymentManagement';
import ReportsAnalytics from '../components/ReportsAnalytics';
import Settings from '../components/Settings';
import DeliveryManagement from './DeliveryManagement';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  HomeIcon, ClipboardDocumentListIcon, UsersIcon, UserGroupIcon, CubeIcon,
  ChartPieIcon, CreditCardIcon, Cog6ToothIcon, BellIcon, Bars3Icon, XMarkIcon,
  ArrowRightOnRectangleIcon, SparklesIcon, MagnifyingGlassIcon, ArrowPathIcon,
  CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, CurrencyDollarIcon,
  TruckIcon, ShoppingBagIcon, CalendarDaysIcon, StarIcon, ChartBarIcon,
  UserCircleIcon, ShieldCheckIcon, BoltIcon, SunIcon, MoonIcon,
  PlusIcon, DocumentChartBarIcon, InformationCircleIcon, RocketLaunchIcon,
  EyeIcon, PencilIcon, TrashIcon, FireIcon, LightBulbIcon, TagIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const AdminDashboardModern = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Debug logging
  console.log('AdminDashboardModern: Component rendering');
  console.log('AdminDashboardModern: User data:', user);
  
  // Check if user exists
  if (!user) {
    console.error('AdminDashboardModern: No user data available!');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please log in to access the admin dashboard.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Static Dashboard Statistics
  const [stats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedToday: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalCustomers: 0,
    newCustomers: 0,
    activeStaff: 0,
    avgRating: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
    pendingPayments: 0,
    todayOrders: 0,
    pendingOrders: 0
  });

  // Static chart data for order trends (last 7 days)
  const orderTrendData = [
    { day: 'Mon', orders: 0, revenue: 0 },
    { day: 'Tue', orders: 0, revenue: 0 },
    { day: 'Wed', orders: 0, revenue: 0 },
    { day: 'Thu', orders: 0, revenue: 0 },
    { day: 'Fri', orders: 0, revenue: 0 },
    { day: 'Sat', orders: 0, revenue: 0 },
    { day: 'Sun', orders: 0, revenue: 0 }
  ];

  // Static monthly income trend data
  const monthlyIncomeData = [
    { month: 'Jan', income: 0 },
    { month: 'Feb', income: 0 },
    { month: 'Mar', income: 0 },
    { month: 'Apr', income: 0 },
    { month: 'May', income: 0 },
    { month: 'Jun', income: 0 }
  ];

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, color: 'blue', description: 'Overview & Analytics' },
    { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon, color: 'green', badge: stats.activeOrders, description: 'Manage Orders' },
    { id: 'customers', name: 'Customers', icon: UsersIcon, color: 'purple', description: 'Customer Management' },
    { id: 'staff', name: 'Staff', icon: UserGroupIcon, color: 'pink', description: 'Team Management' },
    { id: 'inventory', name: 'Inventory', icon: CubeIcon, color: 'indigo', description: 'Stock & Supplies' },
    { id: 'payments', name: 'Payments', icon: CreditCardIcon, color: 'emerald', badge: stats.pendingPayments, description: 'Financial Management' },
    { id: 'delivery', name: 'Delivery', icon: TruckIcon, color: 'orange', description: 'Logistics & Routes' },
    { id: 'reports', name: 'Analytics', icon: ChartPieIcon, color: 'teal', description: 'Reports & Insights' },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon, color: 'gray', description: 'System Configuration' }
  ];

  // Static notifications data
  const [notifications] = useState([]);

  // Static recent activities data
  const [recentActivities] = useState([]);

  const quickActions = [
    { id: 1, title: 'New Order', description: 'Create a new order', icon: PlusIcon, color: 'blue', action: () => setActiveSection('orders') },
    { id: 2, title: 'Add Customer', description: 'Register new customer', icon: UserCircleIcon, color: 'purple', action: () => setActiveSection('customers') },
    { id: 3, title: 'Schedule Pickup', description: 'Arrange delivery', icon: CalendarDaysIcon, color: 'orange', action: () => setActiveSection('delivery') },
    { id: 4, title: 'Generate Report', description: 'View analytics', icon: DocumentChartBarIcon, color: 'teal', action: () => setActiveSection('reports') },
    { id: 5, title: 'Customer Management', description: 'Manage all customers', icon: UsersIcon, color: 'indigo', action: () => navigate('/customer-management') }
  ];

  // Static recent orders data
  const [recentOrders] = useState([]);

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'ready for pickup': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'} flex`}>
      {/* Sidebar */}
      <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl transition-transform duration-300 ease-in-out flex flex-col`}>
        {/* Logo */}
        <div className={`flex items-center justify-between h-20 px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
                FabricsPa
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className={`lg:hidden p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-100'} transition-colors`}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => handleMenuClick(item.id)}
              className={`w-full group relative flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                activeSection === item.id
                  ? darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg'
                    : 'bg-gradient-to-r from-blue-50 to-purple-100 text-blue-700 shadow-md border-l-4 border-blue-500'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-gray-600 hover:bg-gray-50 hover:shadow-sm'
              }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? darkMode ? 'bg-white/20' : 'bg-blue-200/50'
                    : darkMode ? 'bg-gray-700' : 'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <item.icon className={`h-5 w-5 ${
                    activeSection === item.id
                      ? darkMode ? 'text-white' : 'text-blue-600'
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <span className="font-medium text-sm block">{item.name}</span>
                  <span className={`text-xs ${activeSection === item.id ? 'opacity-90' : 'opacity-60'}`}>{item.description}</span>
                </div>
              </div>
              {item.badge && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500 text-white shadow-lg">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-100">
              <span className="text-white font-bold text-lg">{(user?.name || 'Admin').charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'Admin User'}</p>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email || 'admin@fabricspa.com'}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'} shadow-lg hover:shadow-xl`}>
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'} border-b sticky top-0 z-40 shadow-sm`}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-xl ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}>
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {menuItems.find(item => item.id === activeSection)?.name || 'Dashboard'}
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome back, {user?.name?.split(' ')[0] || 'Admin'}! 👋
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center space-x-2">
                <div className="relative">
                  <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64`}
                  />
                  <MagnifyingGlassIcon className={`absolute left-3 top-2.5 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Refresh Button */}
              <button onClick={handleRefresh}
                className={`p-2.5 rounded-xl ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-all ${refreshing ? 'animate-spin' : ''}`}
                title="Refresh">
                <ArrowPathIcon className="h-5 w-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl ${darkMode ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'} hover:shadow-lg transition-all`}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2.5 rounded-xl ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-all`}>
                  <BellIcon className="h-6 w-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-pulse">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-96 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-2xl shadow-2xl border overflow-hidden z-50`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id}
                            className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} transition-colors ${
                              !notification.read ? darkMode ? 'bg-gray-700/30' : 'bg-blue-50' : ''
                            }`}>
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                notification.type === 'success' ? 'bg-green-100 text-green-600' :
                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {notification.type === 'success' && <CheckCircleIcon className="h-4 w-4" />}
                                {notification.type === 'warning' && <ExclamationTriangleIcon className="h-4 w-4" />}
                                {notification.type === 'info' && <InformationCircleIcon className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</p>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{notification.message}</p>
                                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-12 text-center">
                          <BellIcon className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mx-auto mb-3`} />
                          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No notifications</p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>You're all caught up!</p>
                        </div>
                      )}
                    </div>
                    <div className={`px-4 py-3 text-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-4 -mr-16 opacity-20">
                  <RocketLaunchIcon className="h-64 w-64" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Admin'}! 🎉
                  </h2>
                  <p className="text-blue-100 text-lg">Here's what's happening with your laundry management system today</p>
                  <div className="flex items-center space-x-4 mt-6">
                    <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">System Online</span>
                    </div>
                    <div className="text-white/90 text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Users */}
                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                      <UsersIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-500 text-sm font-semibold">
                      <ArrowTrendingUpIcon className="h-4 w-4" /><span>{stats.customerGrowth}%</span>
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Users</h3>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.totalCustomers.toLocaleString()}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center space-x-1`}>
                    <FireIcon className="h-4 w-4 text-orange-500" />
                    <span>{stats.newCustomers} new this month</span>
                  </p>
                </div>

                {/* Total Orders */}
                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                      <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-500 text-sm font-semibold">
                      <ArrowTrendingUpIcon className="h-4 w-4" /><span>{stats.orderGrowth}%</span>
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Orders</h3>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.totalOrders.toLocaleString()}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center space-x-1`}>
                    <FireIcon className="h-4 w-4 text-orange-500" />
                    <span>{stats.completedToday} completed today</span>
                  </p>
                </div>

                {/* Total Revenue */}
                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                      <CurrencyDollarIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-500 text-sm font-semibold">
                      <ArrowTrendingUpIcon className="h-4 w-4" /><span>{stats.revenueGrowth}%</span>
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Revenue</h3>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>${stats.totalRevenue.toLocaleString()}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} flex items-center space-x-1`}>
                    <FireIcon className="h-4 w-4 text-orange-500" />
                    <span>${stats.todayRevenue.toFixed(2)} today</span>
                  </p>
                </div>

                {/* Today's Orders / Pending Orders */}
                <div className={`group ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:scale-105`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                      <ClockIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-blue-500 text-sm font-semibold">
                      <BoltIcon className="h-4 w-4" /><span>Live</span>
                    </div>
                  </div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Today's Orders</h3>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{stats.todayOrders}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{stats.pendingOrders} pending orders</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Trends Chart */}
                <div className={`rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg overflow-hidden`}>
                  <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Trends (Last 7 Days)</h3>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={orderTrendData}>
                        <defs>
                          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            border: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb'),
                            borderRadius: '8px'
                          }}
                        />
                        <Area type="monotone" dataKey="orders" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrders)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Income Trend Chart */}
                <div className={`rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg overflow-hidden`}>
                  <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Revenue Trend (Last 7 Days)</h3>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={orderTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            border: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb'),
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Monthly Income Trend */}
              <div className={`rounded-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border shadow-lg overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Income Trend</h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={monthlyIncomeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          border: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb'),
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <button key={action.id} onClick={action.action}
                      className={`group p-6 rounded-xl border-2 border-dashed ${darkMode ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'} transition-all duration-200`}>
                      <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50'} rounded-xl mx-auto w-fit mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} text-center mb-1`}>{action.title}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity & Orders Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2">
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'} overflow-hidden`}>
                    <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
                      <button onClick={() => setActiveSection('orders')}
                        className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                        View All →
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className={darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}>
                          <tr>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Order ID</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Customer</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Service</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Amount</th>
                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                          {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                              <tr key={order.id} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div>
                                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{order.customer}</div>
                                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.email}</div>
                                  </div>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{order.service}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>${order.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button className={`p-1.5 rounded-lg ${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-blue-50'} transition-colors`}>
                                      <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button className={`p-1.5 rounded-lg ${darkMode ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'} transition-colors`}>
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button className={`p-1.5 rounded-lg ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'} transition-colors`}>
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <ClipboardDocumentListIcon className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-3`} />
                                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No orders yet</p>
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Orders will appear here once created</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <activity.icon className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.action}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{activity.user}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{activity.details}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'} mt-1`}>{activity.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <BoltIcon className={`h-12 w-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-3`} />
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent activity</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>Activity will appear here</p>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setActiveSection('reports')}
                    className={`w-full mt-4 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-colors font-medium text-sm`}>
                    View All Activity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other Sections */}
          {activeSection === 'orders' && <AdminOrderManagement />}
          {activeSection === 'customers' && <CustomerManagement />}
          {activeSection === 'staff' && <StaffManagement />}
          {activeSection === 'inventory' && <InventoryManagement />}
          {activeSection === 'payments' && <PaymentManagement />}
          {activeSection === 'delivery' && <DeliveryManagement />}
          {activeSection === 'reports' && <ReportsAnalytics />}
          {activeSection === 'settings' && <Settings />}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      )}
    </div>
  );
};

export default AdminDashboardModern;