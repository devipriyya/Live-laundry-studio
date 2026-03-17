import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  ClockIcon as ClockSolidIcon,
  MapIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BellIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,





  InformationCircleIcon,
  CheckCircleIcon as CheckCircleOutlineIcon,
  UserIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  SignalIcon,

  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, MapIcon as MapIconSolid, ChatBubbleLeftRightIcon as ChatIconSolid, PhoneIcon as PhoneIconSolid, CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import '../../styles/delivery-dashboard.css';

const EnhancedDeliveryDashboard = ({ stats, expandedSections, toggleSection }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [liveLocation, setLiveLocation] = useState({ latitude: null, longitude: null });
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const locationUpdateInterval = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Initialize location tracking
  useEffect(() => {
    if (isTrackingActive && navigator.geolocation) {
      // Update location every 10 seconds when tracking is active
      locationUpdateInterval.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: new Date().toISOString()
            };
            
            setLiveLocation(newLocation);
            
            // Add to tracking history
            setTrackingHistory(prev => [
              ...prev.slice(-9), // Keep only last 10 locations
              newLocation
            ]);
            
            // In a real app, you would send this to the backend
            console.log('Location updated:', newLocation);
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }, 10000); // Update every 10 seconds
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

  // Animate numbers on mount
  useEffect(() => {
    const targets = {
      pickups: stats.todayPickups || 0,
      deliveries: stats.todayDeliveries || 0,
      earnings: stats.earningsToday || 0,
      completed: stats.completedTasksToday || stats.completedToday || 0
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

  // Get current greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: t('good_morning', 'Good Morning'), emoji: '🌅', period: 'morning' };
    if (hour < 17) return { text: t('good_afternoon', 'Good Afternoon'), emoji: '☀️', period: 'afternoon' };
    if (hour < 21) return { text: t('good_evening', 'Good Evening'), emoji: '🌆', period: 'evening' };
    return { text: t('good_night', 'Good Night'), emoji: '🌙', period: 'night' };
  };

  const greeting = getGreeting();

  // Tracking functions
  const startTracking = () => {
    setIsTrackingActive(true);
    // Find the first active order if available
    if (recentOrders && recentOrders.length > 0) {
      const activeOrder = recentOrders.find(order => 
        order.status === 'in-progress' || order.status === 'out-for-delivery'
      ) || recentOrders[0];
      setCurrentOrder(activeOrder);
    }
  };

  const stopTracking = () => {
    setIsTrackingActive(false);
    setCurrentOrder(null);
  };

  // Performance analytics
  const performanceData = {
    todayStats: {
      deliveries: stats.todayDeliveries || 0,
      pickups: stats.todayPickups || 0,
      distance: (stats.todayDeliveries || 0) * 2.5, // Approximate distance
      time: (stats.todayDeliveries || 0) * 30, // Approximate time in minutes
    },
    weeklyStats: {
      deliveries: Math.round((stats.todayDeliveries || 0) * 7 * 0.8), // Approximate
      pickups: Math.round((stats.todayPickups || 0) * 7 * 0.8),
      earnings: stats.weeklyEarnings || 0,
    },
    efficiency: {
      avgDeliveryTime: 30, // minutes
      avgPickupTime: 15, // minutes
      onTimeRate: stats.onTimePercentage || 100,
      customerSatisfaction: stats.rating || 5.0,
    }
  };

  // Calculate completion rate
  const totalTasks = (stats.todayPickups || 0) + (stats.todayDeliveries || 0);
  const completedTasks = stats.completedTasksToday || stats.completedToday || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get formatted date
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

  // Status indicator
  const isOnShift = stats.isOnShift !== false;

  // Sample recent orders data
  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'John Doe',
      amount: 450,
      status: 'pending',
      address: '123 Main St, New York',
      items: 3,
      distance: '2.5 km',
      time: '10:30 AM'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Jane Smith',
      amount: 650,
      status: 'in-progress',
      address: '456 Oak Ave, Los Angeles',
      items: 5,
      distance: '1.2 km',
      time: '11:15 AM'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Robert Johnson',
      amount: 320,
      status: 'completed',
      address: '789 Pine St, Chicago',
      items: 2,
      distance: '3.8 km',
      time: '9:45 AM'
    }
  ];

  // Sample notifications
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: t('new_order_assigned', 'New Order Assigned'),
      message: t('new_order_msg', 'You have a new order to deliver. Check your orders section.'),
      time: '2 min ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: t('delivery_completed', 'Delivery Completed'),
      message: t('delivery_completed_msg', 'Order ORD-2024-001 delivered successfully.'),
      time: '15 min ago',
      read: true
    },
    {
      id: 3,
      type: 'warning',
      title: t('pickup_reminder', 'Pickup Reminder'),
      message: t('pickup_reminder_msg', 'Don\'t forget to pickup order ORD-2024-005.'),
      time: '1 hour ago',
      read: false
    }
  ];

  // Status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending':
        return 'neo-order-status pending';
      case 'in-progress':
        return 'neo-order-status in-progress';
      case 'completed':
        return 'neo-order-status completed';
      default:
        return 'neo-order-status pending';
    }
  };

  // Status badge text
  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return t('pending', 'Pending');
      case 'in-progress':
        return t('in_progress', 'In Progress');
      case 'completed':
        return t('completed', 'Completed');
      default:
        return t('pending', 'Pending');
    }
  };

  // Handle opening maps
  const handleOpenMaps = (address) => {
    const fullAddress = address.street || `${liveLocation.latitude}, ${liveLocation.longitude}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="neo-dashboard">
      {/* Animated Background */}
      <div className="neo-bg-gradient"></div>
      <div className="neo-bg-orb neo-orb-1"></div>
      <div className="neo-bg-orb neo-orb-2"></div>
      <div className="neo-bg-orb neo-orb-3"></div>

      {/* Header */}
      <div className="neo-header">
        <div className="neo-header-content">
          <div className="neo-header-left">
            <button 
              className="neo-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="neo-brand">
              <div className="neo-brand-icon">
                <TruckIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="neo-title">{t('delivery_dashboard', 'Delivery Dashboard')}</h1>
                <p className="neo-subtitle">{stats.deliveryBoyName || t('driver', 'Driver')}</p>
              </div>
            </div>
          </div>
          
          <div className="neo-header-right">
            <div className="neo-time-display">
              <ClockSolidIcon className="w-4 h-4" />
              <span>{formattedTime}</span>
            </div>
            <div className={`neo-status-indicator ${isOnShift ? 'online' : 'offline'}`}>
              <span className="neo-status-dot"></span>
              <span>{isOnShift ? t('on_shift', 'On Shift') : t('off_duty', 'Off Duty')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="neo-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div className={`neo-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="neo-sidebar-header">
          <div className="neo-sidebar-profile">
            <div className="neo-profile-avatar">
              {stats.deliveryBoyName?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div>
              <p className="neo-profile-name">{stats.deliveryBoyName || t('delivery_boy', 'Delivery Boy')}</p>
              <p className="neo-profile-status">{isOnShift ? t('online', 'Online') : t('offline', 'Offline')}</p>
            </div>
          </div>
          <button 
            className="neo-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="neo-sidebar-nav">
          <button 
            className={`neo-sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setIsSidebarOpen(false);
            }}
          >
            <ChartBarIcon className="w-5 h-5" />
            <span>{t('overview', 'Overview')}</span>
          </button>
          <button 
            className={`neo-sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              navigate('/delivery-dashboard/my-orders');
              setIsSidebarOpen(false);
            }}
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            <span>{t('my_orders', 'My Orders')}</span>
            {stats.pendingTasks > 0 && (
              <span className="neo-sidebar-badge">{stats.pendingTasks}</span>
            )}
          </button>
          <button 
            className={`neo-sidebar-item ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('performance');
              navigate('/delivery-dashboard/performance');
              setIsSidebarOpen(false);
            }}
          >
            <ArrowTrendingUpIcon className="w-5 h-5" />
            <span>{t('performance', 'Performance')}</span>
          </button>
          <button 
            className={`neo-sidebar-item ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('earnings');
              navigate('/delivery-dashboard/earnings');
              setIsSidebarOpen(false);
            }}
          >
            <CurrencyRupeeIcon className="w-5 h-5" />
            <span>{t('earnings', 'Earnings')}</span>
          </button>
          <button 
            className={`neo-sidebar-item ${activeTab === 'shifts' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('shifts');
              navigate('/delivery-dashboard/shift-management');
              setIsSidebarOpen(false);
            }}
          >
            <ClockIcon className="w-5 h-5" />
            <span>{t('shifts', 'Shifts')}</span>
          </button>
          <button 
            className={`neo-sidebar-item ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('support');
              navigate('/delivery-dashboard/help-support');
              setIsSidebarOpen(false);
            }}
          >
            <HeartIcon className="w-5 h-5" />
            <span>{t('support', 'Support')}</span>
          </button>
          <button 
            className={`neo-sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('settings');
              navigate('/delivery-dashboard/profile-settings');
              setIsSidebarOpen(false);
            }}
          >
            <CogIcon className="w-5 h-5" />
            <span>{t('settings', 'Settings')}</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="neo-main-content">
        {/* Hero Header Section */}
        <div className="neo-hero-section">
          <div className="neo-hero-content">
            <div className="neo-status-row">
              <div className={`neo-status-indicator ${isOnShift ? 'online' : 'offline'}`}>
                <span className="neo-status-dot"></span>
                <span>{isOnShift ? t('on_shift', 'On Shift') : t('off_duty', 'Off Duty')}</span>
              </div>
              <div className="neo-time-display">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>{formattedTime}</span>
              </div>
            </div>
            
            <div className="neo-greeting-row">
              <span className="neo-greeting-emoji">{greeting.emoji}</span>
              <div className="neo-greeting-text">
                <p className="neo-greeting">{greeting.text}</p>
                <h1 className="neo-hero-title">{stats.deliveryBoyName || t('driver', 'Driver')}</h1>
              </div>
            </div>
            
            <p className="neo-hero-date">{formattedDate}</p>

            {/* Floating Rating Card */}
            <div className="neo-rating-float">
              <div className="neo-rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <StarSolidIcon 
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(stats.rating || 5) ? 'text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="neo-rating-value">{stats.rating || '5.0'}</span>
              <span className="neo-rating-label">{t('rating', 'Rating')}</span>
            </div>
          </div>
        </div>

        {/* Task Progress Bar */}
        <div className="neo-task-progress">
          <div className="neo-task-header">
            <div className="neo-task-title">{t('todays_task_progress', 'Today\'s Task Progress')}</div>
            <div className="neo-task-count">{completedTasks}/{totalTasks || 0}</div>
          </div>
          <div className="neo-task-progress-bar">
            <div className="neo-task-progress-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
          <div className="neo-task-stats">
            <span>{t('completed', 'Completed')}</span>
            <span>{completionRate}%</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="neo-quick-stats">
          <div className="neo-quick-stat">
            <div className="neo-quick-stat-value">{animatedStats.pickups ?? 0}</div>
            <div className="neo-quick-stat-label">{t('pickups', 'Pickups')}</div>
          </div>
          <div className="neo-quick-stat">
            <div className="neo-quick-stat-value">{animatedStats.deliveries ?? 0}</div>
            <div className="neo-quick-stat-label">{t('deliveries', 'Deliveries')}</div>
          </div>
          <div className="neo-quick-stat">
            <div className="neo-quick-stat-value">{stats.pendingTasks || 0}</div>
            <div className="neo-quick-stat-label">{t('pending', 'Pending')}</div>
          </div>
          <div className="neo-quick-stat">
            <div className="neo-quick-stat-value">{stats.earningsToday || 0}</div>
            <div className="neo-quick-stat-label">{t('earnings', 'Earnings')}</div>
          </div>
        </div>

        {/* Live Stats Cards */}
        <div className="neo-stats-grid">
          <div className="neo-stat-card neo-stat-primary" onClick={() => navigate('/delivery-dashboard/my-orders')}>
            <div className="neo-stat-glow"></div>
            <div className="neo-stat-icon-wrap">
              <ArrowUpTrayIcon className="w-6 h-6" />
            </div>
            <div className="neo-stat-content">
              <span className="neo-stat-value">{animatedStats.pickups ?? 0}</span>
              <span className="neo-stat-label">{t('pickups_today', 'Pickups Today')}</span>
            </div>
            <BoltIcon className="neo-stat-bg-icon" />
          </div>

          <div className="neo-stat-card neo-stat-success" onClick={() => navigate('/delivery-dashboard/my-orders')}>
            <div className="neo-stat-glow"></div>
            <div className="neo-stat-icon-wrap">
              <ArrowDownTrayIcon className="w-6 h-6" />
            </div>
            <div className="neo-stat-content">
              <span className="neo-stat-value">{animatedStats.deliveries ?? 0}</span>
              <span className="neo-stat-label">{t('deliveries_today', 'Deliveries Today')}</span>
            </div>
            <TruckIcon className="neo-stat-bg-icon" />
          </div>

          <div className="neo-stat-card neo-stat-warning" onClick={() => navigate('/delivery-dashboard/my-orders')}>
            <div className="neo-stat-glow"></div>
            <div className="neo-stat-icon-wrap">
              <ClockIcon className="w-6 h-6" />
            </div>
            <div className="neo-stat-content">
              <span className="neo-stat-value">{stats.pendingTasks || 0}</span>
              <span className="neo-stat-label">{t('pending_tasks', 'Pending')}</span>
            </div>
            <FireIcon className="neo-stat-bg-icon" />
          </div>

          <div className="neo-stat-card neo-stat-info" onClick={() => navigate('/delivery-dashboard/performance')}>
            <div className="neo-stat-glow"></div>
            <div className="neo-stat-icon-wrap">
              <CheckCircleOutlineIcon className="w-6 h-6" />
            </div>
            <div className="neo-stat-content">
              <span className="neo-stat-value">{animatedStats.completed ?? 0}</span>
              <span className="neo-stat-label">{t('completed', 'Completed')}</span>
            </div>
            <SparklesIcon className="neo-stat-bg-icon" />
          </div>
        </div>

        {/* Progress Ring Section */}
        <div className="neo-progress-section">
          <div className="neo-progress-ring-card">
            <div className="neo-progress-ring" style={{ '--progress': completionRate }}>
              <svg viewBox="0 0 100 100">
                <circle className="neo-ring-bg" cx="50" cy="50" r="42" />
                <circle 
                  className="neo-ring-fill" 
                  cx="50" 
                  cy="50" 
                  r="42"
                  strokeDasharray={`${completionRate * 2.64} 264`}
                />
              </svg>
              <div className="neo-progress-content">
                <span className="neo-progress-value">{completionRate}%</span>
                <span className="neo-progress-label">{t('complete', 'Complete')}</span>
              </div>
            </div>
            <div className="neo-progress-details">
              <h3>{t('todays_progress', "Today's Progress")}</h3>
              <p>{completedTasks} {t('of', 'of')} {totalTasks || 0} {t('tasks_done', 'tasks done')}</p>
              <div className="neo-progress-bar">
                <div className="neo-progress-fill" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings Panel */}
        <div className="neo-earnings-panel">
          <div className="neo-panel-header">
            <div className="neo-panel-title">
              <BanknotesIcon className="w-5 h-5" />
              <h3>{t('earnings', 'Earnings')}</h3>
            </div>
            <button className="neo-see-all" onClick={() => navigate('/delivery-dashboard/earnings')}>
              {t('see_all', 'See All')}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="neo-earnings-cards">
            <div className="neo-earning-card neo-earning-today">
              <div className="neo-earning-header">
                <span className="neo-earning-badge">{t('today', 'Today')}</span>
                <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="neo-earning-amount">
                <CurrencyRupeeIcon className="w-6 h-6" />
                <span>{animatedStats.earnings ?? 0}</span>
              </div>
            </div>
            <div className="neo-earning-card">
              <div className="neo-earning-header">
                <span className="neo-earning-badge">{t('this_week', 'This Week')}</span>
              </div>
              <div className="neo-earning-amount">
                <CurrencyRupeeIcon className="w-5 h-5" />
                <span>{stats.weeklyEarnings || 0}</span>
              </div>
            </div>
            <div className="neo-earning-card">
              <div className="neo-earning-header">
                <span className="neo-earning-badge">{t('this_month', 'Month')}</span>
              </div>
              <div className="neo-earning-amount">
                <CurrencyRupeeIcon className="w-5 h-5" />
                <span>{stats.monthlyEarnings || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Preview Card */}
        <div className="neo-map-card">
          <div className="neo-map-header">
            <div className="neo-map-title">{t('current_route', 'Current Route')}</div>
            <button className="neo-see-all" onClick={() => navigate('/delivery-dashboard/my-orders')}>
              {t('view_map', 'View Map')}
            </button>
          </div>
          <div className="neo-map-preview">
            <div className="neo-map-route"></div>
            <div className="neo-map-marker"></div>
            <div className="neo-map-marker destination"></div>
          </div>
          <div className="neo-map-distance">{t('distance_to_destination', '2.5 km to destination')}</div>
        </div>

        {/* Real-time Tracking Section */}
        <div className="neo-tracking-section">
          <div className="neo-section-header">
            <h3 className="neo-section-title">
              <MapPinIcon className="w-5 h-5" />
              {t('real_time_tracking', 'Real-time Tracking')}
            </h3>
            <div className="neo-tracking-controls">
              <button 
                className={`neo-tracking-btn ${isTrackingActive ? 'active' : ''}`}
                onClick={isTrackingActive ? stopTracking : startTracking}
              >
                {isTrackingActive ? (
                  <>
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    {t('stop_tracking', 'Stop Tracking')}
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    {t('start_tracking', 'Start Tracking')}
                  </>
                )}
              </button>
            </div>
          </div>
          
          {isTrackingActive && (
            <div className="neo-tracking-info">
              <div className="neo-tracking-status">
                <div className="neo-status-item">
                  <span className="neo-status-label">{t('current_status', 'Current Status')}:</span>
                  <span className="neo-status-value tracking-active">{t('tracking_active', 'Tracking Active')}</span>
                </div>
                <div className="neo-status-item">
                  <span className="neo-status-label">{t('last_update', 'Last Update')}:</span>
                  <span className="neo-status-value">{liveLocation.timestamp ? new Date(liveLocation.timestamp).toLocaleTimeString() : t('no_location', 'No Location')}</span>
                </div>
              </div>
              
              {liveLocation.latitude && liveLocation.longitude && (
                <div className="neo-location-details">
                  <div className="neo-location-coords">
                    <span className="neo-coord-label">{t('latitude', 'Lat')}:</span>
                    <span className="neo-coord-value">{liveLocation.latitude.toFixed(6)}</span>
                    <span className="neo-coord-label ml-4">{t('longitude', 'Lng')}:</span>
                    <span className="neo-coord-value">{liveLocation.longitude.toFixed(6)}</span>
                  </div>
                  <button 
                    className="neo-location-action"
                    onClick={() => handleOpenMaps({
                      street: `${liveLocation.latitude}, ${liveLocation.longitude}`,
                      city: '', state: '', zipCode: ''
                    })}
                  >
                    <MapIconSolid className="w-4 h-4" />
                    {t('view_on_map', 'View on Map')}
                  </button>
                </div>
              )}
              
              {currentOrder && (
                <div className="neo-current-order">
                  <div className="neo-order-badge">
                    <span className="neo-order-id">{currentOrder.id}</span>
                    <span className={`neo-order-status ${currentOrder.status}`}>{getStatusText(currentOrder.status)}</span>
                  </div>
                  <p className="neo-order-address">{currentOrder.address}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="neo-actions-section">
          <h3 className="neo-section-title">
            <RocketLaunchIcon className="w-5 h-5" />
            {t('quick_actions', 'Quick Actions')}
          </h3>
          <div className="neo-actions-grid">
            <button className="neo-action-btn neo-action-orders" onClick={() => navigate('/delivery-dashboard/my-orders')}>
              <div className="neo-action-icon">
                <ClipboardDocumentListIcon className="w-7 h-7" />
              </div>
              <span className="neo-action-label">{t('my_orders', 'My Orders')}</span>
              {stats.pendingTasks > 0 && (
                <span className="neo-action-badge">{stats.pendingTasks}</span>
              )}
            </button>
            
            <button className="neo-action-btn neo-action-perf" onClick={() => navigate('/delivery-dashboard/performance')}>
              <div className="neo-action-icon">
                <ArrowTrendingUpIcon className="w-7 h-7" />
              </div>
              <span className="neo-action-label">{t('performance', 'Performance')}</span>
            </button>
            
            <button className="neo-action-btn neo-action-shift" onClick={() => navigate('/delivery-dashboard/shift-management')}>
              <div className="neo-action-icon">
                <ClockIcon className="w-7 h-7" />
              </div>
              <span className="neo-action-label">{t('shifts', 'Shifts')}</span>
            </button>
            
            <button className="neo-action-btn neo-action-support" onClick={() => navigate('/delivery-dashboard/help-support')}>
              <div className="neo-action-icon">
                <HeartIcon className="w-7 h-7" />
              </div>
              <span className="neo-action-label">{t('support', 'Support')}</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="neo-actions-section">
          <h3 className="neo-section-title">
            <DocumentTextIcon className="w-5 h-5" />
            {t('recent_orders', 'Recent Orders')}
          </h3>
          {recentOrders.map((order) => (
            <div key={order.id} className="neo-order-card">
              <div className="neo-order-header">
                <div className="neo-order-number">{order.id}</div>
                <div className={getStatusClass(order.status)}>{getStatusText(order.status)}</div>
              </div>
              <div className="neo-order-details">
                <div className="neo-order-customer">{order.customer}</div>
                <div className="neo-order-amount">₹{order.amount}</div>
              </div>
              <div className="neo-order-info">
                <div className="neo-order-item">
                  <span className="neo-order-label">{t('items', 'Items')}:</span>
                  <span className="neo-order-value">{order.items}</span>
                </div>
                <div className="neo-order-item">
                  <span className="neo-order-label">{t('distance', 'Distance')}:</span>
                  <span className="neo-order-value">{order.distance}</span>
                </div>
                <div className="neo-order-item">
                  <span className="neo-order-label">{t('time', 'Time')}:</span>
                  <span className="neo-order-value">{order.time}</span>
                </div>
              </div>
              <div className="neo-order-actions">
                <button className="neo-order-action primary">
                  {order.status === 'pending' ? t('pickup', 'Pickup') : order.status === 'in-progress' ? t('deliver', 'Deliver') : t('view', 'View')}
                </button>
                <button className="neo-order-action success">
                  <PhoneIconSolid className="w-4 h-4" />
                </button>
                <button className="neo-order-action success">
                  <ChatIconSolid className="w-4 h-4" />
                </button>
                <button className="neo-order-action success">
                  <MapIconSolid className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Management Section */}
        <div className="neo-order-management-section">
          <div className="neo-section-header">
            <h3 className="neo-section-title">
              <ClipboardDocumentListIcon className="w-5 h-5" />
              {t('order_management', 'Order Management')}
            </h3>
            <button className="neo-see-all" onClick={() => navigate('/delivery-dashboard/my-orders')}>
              {t('view_all_orders', 'View All Orders')}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="neo-order-management-grid">
            {/* Pending Orders */}
            <div className="neo-order-management-card">
              <div className="neo-order-management-icon bg-yellow-100 text-yellow-600">
                <ClockIcon className="w-6 h-6" />
              </div>
              <div className="neo-order-management-content">
                <div className="neo-order-management-value">{stats.pendingTasks || 0}</div>
                <div className="neo-order-management-label">{t('pending_orders', 'Pending Orders')}</div>
              </div>
              <button 
                className="neo-order-management-action"
                onClick={() => navigate('/delivery-dashboard/my-orders?status=pending')}
              >
                <span>{t('manage', 'Manage')}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* In Progress Orders */}
            <div className="neo-order-management-card">
              <div className="neo-order-management-icon bg-blue-100 text-blue-600">
                <TruckIcon className="w-6 h-6" />
              </div>
              <div className="neo-order-management-content">
                <div className="neo-order-management-value">
                  {recentOrders.filter(order => order.status === 'in-progress' || order.status === 'out-for-delivery').length}
                </div>
                <div className="neo-order-management-label">{t('in_progress_orders', 'In Progress')}</div>
              </div>
              <button 
                className="neo-order-management-action"
                onClick={() => navigate('/delivery-dashboard/my-orders?status=in-progress')}
              >
                <span>{t('manage', 'Manage')}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Completed Today */}
            <div className="neo-order-management-card">
              <div className="neo-order-management-icon bg-green-100 text-green-600">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
              <div className="neo-order-management-content">
                <div className="neo-order-management-value">{stats.completedTasksToday || stats.completedToday || 0}</div>
                <div className="neo-order-management-label">{t('completed_today', 'Completed Today')}</div>
              </div>
              <button 
                className="neo-order-management-action"
                onClick={() => navigate('/delivery-dashboard/my-orders?status=completed')}
              >
                <span>{t('view', 'View')}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Quick Order Actions */}
          <div className="neo-quick-order-actions">
            <button 
              className="neo-quick-action"
              onClick={() => {
                // In a real app, this would open a quick action modal
                alert(t('quick_action_alert', 'Quick action would open here')); 
              }}
            >
              <div className="neo-quick-action-icon bg-blue-100 text-blue-600">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <span className="neo-quick-action-label">{t('mark_all_delivered', 'Mark All Delivered')}</span>
            </button>
            <button 
              className="neo-quick-action"
              onClick={() => {
                // In a real app, this would open a quick action modal
                alert(t('quick_action_alert', 'Quick action would open here')); 
              }}
            >
              <div className="neo-quick-action-icon bg-green-100 text-green-600">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <span className="neo-quick-action-label">{t('call_customers', 'Call Customers')}</span>
            </button>
            <button 
              className="neo-quick-action"
              onClick={() => {
                // In a real app, this would open a quick action modal
                alert(t('quick_action_alert', 'Quick action would open here')); 
              }}
            >
              <div className="neo-quick-action-icon bg-purple-100 text-purple-600">
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </div>
              <span className="neo-quick-action-label">{t('send_updates', 'Send Updates')}</span>
            </button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="neo-performance-section">
          <h3 className="neo-section-title">
            <SparklesIcon className="w-5 h-5" />
            {t('performance_stats', 'Performance Stats')}
          </h3>
          <div className="neo-perf-cards">
            <div className="neo-perf-card">
              <div className="neo-perf-ring" style={{ '--perf-progress': stats.onTimePercentage || 100 }}>
                <svg viewBox="0 0 60 60">
                  <circle className="neo-perf-ring-bg" cx="30" cy="30" r="26" />
                  <circle 
                    className="neo-perf-ring-fill" 
                    cx="30" 
                    cy="30" 
                    r="26"
                    strokeDasharray={`${(stats.onTimePercentage || 100) * 1.63} 163`}
                  />
                </svg>
                <span className="neo-perf-ring-value">{stats.onTimePercentage || 100}%</span>
              </div>
              <span className="neo-perf-card-label">{t('on_time', 'On Time')}</span>
            </div>
            <div className="neo-perf-card">
              <div className="neo-perf-stat">
                <TruckIcon className="w-8 h-8 text-blue-500" />
                <span className="neo-perf-stat-value">{stats.totalDeliveries || 0}</span>
              </div>
              <span className="neo-perf-card-label">{t('total_deliveries', 'Total')}</span>
            </div>
            <div className="neo-perf-card">
              <div className="neo-perf-stat">
                <div className="neo-perf-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <StarSolidIcon 
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(stats.rating || 5) ? 'text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="neo-perf-stat-value">{stats.rating || '5.0'}</span>
              </div>
              <span className="neo-perf-card-label">{t('avg_rating', 'Avg Rating')}</span>
            </div>
          </div>
        </div>

        {/* Performance Analytics Section */}
        <div className="neo-analytics-section">
          <div className="neo-section-header">
            <h3 className="neo-section-title">
              <ChartBarIcon className="w-5 h-5" />
              {t('performance_analytics', 'Performance Analytics')}
            </h3>
            <button className="neo-see-all" onClick={() => navigate('/delivery-dashboard/performance')}>
              {t('view_detailed', 'View Detailed')}
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="neo-analytics-grid">
            {/* Today's Performance */}
            <div className="neo-analytics-card">
              <div className="neo-analytics-header">
                <h4 className="neo-analytics-subtitle">{t('today_s_performance', "Today's Performance")}</h4>
              </div>
              <div className="neo-analytics-stats">
                <div className="neo-analytics-stat">
                  <div className="neo-stat-icon bg-blue-100 text-blue-600">
                    <TruckIcon className="w-5 h-5" />
                  </div>
                  <div className="neo-stat-content">
                    <span className="neo-stat-value">{performanceData.todayStats.deliveries}</span>
                    <span className="neo-stat-label">{t('deliveries_completed', 'Deliveries')}</span>
                  </div>
                </div>
                <div className="neo-analytics-stat">
                  <div className="neo-stat-icon bg-green-100 text-green-600">
                    <ArrowUpTrayIcon className="w-5 h-5" />
                  </div>
                  <div className="neo-stat-content">
                    <span className="neo-stat-value">{performanceData.todayStats.pickups}</span>
                    <span className="neo-stat-label">{t('pickups_completed', 'Pickups')}</span>
                  </div>
                </div>
                <div className="neo-analytics-stat">
                  <div className="neo-stat-icon bg-purple-100 text-purple-600">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div className="neo-stat-content">
                    <span className="neo-stat-value">{performanceData.todayStats.distance} km</span>
                    <span className="neo-stat-label">{t('distance_covered', 'Distance')}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Efficiency Metrics */}
            <div className="neo-analytics-card">
              <div className="neo-analytics-header">
                <h4 className="neo-analytics-subtitle">{t('efficiency_metrics', 'Efficiency Metrics')}</h4>
              </div>
              <div className="neo-efficiency-grid">
                <div className="neo-efficiency-item">
                  <div className="neo-efficiency-label">{t('avg_delivery_time', 'Avg. Delivery Time')}</div>
                  <div className="neo-efficiency-value">{performanceData.efficiency.avgDeliveryTime} {t('minutes', 'min')}</div>
                  <div className="neo-efficiency-trend positive">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    {t('improved', '+5%')}
                  </div>
                </div>
                <div className="neo-efficiency-item">
                  <div className="neo-efficiency-label">{t('on_time_rate', 'On-time Rate')}</div>
                  <div className="neo-efficiency-value">{performanceData.efficiency.onTimeRate}%</div>
                  <div className="neo-efficiency-trend positive">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    {t('excellent', 'Excellent')}
                  </div>
                </div>
                <div className="neo-efficiency-item">
                  <div className="neo-efficiency-label">{t('customer_satisfaction', 'Satisfaction')}</div>
                  <div className="neo-efficiency-value">{performanceData.efficiency.customerSatisfaction}/5</div>
                  <div className="neo-efficiency-trend positive">
                    <StarSolidIcon className="w-4 h-4" />
                    {t('high', 'High')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="neo-notifications">
          <h3 className="neo-section-title">
            <BellIcon className="w-5 h-5" />
            {t('notifications', 'Notifications')}
          </h3>
          {notifications.map((notification) => (
            <div key={notification.id} className="neo-notification">
              <div className={`neo-notification-icon ${notification.type}`}>
                {notification.type === 'info' && <InformationCircleIcon className="w-4 h-4" />}
                {notification.type === 'success' && <CheckCircleSolidIcon className="w-4 h-4" />}
                {notification.type === 'warning' && <ExclamationTriangleIcon className="w-4 h-4" />}
              </div>
              <div className="neo-notification-content">
                <div className="neo-notification-title">{notification.title}</div>
                <div className="neo-notification-message">{notification.message}</div>
              </div>
              <div className="neo-notification-time">{notification.time}</div>
            </div>
          ))}
        </div>

        {/* Motivational Footer */}
        <div className="neo-motivation-card">
          <div className="neo-motivation-icon">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div className="neo-motivation-content">
            <h4>{t('keep_going', "You're doing great!")}</h4>
            <p>{t('motivation_msg', 'Complete your pending tasks to earn bonus rewards today!')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDeliveryDashboard;