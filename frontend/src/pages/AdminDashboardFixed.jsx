import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  
  // Data states
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingPayments: 0,
    activeStaff: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [services, setServices] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Navigation menu items with proper class mappings
  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: HomeIcon, 
      activeClasses: 'bg-blue-50 text-blue-700 border-r-4 border-blue-500',
      iconActiveClass: 'text-blue-600'
    },
    { 
      id: 'orders', 
      name: 'Order Management', 
      icon: ClipboardDocumentListIcon, 
      activeClasses: 'bg-green-50 text-green-700 border-r-4 border-green-500',
      iconActiveClass: 'text-green-600'
    },
    { 
      id: 'customers', 
      name: 'Customer Management', 
      icon: UsersIcon, 
      activeClasses: 'bg-purple-50 text-purple-700 border-r-4 border-purple-500',
      iconActiveClass: 'text-purple-600'
    },
    { 
      id: 'services', 
      name: 'Service Management', 
      icon: WrenchScrewdriverIcon, 
      activeClasses: 'bg-orange-50 text-orange-700 border-r-4 border-orange-500',
      iconActiveClass: 'text-orange-600'
    },
    { 
      id: 'staff', 
      name: 'Staff Management', 
      icon: UserGroupIcon, 
      activeClasses: 'bg-pink-50 text-pink-700 border-r-4 border-pink-500',
      iconActiveClass: 'text-pink-600'
    },
    { 
      id: 'inventory', 
      name: 'Inventory', 
      icon: CubeIcon, 
      activeClasses: 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500',
      iconActiveClass: 'text-indigo-600'
    },
    { 
      id: 'reports', 
      name: 'Reports & Analytics', 
      icon: ChartPieIcon, 
      activeClasses: 'bg-teal-50 text-teal-700 border-r-4 border-teal-500',
      iconActiveClass: 'text-teal-600'
    },
    { 
      id: 'payments', 
      name: 'Payment Management', 
      icon: CreditCardIcon, 
      activeClasses: 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-500',
      iconActiveClass: 'text-emerald-600'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Cog6ToothIcon, 
      activeClasses: 'bg-gray-50 text-gray-700 border-r-4 border-gray-500',
      iconActiveClass: 'text-gray-600'
    },
  ];

  // Handle menu navigation
  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  // Mock data initialization
  useEffect(() => {
    setStats({
      totalOrders: 1247,
      activeOrders: 38,
      completedOrders: 1209,
      totalCustomers: 456,
      totalRevenue: 45680.50,
      todayRevenue: 1250.75,
      pendingPayments: 12,
      activeStaff: 15,
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
  }, []);

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
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeSection === item.id
                  ? item.activeClasses
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${
                activeSection === item.id ? item.iconActiveClass : 'text-gray-400'
              }`} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeSection)?.name || 'Dashboard'}
                </h1>
                <p className="text-gray-600">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {(user?.name || 'Admin').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1">
          {activeSection === 'dashboard' && (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h2>
                <p className="text-gray-600 mb-8">Comprehensive laundry management system with modern design and full functionality.</p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-700 font-medium">Total Orders</p>
                        <p className="text-3xl font-bold text-blue-900">{stats.totalOrders}</p>
                      </div>
                      <ClipboardDocumentListIcon className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-700 font-medium">Active Orders</p>
                        <p className="text-3xl font-bold text-green-900">{stats.activeOrders}</p>
                      </div>
                      <ClockIcon className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-700 font-medium">Total Customers</p>
                        <p className="text-3xl font-bold text-purple-900">{stats.totalCustomers}</p>
                      </div>
                      <UsersIcon className="h-12 w-12 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-700 font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-orange-900">₹{stats.totalRevenue.toLocaleString()}</p>
                      </div>
                      <CurrencyDollarIcon className="h-12 w-12 text-orange-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                <div className="text-sm text-gray-500">{order.customerEmail}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.service}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Ready for Pickup' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900 mr-3">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'orders' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Management</h2>
              <p className="text-gray-600">Order management features coming soon...</p>
            </div>
          )}
          
          {activeSection === 'customers' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Management</h2>
              <p className="text-gray-600">Customer management features coming soon...</p>
            </div>
          )}
          
          {activeSection === 'staff' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Staff Management</h2>
              <p className="text-gray-600">Staff management features coming soon...</p>
            </div>
          )}
          
          {activeSection === 'reports' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h2>
              <p className="text-gray-600">Reports and analytics features coming soon...</p>
            </div>
          )}
          
          {activeSection === 'payments' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Management</h2>
              <p className="text-gray-600">Payment management features coming soon...</p>
            </div>
          )}
          
          {activeSection === 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">System settings coming soon...</p>
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

export default AdminDashboard;
