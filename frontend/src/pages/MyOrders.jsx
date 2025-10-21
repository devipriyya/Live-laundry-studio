import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import ReviewForm from '../components/ReviewForm';
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
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  // Load orders from the backend API
  const loadOrders = async (email) => {
    try {
      if (!email) {
        console.log('No email provided, cannot fetch orders');
        return [];
      }
      const response = await api.get(`/orders/my?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  };

  useEffect(() => {
    // Get user email from context or localStorage
    let email = user?.email;
    if (!email) {
      // Try to get from localStorage as fallback
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      email = storedUser.email;
    }
    
    setUserEmail(email || '');
    
    // Load real orders from backend API
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (email) {
          const realOrders = await loadOrders(email);
          setOrders(realOrders);
          setFilteredOrders(realOrders);
        } else {
          // No email available, show empty state
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  // Refresh orders when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && userEmail) {
        const updatedOrders = await loadOrders(userEmail);
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userEmail]);

  useEffect(() => {
    // Filter orders based on search term and status
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      // Legacy statuses
      'Pending': 'text-yellow-700 bg-yellow-100 border-yellow-200',
      'Approved': 'text-blue-700 bg-blue-100 border-blue-200',
      'Pick Up In Progress': 'text-purple-700 bg-purple-100 border-purple-200',
      'Pick Up Completed': 'text-indigo-700 bg-indigo-100 border-indigo-200',
      'Wash Done': 'text-cyan-700 bg-cyan-100 border-cyan-200',
      'Out For Delivery': 'text-orange-700 bg-orange-100 border-orange-200',
      'Delivered': 'text-green-700 bg-green-100 border-green-200',
      // New admin statuses
      'order-placed': 'text-yellow-700 bg-yellow-100 border-yellow-200',
      'order-accepted': 'text-blue-700 bg-blue-100 border-blue-200',
      'out-for-pickup': 'text-purple-700 bg-purple-100 border-purple-200',
      'pickup-completed': 'text-indigo-700 bg-indigo-100 border-indigo-200',
      'wash-in-progress': 'text-cyan-700 bg-cyan-100 border-cyan-200',
      'wash-completed': 'text-teal-700 bg-teal-100 border-teal-200',
      'out-for-delivery': 'text-orange-700 bg-orange-100 border-orange-200',
      'delivery-completed': 'text-green-700 bg-green-100 border-green-200'
    };
    return statusColors[status] || 'text-gray-700 bg-gray-100 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      // Legacy statuses
      'Pending': ClockIcon,
      'Approved': CheckCircleIcon,
      'Pick Up In Progress': TruckIcon,
      'Pick Up Completed': CheckCircleIcon,
      'Wash Done': SparklesIcon,
      'Out For Delivery': TruckIcon,
      'Delivered': CheckCircleIcon,
      // New admin statuses
      'order-placed': ClockIcon,
      'order-accepted': CheckCircleIcon,
      'out-for-pickup': TruckIcon,
      'pickup-completed': CheckCircleIcon,
      'wash-in-progress': SparklesIcon,
      'wash-completed': SparklesIcon,
      'out-for-delivery': TruckIcon,
      'delivery-completed': CheckCircleIcon
    };
    return icons[status] || DocumentTextIcon;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getOrderProgress = (status) => {
    const progressMap = {
      // Legacy statuses
      'Pending': 10,
      'Approved': 25,
      'Pick Up In Progress': 40,
      'Pick Up Completed': 55,
      'Wash Done': 75,
      'Out For Delivery': 90,
      'Delivered': 100,
      // New admin statuses
      'order-placed': 10,
      'order-accepted': 25,
      'out-for-pickup': 40,
      'pickup-completed': 55,
      'wash-in-progress': 70,
      'wash-completed': 80,
      'out-for-delivery': 90,
      'delivery-completed': 100
    };
    return progressMap[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            </div>
            <div className="text-sm text-gray-600">
              {filteredOrders.length} {filteredOrders.length === 1 ? 'Order' : 'Orders'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                  />
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="md:w-56">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="order-placed">Order Placed</option>
                  <option value="order-accepted">Order Accepted</option>
                  <option value="out-for-pickup">Out for Pickup</option>
                  <option value="pickup-completed">Pickup Completed</option>
                  <option value="wash-in-progress">Wash in Progress</option>
                  <option value="wash-completed">Wash Completed</option>
                  <option value="out-for-delivery">Out for Delivery</option>
                  <option value="delivery-completed">Delivery Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {!userEmail ? (
          <div className="text-center py-12">
            <InformationCircleIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Please Log In</h3>
            <p className="text-gray-500 mb-4">
              You need to be logged in to view your orders.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'You haven\'t placed any orders yet.'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/schedule-pickup')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Place Your First Order
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const progress = getOrderProgress(order.status);
              
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-5">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace(/-/g, ' ')}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Items</p>
                        <p className="font-semibold text-gray-900">{order.totalItems}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900">₹{order.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Delivery</p>
                        <p className="font-semibold text-gray-900">{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        View Details
                      </button>
                      
                      {order.paymentStatus === 'paid' && (
                        <button
                          onClick={() => navigate(`/invoice/${order._id}`)}
                          className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          Invoice
                        </button>
                      )}
                      
                      {(['order-placed', 'order-accepted'].includes(order.status)) && (
                        <button
                          onClick={() => {
                            setCancellingOrder(order);
                            setShowCancelModal(true);
                          }}
                          className="px-4 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">{selectedOrder.orderNumber}</h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium text-gray-900">{new Date(selectedOrder.orderDate || selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup Date:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.pickupDate ? new Date(selectedOrder.pickupDate).toLocaleDateString() : 'TBD'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Date:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'TBD'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.customerInfo.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.customerInfo.address.street}, {selectedOrder.customerInfo.address.city}, {selectedOrder.customerInfo.address.state} {selectedOrder.customerInfo.address.zipCode}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.customerInfo.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.customerInfo.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items and Pricing */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Items:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.totalItems} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Weight:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.weight}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-semibold text-gray-900">Total:</span>
                          <span className="text-xl font-bold text-yellow-600">₹{selectedOrder.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {selectedOrder.paymentStatus === 'paid' && (
                      <button 
                        onClick={() => navigate(`/invoice/${selectedOrder._id}`)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Invoice
                      </button>
                    )}
                    
                    {(['order-placed', 'order-accepted'].includes(selectedOrder.status)) && (
                      <button 
                        onClick={() => {
                          setCancellingOrder(selectedOrder);
                          setShowCancelModal(true);
                        }}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setShowOrderDetails(false)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <ReviewForm
                orderId={selectedOrder._id}
                orderNumber={selectedOrder.orderNumber}
                customerInfo={selectedOrder.customerInfo}
                onSubmitSuccess={() => {
                  setShowReviewForm(false);
                  alert('Thank you for your review!');
                }}
              />
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && cancellingOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 mb-4">Are you sure you want to cancel order <strong>{cancellingOrder.orderNumber}</strong>?</p>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cancellation Reason
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please tell us why you're cancelling..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={async () => {
                    try {
                      await api.patch(`/orders/${cancellingOrder._id}/cancel`, {
                        reason: cancelReason || 'Customer request',
                        email: userEmail
                      });
                      alert('Order cancelled successfully. Refund will be processed.');
                      setShowCancelModal(false);
                      setCancelReason('');
                      // Refresh orders
                      const updatedOrders = await loadOrders(userEmail);
                      setOrders(updatedOrders);
                      setFilteredOrders(updatedOrders);
                      setShowOrderDetails(false);
                    } catch (error) {
                      alert(error.response?.data?.message || 'Failed to cancel order');
                    }
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
