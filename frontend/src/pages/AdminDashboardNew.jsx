import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderManagementNew from '../components/OrderManagementNew';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import InventoryManagement from '../components/InventoryManagement';
import ReportsAnalytics from '../components/ReportsAnalytics';
import PaymentManagement from '../components/PaymentManagement';
import Settings from '../components/Settings';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  UserGroupIcon,
  CubeIcon,
  ChartPieIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  BanknotesIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  FireIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const AdminDashboardNew = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 1847,
      activeOrders: 67,
      completedOrders: 1780,
      totalCustomers: 892,
      totalRevenue: 78450.75,
      todayRevenue: 2340.50,
      pendingPayments: 18,
      activeStaff: 24,
      totalServices: 12,
      inventoryItems: 156,
      avgRating: 4.8,
      monthlyGrowth: 15.2
    },
    recentOrders: [
      {
        id: 'ORD-2024-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        phone: '+1 555-0123',
        service: 'Premium Dry Clean',
        status: 'In Progress',
        amount: 89.99,
        orderDate: '2024-01-20',
        priority: 'high',
        items: 5,
        estimatedCompletion: '2024-01-22'
      },
      {
        id: 'ORD-2024-002',
        customerName: 'Michael Chen',
        customerEmail: 'mchen@email.com',
        phone: '+1 555-0124',
        service: 'Wash & Fold',
        status: 'Ready for Pickup',
        amount: 34.50,
        orderDate: '2024-01-19',
        priority: 'normal',
        items: 8,
        estimatedCompletion: '2024-01-21'
      },
      {
        id: 'ORD-2024-003',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.w@email.com',
        phone: '+1 555-0125',
        service: 'Express Steam Press',
        status: 'Completed',
        amount: 45.00,
        orderDate: '2024-01-18',
        priority: 'urgent',
        items: 3,
        estimatedCompletion: '2024-01-19'
      }
    ],
    customers: [
      {
        id: 'CUST-001',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1 555-0123',
        totalOrders: 23,
        totalSpent: 1245.67,
        joinDate: '2023-08-15',
        status: 'Premium',
        lastOrder: '2024-01-20'
      },
      {
        id: 'CUST-002',
        name: 'Michael Chen',
        email: 'mchen@email.com',
        phone: '+1 555-0124',
        totalOrders: 15,
        totalSpent: 678.90,
        joinDate: '2023-10-22',
        status: 'Regular',
        lastOrder: '2024-01-19'
      }
    ],
    staff: [
      {
        id: 'STAFF-001',
        name: 'David Rodriguez',
        role: 'Manager',
        department: 'Operations',
        email: 'david.r@fabricspa.com',
        phone: '+1 555-0201',
        status: 'Active',
        rating: 4.9,
        ordersCompleted: 156,
        joinDate: '2023-03-15'
      },
      {
        id: 'STAFF-002',
        name: 'Lisa Park',
        role: 'Technician',
        department: 'Dry Cleaning',
        email: 'lisa.p@fabricspa.com',
        phone: '+1 555-0202',
        status: 'Active',
        rating: 4.7,
        ordersCompleted: 89,
        joinDate: '2023-06-20'
      }
    ],
    inventory: [
      {
        id: 'INV-001',
        name: 'Premium Detergent',
        category: 'Cleaning Supplies',
        currentStock: 45,
        minStock: 20,
        maxStock: 100,
        unitCost: 12.50,
        supplier: 'CleanCorp Ltd',
        lastRestocked: '2024-01-15'
      },
      {
        id: 'INV-002',
        name: 'Garment Bags',
        category: 'Packaging',
        currentStock: 8,
        minStock: 15,
        maxStock: 50,
        unitCost: 0.75,
        supplier: 'PackPro Inc',
        lastRestocked: '2024-01-10'
      }
    ]
  });

  // Navigation menu items
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, color: 'blue' },
    { id: 'orders', name: 'Order Management', icon: ClipboardDocumentListIcon, color: 'green' },
    { id: 'customers', name: 'Customer Management', icon: UsersIcon, color: 'purple' },
    { id: 'staff', name: 'Staff Management', icon: UserGroupIcon, color: 'pink' },
    { id: 'inventory', name: 'Inventory', icon: CubeIcon, color: 'indigo' },
    { id: 'reports', name: 'Reports & Analytics', icon: ChartPieIcon, color: 'teal' },
    { id: 'payments', name: 'Payment Management', icon: CreditCardIcon, color: 'emerald' },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon, color: 'gray' }
  ];

  // Handle menu navigation
  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Get status badge color
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

  // Dashboard Statistics Component
  const DashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 font-medium text-sm">Total Orders</p>
            <p className="text-3xl font-bold text-blue-900">{dashboardData.stats.totalOrders.toLocaleString()}</p>
            <p className="text-blue-600 text-sm mt-1">+12% from last month</p>
          </div>
          <div className="bg-blue-200 p-3 rounded-xl">
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 font-medium text-sm">Active Orders</p>
            <p className="text-3xl font-bold text-green-900">{dashboardData.stats.activeOrders}</p>
            <p className="text-green-600 text-sm mt-1">Processing now</p>
          </div>
          <div className="bg-green-200 p-3 rounded-xl">
            <ClockIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-700 font-medium text-sm">Total Customers</p>
            <p className="text-3xl font-bold text-purple-900">{dashboardData.stats.totalCustomers.toLocaleString()}</p>
            <p className="text-purple-600 text-sm mt-1">+8% growth</p>
          </div>
          <div className="bg-purple-200 p-3 rounded-xl">
            <UsersIcon className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-700 font-medium text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-orange-900">₹{dashboardData.stats.totalRevenue.toLocaleString()}</p>
            <p className="text-orange-600 text-sm mt-1">+15% this month</p>
          </div>
          <div className="bg-orange-200 p-3 rounded-xl">
            <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );

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
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
                  ? `bg-${item.color}-50 text-${item.color}-700 border-r-4 border-${item.color}-500`
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`h-5 w-5 ${
                activeSection === item.id ? `text-${item.color}-600` : 'text-gray-400'
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
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
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
              <button 
                onClick={handleRefresh}
                className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${refreshing ? 'animate-spin' : ''}`}
              >
                <ArrowPathIcon className="h-6 w-6" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
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
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'dashboard' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                  <p className="text-gray-600">Comprehensive laundry management system with real-time insights</p>
                </div>
                
                <DashboardStats />

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <PlusIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">New Order</h3>
                        <p className="text-gray-600 text-sm">Create a new order</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <MagnifyingGlassIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Search Orders</h3>
                        <p className="text-gray-600 text-sm">Find existing orders</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <ChartBarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">View Reports</h3>
                        <p className="text-gray-600 text-sm">Analytics & insights</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                <div className="text-sm text-gray-500">{order.orderDate}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                <div className="text-sm text-gray-500">{order.customerEmail}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{order.service}</div>
                              <div className="text-sm text-gray-500">{order.items} items</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${order.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900 p-1 rounded">
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900 p-1 rounded">
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
            )}

            {/* Integrated Management Components */}
            {activeSection === 'orders' && <OrderManagementNew />}
            {activeSection === 'customers' && <CustomerManagement />}
            {activeSection === 'staff' && <StaffManagement />}
            {activeSection === 'inventory' && <InventoryManagement />}
            {activeSection === 'reports' && <ReportsAnalytics />}
            {activeSection === 'payments' && <PaymentManagement />}
            {activeSection === 'settings' && <Settings />}
          </div>
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

export default AdminDashboardNew;
