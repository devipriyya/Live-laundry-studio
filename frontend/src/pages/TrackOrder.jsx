import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  EyeIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  InformationCircleIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import ReviewForm from '../components/ReviewForm';

const TrackOrder = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(null);

  // Mock order data for demonstration
  const mockOrders = {
    'ORD-001': {
      id: 'ORD-001',
      service: 'Wash & Fold',
      status: 'In Transit',
      currentStep: 3,
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-17',
      estimatedDelivery: '2024-01-17 14:00',
      items: 12,
      weight: '4.5 lbs',
      total: 24.99,
      customer: {
        name: 'John Doe',
        address: '123 Main St, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'john.doe@email.com'
      },
      timeline: [
        { step: 'Order Placed', completed: true, time: '2024-01-15 09:00', description: 'Order confirmed and scheduled for pickup' },
        { step: 'Picked Up', completed: true, time: '2024-01-15 14:30', description: 'Items collected from your location' },
        { step: 'Processing', completed: true, time: '2024-01-16 10:00', description: 'Items being washed and processed' },
        { step: 'In Transit', completed: true, time: '2024-01-17 08:00', description: 'Out for delivery', current: true },
        { step: 'Delivered', completed: false, time: '', description: 'Items delivered to your location' }
      ],
      driver: {
        name: 'Mike Johnson',
        phone: '+1 (555) 987-6543',
        vehicleNumber: 'FAB-123',
        photo: null
      },
      trackingUpdates: [
        { time: '2024-01-17 08:00', message: 'Your order is out for delivery and will arrive by 2 PM', location: 'Distribution Center' },
        { time: '2024-01-16 16:00', message: 'Processing complete. Order packed and ready for delivery', location: 'Processing Center' },
        { time: '2024-01-16 10:00', message: 'Items received at processing center', location: 'Processing Center' },
        { time: '2024-01-15 14:30', message: 'Items successfully picked up', location: '123 Main St' }
      ]
    },
    'ORD-002': {
      id: 'ORD-002',
      service: 'Dry Cleaning',
      status: 'Ready for Pickup',
      currentStep: 4,
      pickupDate: '2024-01-14',
      deliveryDate: '2024-01-16',
      estimatedDelivery: 'Ready Now',
      items: 3,
      weight: '2.1 lbs',
      total: 45.00,
      customer: {
        name: 'Jane Smith',
        address: '456 Oak Ave, City, State 12345',
        phone: '+1 (555) 456-7890',
        email: 'jane.smith@email.com'
      },
      timeline: [
        { step: 'Order Placed', completed: true, time: '2024-01-14 11:00', description: 'Order confirmed and scheduled for pickup' },
        { step: 'Picked Up', completed: true, time: '2024-01-14 15:45', description: 'Items collected from your location' },
        { step: 'Processing', completed: true, time: '2024-01-15 09:00', description: 'Professional dry cleaning in progress' },
        { step: 'Ready for Pickup', completed: true, time: '2024-01-16 12:00', description: 'Items ready for collection', current: true },
        { step: 'Delivered', completed: false, time: '', description: 'Items delivered to your location' }
      ],
      trackingUpdates: [
        { time: '2024-01-16 12:00', message: 'Your items are ready for pickup! Available Mon-Fri 9AM-6PM', location: 'Fabrico Store' },
        { time: '2024-01-15 16:00', message: 'Dry cleaning process completed successfully', location: 'Processing Center' },
        { time: '2024-01-15 09:00', message: 'Items received and dry cleaning started', location: 'Processing Center' },
        { time: '2024-01-14 15:45', message: 'Items successfully picked up for dry cleaning', location: '456 Oak Ave' }
      ]
    },
    'ORD-003': {
      id: 'ORD-003',
      service: 'Ironing Service',
      status: 'Delivered',
      currentStep: 5,
      pickupDate: '2024-01-10',
      deliveryDate: '2024-01-12',
      estimatedDelivery: 'Completed',
      items: 15,
      weight: '3.2 lbs',
      total: 52.50,
      customer: {
        name: 'Robert Wilson',
        address: '789 Pine Rd, City, State 12345',
        phone: '+1 (555) 789-0123',
        email: 'robert.wilson@email.com'
      },
      timeline: [
        { step: 'Order Placed', completed: true, time: '2024-01-10 13:00', description: 'Order confirmed and scheduled for pickup' },
        { step: 'Picked Up', completed: true, time: '2024-01-10 17:20', description: 'Items collected from your location' },
        { step: 'Processing', completed: true, time: '2024-01-11 08:00', description: 'Professional ironing service in progress' },
        { step: 'In Transit', completed: true, time: '2024-01-12 09:30', description: 'Out for delivery' },
        { step: 'Delivered', completed: true, time: '2024-01-12 14:15', description: 'Items successfully delivered', current: true }
      ],
      trackingUpdates: [
        { time: '2024-01-12 14:15', message: 'Order delivered successfully! Thank you for choosing Fabrico', location: '789 Pine Rd' },
        { time: '2024-01-12 09:30', message: 'Your order is out for delivery', location: 'Distribution Center' },
        { time: '2024-01-11 17:00', message: 'Ironing completed. Items packed and ready for delivery', location: 'Processing Center' },
        { time: '2024-01-11 08:00', message: 'Items received and ironing service started', location: 'Processing Center' }
      ]
    }
  };

  // Load recent orders on mount
  useEffect(() => {
    const loadRecentOrders = async () => {
      try {
        const email = user?.email || JSON.parse(localStorage.getItem('user') || '{}').email;
        if (email) {
          setUserEmail(email);
          const response = await api.get(`/orders/my?email=${encodeURIComponent(email)}`);
          setRecentOrders(response.data.slice(0, 3)); // Get last 3 orders
        }
      } catch (error) {
        console.error('Error loading recent orders:', error);
      }
    };
    loadRecentOrders();
  }, [user]);

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Try to find order by orderNumber
      const email = user?.email || JSON.parse(localStorage.getItem('user') || '{}').email;
      if (!email) {
        setError('Please log in to track orders');
        setLoading(false);
        return;
      }

      const response = await api.get(`/orders/my?email=${encodeURIComponent(email)}`);
      const foundOrder = response.data.find(o => o.orderNumber === trackingId.toUpperCase());
      
      if (foundOrder) {
        // Convert backend order to display format
        const formattedOrder = {
          id: foundOrder.orderNumber,
          service: 'Laundry Service',
          status: foundOrder.status,
          currentStep: getOrderStep(foundOrder.status),
          pickupDate: foundOrder.pickupDate ? new Date(foundOrder.pickupDate).toLocaleDateString() : 'TBD',
          deliveryDate: foundOrder.deliveryDate ? new Date(foundOrder.deliveryDate).toLocaleDateString() : 'TBD',
          estimatedDelivery: foundOrder.estimatedDelivery || 'TBD',
          items: foundOrder.totalItems || 0,
          weight: foundOrder.weight || 'N/A',
          total: foundOrder.totalAmount || 0,
          customer: {
            name: foundOrder.customerInfo?.name || 'Customer',
            address: `${foundOrder.customerInfo?.address?.street || ''}, ${foundOrder.customerInfo?.address?.city || ''}, ${foundOrder.customerInfo?.address?.state || ''} ${foundOrder.customerInfo?.address?.zipCode || ''}`,
            phone: foundOrder.customerInfo?.phone || '',
            email: foundOrder.customerInfo?.email || '',
            deliveryNote: foundOrder.deliveryNote || null,
            deliveryPhoto: foundOrder.deliveryPhoto || null
          },
          timeline: generateTimeline(foundOrder),
          trackingUpdates: foundOrder.statusHistory?.map(h => ({
            time: new Date(h.timestamp).toLocaleString(),
            message: h.note || `Status updated to ${h.status}`,
            location: 'Processing Center'
          })) || []
        };
        setOrder(formattedOrder);
        setError('');
      } else {
        // Check if it's from mock data for demo
        const foundMockOrder = mockOrders[trackingId.toUpperCase()];
        if (foundMockOrder) {
          setOrder(foundMockOrder);
          setError('');
        } else {
          setError('Order not found. Please check your tracking ID and try again.');
          setOrder(null);
        }
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      setError('Failed to track order. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStep = (status) => {
    const stepMap = {
      'order-placed': 1,
      'order-accepted': 1,
      'out-for-pickup': 2,
      'pickup-completed': 2,
      'received-at-facility': 3,
      'washing': 3,
      'wash-in-progress': 3,
      'wash-completed': 6, // ready for delivery
      'drying': 4,
      'cleaning': 4,
      'pressing': 5,
      'quality-check': 5,
      'ready-for-pickup': 6,
      'ready-for-delivery': 6,
      'out-for-delivery': 7,
      'delivery-completed': 7,
      'delivered': 7
    };
    return stepMap[status] || 1;
  };

  const generateTimeline = (order) => {
    const steps = [
      { step: 'Order Placed', icon: DocumentTextIcon, description: 'Order confirmed and scheduled' },
      { step: 'Picked Up', icon: TruckIcon, description: 'Items collected from your door' },
      { step: 'Washing', icon: SparklesIcon, description: 'Deep cleaning in progress' },
      { step: 'Drying', icon: SparklesIcon, description: 'Nature-fresh drying process' },
      { step: 'Ironing', icon: SparklesIcon, description: 'Professional steam pressing' },
      { step: 'Ready for Delivery', icon: ShoppingBagIcon, description: 'Packed and waiting to arrive' },
      { step: 'Delivered', icon: CheckCircleIcon, description: 'Delivered to your doorstep' }
    ];

    const currentStep = getOrderStep(order.status);
    
    return steps.map((s, index) => {
      const stepNum = index + 1;
      const stepHistory = order.statusHistory?.find(h => getOrderStep(h.status) === stepNum);
      
      return {
        ...s,
        completed: stepNum <= currentStep,
        current: stepNum === currentStep,
        time: stepHistory ? new Date(stepHistory.timestamp).toLocaleString() : ''
      };
    });
  };

  const handleCancelOrder = async () => {
    try {
      await api.patch(`/orders/${cancellingOrder._id}/cancel`, {
        reason: cancelReason || 'Customer request',
        email: userEmail
      });
      alert('Order cancelled successfully. Refund will be processed.');
      setShowCancelModal(false);
      setCancelReason('');
      setShowOrderDetails(false);
      if (trackingId) handleTrackOrder(); // Refresh tracking info
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    const step = getOrderStep(status);
    if (status === 'cancelled') return 'text-red-600 bg-red-100';
    if (step === 7) return 'text-emerald-600 bg-emerald-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getStatusIcon = (status) => {
    const icons = {
      1: DocumentTextIcon,
      2: TruckIcon,
      3: SparklesIcon,
      4: SparklesIcon,
      5: SparklesIcon,
      6: ShoppingBagIcon,
      7: CheckCircleIcon
    };
    return icons[getOrderStep(status)] || DocumentTextIcon;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
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
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  🚚 Track Your Order
                </h1>
                <p className="text-gray-600">Real-time order tracking and updates</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-6 w-6 text-purple-500" />
              <span className="text-purple-600 font-medium">Live Tracking</span>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-6 sm:px-8 lg:px-12 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MagnifyingGlassIcon className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Enter Tracking ID</h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="e.g., ORD-001, ORD-002, ORD-003"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value);
                      setError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-lg"
                  />
                  {error && (
                    <p className="mt-2 text-red-600 text-sm flex items-center space-x-1">
                      <XMarkIcon className="h-4 w-4" />
                      <span>{error}</span>
                    </p>
                  )}
                </div>
                <button
                  onClick={handleTrackOrder}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Tracking...</span>
                    </div>
                  ) : (
                    'Track Order'
                  )}
                </button>
              </div>

              {/* Recent Orders */}
              {recentOrders.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm text-gray-600 block mb-2">Your recent orders:</span>
                  <div className="flex flex-wrap gap-2">
                    {recentOrders.map((ord) => (
                      <button
                        key={ord._id}
                        onClick={() => setTrackingId(ord.orderNumber)}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-lg hover:from-purple-200 hover:to-pink-200 transition-colors"
                      >
                        {ord.orderNumber}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sample IDs for demo */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Try these sample IDs:</span>
                {['ORD-001', 'ORD-002', 'ORD-003'].map((id) => (
                  <button
                    key={id}
                    onClick={() => setTrackingId(id)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-sm rounded-lg hover:from-blue-200 hover:to-cyan-200 transition-colors"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Information */}
        {order && (
          <div className="space-y-8">
            {/* Order Status Overview */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                {order.status === 'cancelled' && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <XMarkIcon className="h-10 w-10 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-red-900">Order Cancelled</h4>
                      <p className="text-red-700">This order has been cancelled and a refund has been initiated if applicable.</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Status Card */}
                  <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                          <h3 className="text-2xl font-bold text-gray-900">Order #{order.id}</h3>
                          {order.status === 'delivered' && order.isReviewed && order.rating && (
                            <div className="flex items-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIconSolid 
                                  key={star} 
                                  className={`h-5 w-5 ${star <= order.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium text-gray-500">Service Rated</span>
                            </div>
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-xl font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </div>
                      </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-sm text-blue-700 font-medium">Service</p>
                        <p className="text-lg font-bold text-blue-900">{order.service}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                        <p className="text-sm text-purple-700 font-medium">Items</p>
                        <p className="text-lg font-bold text-purple-900">{order.items} items ({order.weight})</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <p className="text-sm text-green-700 font-medium">Total</p>
                        <p className="text-lg font-bold text-green-900">${order.total}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <ClockIcon className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-purple-900">Estimated Delivery</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900">{order.estimatedDelivery}</p>
                    </div>
                  </div>

                  {/* Driver Info (if in transit) */}
                  {order.status === 'In Transit' && order.driver && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-4 flex items-center space-x-2">
                        <TruckIcon className="h-5 w-5" />
                        <span>Your Driver</span>
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-orange-700">Driver Name</p>
                          <p className="font-semibold text-orange-900">{order.driver.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-orange-700">Vehicle</p>
                          <p className="font-semibold text-orange-900">{order.driver.vehicleNumber}</p>
                        </div>
                        <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-colors flex items-center justify-center space-x-2">
                          <PhoneIcon className="h-4 w-4" />
                          <span>Call Driver</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                  <span>Order Timeline</span>
                </h3>
                
                <div className="space-y-4">
                  {order.timeline.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="relative flex flex-col items-center">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                            step.completed 
                              ? step.current 
                                ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg ring-4 ring-purple-100' 
                                : 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          {index < order.timeline.length - 1 && (
                            <div className={`w-1 h-full absolute top-12 -z-0 ${
                              step.completed && order.timeline[index + 1].completed ? 'bg-green-500' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 pb-6">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-lg font-bold ${
                              step.completed ? step.current ? 'text-purple-900' : 'text-green-900' : 'text-gray-400'
                            }`}>
                              {step.step}
                            </h4>
                            {step.time && (
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{step.time}</span>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.description}
                          </p>
                          {step.current && (
                            <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                              <span>Live Updates</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tracking Updates & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tracking Updates */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <InformationCircleIcon className="h-6 w-6 text-cyan-600" />
                    <span>Recent Updates</span>
                  </h3>
                  
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {order.trackingUpdates.map((update, index) => (
                      <div key={index} className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm text-cyan-700 font-medium">{update.time}</span>
                          <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">{update.location}</span>
                        </div>
                        <p className="text-cyan-900">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                {/* Order Details Button */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowOrderDetails(true)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        <EyeIcon className="h-5 w-5" />
                        <span>View Order Details</span>
                      </button>
                      
                      <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        <span>Contact Support</span>
                      </button>
                      
                      <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                        <PhoneIcon className="h-5 w-5" />
                        <span>Call Customer Service</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5 text-green-600" />
                      <span>Delivery Information</span>
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Customer</p>
                        <p className="text-green-900">{order.customer.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">Address</p>
                        <p className="text-green-900">{order.customer.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-700 font-medium">Contact</p>
                        <p className="text-green-900">{order.customer.phone}</p>
                      </div>
                    </div>

                    {/* Delivery Proof for User */}
                    {order.status === 'delivery-completed' && (order.customer.deliveryNote || order.customer.deliveryPhoto) && (
                      <div className="mt-6 pt-6 border-t border-green-200">
                        <h4 className="font-bold text-green-900 mb-4 flex items-center space-x-2">
                          <CheckBadgeIcon className="h-5 w-5" />
                          <span>Delivery Confirmation</span>
                        </h4>
                        
                        {order.customer.deliveryNote && (
                          <div className="bg-green-50 rounded-lg p-3 border border-green-100 mb-4">
                            <p className="text-sm text-green-700 font-medium mb-1 flex items-center gap-1">
                              <ChatBubbleLeftRightIcon className="w-4 h-4" />
                              Delivery Note
                            </p>
                            <p className="text-green-900 italic">"{order.customer.deliveryNote}"</p>
                          </div>
                        )}

                        {order.customer.deliveryPhoto && (
                          <div>
                            <p className="text-sm text-green-700 font-medium mb-2 flex items-center gap-1">
                              <PhotoIcon className="w-4 h-4" />
                              Proof of Delivery
                            </p>
                            <div className="rounded-xl overflow-hidden border-2 border-green-100 shadow-sm">
                              <img src={order.customer.deliveryPhoto} alt="Proof of Delivery" className="w-full h-auto max-h-48 object-cover" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && order && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-medium">Order ID</p>
                    <p className="text-lg font-bold text-gray-900">{order.id}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-medium">Service Type</p>
                    <p className="text-lg font-bold text-gray-900">{order.service}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-medium">Pickup Date</p>
                    <p className="text-lg font-bold text-gray-900">{order.pickupDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-medium">Delivery Date</p>
                    <p className="text-lg font-bold text-gray-900">{order.deliveryDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-medium">Total Items</p>
                    <p className="text-lg font-bold text-gray-900">{order.items} items</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 font-medium">Total Weight</p>
                    <p className="text-lg font-bold text-gray-900">{order.weight}</p>
                  </div>
                </div>
                
                <div className="flex gap-3 px-6 pb-6">
                  {['order-placed', 'order-accepted'].includes(order.status) && (
                    <button
                      onClick={() => {
                        setCancellingOrder(order);
                        setShowCancelModal(true);
                      }}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status === 'delivered' && !order.isReviewed && (
                    <button
                      onClick={() => {
                        setReviewingOrder(order);
                        setShowReviewModal(true);
                      }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <StarIconSolid className="h-4 w-4 text-yellow-200" />
                      Rate Order
                    </button>
                  )}
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && cancellingOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
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
                <p className="text-gray-600 mb-4">Are you sure you want to cancel order <strong>{cancellingOrder.id || cancellingOrder.orderNumber}</strong>?</p>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cancellation Reason
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please tell us why you're cancelling..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Review Modal */}
        {showReviewModal && reviewingOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[70] overflow-y-auto">
            <div className="w-full max-w-2xl my-8">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewingOrder(null);
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
                <ReviewForm 
                  orderId={reviewingOrder._id}
                  orderNumber={reviewingOrder.id || reviewingOrder.orderNumber}
                  customerInfo={reviewingOrder.customerInfo}
                  onSubmitSuccess={() => {
                    alert('Thank you for your review!');
                    setShowReviewModal(false);
                    setReviewingOrder(null);
                    setShowOrderDetails(false);
                    if (trackingId) handleTrackOrder(); // Refresh tracking info
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;