import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EyeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ShoppingBagIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load orders from the order service
  const loadOrders = () => {
    try {
      const allOrders = orderService.getAllOrders();
      return allOrders;
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  };

  useEffect(() => {
    // Load real orders from order service
    setLoading(true);
    setTimeout(() => {
      const realOrders = loadOrders();
      setOrders(realOrders);
      setFilteredOrders(realOrders);
      setLoading(false);
    }, 500);
  }, []);

  // Listen for order updates (when user navigates back from other pages)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedOrders = loadOrders();
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    };

    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates when the component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleStorageChange();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // Filter orders based on search term and status
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'text-yellow-700 bg-yellow-100 border-yellow-200',
      'Approved': 'text-blue-700 bg-blue-100 border-blue-200',
      'Pick Up In Progress': 'text-purple-700 bg-purple-100 border-purple-200',
      'Pick Up Completed': 'text-indigo-700 bg-indigo-100 border-indigo-200',
      'Wash Done': 'text-cyan-700 bg-cyan-100 border-cyan-200',
      'Out For Delivery': 'text-orange-700 bg-orange-100 border-orange-200',
      'Delivered': 'text-green-700 bg-green-100 border-green-200'
    };
    return statusColors[status] || 'text-gray-700 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': ClockIcon,
      'Approved': CheckCircleIcon,
      'Pick Up In Progress': TruckIcon,
      'Pick Up Completed': CheckCircleIcon,
      'Wash Done': SparklesIcon,
      'Out For Delivery': TruckIcon,
      'Delivered': CheckCircleIcon
    };
    return icons[status] || DocumentTextIcon;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getOrderProgress = (status) => {
    const progressMap = {
      'Pending': 10,
      'Approved': 25,
      'Pick Up In Progress': 40,
      'Pick Up Completed': 55,
      'Wash Done': 75,
      'Out For Delivery': 90,
      'Delivered': 100
    };
    return progressMap[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
              <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  🛍️ My Orders
                </h1>
                <p className="text-gray-600">View and manage all your laundry orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-6 w-6 text-purple-500" />
              <span className="text-purple-600 font-medium">{filteredOrders.length} Orders</span>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-6 sm:px-8 lg:px-12 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Service, or Status..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                    />
                  </div>
                </div>
                
                {/* Status Filter */}
                <div className="lg:w-64">
                  <div className="relative">
                    <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Pick Up In Progress">Pick Up In Progress</option>
                      <option value="Pick Up Completed">Pick Up Completed</option>
                      <option value="Wash Done">Wash Done</option>
                      <option value="Out For Delivery">Out For Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'You haven\'t placed any orders yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const progress = getOrderProgress(order.status);
              
              return (
                <div key={order.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-300">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <StatusIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.service}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-200">
                        <p className="text-xs text-blue-700 font-medium">Items</p>
                        <p className="text-sm font-bold text-blue-900">{order.items} items</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                        <p className="text-xs text-green-700 font-medium">Total</p>
                        <p className="text-sm font-bold text-green-900">${order.total}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium text-gray-900">{order.orderDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium text-gray-900">{order.deliveryDate}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                      <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center text-sm">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Order Details - {selectedOrder.id}</h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Information */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-4">Order Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Order ID:</span>
                        <span className="font-semibold text-purple-900">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Service:</span>
                        <span className="font-semibold text-purple-900">{selectedOrder.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Order Date:</span>
                        <span className="font-semibold text-purple-900">{selectedOrder.orderDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Pickup Date:</span>
                        <span className="font-semibold text-purple-900">{selectedOrder.pickupDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Delivery Date:</span>
                        <span className="font-semibold text-purple-900">{selectedOrder.deliveryDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h4 className="font-bold text-green-900 mb-4">Customer Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-green-700 text-sm">Name:</span>
                        <p className="font-semibold text-green-900">{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <span className="text-green-700 text-sm">Address:</span>
                        <p className="font-semibold text-green-900">{selectedOrder.customer.address}</p>
                      </div>
                      <div>
                        <span className="text-green-700 text-sm">Phone:</span>
                        <p className="font-semibold text-green-900">{selectedOrder.customer.phone}</p>
                      </div>
                      <div>
                        <span className="text-green-700 text-sm">Email:</span>
                        <p className="font-semibold text-green-900">{selectedOrder.customer.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items and Pricing */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.itemsList.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0">
                          <div>
                            <p className="font-medium text-blue-900">{item.name}</p>
                            <p className="text-sm text-blue-700">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-blue-900">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                    <h4 className="font-bold text-orange-900 mb-4">Order Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-orange-700">Total Items:</span>
                        <span className="font-semibold text-orange-900">{selectedOrder.items} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-700">Total Weight:</span>
                        <span className="font-semibold text-orange-900">{selectedOrder.weight}</span>
                      </div>
                      <div className="border-t border-orange-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-orange-900">Total Amount:</span>
                          <span className="text-2xl font-bold text-orange-900">${selectedOrder.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      <span>Contact Support</span>
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                      <PhoneIcon className="h-5 w-5" />
                      <span>Call Us</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
