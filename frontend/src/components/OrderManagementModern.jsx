import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  TagIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  BellIcon,
  StarIcon
} from '@heroicons/react/24/outline';

import OrderTable from './OrderTable';
import OrderGrid from './OrderGrid';
import OrderDetailModal from './OrderDetailModal';
import CreateOrderModal from './CreateOrderModal';
import EditOrderModal from './EditOrderModal';

const OrderManagementModern = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // table or grid
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // detail, create, edit
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced mock orders data
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+1 555-0123',
      customerAddress: '123 Main St, City, State 12345',
      service: 'Premium Dry Clean',
      status: 'In Progress',
      priority: 'High',
      amount: 89.99,
      orderDate: '2024-01-20T10:30:00',
      estimatedCompletion: '2024-01-22T16:00:00',
      actualCompletion: null,
      items: [
        { name: 'Business Suit', quantity: 1, price: 45.00, category: 'Formal' },
        { name: 'Silk Dress', quantity: 1, price: 35.00, category: 'Formal' },
        { name: 'Wool Coat', quantity: 1, price: 9.99, category: 'Outerwear' }
      ],
      notes: 'Handle with extra care - delicate fabric',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      assignedStaff: 'Lisa Park',
      customerRating: null,
      tags: ['VIP', 'Delicate'],
      history: [
        { status: 'Order Placed', timestamp: '2024-01-20T10:30:00', note: 'Order received and confirmed', user: 'System' },
        { status: 'In Progress', timestamp: '2024-01-20T14:15:00', note: 'Started processing by Lisa Park', user: 'Lisa Park' }
      ]
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Michael Chen',
      customerEmail: 'mchen@email.com',
      customerPhone: '+1 555-0124',
      customerAddress: '456 Oak Ave, City, State 12345',
      service: 'Wash & Fold',
      status: 'Ready for Pickup',
      priority: 'Normal',
      amount: 34.50,
      orderDate: '2024-01-19T09:15:00',
      estimatedCompletion: '2024-01-21T12:00:00',
      actualCompletion: '2024-01-21T11:30:00',
      items: [
        { name: 'T-Shirts', quantity: 5, price: 15.00, category: 'Casual' },
        { name: 'Jeans', quantity: 2, price: 12.00, category: 'Casual' },
        { name: 'Underwear', quantity: 6, price: 7.50, category: 'Undergarments' }
      ],
      notes: 'Regular customer - preferred detergent: sensitive skin',
      paymentStatus: 'Paid',
      paymentMethod: 'Debit Card',
      assignedStaff: 'David Rodriguez',
      customerRating: 5,
      tags: ['Regular Customer'],
      history: [
        { status: 'Order Placed', timestamp: '2024-01-19T09:15:00', note: 'Order received', user: 'System' },
        { status: 'In Progress', timestamp: '2024-01-19T13:00:00', note: 'Washing started', user: 'David Rodriguez' },
        { status: 'Ready for Pickup', timestamp: '2024-01-21T11:30:00', note: 'Completed and ready', user: 'David Rodriguez' }
      ]
    },
    {
      id: 'ORD-2024-003',
      customerName: 'Emma Wilson',
      customerEmail: 'emma.w@email.com',
      customerPhone: '+1 555-0125',
      customerAddress: '789 Pine St, City, State 12345',
      service: 'Express Steam Press',
      status: 'Completed',
      priority: 'Urgent',
      amount: 45.00,
      orderDate: '2024-01-18T16:45:00',
      estimatedCompletion: '2024-01-19T10:00:00',
      actualCompletion: '2024-01-19T09:45:00',
      items: [
        { name: 'Business Shirts', quantity: 3, price: 45.00, category: 'Formal' }
      ],
      notes: 'Express service - needed for important meeting',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      assignedStaff: 'Maria Garcia',
      customerRating: 4,
      tags: ['Express', 'Business'],
      history: [
        { status: 'Order Placed', timestamp: '2024-01-18T16:45:00', note: 'Express order received', user: 'System' },
        { status: 'In Progress', timestamp: '2024-01-18T17:00:00', note: 'Priority processing started', user: 'Maria Garcia' },
        { status: 'Completed', timestamp: '2024-01-19T09:45:00', note: 'Delivered to customer', user: 'Maria Garcia' }
      ]
    },
    {
      id: 'ORD-2024-004',
      customerName: 'James Rodriguez',
      customerEmail: 'james.r@email.com',
      customerPhone: '+1 555-0126',
      customerAddress: '321 Elm St, City, State 12345',
      service: 'Alterations',
      status: 'Pending',
      priority: 'Low',
      amount: 25.00,
      orderDate: '2024-01-21T14:20:00',
      estimatedCompletion: '2024-01-24T16:00:00',
      actualCompletion: null,
      items: [
        { name: 'Pants Hemming', quantity: 2, price: 25.00, category: 'Alterations' }
      ],
      notes: 'Hem to 32 inch length',
      paymentStatus: 'Pending',
      paymentMethod: 'Credit Card',
      assignedStaff: 'Anna Kim',
      customerRating: null,
      tags: ['Alterations'],
      history: [
        { status: 'Order Placed', timestamp: '2024-01-21T14:20:00', note: 'Alteration order received', user: 'System' }
      ]
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Enhanced filtering logic
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.status.toLowerCase().replace(' ', '_') === statusFilter
      );
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => 
        order.priority.toLowerCase() === priorityFilter
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const orderDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(order => {
            const oDate = new Date(order.orderDate);
            return oDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            const oDate = new Date(order.orderDate);
            return oDate >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(order => {
            const oDate = new Date(order.orderDate);
            return oDate >= monthAgo;
          });
          break;
      }
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, priorityFilter, dateFilter, orders]);

  // Utility functions
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready for pickup': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />;
      case 'in progress': return <ClockIcon className="h-4 w-4" />;
      case 'ready for pickup': return <BellIcon className="h-4 w-4" />;
      case 'pending': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  // Order actions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              actualCompletion: newStatus === 'Completed' ? new Date().toISOString() : order.actualCompletion,
              history: [
                ...order.history,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: `Status updated to ${newStatus}`,
                  user: 'Admin'
                }
              ]
            }
          : order
      )
    );
  };

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) return;
    
    switch (action) {
      case 'complete':
        selectedOrders.forEach(orderId => updateOrderStatus(orderId, 'Completed'));
        break;
      case 'progress':
        selectedOrders.forEach(orderId => updateOrderStatus(orderId, 'In Progress'));
        break;
      case 'ready':
        selectedOrders.forEach(orderId => updateOrderStatus(orderId, 'Ready for Pickup'));
        break;
    }
    setSelectedOrders([]);
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Order Management
              </h1>
              <p className="text-gray-600 mt-2">Manage and track all laundry orders efficiently</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export</span>
              </button>
              <button 
                onClick={() => {
                  setModalType('create');
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                <PlusIcon className="h-5 w-5" />
                <span>New Order</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold">{orders.length}</p>
                <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <TagIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold">
                  {orders.filter(o => o.status === 'In Progress').length}
                </p>
                <p className="text-orange-100 text-xs mt-1">Active orders</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <ClockIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Ready for Pickup</p>
                <p className="text-3xl font-bold">
                  {orders.filter(o => o.status === 'Ready for Pickup').length}
                </p>
                <p className="text-purple-100 text-xs mt-1">Awaiting collection</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <CheckCircleIcon className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">
                  ${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
                </p>
                <p className="text-green-100 text-xs mt-1">This month</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <CurrencyDollarIcon className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6 animate-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="ready_for_pickup">Ready for Pickup</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'table' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Squares2X2Icon className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Bulk Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders, customers, or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedOrders.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkAction('progress')}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Mark In Progress
                  </button>
                  <button
                    onClick={() => handleBulkAction('ready')}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    Ready for Pickup
                  </button>
                  <button
                    onClick={() => handleBulkAction('complete')}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders Display */}
        {viewMode === 'table' ? (
          <OrderTable 
            orders={filteredOrders}
            selectedOrders={selectedOrders}
            onToggleSelection={toggleOrderSelection}
            onSelectAll={selectAllOrders}
            onViewOrder={(order) => {
              setSelectedOrder(order);
              setModalType('detail');
              setShowModal(true);
            }}
            onEditOrder={(order) => {
              setSelectedOrder(order);
              setModalType('edit');
              setShowModal(true);
            }}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getStatusIcon={getStatusIcon}
          />
        ) : (
          <OrderGrid 
            orders={filteredOrders}
            onViewOrder={(order) => {
              setSelectedOrder(order);
              setModalType('detail');
              setShowModal(true);
            }}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
            getStatusIcon={getStatusIcon}
          />
        )}

        {/* Modals */}
        {showModal && (
          <>
            {modalType === 'detail' && (
              <OrderDetailModal
                order={selectedOrder}
                onClose={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                onUpdateStatus={updateOrderStatus}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            )}
            {modalType === 'create' && (
              <CreateOrderModal
                onClose={() => {
                  setShowModal(false);
                }}
                onCreateOrder={(newOrder) => {
                  setOrders(prev => [...prev, newOrder]);
                  setShowModal(false);
                }}
              />
            )}
            {modalType === 'edit' && (
              <EditOrderModal
                order={selectedOrder}
                onClose={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                onUpdateOrder={(updatedOrder) => {
                  setOrders(prev => prev.map(order => 
                    order.id === updatedOrder.id ? updatedOrder : order
                  ));
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManagementModern;
