import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import orderService from '../services/orderService';
import notificationService from '../services/notificationService';
import {
  UserCircleIcon,
  ClockIcon,
  TruckIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  BellIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  EyeIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  EllipsisVerticalIcon,
  KeyIcon,
  ShoppingBagIcon,
  FireIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
  CubeIcon,
  TagIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedService, setSelectedService] = useState('regular');
  const [selectedWashType, setSelectedWashType] = useState('dry-clean');
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    rewardPoints: 0
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Ref for notification dropdown
  const notificationRef = useRef(null);

  // Load orders and stats from order service
  const loadOrdersAndStats = () => {
    const orders = orderService.getActiveOrders();
    const orderStats = orderService.getOrderStats();
    
    // Convert orders to dashboard format
    const dashboardOrders = orders.map(order => ({
      id: order.id,
      service: order.service,
      serviceType: order.serviceType || 'Regular',
      status: order.status,
      pickupDate: order.pickupDate,
      timeSlot: order.timeSlot || 'TBD',
      location: order.customer?.address?.split(',')[0] || 'Location TBD',
      statusColor: getStatusColor(order.status),
      amount: `₹${order.total || 0}`
    }));
    
    setActiveOrders(dashboardOrders);
    setStats(orderStats);
  };

  // Get status color for orders
  const getStatusColor = (status) => {
    const colorMap = {
      'Pending': 'bg-yellow-500',
      'Approved': 'bg-blue-500',
      'Pick Up In Progress': 'bg-purple-500',
      'Pick Up Completed': 'bg-indigo-500',
      'Wash Done': 'bg-cyan-500',
      'Out For Delivery': 'bg-orange-500',
      'Delivered': 'bg-green-500',
      'Scheduled': 'bg-yellow-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Load orders on component mount
  useEffect(() => {
    loadOrdersAndStats();
  }, []);

  // Listen for order updates
  useEffect(() => {
    const handleStorageChange = () => {
      loadOrdersAndStats();
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadOrdersAndStats();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load notifications
  const loadNotifications = async () => {
    if (!user?.email) return;
    
    try {
      // Get unread count
      const count = await notificationService.getUnreadCount(user.email);
      setUnreadCount(count);
      
      // Get notifications
      const notificationData = await notificationService.getUserNotifications(user.email, {
        limit: 5,
        read: false
      });
      
      setNotifications(notificationData.notifications || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? {...n, read: true} : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user.email);
      setNotifications(prev => prev.map(n => ({...n, read: true})));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Load notifications on component mount and when user changes
  useEffect(() => {
    loadNotifications();
  }, [user]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log('Click event detected:', event.target);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        console.log('Click outside notification dropdown, closing it');
        setShowNotifications(false);
      } else {
        console.log('Click inside notification dropdown, keeping it open');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Navigation menu items
  const menuItems = [
    { id: 'home', name: 'Home', icon: HomeIcon, active: true },
    { id: 'profile', name: 'My Profile', icon: UserCircleIcon },
    { id: 'schedule', name: 'Schedule Wash', icon: CalendarDaysIcon },
    { id: 'orders', name: 'My Orders', icon: ShoppingBagIcon },
    { id: 'payment', name: 'Online Payment', icon: CreditCardIcon },
    { id: 'quality', name: 'Quality Approval', icon: CheckCircleIcon },
    { id: 'rate', name: 'Get Rate Card', icon: DocumentTextIcon },
    { id: 'products', name: 'WashLab Products', icon: TagIcon, badge: 'NEW' },
    { id: 'store', name: 'Store Locator', icon: BuildingStorefrontIcon },
    { id: 'legal', name: 'Legal Info', icon: InformationCircleIcon, hasSubmenu: true },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'logout', name: 'Log Out', icon: ArrowRightOnRectangleIcon }
  ];

  // Service types
  const serviceTypes = [
    { id: 'regular', name: 'Regular', icon: '⭐', color: 'blue' },
    { id: 'express', name: 'Express', icon: '🚀', color: 'green' },
    { id: 'premium', name: 'Premium', icon: '💎', color: 'orange' }
  ];

  // Wash types
  const washTypes = [
    { id: 'dry-clean', name: 'Dry Cleaning & Steam Press', icon: '👔', color: 'pink' },
    { id: 'wash-steam', name: 'Wash & Steam Press', icon: '💧', color: 'blue' },
    { id: 'steam-only', name: 'Steam Press Only', icon: '🔥', color: 'purple' }
  ];

  const handleMenuClick = (itemId) => {
    setActiveMenuItem(itemId);
    if (itemId === 'logout') {
      logout();
      navigate('/');
    } else if (itemId === 'profile') {
      navigate('/profile');
    } else if (itemId === 'orders') {
      navigate('/track-order');
    } else if (itemId === 'schedule') {
      navigate('/schedule-pickup');
    } else if (itemId === 'notifications') {
      navigate('/notifications');
    }
  };

  const handleScheduleWash = () => {
    if (!pickupLocation || !pickupDate || !timeSlot) {
      alert('Please fill in all required fields');
      return;
    }
    
    const selectedWashTypeData = washTypes.find(w => w.id === selectedWashType);
    const selectedServiceData = serviceTypes.find(s => s.id === selectedService);
    const orderAmount = Math.floor(Math.random() * 300) + 200; // Random amount between 200-500
    
    const newOrderData = {
      id: `ORD-${Date.now()}`,
      service: selectedWashTypeData?.name || 'Dry Cleaning',
      serviceType: selectedServiceData?.name || 'Regular',
      status: 'Scheduled',
      orderDate: new Date().toISOString().split('T')[0],
      pickupDate,
      deliveryDate: '', // Will be calculated later
      estimatedDelivery: '',
      timeSlot,
      items: 1,
      weight: '1.0 lbs',
      total: orderAmount,
      customer: {
        name: user?.name || 'Customer',
        address: pickupLocation,
        phone: user?.phone || '',
        email: user?.email || ''
      },
      itemsList: [{
        name: selectedWashTypeData?.name || 'Dry Cleaning',
        quantity: 1,
        price: orderAmount
      }]
    };
    
    // Save order using order service
    const savedOrder = orderService.addOrder(newOrderData);
    
    if (savedOrder) {
      // Refresh orders and stats
      loadOrdersAndStats();
      
      // Navigate to order success page
      navigate('/order-success', {
        state: {
          orderData: {
            orderNumber: savedOrder.id,
            pickupDate,
            pickupTime: timeSlot,
            address: {
              street: pickupLocation,
              city: pickupLocation,
              state: 'Selected State',
              zipCode: '12345'
            },
            status: 'Confirmed'
          },
          cartItems: [{
            id: selectedWashType,
            name: selectedWashTypeData?.name || 'Dry Cleaning',
            icon: selectedWashTypeData?.icon || '👔',
            serviceType: selectedServiceData?.name || 'Regular',
            quantity: 1,
            price: orderAmount
          }],
          totalPrice: orderAmount
        }
      });
    } else {
      alert('Failed to create order. Please try again.');
    }
    
    // Reset form
    setPickupLocation('');
    setPickupDate('');
    setTimeSlot('');
  };

  // Navigate to notifications page
  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-600">WashLab</h1>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    activeMenuItem === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    activeMenuItem === item.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <ChevronDownIcon className="h-4 w-4 ml-auto text-gray-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => {
                    console.log('Notification bell clicked, current state:', showNotifications);
                    setShowNotifications(!showNotifications);
                    console.log('Notification bell clicked, new state:', !showNotifications);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 relative"
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification._id} 
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                            onClick={() => {
                              markAsRead(notification._id);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <div className="p-3 border-t border-gray-100 text-center">
                      <button 
                        onClick={handleViewAllNotifications}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <EnvelopeIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <PhoneIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* Hero Welcome Section */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            {/* Floating decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10 px-6 py-12">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <SparklesIcon className="h-6 w-6 text-yellow-300" />
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text font-semibold">
                      Premium Member
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HeartIcon className="h-5 w-5 text-pink-300" />
                    <span className="text-pink-300 text-sm font-medium">Loyal Customer</span>
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Ready to make your clothes sparkle? Let's get started with your laundry journey.
                </p>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-5 w-5 text-yellow-300" />
                    <span className="text-white font-medium">{stats.rewardPoints} Reward Points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GiftIcon className="h-5 w-5 text-green-300" />
                    <span className="text-white font-medium">Next reward at 1500 points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                    <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.activeOrders}</p>
                    <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <ClockIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completedOrders}</p>
                    <div className="w-full bg-purple-100 rounded-full h-2 mt-3">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CheckCircleIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
                    <div className="w-full bg-orange-100 rounded-full h-2 mt-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleMenuClick('schedule')}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
                >
                  <div className="text-center">
                    <div className="bg-blue-100 group-hover:bg-blue-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors">
                      <CalendarDaysIcon className="h-8 w-8 text-blue-600 mx-auto" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Schedule Pickup</h3>
                    <p className="text-sm text-gray-600">Book a new laundry pickup</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleMenuClick('orders')}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50"
                >
                  <div className="text-center">
                    <div className="bg-purple-100 group-hover:bg-purple-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors">
                      <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600 mx-auto" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Track Orders</h3>
                    <p className="text-sm text-gray-600">Monitor your order status</p>
                  </div>
                </button>

                <button 
                  onClick={() => handleMenuClick('payment')}
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50"
                >
                  <div className="text-center">
                    <div className="bg-orange-100 group-hover:bg-orange-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors">
                      <CreditCardIcon className="h-8 w-8 text-orange-600 mx-auto" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Make Payment</h3>
                    <p className="text-sm text-gray-600">Pay for your orders online</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Orders & Services Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <button 
                      onClick={() => handleMenuClick('orders')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {activeOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">#{order.id}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${order.statusColor}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{order.service} • {order.serviceType}</p>
                            <p className="text-xs text-gray-500">
                              <MapPinIcon className="h-3 w-3 inline mr-1" />
                              {order.location} • {order.pickupDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{order.amount}</p>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Services Overview */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Our Services</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">👔</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Dry Cleaning</h4>
                          <p className="text-sm text-gray-600">Starting from ₹150</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">💧</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Wash & Press</h4>
                          <p className="text-sm text-gray-600">Starting from ₹80</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">🔥</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Steam Press</h4>
                          <p className="text-sm text-gray-600">Starting from ₹50</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleMenuClick('rate')}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                  >
                    View Full Rate Card
                  </button>
                </div>

                {/* Notifications Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-1 rounded-full">
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Order #ORD-002 is ready for pickup</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <TruckIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Pickup scheduled for tomorrow</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 p-1 rounded-full">
                        <GiftIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">You earned 50 reward points!</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
