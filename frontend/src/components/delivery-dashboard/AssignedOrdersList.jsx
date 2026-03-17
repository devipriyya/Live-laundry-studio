import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowsUpDownIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ArrowRightIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ScaleIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const AssignedOrdersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
  
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasMore: false
  });
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
    priority: '',
    orderType: '' // 'pickup' or 'delivery'
  });

  // Fetch assigned orders from backend
  const fetchAssignedOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        status: activeTab,
        page: pagination.currentPage,
        limit: 20,
        sortBy: sortBy,
        sortOrder: sortOrder
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      // Add orderType filter (pickup or delivery)
      if (filters.orderType) {
        params.append('orderType', filters.orderType);
      }
      
      // Add priority filter to backend
      if (filters.priority) {
        params.append('priority', filters.priority);
      }
      
      // Add date filters to backend
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      
      const response = await axios.get(`${API_URL}/delivery-boy/assigned-orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        let filteredOrders = response.data.orders || [];
        
        // Apply client-side amount filters (keeping for flexibility)
        if (filters.minAmount) {
          filteredOrders = filteredOrders.filter(order => order.totalAmount >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
          filteredOrders = filteredOrders.filter(order => order.totalAmount <= parseFloat(filters.maxAmount));
        }
        
        setOrders(filteredOrders);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching assigned orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, activeTab, pagination.currentPage, sortBy, sortOrder, searchTerm, filters]);

  useEffect(() => {
    fetchAssignedOrders();
  }, [fetchAssignedOrders]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (pagination.currentPage === 1) {
        fetchAssignedOrders();
      } else {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      }
    }, 500);
    
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      'order-placed': 'bg-gray-100 text-gray-800',
      'order-accepted': 'bg-blue-100 text-blue-800',
      'out-for-pickup': 'bg-amber-100 text-amber-800',
      'pickup-completed': 'bg-indigo-100 text-indigo-800',
      'wash-in-progress': 'bg-cyan-100 text-cyan-800',
      'wash-completed': 'bg-teal-100 text-teal-800',
      'drying': 'bg-orange-100 text-orange-800',
      'quality-check': 'bg-pink-100 text-pink-800',
      'out-for-delivery': 'bg-purple-100 text-purple-800',
      'delivery-completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'order-placed': t('order_placed', 'Order Placed'),
      'order-accepted': t('order_accepted', 'Order Accepted'),
      'out-for-pickup': t('out_for_pickup', 'Out for Pickup'),
      'pickup-completed': t('pickup_completed', 'Pickup Completed'),
      'wash-in-progress': t('wash_in_progress', 'Wash in Progress'),
      'wash-completed': t('wash_completed', 'Wash Completed'),
      'drying': t('drying', 'Drying'),
      'quality-check': t('quality_check', 'Quality Check'),
      'out-for-delivery': t('out_for_delivery', 'Out for Delivery'),
      'delivery-completed': t('delivered', 'Delivered'),
      'cancelled': t('cancelled', 'Cancelled')
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    if (['out-for-pickup', 'out-for-delivery'].includes(status)) {
      return <TruckIcon className="w-4 h-4" />;
    }
    if (status === 'delivery-completed') {
      return <CheckCircleIcon className="w-4 h-4" />;
    }
    if (status === 'cancelled') {
      return <ExclamationCircleIcon className="w-4 h-4" />;
    }
    return <ClockIcon className="w-4 h-4" />;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'normal': 'bg-gray-100 text-gray-600 border-gray-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    };
    return badges[priority] || badges['normal'];
  };

  const getServiceIcon = (serviceType) => {
    const type = serviceType?.toLowerCase() || '';
    if (type.includes('wash') || type.includes('laundry')) {
      return '🧺';
    }
    if (type.includes('iron') || type.includes('press')) {
      return '👔';
    }
    if (type.includes('dry') && type.includes('clean')) {
      return '✨';
    }
    if (type.includes('shoe')) {
      return '👟';
    }
    return '🧹';
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const clearFilters = () => {
    setFilters({
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: '',
      priority: '',
      orderType: ''
    });
    setSearchTerm('');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // Order Detail Modal
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {t('order_details', 'Order Details')}
              </h2>
              <p className="text-sm text-gray-500">#{order.orderNumber}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Status and Priority */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {getStatusLabel(order.status)}
              </span>
              {order.priority === 'high' && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  ⚡ {t('high_priority', 'High Priority')}
                </span>
              )}
            </div>
            
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-blue-500" />
                {t('customer_info', 'Customer Information')}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">{t('name', 'Name')}:</span> {order.customerInfo?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">{t('phone', 'Phone')}:</span> 
                  <a href={`tel:${order.customerInfo?.phone}`} className="text-blue-600 hover:underline ml-1">
                    {order.customerInfo?.phone}
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">{t('email', 'Email')}:</span> {order.customerInfo?.email}
                </p>
              </div>
            </div>
            
            {/* Address */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-500" />
                {order.addressLabel || t('address', 'Address')}
              </h3>
              <p className="text-gray-700">{order.fullAddress}</p>
              {order.addressInstructions && (
                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">{t('instructions', 'Instructions')}:</span> {order.addressInstructions}
                </p>
              )}
            </div>
            
            {/* Service Details */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-purple-500" />
                {t('service_details', 'Service Details')}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">{t('service_type', 'Service Type')}:</span> {order.serviceTypeDisplay}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">{t('quantity', 'Quantity')}:</span> {order.totalQuantity} {t('items', 'items')}
                </p>
                {order.weight && order.weight !== 'N/A' && (
                  <p className="text-gray-700">
                    <span className="font-medium">{t('weight', 'Weight')}:</span> {order.weight}
                  </p>
                )}
              </div>
              
              {/* Items List */}
              {order.items && order.items.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-2">{t('items_list', 'Items')}:</p>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm text-gray-600 bg-white rounded px-3 py-2">
                        <span>{getServiceIcon(item.service)} {item.name}</span>
                        <span>x{item.quantity} - ₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Dates */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" />
                {t('schedule', 'Schedule')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('order_date', 'Order Date')}</p>
                  <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                {order.pickupDate && (
                  <div>
                    <p className="text-sm text-gray-500">{t('pickup_date', 'Pickup Date')}</p>
                    <p className="font-medium">{new Date(order.pickupDate).toLocaleDateString()}</p>
                  </div>
                )}
                {order.deliveryDate && (
                  <div>
                    <p className="text-sm text-gray-500">{t('delivery_date', 'Delivery Date')}</p>
                    <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                  </div>
                )}
                {order.timeSlot && order.timeSlot !== 'Not specified' && (
                  <div>
                    <p className="text-sm text-gray-500">{t('time_slot', 'Time Slot')}</p>
                    <p className="font-medium">{order.timeSlot}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{t('special_instructions', 'Special Instructions')}</h3>
                <p className="text-gray-700">{order.specialInstructions}</p>
              </div>
            )}
            
            {/* Total Amount */}
            <div className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
              <span className="font-semibold text-gray-900">{t('total_amount', 'Total Amount')}</span>
              <span className="text-2xl font-bold text-green-600 flex items-center">
                <CurrencyRupeeIcon className="w-6 h-6" />
                {order.totalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-6 h-6 text-blue-500" />
                {t('assigned_orders', 'Assigned Orders')}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t('total_orders', 'Total')}: {pagination.totalOrders} {t('orders', 'orders')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-grow md:w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('search_order_customer', 'Search order or customer...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filter & Sort Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FunnelIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('filters', 'Filters')}</span>
                </button>
                <button
                  onClick={fetchAssignedOrders}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                >
                  <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-5 pt-5 border-t border-blue-100">
              {/* Order Type Filter - Pickup/Delivery */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('order_type', 'Order Type')}</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, orderType: '' }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filters.orderType === ''
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t('all_types', 'All Types')}
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, orderType: 'pickup' }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      filters.orderType === 'pickup'
                        ? 'bg-amber-500 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    📦 {t('pickup_orders', 'Pickup Orders')}
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, orderType: 'delivery' }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      filters.orderType === 'delivery'
                        ? 'bg-green-500 text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    🚚 {t('delivery_orders', 'Delivery Orders')}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('min_amount', 'Min Amount')}</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('max_amount', 'Max Amount')}</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('from_date', 'From Date')}</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('to_date', 'To Date')}</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('priority', 'Priority')}</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('all_priorities', 'All Priorities')}</option>
                    <option value="high">{t('high', 'High')}</option>
                    <option value="normal">{t('normal', 'Normal')}</option>
                    <option value="low">{t('low', 'Low')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('status', 'Status')}</label>
                  <select
                    value={activeTab}
                    onChange={(e) => {
                      setActiveTab(e.target.value);
                      setPagination(prev => ({ ...prev, currentPage: 1 }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">{t('all_statuses', 'All Statuses')}</option>
                    <option value="pending">{t('pending', 'Pending')}</option>
                    <option value="completed">{t('completed', 'Completed')}</option>
                    <option value="out-for-pickup">{t('out_for_pickup', 'Out for Pickup')}</option>
                    <option value="pickup-completed">{t('pickup_done', 'Pickup Completed')}</option>
                    <option value="out-for-delivery">{t('out_for_delivery', 'Out for Delivery')}</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {t('search_hint', 'Search by Order ID, Customer Name, or Phone Number')}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('clear_filters', 'Clear All Filters')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {[
              { key: 'all', label: t('all_orders', 'All Orders') },
              { key: 'pending', label: t('pending_orders', 'Pending') },
              { key: 'out-for-pickup', label: t('pickups', 'Pickups') },
              { key: 'out-for-delivery', label: t('deliveries', 'Deliveries') },
              { key: 'completed', label: t('completed', 'Completed') }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="p-5">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('loading_orders', 'Loading orders...')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ExclamationCircleIcon className="w-16 h-16 text-red-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">{t('error_loading', 'Error Loading Orders')}</h3>
              <p className="mt-1 text-gray-500">{error}</p>
              <button 
                onClick={fetchAssignedOrders}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('try_again', 'Try Again')}
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">{t('no_orders_found', 'No Orders Found')}</h3>
              <p className="mt-1 text-gray-500">{t('no_assigned_orders', 'No orders have been assigned to you yet.')}</p>
            </div>
          ) : (
            <>
              {/* Orders Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {orders.map((order) => (
                  <div 
                    key={order._id} 
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-gray-900 text-lg">#{order.orderNumber}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        {order.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                            ⚡ {t('urgent', 'Urgent')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      {/* Customer Info */}
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                          <PhoneIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">{order.customerInfo?.name}</p>
                          <a 
                            href={`tel:${order.customerInfo?.phone}`} 
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {order.customerInfo?.phone}
                          </a>
                        </div>
                      </div>
                      
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">{order.addressLabel}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{order.fullAddress}</p>
                        </div>
                      </div>
                      
                      {/* Service Type */}
                      <div className="flex items-start gap-3">
                        <SparklesIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">{t('service', 'Service')}</p>
                          <p className="text-sm text-gray-700">
                            {order.serviceTypes?.map(s => getServiceIcon(s)).join(' ')} {order.serviceTypeDisplay}
                          </p>
                        </div>
                      </div>
                      
                      {/* Quantity/Weight */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <ClipboardDocumentListIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {order.totalQuantity} {t('items', 'items')}
                          </span>
                        </div>
                        {order.weight && order.weight !== 'N/A' && (
                          <div className="flex items-center gap-2">
                            <ScaleIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.weight}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900 flex items-center">
                        <CurrencyRupeeIcon className="w-5 h-5" />
                        {order.totalAmount}
                      </div>
                      <button
                        onClick={() => navigate(`/delivery-dashboard/order/${order._id}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        {t('view_details', 'View Details')}
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="px-4 py-2 bg-white border-t flex justify-around">
                      <button 
                        onClick={() => handleNavigate(order.fullAddress)}
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm py-1 px-2 rounded hover:bg-blue-50 transition-colors"
                      >
                        <MapPinIcon className="w-4 h-4" />
                        {t('navigate', 'Navigate')}
                      </button>
                      <button 
                        onClick={() => handleCall(order.customerInfo?.phone)}
                        className="flex items-center gap-1 text-gray-600 hover:text-green-600 text-sm py-1 px-2 rounded hover:bg-green-50 transition-colors"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        {t('call', 'Call')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <p className="text-sm text-gray-500">
                    {t('showing', 'Showing')} {((pagination.currentPage - 1) * 20) + 1} - {Math.min(pagination.currentPage * 20, pagination.totalOrders)} {t('of', 'of')} {pagination.totalOrders}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium">
                      {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }} 
        />
      )}
    </div>
  );
};

export default AssignedOrdersList;
