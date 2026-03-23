import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderManagement from '../components/OrderManagement';
import AdminOrderManagement from '../components/AdminOrderManagement';
import CustomerManagement from '../components/CustomerManagement';
import CustomerManagementFixed from '../components/CustomerManagementFixed';
import CustomerManagementTest from '../components/CustomerManagementTest';
import StaffManagementDashboard from '../pages/StaffManagementDashboard';
import InventoryManagement from '../components/InventoryManagement';
import PaymentManagement from '../components/PaymentManagement';
import DeliveryManagement from './DeliveryManagement';
import AdvertisementManagement from '../components/AdvertisementManagement';
import ReportsAnalytics from './ReportsAnalytics';
import IncidentManagement from '../components/IncidentManagement';
import LiveLocationMap from '../components/LiveLocationMap';
import InsuranceClaimsManagement from '../components/InsuranceClaimsManagement';
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
  EllipsisVerticalIcon,
  HomeIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  ChartPieIcon,
  CubeIcon,
  TagIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckBadgeIcon,
  UserPlusIcon,
  XMarkIcon,
  StarIcon,
  HeartIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XCircleIcon,
  PresentationChartLineIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  
  // Enhanced data states
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingPayments: 0,
    activeStaff: 0,
    monthlyGrowth: 0,
    customerSatisfaction: 0,
    averageOrderValue: 0,
    deliverySuccess: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  // Enhanced navigation menu items with badges and descriptions
  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: HomeIcon, 
      description: 'Overview & Analytics',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-4 border-blue-500 shadow-sm',
      iconActiveClass: 'text-blue-600'
    },
    { 
      id: 'orders', 
      name: 'Order Management', 
      icon: ClipboardDocumentListIcon, 
      description: 'Track & Manage Orders',
      badge: stats.activeOrders > 0 ? stats.activeOrders : null,
      activeClasses: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-r-4 border-green-500 shadow-sm',
      iconActiveClass: 'text-green-600'
    },
    { 
      id: 'customers', 
      name: 'Customer Management (FIXED)', 
      icon: UsersIcon, 
      description: 'Customer Profiles & Data - Now Working!',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-r-4 border-purple-500 shadow-sm',
      iconActiveClass: 'text-purple-600'
    },
    { 
      id: 'customer-test', 
      name: 'Customer Test', 
      icon: UserCircleIcon, 
      description: 'Test Customer Data',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-r-4 border-purple-500 shadow-sm',
      iconActiveClass: 'text-purple-600'
    },
    { 
      id: 'staff', 
      name: 'Staff Management', 
      icon: UserGroupIcon, 
      description: 'Employee Management',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 border-r-4 border-pink-500 shadow-sm',
      iconActiveClass: 'text-pink-600'
    },
    { 
      id: 'inventory', 
      name: 'Inventory Management', 
      icon: CubeIcon, 
      description: 'Stock & Supplies',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 border-r-4 border-indigo-500 shadow-sm',
      iconActiveClass: 'text-indigo-600'
    },
    { 
      id: 'advertisements', 
      name: 'Advertisement Management', 
      icon: MegaphoneIcon, 
      description: 'Create & Manage Ads',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-r-4 border-orange-500 shadow-sm',
      iconActiveClass: 'text-orange-600'
    },
    { 
      id: 'payments', 
      name: 'Payment Management', 
      icon: CreditCardIcon, 
      description: 'Billing & Transactions',
      badge: stats.pendingPayments > 0 ? stats.pendingPayments : null,
      activeClasses: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-r-4 border-emerald-500 shadow-sm',
      iconActiveClass: 'text-emerald-600'
    },
    { 
      id: 'delivery', 
      name: 'Delivery Management', 
      icon: TruckIcon, 
      description: 'Logistics & Tracking',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-r-4 border-yellow-500 shadow-sm',
      iconActiveClass: 'text-yellow-600'
    },
    { 
      id: 'reports', 
      name: 'Reports & Analytics', 
      icon: ChartPieIcon, 
      description: 'Business Intelligence',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border-r-4 border-teal-500 shadow-sm',
      iconActiveClass: 'text-teal-600'
    },
    { 
      id: 'services', 
      name: 'Service Management', 
      icon: WrenchScrewdriverIcon, 
      description: 'Service Configuration',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-r-4 border-orange-500 shadow-sm',
      iconActiveClass: 'text-orange-600'
    },
    { 
      id: 'settings', 
      name: 'System Settings', 
      icon: Cog6ToothIcon, 
      description: 'Configuration & Preferences',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-r-4 border-gray-500 shadow-sm',
      iconActiveClass: 'text-gray-600'
    },
    { 
      id: 'incidents', 
      name: 'Incident Management', 
      icon: ExclamationTriangleIcon, 
      description: 'Delivery Issues & Reports',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-r-4 border-red-500 shadow-sm',
      iconActiveClass: 'text-red-600'
    },
    { 
      id: 'live-tracking', 
      name: 'Live Tracking', 
      icon: MapPinIcon, 
      description: 'Real-time Delivery Tracking',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-r-4 border-green-500 shadow-sm',
      iconActiveClass: 'text-green-600'
    },
    { 
      id: 'insurance-claims', 
      name: 'Insurance Claims', 
      icon: ShieldCheckIcon, 
      description: 'Cloth Damage Insurance Claims',
      badge: null,
      activeClasses: 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 border-r-4 border-teal-500 shadow-sm',
      iconActiveClass: 'text-teal-600'
    },  ];

  // Enhanced navigation handlers
  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
    // Track navigation for analytics
    console.log(`Navigated to: ${sectionId}`);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Simulate data refresh
    setTimeout(() => {
      loadDashboardData();
    }, 500);
  };

  const toggleRealTimeUpdates = () => {
    setRealTimeUpdates(prev => !prev);
  };

  // Enhanced data loading function
  const loadDashboardData = () => {
    setStats({
      totalOrders: 1247,
      activeOrders: 38,
      completedOrders: 1209,
      totalCustomers: 456,
      totalRevenue: 45680.50,
      todayRevenue: 1250.75,
      pendingPayments: 12,
      activeStaff: 15,
      monthlyGrowth: 12.5,
      customerSatisfaction: 4.8,
      averageOrderValue: 36.75,
      deliverySuccess: 98.2,
    });

    setRecentOrders([
      {
        id: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        phone: '+1 234-567-8901',
        service: 'Wash & Fold',
        status: 'In Progress',
        amount: 24.99,
        orderDate: '2024-01-15',
        priority: 'normal'
      },
      {
        id: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        phone: '+1 234-567-8902',
        service: 'Dry Cleaning',
        status: 'Ready for Pickup',
        amount: 45.00,
        orderDate: '2024-01-14',
        priority: 'high'
      },
      {
        id: 'ORD-003',
        customerName: 'Mike Johnson',
        customerEmail: 'mike@example.com',
        phone: '+1 234-567-8903',
        service: 'Steam Press',
        status: 'Completed',
        amount: 15.00,
        orderDate: '2024-01-13',
        priority: 'normal'
      }
    ]);

    setNotifications([
      {
        id: 1,
        message: 'New customer registration: sarah@example.com',
        time: '15 minutes ago',
        type: 'info',
        read: false
      },
      {
        id: 2,
        message: 'Order ORD-045 requires attention - delayed pickup',
        time: '1 hour ago',
        type: 'warning',
        read: false
      },
      {
        id: 3,
        message: 'Daily revenue target exceeded! $1,250 achieved',
        time: '3 hours ago',
        type: 'success',
        read: true
      }
    ]);

    setRecentActivities([
      { id: 1, action: 'Order Created', details: 'ORD-1248 by John Doe', time: '2 min ago', type: 'order' },
      { id: 2, action: 'Payment Received', details: '$45.00 from Jane Smith', time: '5 min ago', type: 'payment' },
      { id: 3, action: 'Staff Check-in', details: 'Mike Johnson started shift', time: '15 min ago', type: 'staff' },
      { id: 4, action: 'Delivery Completed', details: 'ORD-1240 delivered successfully', time: '25 min ago', type: 'delivery' },
    ]);

    setSystemAlerts([
      { id: 1, message: 'Low inventory: Detergent powder (5 units left)', severity: 'warning' },
      { id: 2, message: 'System backup completed successfully', severity: 'success' },
      { id: 3, message: 'Peak hours approaching (2-4 PM)', severity: 'info' },
    ]);

    setQuickActions([
      { id: 1, title: 'Add Staff', icon: UserPlusIcon, color: 'blue', action: () => setActiveSection('staff') },
      { id: 2, title: 'Add Customer', icon: UserCircleIcon, color: 'green', action: () => setActiveSection('customers') },
      { id: 3, title: 'Schedule Pickup', icon: CalendarDaysIcon, color: 'purple', action: () => setActiveSection('delivery') },
      { id: 4, title: 'Generate Report', icon: DocumentTextIcon, color: 'orange', action: () => setActiveSection('reports') },
    ]);
  };

  // Initialize data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;
    
    const interval = setInterval(() => {
      // Simulate real-time stat updates
      setStats(prev => ({
        ...prev,
        activeOrders: prev.activeOrders + Math.floor(Math.random() * 3) - 1,
        todayRevenue: prev.todayRevenue + (Math.random() * 50),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  return (
    <div className="min-h-screen flex" style={{background: 'var(--surface-base)'}}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 ease-in-out`} style={{boxShadow: 'var(--shadow-sidebar)', borderRight: '1px solid var(--border-default)'}}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6" style={{borderBottom: '1px solid var(--border-default)'}}>
          <div className="flex items-center space-x-3">
            <div className="ds-icon-box ds-icon-box-sm ds-gradient-primary rounded-lg">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WashLab Admin
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`ds-sidebar-nav-item w-full text-left ${activeSection === item.id ? 'active' : ''}`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">{item.name}</span>
                <span className="text-xs opacity-60 truncate">{item.description}</span>
              </div>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center flex-shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4" style={{borderTop: '1px solid var(--border-default)'}}>
          <div className="flex items-center space-x-3">
            <div className="ds-avatar ds-avatar-md">
              <span>{(user?.name || 'Admin').charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{color: 'var(--text-primary)'}}>{user?.name || 'Admin User'}</p>
              <p className="text-xs" style={{color: 'var(--text-muted)'}}>Administrator</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="ds-btn ds-btn-icon ds-btn-ghost"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {/* Top Header */}
        <header className="ds-header" style={{paddingLeft: '1.5rem', paddingRight: '1.5rem'}}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden ds-btn ds-btn-icon ds-btn-ghost"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>
                  {menuItems.find(item => item.id === activeSection)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm" style={{color: 'var(--text-secondary)'}}>Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleRealTimeUpdates}
                className={`ds-btn ds-btn-icon ${realTimeUpdates ? 'ds-btn-secondary' : 'ds-btn-ghost'}`}
                title={realTimeUpdates ? 'Real-time updates ON' : 'Real-time updates OFF'}
              >
                <BoltIcon className={`h-5 w-5 ${realTimeUpdates ? 'text-green-600' : ''}`} />
              </button>
              
              <button onClick={handleRefresh} className="ds-btn ds-btn-icon ds-btn-ghost" title="Refresh">
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              
              <div className="ds-tooltip-wrapper">
                <button className="ds-btn ds-btn-icon ds-btn-ghost relative">
                  <BellIcon className="h-5 w-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="ds-notif-dot" />
                  )}
                </button>
                <span className="ds-tooltip">Notifications</span>
              </div>
              
              <div className="flex items-center space-x-2 pl-2" style={{borderLeft: '1px solid var(--border-default)'}}>
                <div className="ds-avatar ds-avatar-sm">
                  <span>{(user?.name || 'Admin').charAt(0).toUpperCase()}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold" style={{color: 'var(--text-primary)'}}>{user?.name || 'Admin User'}</p>
                  <p className="text-xs" style={{color: 'var(--text-muted)'}}>Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1">
          {activeSection === 'dashboard' && (
            <div className="p-6 space-y-6">
              <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">WashLab Admin Dashboard</h2>
                    <p className="text-gray-600">Comprehensive laundry management system with real-time analytics</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                    <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 text-sm font-medium">System Online</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ds-stagger">
                  <div className="ds-stat-card ds-animate-fade-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="ds-label mb-1">Total Orders</p>
                        <p className="text-3xl font-bold mb-1" style={{color: 'var(--text-primary)'}}>{stats.totalOrders.toLocaleString()}</p>
                        <p className="ds-caption text-green-600">+{stats.monthlyGrowth}% this month</p>
                      </div>
                      <div className="ds-icon-box ds-icon-box-lg rounded-xl" style={{background: 'var(--color-primary-light)'}}>
                        <ClipboardDocumentListIcon className="h-7 w-7" style={{color: 'var(--color-primary)'}} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="ds-stat-card ds-animate-fade-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="ds-label mb-1">Active Orders</p>
                        <p className="text-3xl font-bold mb-1" style={{color: 'var(--text-primary)'}}>{stats.activeOrders}</p>
                        <p className="ds-caption">Processing now</p>
                      </div>
                      <div className="ds-icon-box ds-icon-box-lg rounded-xl bg-green-50">
                        <ClockIcon className="h-7 w-7 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="ds-stat-card ds-animate-fade-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="ds-label mb-1">Total Customers</p>
                        <p className="text-3xl font-bold mb-1" style={{color: 'var(--text-primary)'}}>{stats.totalCustomers}</p>
                        <p className="ds-caption">Satisfaction: {stats.customerSatisfaction}/5</p>
                      </div>
                      <div className="ds-icon-box ds-icon-box-lg rounded-xl" style={{background: 'var(--color-accent-light)'}}>
                        <UsersIcon className="h-7 w-7" style={{color: 'var(--color-accent)'}} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="ds-stat-card ds-animate-fade-up">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="ds-label mb-1">Today's Revenue</p>
                        <p className="text-3xl font-bold mb-1" style={{color: 'var(--text-primary)'}}>₹{stats.todayRevenue.toFixed(2)}</p>
                        <p className="ds-caption">Avg: ₹{stats.averageOrderValue}</p>
                      </div>
                      <div className="ds-icon-box ds-icon-box-lg rounded-xl bg-orange-50">
                        <CurrencyDollarIcon className="h-7 w-7 text-orange-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <div className="ds-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="ds-icon-box ds-icon-box-md rounded-lg bg-emerald-50">
                        <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="ds-caption">Delivery Success</p>
                        <p className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>{stats.deliverySuccess}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ds-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="ds-icon-box ds-icon-box-md rounded-lg bg-red-50">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="ds-caption">Pending Payments</p>
                        <p className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>{stats.pendingPayments}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ds-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="ds-icon-box ds-icon-box-md rounded-lg" style={{background: 'var(--color-primary-light)'}}>
                        <UserGroupIcon className="h-5 w-5" style={{color: 'var(--color-primary)'}} />
                      </div>
                      <div>
                        <p className="ds-caption">Active Staff</p>
                        <p className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>{stats.activeStaff}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ds-card p-4">
                    <div className="flex items-center space-x-3">
                      <div className="ds-icon-box ds-icon-box-md rounded-lg bg-yellow-50">
                        <StarIcon className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="ds-caption">Total Revenue</p>
                        <p className="text-xl font-bold" style={{color: 'var(--text-primary)'}}>₹{stats.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="ds-card p-6 mb-8">
                  <h3 className="ds-heading-md mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="ds-btn ds-btn-secondary flex-col h-auto py-4 gap-2 rounded-xl hover:shadow-md transition-all"
                      >
                        <action.icon className="h-7 w-7" style={{color: 'var(--color-primary)'}} />
                        <p className="text-sm font-semibold" style={{color: 'var(--color-primary)'}}>{action.title}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Orders */}
                  <div className="lg:col-span-2">

                    <div className="ds-card overflow-hidden">
                      <div className="px-6 py-4 flex items-center justify-between" style={{borderBottom: '1px solid var(--border-default)'}}>
                        <h3 className="ds-heading-md">Recent Orders</h3>
                        <button 
                          onClick={() => setActiveSection('orders')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View All →
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="ds-table">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Customer</th>
                              <th>Service</th>
                              <th>Status</th>
                              <th>Amount</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentOrders.map((order) => (
                              <tr key={order.id}>
                                <td className="font-medium" style={{color: 'var(--text-primary)'}}>{order.id}</td>
                                <td>
                                  <div>
                                    <div className="font-medium" style={{color: 'var(--text-primary)'}}>{order.customerName}</div>
                                    <div className="ds-caption">{order.customerEmail}</div>
                                  </div>
                                </td>
                                <td>{order.service}</td>
                                <td>
                                  <span className={`ds-badge ${
                                    order.status === 'Completed' ? 'ds-badge-green' :
                                    order.status === 'In Progress' ? 'ds-badge-blue' :
                                    order.status === 'Ready for Pickup' ? 'ds-badge-purple' :
                                    'ds-badge-gray'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="font-semibold" style={{color: 'var(--text-primary)'}}>₹{order.amount}</td>
                                <td>
                                  <div className="flex items-center space-x-1">
                                    <button className="ds-btn ds-btn-icon ds-btn-ghost" title="View">
                                      <EyeIcon className="h-4 w-4 text-blue-500" />
                                    </button>
                                    <button className="ds-btn ds-btn-icon ds-btn-ghost" title="Edit">
                                      <PencilIcon className="h-4 w-4 text-green-500" />
                                    </button>
                                    <button className="ds-btn ds-btn-icon ds-btn-danger" title="Delete">
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Recent Activities */}
                    <div className="ds-card p-6">
                      <h3 className="ds-heading-md mb-4">Recent Activities</h3>
                      <div className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className={`ds-icon-box ds-icon-box-sm rounded-lg ${
                              activity.type === 'order' ? 'bg-blue-50' :
                              activity.type === 'payment' ? 'bg-green-50' :
                              activity.type === 'staff' ? 'bg-purple-50' :
                              'bg-orange-50'
                            }`}>
                              {activity.type === 'order' && <ClipboardDocumentListIcon className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'payment' && <CreditCardIcon className="h-4 w-4 text-green-600" />}
                              {activity.type === 'staff' && <UserGroupIcon className="h-4 w-4 text-purple-600" />}
                              {activity.type === 'delivery' && <TruckIcon className="h-4 w-4 text-orange-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="ds-heading-sm">{activity.action}</p>
                              <p className="ds-body">{activity.details}</p>
                              <p className="ds-caption mt-0.5">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* System Alerts */}
                    <div className="ds-card p-6">
                      <h3 className="ds-heading-md mb-4">System Alerts</h3>
                      <div className="space-y-3">
                        {systemAlerts.map((alert) => (
                          <div key={alert.id} className={`p-3 rounded-xl border ${
                            alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                            alert.severity === 'success' ? 'bg-green-50 border-green-200' :
                            'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex items-start space-x-2">
                              {alert.severity === 'warning' && <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />}
                              {alert.severity === 'success' && <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />}
                              {alert.severity === 'info' && <InformationCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />}
                              <p className={`text-sm ${
                                alert.severity === 'warning' ? 'text-yellow-800' :
                                alert.severity === 'success' ? 'text-green-800' :
                                'text-blue-800'
                              }`}>{alert.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'orders' && <AdminOrderManagement />}
          {activeSection === 'customers' && <CustomerManagementFixed />}
          {activeSection === 'customer-test' && <CustomerManagementTest />}
          {activeSection === 'staff' && <StaffManagementDashboard />}
          {activeSection === 'advertisements' && <AdvertisementManagement />}
          {activeSection === 'laundry-staff' && <StaffManagementDashboard />}
          {activeSection === 'inventory' && <InventoryManagement />}
          {activeSection === 'payments' && <PaymentManagement />}
          {activeSection === 'delivery' && <DeliveryManagement />}
          {activeSection === 'reports' && <ReportsAnalytics />}
          {activeSection === 'incidents' && <IncidentManagement />}
          {activeSection === 'live-tracking' && <LiveLocationMap />}
          {activeSection === 'insurance-claims' && <InsuranceClaimsManagement />}
          
          {activeSection === 'services' && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Service Management</h2>
                    <p className="text-gray-600">Configure and manage laundry services, pricing, and availability</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Service</span>
                  </button>
                </div>

                {/* Service Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-200 p-3 rounded-xl">
                        <SparklesIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900">Wash & Fold</h3>
                        <p className="text-blue-700 text-sm">Regular laundry service</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-800">Base Price:</span>
                        <span className="font-semibold text-blue-900">$2.50/lb</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Turnaround:</span>
                        <span className="font-semibold text-blue-900">24-48 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Status:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-purple-200 p-3 rounded-xl">
                        <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900">Dry Cleaning</h3>
                        <p className="text-purple-700 text-sm">Professional dry cleaning</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-purple-800">Base Price:</span>
                        <span className="font-semibold text-purple-900">$8.00/item</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-800">Turnaround:</span>
                        <span className="font-semibold text-purple-900">2-3 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-800">Status:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-orange-200 p-3 rounded-xl">
                        <FireIcon className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900">Steam Press</h3>
                        <p className="text-orange-700 text-sm">Professional pressing</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-orange-800">Base Price:</span>
                        <span className="font-semibold text-orange-900">$3.00/item</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-800">Turnaround:</span>
                        <span className="font-semibold text-orange-900">Same day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-800">Status:</span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Configuration */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Service Configuration</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Pricing Settings */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Pricing Settings</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Express Service Multiplier</label>
                            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="1.5" step="0.1" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount</label>
                            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="15" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee</label>
                            <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="5" />
                          </div>
                        </div>
                      </div>

                      {/* Service Hours */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Service Hours</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Hours</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="08:00" />
                              <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="18:00" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Hours</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="09:00" />
                              <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="19:00" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="weekend" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                            <label htmlFor="weekend" className="text-sm text-gray-700">Weekend Service Available</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Reset
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'settings' && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h2>
                  <p className="text-gray-600">Configure system preferences and business settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* General Settings */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="WashLab Laundry" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="+1 (555) 123-4567" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="admin@washlab.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                          <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" defaultValue="https://washlab.com" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                          <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" defaultValue="123 Main Street, City, State 12345" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                          </div>
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Order Updates</p>
                            <p className="text-sm text-gray-500">Notify customers about order status</p>
                          </div>
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Low Inventory Alerts</p>
                            <p className="text-sm text-gray-500">Alert when inventory is low</p>
                          </div>
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Settings */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">System Health</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Excellent</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Database</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Connected</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Payment Gateway</span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Backup Status</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Daily</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          🔄 Backup Database
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          📊 Export Reports
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                          🔧 System Maintenance
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          🚨 Clear Cache
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Need help? Contact our support team.</p>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Contact Support
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          View Documentation
                        </button>
                      </div>
                    </div>
                  </div>
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

      {/* Real-time Updates Indicator */}
      {realTimeUpdates && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Updates</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
