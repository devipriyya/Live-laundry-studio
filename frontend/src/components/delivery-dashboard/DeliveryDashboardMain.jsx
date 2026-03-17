import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import deliveryBoyService from '../../services/deliveryBoyService';
import { 
  TruckIcon,
  CurrencyRupeeIcon,
  StarIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  MapPinIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  RocketLaunchIcon,
  HeartIcon,
  ChartBarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapIcon,
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowPathIcon,
  PlayIcon,
  StopIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon, 
  MapIcon as MapIconSolid, 
  PhoneIcon as PhoneIconSolid, 
  CheckCircleIcon as CheckCircleSolidIcon 
} from '@heroicons/react/24/solid';
import '../../styles/delivery-dashboard.css';

const DeliveryDashboardMain = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Stats State
  const [stats, setStats] = useState({
    todayPickups: 0,
    todayDeliveries: 0,
    pendingTasks: 0,
    completedTasksToday: 0,
    earningsToday: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    rating: 5.0,
    onTimePercentage: 100,
    totalDeliveries: 0,
    isAvailable: false,
    deliveryBoyName: ''
  });

  // Shift State
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftLoading, setShiftLoading] = useState(false);

  // Orders State
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Location Tracking State
  const [liveLocation, setLiveLocation] = useState({ latitude: null, longitude: null });
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const locationUpdateInterval = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats
      const statsData = await deliveryBoyService.getStats();
      setStats({
        todayPickups: statsData.todayPickups || 0,
        todayDeliveries: statsData.todayDeliveries || 0,
        pendingTasks: statsData.pendingTasks || 0,
        completedTasksToday: statsData.completedTasksToday || 0,
        earningsToday: statsData.earningsToday || 0,
        weeklyEarnings: statsData.weeklyEarnings || 0,
        monthlyEarnings: statsData.monthlyEarnings || 0,
        rating: statsData.rating || 5.0,
        onTimePercentage: statsData.onTimePercentage || 100,
        totalDeliveries: statsData.totalDeliveries || 0,
        isAvailable: statsData.isAvailable || false,
        deliveryBoyName: statsData.deliveryBoyName || 'Delivery Partner'
      });

      // Fetch current shift
      const shiftData = await deliveryBoyService.getCurrentShift();
      setCurrentShift(shiftData.shift);

      // Fetch recent orders
      const ordersData = await deliveryBoyService.getAssignedOrders({ 
        limit: 5, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
      setRecentOrders(ordersData.orders || []);

      // Fetch notifications
      const notifData = await deliveryBoyService.getNotifications({ limit: 5 });
      setNotifications(notifData.notifications || []);
      setUnreadCount(notifData.unreadCount || 0);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Animate numbers on mount
  useEffect(() => {
    const targets = {
      pickups: stats.todayPickups,
      deliveries: stats.todayDeliveries,
      earnings: stats.earningsToday,
      completed: stats.completedTasksToday
    };
    
    Object.keys(targets).forEach(key => {
      let current = 0;
      const target = targets[key];
      const increment = target / 20;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: Math.round(current) }));
      }, 50);
    });
  }, [stats]);

  // Location tracking
  useEffect(() => {
    if (isTrackingActive && navigator.geolocation) {
      locationUpdateInterval.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            setLiveLocation(newLocation);
            
            // Update location on server
            try {
              await deliveryBoyService.updateLocation(newLocation);
            } catch (err) {
              console.error('Failed to update location:', err);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }, 30000); // Update every 30 seconds
    } else {
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current);
        locationUpdateInterval.current = null;
      }
    }
    
    return () => {
      if (locationUpdateInterval.current) {
        clearInterval(locationUpdateInterval.current);
      }
    };
  }, [isTrackingActive]);

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Shift management handlers
  const handleStartShift = async () => {
    try {
      setShiftLoading(true);
      let locationData = {};
      
      // Get current location if available
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve();
            },
            () => resolve(), // Resolve even on error
            { timeout: 5000 }
          );
        });
      }
      
      const result = await deliveryBoyService.startShift(locationData);
      setCurrentShift(result.shift);
      setIsTrackingActive(true);
      
      // Update availability in stats
      setStats(prev => ({ ...prev, isAvailable: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start shift');
    } finally {
      setShiftLoading(false);
    }
  };

  const handleEndShift = async () => {
    if (!window.confirm('Are you sure you want to end your shift?')) return;
    
    try {
      setShiftLoading(true);
      let locationData = {};
      
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve();
            },
            () => resolve(),
            { timeout: 5000 }
          );
        });
      }
      
      await deliveryBoyService.endShift(locationData);
      setCurrentShift(null);
      setIsTrackingActive(false);
      
      setStats(prev => ({ ...prev, isAvailable: false }));
      
      // Refresh stats after ending shift
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to end shift');
    } finally {
      setShiftLoading(false);
    }
  };

  const handleStartBreak = async () => {
    try {
      const result = await deliveryBoyService.startBreak();
      setCurrentShift(result.shift);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start break');
    }
  };

  const handleEndBreak = async () => {
    try {
      const result = await deliveryBoyService.endBreak();
      setCurrentShift(result.shift);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to end break');
    }
  };

  // Toggle availability
  const handleToggleAvailability = async () => {
    try {
      const newStatus = !stats.isAvailable;
      await deliveryBoyService.updateAvailability(newStatus);
      setStats(prev => ({ ...prev, isAvailable: newStatus }));
    } catch (err) {
      alert('Failed to update availability');
    }
  };

  // Mark notification as read
  const handleMarkNotificationRead = async (notificationId) => {
    try {
      await deliveryBoyService.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: t('good_morning', 'Good Morning'), emoji: '🌅' };
    if (hour < 17) return { text: t('good_afternoon', 'Good Afternoon'), emoji: '☀️' };
    if (hour < 21) return { text: t('good_evening', 'Good Evening'), emoji: '🌆' };
    return { text: t('good_night', 'Good Night'), emoji: '🌙' };
  };

  const greeting = getGreeting();

  // Calculate completion rate
  const totalTasks = stats.todayPickups + stats.todayDeliveries;
  const completedTasks = stats.completedTasksToday;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Get status styling
  const getStatusConfig = (status) => {
    const configs = {
      'order-placed': { color: 'bg-gray-100 text-gray-700', label: 'Pending' },
      'order-accepted': { color: 'bg-blue-100 text-blue-700', label: 'Accepted' },
      'out-for-pickup': { color: 'bg-amber-100 text-amber-700', label: 'Out for Pickup' },
      'pickup-completed': { color: 'bg-indigo-100 text-indigo-700', label: 'Picked Up' },
      'wash-in-progress': { color: 'bg-cyan-100 text-cyan-700', label: 'Processing' },
      'wash-completed': { color: 'bg-teal-100 text-teal-700', label: 'Ready' },
      'out-for-delivery': { color: 'bg-purple-100 text-purple-700', label: 'Delivering' },
      'delivery-completed': { color: 'bg-green-100 text-green-700', label: 'Delivered' },
      'cancelled': { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
    };
    return configs[status] || { color: 'bg-gray-100 text-gray-700', label: status };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
              >
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TruckIcon className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">Delivery Dashboard</h1>
                  <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowPathIcon className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <BellIcon className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Status Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                currentShift ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${currentShift ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                <span className="hidden sm:inline">{currentShift ? 'On Shift' : 'Off Duty'}</span>
              </div>

              {/* Profile */}
              <button 
                onClick={() => navigate('/delivery-dashboard/profile-settings')}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow"
              >
                {stats.deliveryBoyName?.charAt(0)?.toUpperCase() || 'D'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl lg:hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {stats.deliveryBoyName?.charAt(0)?.toUpperCase() || 'D'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{stats.deliveryBoyName}</p>
                    <p className="text-sm text-gray-500">{currentShift ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {[
                { icon: ChartBarIcon, label: 'Dashboard', path: '/delivery-dashboard' },
                { icon: ClipboardDocumentListIcon, label: 'My Orders', path: '/delivery-dashboard/my-orders', badge: stats.pendingTasks },
                { icon: ArrowTrendingUpIcon, label: 'Performance', path: '/delivery-dashboard/performance' },
                { icon: CurrencyRupeeIcon, label: 'Earnings', path: '/delivery-dashboard/earnings' },
                { icon: ClockIcon, label: 'Shifts', path: '/delivery-dashboard/shift-management' },
                { icon: HeartIcon, label: 'Support', path: '/delivery-dashboard/help-support' },
                { icon: CogIcon, label: 'Settings', path: '/delivery-dashboard/profile-settings' }
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    location.pathname === item.path 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      location.pathname === item.path ? 'bg-white/20' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={handleRefresh} className="ml-auto text-red-600 hover:text-red-800 font-medium">
              Retry
            </button>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">{formattedTime}</p>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <span>{greeting.emoji}</span>
                <span>{greeting.text}, {stats.deliveryBoyName?.split(' ')[0] || 'Partner'}!</span>
              </h2>
              <p className="text-blue-100 mt-2">{formattedDate}</p>
            </div>

            {/* Rating Badge */}
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <StarSolidIcon 
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(stats.rating) ? 'text-yellow-400' : 'text-white/30'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-blue-100">{stats.rating.toFixed(1)} Rating</p>
              </div>

              {/* Shift Button */}
              {!currentShift ? (
                <button 
                  onClick={handleStartShift}
                  disabled={shiftLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-50"
                >
                  {shiftLoading ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  )}
                  Start Shift
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {currentShift.status === 'on-break' ? (
                    <button 
                      onClick={handleEndBreak}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <PlayIcon className="w-5 h-5" />
                      Resume
                    </button>
                  ) : (
                    <button 
                      onClick={handleStartBreak}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition-colors"
                    >
                      <PauseIcon className="w-5 h-5" />
                      Break
                    </button>
                  )}
                  <button 
                    onClick={handleEndShift}
                    disabled={shiftLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {shiftLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <StopIcon className="w-5 h-5" />
                    )}
                    End Shift
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Today's Pickups */}
          <div 
            onClick={() => navigate('/delivery-dashboard/my-orders?tab=pickup')}
            className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <ArrowUpTrayIcon className="w-6 h-6 text-white" />
              </div>
              <BoltIcon className="w-6 h-6 text-amber-300" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{animatedStats.pickups ?? 0}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Today's Pickups</p>
          </div>

          {/* Today's Deliveries */}
          <div 
            onClick={() => navigate('/delivery-dashboard/my-orders?tab=delivery')}
            className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <ArrowDownTrayIcon className="w-6 h-6 text-white" />
              </div>
              <TruckIcon className="w-6 h-6 text-green-300" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{animatedStats.deliveries ?? 0}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Today's Deliveries</p>
          </div>

          {/* Pending Tasks */}
          <div 
            onClick={() => navigate('/delivery-dashboard/my-orders?status=pending')}
            className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <FireIcon className="w-6 h-6 text-purple-300" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.pendingTasks}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Pending Tasks</p>
          </div>

          {/* Today's Earnings */}
          <div 
            onClick={() => navigate('/delivery-dashboard/earnings')}
            className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <CurrencyRupeeIcon className="w-6 h-6 text-white" />
              </div>
              <SparklesIcon className="w-6 h-6 text-blue-300" />
            </div>
            <p className="text-3xl font-bold text-gray-800">₹{animatedStats.earnings ?? 0}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Today's Earnings</p>
          </div>
        </div>

        {/* Progress & Earnings Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Progress Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-500" />
              Today's Progress
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="10"
                  />
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="none" 
                    stroke="url(#progressGradient)" 
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${completionRate * 2.64} 264`}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{completionRate}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-2">{completedTasks} of {totalTasks} tasks completed</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Pickups</span>
                    <span className="font-medium">{stats.todayPickups}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Deliveries</span>
                    <span className="font-medium">{stats.todayDeliveries}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Completed</span>
                    <span className="font-medium text-green-600">{stats.completedTasksToday}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BanknotesIcon className="w-5 h-5 text-green-500" />
                Earnings Overview
              </h3>
              <button 
                onClick={() => navigate('/delivery-dashboard/earnings')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                View All <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Today</p>
                <p className="text-xl font-bold text-green-600">₹{stats.earningsToday}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">This Week</p>
                <p className="text-xl font-bold text-blue-600">₹{stats.weeklyEarnings}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">This Month</p>
                <p className="text-xl font-bold text-purple-600">₹{stats.monthlyEarnings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RocketLaunchIcon className="w-5 h-5 text-blue-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/delivery-dashboard/my-orders')}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-800">My Orders</p>
              {stats.pendingTasks > 0 && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                  {stats.pendingTasks} pending
                </span>
              )}
            </button>

            <button 
              onClick={() => navigate('/delivery-dashboard/performance')}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-800">Performance</p>
            </button>

            <button 
              onClick={() => navigate('/delivery-dashboard/shift-management')}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-800">Shifts</p>
            </button>

            <button 
              onClick={() => navigate('/delivery-dashboard/help-support')}
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-800">Support</p>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ClipboardDocumentListIcon className="w-5 h-5 text-blue-500" />
              Recent Orders
            </h3>
            <button 
              onClick={() => navigate('/delivery-dashboard/my-orders')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500">Loading orders...</p>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No orders assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <div 
                    key={order._id}
                    onClick={() => navigate(`/delivery-dashboard/order/${order._id}`)}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                      {order.customerInfo?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">#{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{order.customerInfo?.name}</p>
                      <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {order.fullAddress || 'Address not available'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-blue-500" />
              Recent Notifications
            </h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification._id}
                  onClick={() => handleMarkNotificationRead(notification._id)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'success' ? 'bg-green-100 text-green-600' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {notification.type === 'order' && <ClipboardDocumentListIcon className="w-5 h-5" />}
                    {notification.type === 'success' && <CheckCircleSolidIcon className="w-5 h-5" />}
                    {notification.type === 'warning' && <ExclamationTriangleIcon className="w-5 h-5" />}
                    {!['order', 'success', 'warning'].includes(notification.type) && <InformationCircleIcon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(notification.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DeliveryDashboardMain;
