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
  const [activeTab, setActiveTab] = useState('all'); // New state for tabs

  // Load orders from the backend API
  const loadOrders = async (email) => {
    try {
      if (!email) {
        console.log('No email provided, cannot fetch orders');
        return [];
      }
      console.log('Fetching orders for email:', email);
      const response = await api.get(`/orders/my?email=${encodeURIComponent(email)}`);
      console.log('Orders fetched:', response.data);
      
      // Filter out orders without proper customer info
      const validOrders = response.data.filter(order => 
        order.customerInfo && 
        order.customerInfo.email && 
        order.customerInfo.email === email
      );
      
      console.log('Valid orders for this user:', validOrders);
      return validOrders;
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  };

  useEffect(() => {
    // Get user email from context or localStorage
    let email = user?.email;
    console.log('User from context:', user);
    if (!email) {
      // Try to get from localStorage user object as fallback
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Stored user from localStorage:', storedUser);
      email = storedUser.email;
    }
    if (!email) {
      // Try to get from userEmail localStorage key (set after order placement)
      email = localStorage.getItem('userEmail');
      console.log('Email from userEmail localStorage:', email);
    }

    console.log('Final email used for fetching orders:', email);
    setUserEmail(email || '');

    // If we still don't have an email, try to get it from existing orders in localStorage
    if (!email) {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (storedOrders.length > 0) {
        // Try to get email from the first order with valid customer info
        const orderWithEmail = storedOrders.find(order =>
          order.customerInfo && order.customerInfo.email
        );
        if (orderWithEmail) {
          email = orderWithEmail.customerInfo.email;
          console.log('Email extracted from stored orders:', email);
          setUserEmail(email);
        }
      }
    }

    // Load real orders from backend API
    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (email) {
          const realOrders = await loadOrders(email);
          console.log('Setting orders state:', realOrders);
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

  // Listen for order placement events to refresh orders
  useEffect(() => {
    const handleOrderPlaced = () => {
      console.log('Order placed event received, refreshing orders');
      if (userEmail) {
        loadOrders(userEmail).then(updatedOrders => {
          console.log('Refreshed orders after new order:', updatedOrders);
          setOrders(updatedOrders);
          setFilteredOrders(updatedOrders);
        }).catch(error => {
          console.error('Error refreshing orders:', error);
        });
      }
    };

    window.addEventListener('orderPlaced', handleOrderPlaced);

    return () => {
      window.removeEventListener('orderPlaced', handleOrderPlaced);
    };
  }, [userEmail]);

  // Refresh orders when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        // Get current user email
        let currentEmail = userEmail;
        if (!currentEmail) {
          // Try to get email from context
          const contextUser = user?.email;
          if (contextUser) {
            currentEmail = contextUser;
            setUserEmail(currentEmail);
          } else {
            // Try to get from localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            currentEmail = storedUser.email;
            if (currentEmail) {
              setUserEmail(currentEmail);
            }
          }
        }
        
        if (currentEmail) {
          console.log('Refreshing orders for:', currentEmail);
          const updatedOrders = await loadOrders(currentEmail);
          console.log('Refreshed orders:', updatedOrders);
          setOrders(updatedOrders);
          setFilteredOrders(updatedOrders);
          
          // Store orders in localStorage for offline access
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userEmail, user]);

  // Filter orders based on search term, status, and service type
  useEffect(() => {
    let filtered = orders;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply service type filter (tabs)
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => {
        // Check if any item in the order matches the service type
        return order.items.some(item => {
          // If item doesn't have a service field, check the item name or treat as schedule-wash
          const serviceName = item.service ? item.service.toLowerCase() : 
                            (item.name ? item.name.toLowerCase() : 'schedule-wash');
          
          switch (activeTab) {
            case 'schedule-wash':
              return serviceName.includes('wash') || serviceName.includes('fold') || 
                     serviceName.includes('schedule') || !item.service;
            case 'steam-ironing':
              return serviceName.includes('iron') || serviceName.includes('steam');
            case 'stain-removal':
              return serviceName.includes('stain') || serviceName.includes('remove');
            case 'shoe-polish':
              return serviceName.includes('shoe') || serviceName.includes('polish') || 
                     serviceName.includes('care');
            case 'dry-cleaning':
              return serviceName.includes('dry') && serviceName.includes('clean');
            default:
              return true;
          }
        });
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, activeTab, orders]);

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

  // Define tabs for different service types
  const serviceTabs = [
    { id: 'all', name: 'All Orders' },
    { id: 'schedule-wash', name: 'Schedule Wash' },
    { id: 'steam-ironing', name: 'Steam Ironing' },
    { id: 'stain-removal', name: 'Stain Removal' },
    { id: 'shoe-polish', name: 'Shoe Polish' },
    { id: 'dry-cleaning', name: 'Dry Cleaning' }
  ];

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
        {/* Service Type Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {serviceTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
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
              <option value="cancelled">Cancelled</option>
            </select>
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
              {searchTerm || statusFilter !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your search, filter criteria, or selecting a different tab.'
                : 'You haven\'t placed any orders yet.'}
            </p>
            {!searchTerm && statusFilter === 'all' && activeTab === 'all' && (
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
              // Skip orders without required data
              if (!order._id || !order.orderNumber) {
                return null;
              }
              
              const progress = getOrderProgress(order.status);
              
              return (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-5">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{order.orderNumber || 'Order #' + order._id.substring(0, 8)}</h3>
                        <p className="text-sm text-gray-500">{order.orderDate || order.createdAt ? new Date(order.orderDate || order.createdAt).toLocaleDateString() : 'Date not available'}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'Pending')}`}>
                        {(order.status || 'Pending').replace(/-/g, ' ')}
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
                        <p className="font-semibold text-gray-900">{order.totalItems || order.items?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900">₹{order.totalAmount || 0}</p>
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
                          onClick={async (event) => {
                            try {
                              // Show loading state
                              const button = event.currentTarget;
                              const originalText = button.innerHTML;
                              button.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Downloading...';
                              button.disabled = true;
                              
                              // Create a link to download the PDF
                              const downloadUrl = `${api.defaults.baseURL.replace('/api', '')}/api/invoices/${order._id}/download`;
                              
                              // Create a temporary anchor element
                              const link = document.createElement('a');
                              link.href = downloadUrl;
                              link.download = `invoice-${order.orderNumber || order._id}.pdf`;
                              link.target = '_blank';
                              
                              // Trigger the download
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              
                              // Reset button state
                              setTimeout(() => {
                                button.innerHTML = originalText;
                                button.disabled = false;
                              }, 1000);
                            } catch (error) {
                              console.error('Error downloading PDF:', error);
                              alert('Failed to download PDF. Please try again.');
                              // Reset button state on error
                              const button = event.currentTarget;
                              button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Download Invoice';
                              button.disabled = false;
                            }
                          }}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Invoice
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
                        <span className="font-medium text-gray-900">{selectedOrder.orderNumber || 'Order #' + selectedOrder._id?.substring(0, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status || 'Pending')}`}>
                          {(selectedOrder.status || 'Pending').replace(/-/g, ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.orderDate || selectedOrder.createdAt ? new Date(selectedOrder.orderDate || selectedOrder.createdAt).toLocaleDateString() : 'Date not available'}</span>
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
                        <p className="font-medium text-gray-900">{selectedOrder.customerInfo?.name || 'Name not available'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium text-gray-900">
                          {selectedOrder.customerInfo?.address ? 
                            `${selectedOrder.customerInfo.address.street || ''}, ${selectedOrder.customerInfo.address.city || ''}, ${selectedOrder.customerInfo.address.state || ''} ${selectedOrder.customerInfo.address.zipCode || ''}` : 
                            'Address not available'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.customerInfo?.phone || 'Phone not available'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <p className="font-medium text-gray-900">{selectedOrder.customerInfo?.email || 'Email not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items and Pricing */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 text-sm">
                            <div>
                              <p className="font-medium text-gray-900">{item.name || 'Item'}</p>
                              <p className="text-xs text-gray-600">Service: {item.service || 'N/A'} | Qty: {item.quantity || 0}</p>
                            </div>
                            <span className="font-semibold text-gray-900">₹{item.price ? item.price.toFixed(2) : '0.00'}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No items found for this order</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Items:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.totalItems || selectedOrder.items?.length || 0} items</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Weight:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.weight || 'Not specified'}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-semibold text-gray-900">Total:</span>
                          <span className="text-xl font-bold text-yellow-600">₹{selectedOrder.totalAmount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {selectedOrder.paymentStatus === 'paid' && (
                      <button 
                        onClick={async () => {
                          try {
                            // Create a link to download the PDF
                            const downloadUrl = `${api.defaults.baseURL.replace('/api', '')}/api/invoices/${selectedOrder._id}/download`;
                            
                            // Create a temporary anchor element
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = `invoice-${selectedOrder.orderNumber || selectedOrder._id}.pdf`;
                            link.target = '_blank';
                            
                            // Trigger the download
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch (error) {
                            console.error('Error downloading PDF:', error);
                            alert('Failed to download PDF. Please try again.');
                          }
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        Download Invoice
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
