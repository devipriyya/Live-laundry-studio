import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminOrderManagement from '../components/AdminOrderManagement';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import InventoryManagement from '../components/InventoryManagement';
import EnhancedPaymentManagement from '../components/EnhancedPaymentManagement';
import EnhancedReportsAnalytics from './EnhancedReportsAnalytics'; // Changed to import EnhancedReportsAnalytics
import Settings from '../components/Settings';
import DeliveryManagement from './DeliveryManagement';
import api from '../api';
import { dashboardService } from '../services/dashboardService';
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
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const AdminDashboardModern = () => {
  const { user, logout, adminDemoLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Move all hooks to the top level to avoid "Rendered more hooks than during the previous render" error
  const [loading, setLoading] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Dashboard Statistics
  const [stats, setStats] = useState({
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

  // Chart data for order trends (last 7 days)
  const [orderTrendData, setOrderTrendData] = useState([
    { day: 'Mon', orders: 0, revenue: 0 },
    { day: 'Tue', orders: 0, revenue: 0 },
    { day: 'Wed', orders: 0, revenue: 0 },
    { day: 'Thu', orders: 0, revenue: 0 },
    { day: 'Fri', orders: 0, revenue: 0 },
    { day: 'Sat', orders: 0, revenue: 0 },
    { day: 'Sun', orders: 0, revenue: 0 }
  ]);

  // Monthly income trend data
  const [monthlyIncomeData, setMonthlyIncomeData] = useState([
    { month: 'Jan', income: 0 },
    { month: 'Feb', income: 0 },
    { month: 'Mar', income: 0 },
    { month: 'Apr', income: 0 },
    { month: 'May', income: 0 },
    { month: 'Jun', income: 0 }
  ]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
    { id: 'customers', label: 'Customers', icon: UsersIcon },
    { id: 'staff', label: 'Staff', icon: UserGroupIcon },
    { id: 'inventory', label: 'Inventory', icon: CubeIcon },
    { id: 'payments', label: 'Payment Management', icon: CreditCardIcon },
    { id: 'reports', label: 'Reports', icon: ChartBarIcon }, // Changed this to stay within dashboard
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  // Notifications data
  const [notifications, setNotifications] = useState([]);

  // Recent activities data
  const [recentActivities, setRecentActivities] = useState([]);

  const quickActions = [
    { id: 2, title: 'Add Customer', description: 'Register new customer', icon: UserCircleIcon, color: 'purple', action: () => setActiveSection('customers') },
    { id: 3, title: 'Schedule Pickup', description: 'Arrange delivery', icon: CalendarDaysIcon, color: 'orange', action: () => setActiveSection('delivery') },
    { id: 4, title: 'Generate Report', description: 'View analytics', icon: DocumentChartBarIcon, color: 'teal', action: () => setActiveSection('reports') },
    { id: 5, title: 'Customer Management', description: 'Manage all customers', icon: UsersIcon, color: 'indigo', action: () => setActiveSection('customers') }
  ];

  // Recent orders data
  const [recentOrders, setRecentOrders] = useState([]);

  // Debug logging
  console.log('AdminDashboardModern: Component rendering');
  console.log('AdminDashboardModern: User data:', user);
  console.log('AdminDashboardModern: User type:', typeof user);
  console.log('AdminDashboardModern: User keys:', user ? Object.keys(user) : 'null');
  
  // Verify authentication on component mount
  useEffect(() => {
    console.log('AdminDashboardModern: useEffect triggered');
    const verifyAuth = async () => {
      console.log('AdminDashboardModern: Verifying authentication...');
      
      // Check if we have a user and token
      const token = localStorage.getItem('token');
      console.log('AdminDashboardModern: Token present:', !!token);
      
      if (!user || !token) {
        console.log('AdminDashboardModern: Missing user or token, attempting re-authentication...');
        try {
          // Try to re-authenticate
          if (typeof adminDemoLogin === 'function') {
            await adminDemoLogin();
            console.log('AdminDashboardModern: Re-authentication attempt completed');
          }
        } catch (error) {
          console.error('AdminDashboardModern: Re-authentication failed:', error);
        }
      }
      
      // Small delay to ensure context updates
      setTimeout(() => {
        setLoading(false);
        setAuthVerified(true);
        console.log('AdminDashboardModern: Loading state set to false');
      }, 300);
    };
    
    verifyAuth();
  }, []);
  
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      
      // Check if we have a valid token
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, attempting to re-authentication...');
        // Try to get a new token
        if (typeof adminDemoLogin === 'function') {
          await adminDemoLogin();
          // Check again
          const newToken = localStorage.getItem('token');
          if (!newToken) {
            console.error('Failed to obtain token for dashboard data fetch');
            return;
          }
        } else {
          console.error('adminDemoLogin function not available');
          return;
        }
      }
      
      // Fetch all dashboard data in parallel
      const [dashboardStats, recentOrdersData, orderTrendsData, monthlyIncomeData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentOrders(5),
        dashboardService.getOrderTrends(7),
        dashboardService.getMonthlyIncome(6)
      ]);
      
      console.log('Dashboard stats response:', dashboardStats);
      console.log('Recent orders response:', recentOrdersData);
      console.log('Order trends response:', orderTrendsData);
      console.log('Monthly income response:', monthlyIncomeData);
      
      // Update state with fetched data
      setStats({
        totalOrders: dashboardStats.totalOrders || 0,
        activeOrders: dashboardStats.activeOrders || 0,
        completedToday: dashboardStats.completedToday || 0,
        totalRevenue: dashboardStats.totalRevenue || 0,
        todayRevenue: dashboardStats.todayRevenue || 0,
        totalCustomers: dashboardStats.totalCustomers || 0,
        newCustomers: dashboardStats.newCustomers || 0,
        activeStaff: 0, // We'll need to implement this
        avgRating: 0, // We'll need to implement this
        orderGrowth: dashboardStats.orderGrowth || 0,
        revenueGrowth: dashboardStats.revenueGrowth || 0,
        customerGrowth: dashboardStats.customerGrowth || 0,
        pendingPayments: 0, // We'll need to implement this
        todayOrders: dashboardStats.todayOrders || 0,
        pendingOrders: dashboardStats.pendingOrders || 0
      });
      
      setRecentOrders(recentOrdersData);
      setOrderTrendData(orderTrendsData);
      setMonthlyIncomeData(monthlyIncomeData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  };

  // Fetch data when dashboard section is active
  useEffect(() => {
    if (activeSection === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeSection]);

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (activeSection === 'dashboard') {
      fetchDashboardData();
    }
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

  // Show loading state while verifying authentication
  if (loading || !authVerified) {
    console.log('AdminDashboardModern: Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Check if user exists and has admin role
  console.log('AdminDashboardModern: Checking user authentication');
  console.log('AdminDashboardModern: User exists:', !!user);
  console.log('AdminDashboardModern: User role:', user ? user.role : 'no user');
  
  if (!user || user.role !== 'admin') {
    console.error('AdminDashboardModern: No admin user data available!');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You must be logged in as an administrator to access this dashboard.</p>
          <p className="text-gray-500 mb-4">Current user role: {user ? user.role : 'none'}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin-login-debug')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-3"
            >
              Admin Login
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  console.log('AdminDashboardModern: Rendering dashboard content');
  
  // Render the appropriate component based on activeSection
  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'orders':
        return <AdminOrderManagement />;
      case 'customers':
        return <CustomerManagement isAdminView={true} />;
      case 'staff':
        return <StaffManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'payments':
        return <EnhancedPaymentManagement />;
      case 'reports':
        // Render reports within the dashboard layout
        return <EnhancedReportsAnalytics inDashboard={true} />;
      case 'settings':
        return <Settings />;
      case 'delivery':
        return <DeliveryManagement />;
      default:
        return (
          <div className="p-6">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Admin'}!</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {darkMode ? (
                    <SunIcon className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <MoonIcon className="h-5 w-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'} border border-blue-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-blue-600'}`}>Total Orders</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-500 ml-1">{stats.orderGrowth}%</span>
                  <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>from last month</span>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-green-50 to-green-100'} border border-green-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-green-600'}`}>Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-500 ml-1">{stats.revenueGrowth}%</span>
                  <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>from last month</span>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-50 to-purple-100'} border border-purple-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-purple-600'}`}>Customers</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalCustomers}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <UsersIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-500 ml-1">{stats.customerGrowth}%</span>
                  <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>from last month</span>
                </div>
              </div>

              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-amber-50 to-amber-100'} border border-amber-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-amber-600'}`}>Pending Orders</p>
                    <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <ClockIcon className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-500 ml-1">2.5%</span>
                  <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>from last month</span>
                </div>
              </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Order Trends Chart */}
              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Order Trends</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={orderTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="day" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip 
                        contentStyle={darkMode ? { 
                          backgroundColor: '#1f2937', 
                          borderColor: '#374151',
                          color: '#f9fafb'
                        } : {}} 
                      />
                      <Area type="monotone" dataKey="orders" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Income Chart */}
              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Income</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyIncomeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                      <Tooltip 
                        contentStyle={darkMode ? { 
                          backgroundColor: '#1f2937', 
                          borderColor: '#374151',
                          color: '#f9fafb'
                        } : {}} 
                      />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Orders and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h2>
                  <button 
                    onClick={() => handleMenuClick('orders')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>#{order.orderNumber}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>₹{order.totalAmount}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent orders</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={action.action}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl transition-all hover:scale-105 ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100'
                      } border border-gray-200`}
                    >
                      <div className={`p-3 rounded-full mb-3 ${
                        action.color === 'blue' ? 'bg-blue-100' :
                        action.color === 'purple' ? 'bg-purple-100' :
                        action.color === 'orange' ? 'bg-orange-100' :
                        action.color === 'teal' ? 'bg-teal-100' :
                        action.color === 'indigo' ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        <action.icon className={`h-6 w-6 ${
                          action.color === 'blue' ? 'text-blue-600' :
                          action.color === 'purple' ? 'text-purple-600' :
                          action.color === 'orange' ? 'text-orange-600' :
                          action.color === 'teal' ? 'text-teal-600' :
                          action.color === 'indigo' ? 'text-indigo-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{action.title}</h3>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
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
                WashLab
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className={`relative rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              }`}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-6 w-6 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <UserCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || 'Admin User'}
              </p>
              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email || 'admin@washlab.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <header className={`lg:hidden flex items-center justify-between h-20 px-6 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            WashLab Admin
          </h1>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
          >
            <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardModern;