import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Order statuses with display names
  const orderStatuses = [
    { value: 'order-placed', label: 'Order Placed', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'order-accepted', label: 'Order Accepted', color: 'bg-blue-100 text-blue-800' },
    { value: 'out-for-pickup', label: 'Out for Pickup', color: 'bg-purple-100 text-purple-800' },
    { value: 'pickup-completed', label: 'Pickup Completed', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'wash-in-progress', label: 'Wash in Progress', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'wash-completed', label: 'Wash Completed', color: 'bg-teal-100 text-teal-800' },
    { value: 'out-for-delivery', label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800' },
    { value: 'delivery-completed', label: 'Delivery Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  // Payment statuses
  const paymentStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-blue-100 text-blue-800' },
    { value: 'refund-pending', label: 'Refund Pending', color: 'bg-purple-100 text-purple-800' }
  ];

  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders with params:', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
        search: searchTerm || undefined
      });
      
      const response = await api.get('/orders', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
          search: searchTerm || undefined
        }
      });
      
      console.log('Orders API response:', response.data);
      
      // Correctly extract orders from the paginated response
      const ordersData = response.data.orders || [];
      console.log('Processed orders data:', ordersData);
      
      // Ensure ordersData is an array
      const validOrders = Array.isArray(ordersData) ? ordersData : [];
      console.log('Valid orders count:', validOrders.length);
      
      setOrders(validOrders);
      setFilteredOrders(validOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      // Show empty state if API fails
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, priorityFilter, paymentStatusFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, priorityFilter, paymentStatusFilter, orders]);

  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.value === status) || 
           { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getPaymentStatusInfo = (paymentStatus) => {
    return paymentStatuses.find(s => s.value === paymentStatus) || 
           { label: paymentStatus, color: 'bg-gray-100 text-gray-800' };
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated to ${getStatusInfo(newStatus).label}`
      });
      
      // Refresh orders after update
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusUpdateDropdown = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>Update Status</span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="py-1">
              {orderStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => {
                    updateOrderStatus(order._id, status.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    order.status === status.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const OrderModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(order.status).color}`}>
                  {getStatusInfo(order.status).label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusInfo(order.paymentStatus).color}`}>
                  {getPaymentStatusInfo(order.paymentStatus).label}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)} Priority
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Information */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {order.customerInfo.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-blue-900">{order.customerInfo.name}</p>
                    <p className="text-blue-700">Customer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-blue-800">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>{order.customerInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-blue-800">
                  <PhoneIcon className="w-5 h-5" />
                  <span>{order.customerInfo.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-blue-800">
                  <MapPinIcon className="w-5 h-5 mt-0.5" />
                  <span>
                    {order.customerInfo.address.street}, {order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-4">Order Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-800">
                  <CalendarIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-green-700">Order Date</p>
                    <p className="font-bold">{formatDate(order.orderDate || order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-green-800">
                  <TruckIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-green-700">Pickup Date</p>
                    <p className="font-bold">{order.pickupDate ? formatDate(order.pickupDate) : 'Not scheduled'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-green-800">
                  <CurrencyDollarIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-green-700">Total Amount</p>
                    <p className="font-bold text-2xl">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-green-800">
                  <div className="w-5 h-5">
                    <CurrencyDollarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Payment Status</p>
                    <p className="font-bold">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusInfo(order.paymentStatus).color}`}>
                        {getPaymentStatusInfo(order.paymentStatus).label}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-900">₹{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-900 font-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status History */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Status History</h3>
            <div className="space-y-4">
              {order.statusHistory.map((history, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{getStatusInfo(history.status).label}</h4>
                      <span className="text-sm text-gray-500">{formatDate(history.timestamp)}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{history.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h3>
            <div className="flex gap-2 flex-wrap">
              {orderStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => updateOrderStatus(order._id, status.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    order.status === status.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                🛍️ Order Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl">
                <span className="font-bold">{filteredOrders.length}</span> Orders
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, or Email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Payment Status</option>
                  {paymentStatuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <ArrowPathIcon className="h-6 w-6 animate-spin text-purple-600" />
                <span className="text-gray-600 font-medium">Loading orders...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Payment</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                          <div className="text-sm text-gray-600">{order.customerInfo.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {order.totalItems} item{order.totalItems > 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(order.status).color}`}>
                          {getStatusInfo(order.status).label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusInfo(order.paymentStatus).color}`}>
                          {getPaymentStatusInfo(order.paymentStatus).label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{formatDate(order.orderDate || order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <StatusUpdateDropdown order={order} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || paymentStatusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No orders have been placed yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminOrderManagement;