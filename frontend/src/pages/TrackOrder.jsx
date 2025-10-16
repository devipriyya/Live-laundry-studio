import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@heroicons/react/24/outline';

const TrackOrder = () => {
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOrderDetails, setShowOrderDetails] = useState(false);

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

  const handleTrackOrder = () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockOrders[trackingId.toUpperCase()];
      if (foundOrder) {
        setOrder(foundOrder);
        setError('');
      } else {
        setError('Order not found. Please check your tracking ID and try again.');
        setOrder(null);
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Order Placed': 'text-blue-600 bg-blue-100',
      'Picked Up': 'text-purple-600 bg-purple-100',
      'Processing': 'text-orange-600 bg-orange-100',
      'In Transit': 'text-cyan-600 bg-cyan-100',
      'Ready for Pickup': 'text-green-600 bg-green-100',
      'Delivered': 'text-emerald-600 bg-emerald-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Order Placed': DocumentTextIcon,
      'Picked Up': TruckIcon,
      'Processing': ClockIcon,
      'In Transit': TruckIcon,
      'Ready for Pickup': CheckCircleIcon,
      'Delivered': CheckCircleIcon
    };
    return icons[status] || DocumentTextIcon;
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

              {/* Sample IDs for demo */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Try these sample IDs:</span>
                {['ORD-001', 'ORD-002', 'ORD-003'].map((id) => (
                  <button
                    key={id}
                    onClick={() => setTrackingId(id)}
                    className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-lg hover:from-purple-200 hover:to-pink-200 transition-colors"
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Status Card */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">Order #{order.id}</h3>
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
                    const IconComponent = getStatusIcon(step.step);
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? step.current 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg' 
                              : 'bg-gradient-to-br from-green-500 to-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold ${
                              step.completed ? step.current ? 'text-purple-900' : 'text-green-900' : 'text-gray-500'
                            }`}>
                              {step.step}
                            </h4>
                            {step.time && (
                              <span className="text-sm text-gray-500">{step.time}</span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                          {step.current && (
                            <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                              <span>Current Status</span>
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
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium">Total Amount</p>
                      <p className="text-3xl font-bold text-green-900">${order.total}</p>
                    </div>
                    <CurrencyDollarIcon className="h-12 w-12 text-green-600" />
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

export default TrackOrder;