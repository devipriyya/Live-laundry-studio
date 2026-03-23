import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ArrowRightIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const AssignedOrdersListModern = ({ initialTab = 'all' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
  
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasMore: false
  });
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    orderType: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Status flow for delivery boy actions
  const STATUS_FLOW = {
    'order-placed': 'out-for-pickup',
    'order-accepted': 'out-for-pickup',
    'out-for-pickup': 'pickup-completed',
    'pickup-completed': 'out-for-delivery',
    'out-for-delivery': 'delivery-completed'
  };

  const STATUS_BUTTON_CONFIG = {
    'out-for-pickup':    { label: 'Mark Out for Pickup',  gradient: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' },
    'pickup-completed':  { label: 'Confirm Pickup',        gradient: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' },
    'out-for-delivery':  { label: 'Out for Delivery',      gradient: 'from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600' },
    'delivery-completed':{ label: 'Confirm Delivered',     gradient: 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' }
  };

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
      
      if (searchTerm) params.append('search', searchTerm);
      if (filters.orderType) params.append('orderType', filters.orderType);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      
      const response = await axios.get(`${API_URL}/delivery-boy/assigned-orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        let filteredOrders = response.data.orders || [];
        
        if (filters.minAmount) {
          filteredOrders = filteredOrders.filter(order => order.totalAmount >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
          filteredOrders = filteredOrders.filter(order => order.totalAmount <= parseFloat(filters.maxAmount));
        }
        
        setOrders(filteredOrders);
        setPagination(response.data.pagination);
        
        // Calculate stats
        const allOrders = response.data.orders || [];
        setStats({
          total: response.data.pagination?.totalOrders || allOrders.length,
          pending: allOrders.filter(o => ['order-placed', 'order-accepted'].includes(o.status)).length,
          inProgress: allOrders.filter(o => ['out-for-pickup', 'out-for-delivery'].includes(o.status)).length,
          completed: allOrders.filter(o => o.status === 'delivery-completed').length
        });
      }
    } catch (err) {
      console.error('Error fetching assigned orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL, activeTab, pagination.currentPage, sortBy, sortOrder, searchTerm, filters]);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId, newStatus, e) => {
    e?.stopPropagation();
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/orders/${orderId}/delivery-status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAssignedOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.response?.data?.message || 'Failed to update status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  }, [API_URL, fetchAssignedOrders]);

  useEffect(() => {
    fetchAssignedOrders();
  }, [fetchAssignedOrders]);

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

  // Status configurations - Dashboard-style pastel colors
  const statusConfig = {
    'order-placed': { bg: 'bg-gradient-to-br from-gray-100 to-slate-200', text: 'text-gray-700', iconBg: 'bg-gradient-to-br from-gray-500 to-slate-600', icon: ClockIcon },
    'order-accepted': { bg: 'bg-gradient-to-br from-blue-100 to-cyan-200', text: 'text-blue-700', iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500', icon: CheckCircleIcon },
    'out-for-pickup': { bg: 'bg-gradient-to-br from-amber-100 to-orange-200', text: 'text-amber-700', iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500', icon: CubeIcon },
    'pickup-completed': { bg: 'bg-gradient-to-br from-indigo-100 to-purple-200', text: 'text-indigo-700', iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-500', icon: CheckCircleIcon },
    'wash-in-progress': { bg: 'bg-gradient-to-br from-cyan-100 to-teal-200', text: 'text-cyan-700', iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-500', icon: SparklesIcon },
    'wash-completed': { bg: 'bg-gradient-to-br from-teal-100 to-emerald-200', text: 'text-teal-700', iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-500', icon: CheckCircleIcon },
    'out-for-delivery': { bg: 'bg-gradient-to-br from-purple-100 to-indigo-200', text: 'text-purple-700', iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-500', icon: TruckIcon },
    'delivery-completed': { bg: 'bg-gradient-to-br from-green-100 to-emerald-200', text: 'text-green-700', iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500', icon: CheckBadgeIcon },
    'delivery-failed': { bg: 'bg-gradient-to-br from-red-100 to-rose-200', text: 'text-red-700', iconBg: 'bg-gradient-to-br from-red-500 to-rose-500', icon: ExclamationTriangleIcon },
    'cancelled': { bg: 'bg-gradient-to-br from-red-100 to-rose-200', text: 'text-red-700', iconBg: 'bg-gradient-to-br from-red-500 to-rose-500', icon: XMarkIcon }
  };

  const getStatusConfig = (status) => statusConfig[status] || statusConfig['order-placed'];

  const getStatusLabel = (status) => {
    const labels = {
      'order-placed': 'Pending',
      'order-accepted': 'Accepted',
      'out-for-pickup': 'Pickup',
      'pickup-completed': 'Picked Up',
      'wash-in-progress': 'Processing',
      'wash-completed': 'Ready',
      'out-for-delivery': 'Delivering',
      'delivery-completed': 'Delivered',
      'delivery-failed': 'Failed',
      'cancelled': 'Cancelled'
    };
    return t(status?.replace(/-/g, '_'), labels[status] || status);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      orderType: ''
    });
    setSearchTerm('');
  };

  const handleCall = (phone, e) => {
    e?.stopPropagation();
    window.location.href = `tel:${phone}`;
  };
  
  const handleNavigate = (address, e) => {
    e?.stopPropagation();
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  // Dashboard-style Pastel Gradient Stats Cards
  const StatsCards = () => {
    const statItems = [
      { 
        label: t('total', 'Total Orders'), 
        value: stats.total, 
        icon: ClipboardDocumentListIcon, 
        bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500'
      },
      { 
        label: t('pending', 'Pending'), 
        value: stats.pending, 
        icon: ClockIcon, 
        bgColor: 'bg-gradient-to-br from-amber-100 to-orange-200',
        iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
        badge: stats.pending > 0 ? t('action_needed', 'Action needed') : null
      },
      { 
        label: t('in_progress', 'In Progress'), 
        value: stats.inProgress, 
        icon: TruckIcon, 
        bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-200',
        iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-500'
      },
      { 
        label: t('completed', 'Completed'), 
        value: stats.completed, 
        icon: CheckBadgeIcon, 
        bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
        iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500'
      }
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statItems.map((stat, index) => (
          <div 
            key={index}
            className={`${stat.bgColor} rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer transition-all duration-500 group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.badge && (
                <span className="text-xs font-semibold px-2.5 py-1 bg-white/80 text-amber-700 rounded-full shadow-sm">
                  {stat.badge}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    );
  };

  // Dashboard-style Pastel Order Card Component
  const OrderCard = ({ order }) => {
    const config = getStatusConfig(order.status);
    const StatusIcon = config.icon;
    const nextStatus = STATUS_FLOW[order.status];
    const btnConfig = nextStatus ? STATUS_BUTTON_CONFIG[nextStatus] : null;
    const isUpdating = updatingOrderId === order._id;
    
    return (
      <div 
        className={`${config.bg} rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden cursor-pointer group`}
        onClick={() => navigate(`/delivery-dashboard/order/${order._id}`)}
      >
        {/* Card Header */}
        <div className="p-4 border-b border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-800 text-lg">#{order.orderNumber}</span>
              {order.priority === 'high' && (
                <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs font-semibold rounded-full shadow-md">
                  Urgent
                </span>
              )}
            </div>
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 shadow-sm ${config.text}`}>
              <div className={`w-5 h-5 ${config.iconBg} rounded-full flex items-center justify-center`}>
                <StatusIcon className="w-3 h-3 text-white" />
              </div>
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-4 space-y-4">
          {/* Customer */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-sm">
                {order.customerInfo?.name?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-800 truncate">{order.customerInfo?.name}</p>
              <p className="text-sm text-gray-600">{order.customerInfo?.phone}</p>
            </div>
            <button 
              onClick={(e) => handleCall(order.customerInfo?.phone, e)}
              className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all group-hover:scale-105"
            >
              <PhoneIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 text-sm bg-white/50 rounded-xl p-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <MapPinIcon className="w-4 h-4 text-white" />
            </div>
            <p className="text-gray-700 font-medium line-clamp-2">{order.fullAddress}</p>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <CalendarIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 font-medium">
              {new Date(order.orderDate).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Items & Amount */}
          <div className="flex items-center justify-between pt-3 border-t border-white/30">
            <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg shadow-sm">
              <CubeIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{order.totalQuantity || 0} items</span>
            </div>
            <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-lg font-bold shadow-md">
              <CurrencyRupeeIcon className="w-4 h-4" />
              <span>{order.totalAmount}</span>
            </div>
          </div>

          {/* Payment Badge */}
          {order.paymentMethod && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm ${
                order.paymentStatus === 'paid' 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700' 
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700'
              }`}>
                {order.paymentMethod === 'cod' ? '💵 COD' : '✓ Paid'}
              </span>
            </div>
          )}
        </div>
        
        {/* Card Footer - Action Buttons */}
        <div className="px-4 py-3 bg-white/60 border-t border-white/30 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => handleNavigate(order.fullAddress, e)}
              className="flex items-center gap-2 px-3 py-2 bg-white/80 hover:bg-white text-gray-700 font-medium rounded-lg shadow-sm hover:shadow transition-all text-sm"
            >
              <MapPinIcon className="w-4 h-4 text-purple-500" />
              Navigate
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/delivery-dashboard/order/${order._id}`);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              View Details
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Status Update Button */}
          {btnConfig && (
            <button
              onClick={(e) => updateOrderStatus(order._id, nextStatus, e)}
              disabled={isUpdating}
              className={`w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r ${btnConfig.gradient} shadow-md hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isUpdating ? (
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )}
              {isUpdating ? 'Updating...' : btnConfig.label}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Tab definitions
  const tabs = [
    { key: 'all', label: t('all_orders', 'All'), icon: ClipboardDocumentListIcon },
    { key: 'pending', label: t('pending', 'Pending'), icon: ClockIcon },
    { key: 'out-for-pickup', label: t('pickups', 'Pickups'), icon: CubeIcon },
    { key: 'out-for-delivery', label: t('deliveries', 'Deliveries'), icon: TruckIcon },
    { key: 'completed', label: t('completed', 'Completed'), icon: CheckBadgeIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">{t('my_orders', 'My Orders')}</h1>
                <p className="text-blue-100 mt-1">{t('manage_deliveries', 'Manage your assigned deliveries')}</p>
              </div>
              <button
                onClick={fetchAssignedOrders}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all shadow-lg"
              >
                <ArrowPathIcon className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-semibold text-white">{t('refresh', 'Refresh')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* Search & Filters */}
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/50">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('search_orders', 'Search orders, customers...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>

              {/* Filter & Sort */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all shadow-sm ${
                    showFilters 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-transparent text-white shadow-lg' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <FunnelIcon className="w-4 h-4" />
                  {t('filters', 'Filters')}
                  {(filters.orderType || filters.dateFrom) && (
                    <span className={`w-2 h-2 rounded-full ${showFilters ? 'bg-white' : 'bg-blue-500'}`}></span>
                  )}
                </button>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                >
                  <option value="createdAt-desc">{t('newest', 'Newest')}</option>
                  <option value="createdAt-asc">{t('oldest', 'Oldest')}</option>
                </select>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Type Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('type', 'Type')}:</span>
                    {[
                      { key: '', label: t('all', 'All') },
                      { key: 'pickup', label: t('pickup', 'Pickup') },
                      { key: 'delivery', label: t('delivery', 'Delivery') }
                    ].map((type) => (
                      <button
                        key={type.key}
                        onClick={() => setFilters(prev => ({ ...prev, orderType: type.key }))}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                          filters.orderType === type.key
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Date Filters */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('date', 'Date')}:</span>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                      placeholder={t('from', 'From')}
                    />
                    <span className="text-gray-400 font-medium">→</span>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                      placeholder={t('to', 'To')}
                    />
                  </div>

                  {/* Clear Filters */}
                  {(filters.orderType || filters.dateFrom || filters.dateTo) && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      ✕ {t('clear', 'Clear')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/30">
            <div className="flex overflow-x-auto px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-3 transition-all ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    activeTab === tab.key 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md' 
                      : 'bg-gray-100'
                  }`}>
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Content */}
          <div className="p-5 bg-gradient-to-br from-gray-50/50 to-blue-50/30">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <ArrowPathIcon className="w-7 h-7 text-white animate-spin" />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-500">{t('loading', 'Loading orders...')}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-rose-200 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                  <ExclamationCircleIcon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('error', 'Something went wrong')}</h3>
                <p className="text-sm text-gray-500 mb-5">{error}</p>
                <button 
                  onClick={fetchAssignedOrders}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  {t('try_again', 'Try Again')}
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl flex items-center justify-center shadow-lg mb-5">
                  <ClipboardDocumentListIcon className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('no_orders', 'No Orders Found')}</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                  {searchTerm || Object.values(filters).some(v => v) 
                    ? t('try_adjusting_filters', 'Try adjusting your search or filters')
                    : t('no_orders_assigned', 'You have no orders assigned yet. Check back later!')}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-500">
                      {t('showing', 'Showing')} <span className="text-gray-800">{((pagination.currentPage - 1) * 20) + 1} - {Math.min(pagination.currentPage * 20, pagination.totalOrders)}</span> {t('of', 'of')} <span className="text-gray-800">{pagination.totalOrders}</span> orders
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        <ChevronLeftIcon className="w-4 h-4" />
                        {t('prev', 'Previous')}
                      </button>
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-xl shadow-md">
                        {pagination.currentPage} / {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        {t('next', 'Next')}
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedOrdersListModern;
