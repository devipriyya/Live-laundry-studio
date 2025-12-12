import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import IncidentReportModal from '../components/IncidentReportModal';
import LiveLocationTracking from '../components/LiveLocationTracking';
import ChatWidget from '../components/ChatWidget';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserIcon,
  PhoneIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  CurrencyRupeeIcon,
  MapIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  StarIcon,
  ShieldCheckIcon,
  PresentationChartLineIcon,
  ClipboardDocumentListIcon,
  WalletIcon,
  CogIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
  GiftIcon,
  LightBulbIcon,
  BellAlertIcon,
  ClockIcon as ClockSolidIcon,
  PencilIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PlayIcon,
  XIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const DeliveryBoyDashboardModern = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, getProfile, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 24,
    activeDeliveries: 3,
    completedToday: 7,
    pendingPickups: 2,
    pendingDeliveries: 1,
    earningsToday: 1250,
    rating: 4.8,
    onTimePercentage: 96,
    weeklyEarnings: 8450,
    monthlyEarnings: 32500
  });
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationNote, setLocationNote] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftStatus, setShiftStatus] = useState('online'); // offline, online, break
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    stats: true,
    orders: true,
    performance: true
  });
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    licensePlate: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [theme, setTheme] = useState(() => {    // Load theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('deliveryDashboardTheme') || 'light';
    console.log('Initializing theme from localStorage:', savedTheme);
    return savedTheme;
  });
  const [language, setLanguage] = useState(() => {
    // Load language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('deliveryDashboardLanguage') || 'en';
    console.log('Initializing language from localStorage:', savedLanguage);
    return savedLanguage;
  });

  // Update i18n language when state changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Apply theme on mount and when theme changes
  useEffect(() => {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');
    // Add the current theme class
    document.documentElement.classList.add(theme);
    
    // Also apply to body for consistency
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  // Mock data for demonstration
  const mockOrders = [
    {
      _id: '1',
      orderNumber: 'ORD-2024-001',
      status: 'out-for-pickup',
      customerInfo: {
        name: 'Alice Johnson',
        phone: '+1 (555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          instructions: 'Ring doorbell twice'
        }
      },
      items: [
        { name: 'Shirts', quantity: 5, service: 'Wash & Iron', price: 250 },
        { name: 'Pants', quantity: 3, service: 'Dry Clean', price: 300 }
      ],
      totalAmount: 550,
      pickupDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      priority: 'high',
      paymentStatus: 'paid',
      weight: '2.5 kg'
    },
    {
      _id: '2',
      orderNumber: 'ORD-2024-002',
      status: 'out-for-delivery',
      customerInfo: {
        name: 'Bob Smith',
        phone: '+1 (555) 987-6543',
        address: {
          street: '456 Oak Ave',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11201'
        }
      },
      items: [
        { name: 'Dresses', quantity: 2, service: 'Dry Clean', price: 400 },
        { name: 'Curtains', quantity: 1, service: 'Wash & Fold', price: 250 }
      ],
      totalAmount: 650,
      deliveryDate: new Date().toISOString(),
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      priority: 'normal',
      paymentStatus: 'pending'
    },
    {
      _id: '3',
      orderNumber: 'ORD-2024-003',
      status: 'pickup-completed',
      customerInfo: {
        name: 'Carol Williams',
        phone: '+1 (555) 456-7890',
        address: {
          street: '789 Pine St',
          city: 'Queens',
          state: 'NY',
          zipCode: '11375'
        }
      },
      items: [
        { name: 'Suits', quantity: 1, service: 'Dry Clean', price: 320 },
        { name: 'Ties', quantity: 3, service: 'Wash & Iron', price: 90 }
      ],
      totalAmount: 410,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      priority: 'low',
      paymentStatus: 'paid'
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [orders, searchTerm, sortBy, sortOrder, filters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  const applyFiltersAndSorting = () => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.phone.includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    // Apply amount filters
    if (filters.minAmount) {
      result = result.filter(order => order.totalAmount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      result = result.filter(order => order.totalAmount <= parseFloat(filters.maxAmount));
    }
    
    // Apply date filters
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      result = result.filter(order => new Date(order.createdAt) >= dateFrom);
    }
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      result = result.filter(order => new Date(order.createdAt) <= dateTo);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'totalAmount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'customerName':
          aValue = a.customerInfo.name;
          bValue = b.customerInfo.name;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredOrders(result);
  };

  const getStatusColor = (status) => {
    const colors = {
      'out-for-pickup': 'bg-amber-100 text-amber-800 border-amber-300',
      'pickup-completed': 'bg-blue-100 text-blue-800 border-blue-300',
      'out-for-delivery': 'bg-purple-100 text-purple-800 border-purple-300',
      'delivery-completed': 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'out-for-pickup': 'Out for Pickup',
      'pickup-completed': 'Pickup Completed',
      'out-for-delivery': 'Out for Delivery',
      'delivery-completed': 'Delivered'
    };
    return labels[status] || status;
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'out-for-pickup': 'pickup-completed',
      'pickup-completed': 'out-for-delivery',
      'out-for-delivery': 'delivery-completed'
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? getStatusLabel(nextStatus) : null;
  };

  const handleCallCustomer = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleSendMessage = (phoneNumber) => {
    window.open(`sms:${phoneNumber}`, '_blank');
  };

  const handleOpenMaps = (address) => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleTakePhoto = () => {
    // In a real app, this would trigger the camera
    alert('Camera functionality would be implemented here');
  };

  const handleUploadPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, this would upload the file
      alert(`File "${file.name}" selected for upload`);
    }
  };

  const handleLocationUpdate = () => {
    if (location.latitude && location.longitude) {
      setShowLocationModal(true);
    } else {
      alert('Location not available. Please enable location services.');
    }
  };

  const submitLocationUpdate = () => {
    if (selectedOrder) {
      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        note: locationNote,
        timestamp: new Date().toISOString()
      };
      
      // In a real app, this would update the order status
      console.log('Location update submitted:', locationData);
      
      setShowLocationModal(false);
      setLocationNote('');
      
      // Add success notification
      setNotifications(prev => [{
        id: Date.now(),
        title: "Location Updated",
        message: "Your location has been successfully updated",
        type: "success",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
    }
  };

  const toggleShiftStatus = () => {
    const newStatus = shiftStatus === 'online' ? 'offline' : 'online';
    setShiftStatus(newStatus);
    
    // Add notification
    setNotifications(prev => [{
      id: Date.now(),
      title: t('shift_status_updated'),
      message: `${t('you_are_now')} ${newStatus}`,
      type: "info",
      timestamp: new Date(),
      read: false
    }, ...prev]);
    setUnreadNotifications(prev => prev + 1);
  };

  const loadProfile = async () => {
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    
    try {
      const profile = await getProfile();
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        vehicleType: profile.vehicleType || '',
        licensePlate: profile.licensePlate || ''
      });
    } catch (error) {
      setProfileError('Failed to load profile');
      console.error('Error loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    
    try {
      await updateProfile(profileData);
      setProfileSuccess('Profile updated successfully');
      
      // Add success notification
      setNotifications(prev => [{
        id: Date.now(),
        title: "Profile Updated",
        message: "Your profile has been successfully updated",
        type: "success",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
    } catch (error) {
      setProfileError('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleMessageAdmin = () => {
    // In a real app, this would open a chat with admin
    alert('Messaging admin functionality would be implemented here');
  };

  const handleIncidentReport = (reportData) => {
    // In a real app, this would submit the incident report
    console.log('Incident report submitted:', reportData);
    setShowIncidentModal(false);
    
    // Add success notification
    setNotifications(prev => [{
      id: Date.now(),
      title: "Incident Reported",
      message: "Your incident has been reported successfully",
      type: "success",
      timestamp: new Date(),
      read: false
    }, ...prev]);
    setUnreadNotifications(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">Fabrico Delivery</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleShiftStatus}
                className={`relative inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  shiftStatus === 'online' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                } transition-colors`}
              >
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  shiftStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {shiftStatus === 'online' ? 'Online' : 'Offline'}
              </button>
              
              <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
                <BellIcon className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden md:inline text-gray-700 font-medium">{user?.name || 'User'}</span>
                  <ChevronDownIcon className="hidden md:inline h-4 w-4 text-gray-500" />
                </button>
                
                {showProfileMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowProfileSettings(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        {t('profile')}
                      </button>
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowEarningsModal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <CurrencyRupeeIcon className="w-4 h-4" />
                        {t('earnings')}
                      </button>
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowPerformanceModal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <ChartBarIcon className="w-4 h-4" />
                        {t('performance')}
                      </button>
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowSettingsModal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <CogIcon className="w-4 h-4" />
                        {t('settings')}
                      </button>
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowHelpModal(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <InformationCircleIcon className="w-4 h-4" />
                        {t('help_support')}
                      </button>
                      <button 
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-6 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Good morning, {user?.name || 'Delivery Partner'}!</h1>
              <p className="mt-1 opacity-90">Ready to start your day? Here's what's waiting for you.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={toggleShiftStatus}
                className={`px-4 py-2 rounded-lg font-medium ${
                  shiftStatus === 'online' 
                    ? 'bg-white text-blue-600 hover:bg-gray-100' 
                    : 'bg-white text-red-600 hover:bg-gray-100'
                } transition-colors`}
              >
                {shiftStatus === 'online' ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Enhanced Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div 
            className="flex justify-between items-center p-5 border-b cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection('stats')}
          >
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <PresentationChartLineIcon className="w-5 h-5 text-blue-500" />
              {t('performance_overview')}
            </h2>
            {expandedSections.stats ? (
              <ChevronUpIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {expandedSections.stats && (
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{t('total_deliveries')}</p>
                      <p className="text-3xl font-bold mt-1">{stats.totalDeliveries}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <TruckIcon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (stats.totalDeliveries / 50) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 opacity-90">Monthly target</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{t('completed_today')}</p>
                      <p className="text-3xl font-bold mt-1">{stats.completedToday}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <CheckCircleIcon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (stats.completedToday / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 opacity-90">Daily goal</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{t('earnings_today')}</p>
                      <p className="text-3xl font-bold mt-1 flex items-center">
                        <CurrencyRupeeIcon className="w-6 h-6 mr-1" />
                        {stats.earningsToday}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <WalletIcon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (stats.earningsToday / 2000) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 opacity-90">Daily target</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{t('rating')}</p>
                      <p className="text-3xl font-bold mt-1 flex items-center">
                        <StarIcon className="w-6 h-6 mr-1" />
                        {stats.rating}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <ShieldCheckIcon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${stats.rating * 20}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-2 opacity-90">Performance score</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-teal-700">{t('on_time_delivery')}</p>
                      <p className="text-2xl font-bold text-teal-800 mt-1">{stats.onTimePercentage}%</p>
                    </div>
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <ClockSolidIcon className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700">{t('weekly_earnings')}</p>
                      <p className="text-2xl font-bold text-blue-800 mt-1 flex items-center">
                        <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
                        {stats.weeklyEarnings}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-violet-700">{t('monthly_earnings')}</p>
                      <p className="text-2xl font-bold text-violet-800 mt-1 flex items-center">
                        <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
                        {stats.monthlyEarnings}
                      </p>
                    </div>
                    <div className="bg-violet-100 p-3 rounded-lg">
                      <GiftIcon className="w-6 h-6 text-violet-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Location Tracking */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-blue-500" />
              {t('live_location_tracking')}
            </h2>
          </div>
          <div className="p-5">
            <LiveLocationTracking />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {[
            { 
              name: t('start_shift'), 
              icon: PlayIcon, 
              color: 'from-green-400 to-green-600',
              bgColor: 'bg-green-50',
              textColor: 'text-green-700',
              action: () => {
                setShiftStatus('online');
                setNotifications(prev => [{
                  id: Date.now(),
                  title: t('shift_status_updated'),
                  message: t('you_are_now_online'),
                  type: "info",
                  timestamp: new Date(),
                  read: false
                }, ...prev]);
                setUnreadNotifications(prev => prev + 1);
              }
            },
            { 
              name: t('report_issue'), 
              icon: ExclamationTriangleIcon, 
              color: 'from-amber-400 to-orange-500',
              bgColor: 'bg-amber-50',
              textColor: 'text-amber-700',
              action: () => setShowIncidentModal(true)
            },
            { 
              name: t('chat_support'), 
              icon: ChatBubbleLeftRightIcon, 
              color: 'from-blue-400 to-indigo-600',
              bgColor: 'bg-blue-50',
              textColor: 'text-blue-700',
              action: () => setShowChatWidget(true)
            },
            { 
              name: t('view_earnings'), 
              icon: CurrencyRupeeIcon, 
              color: 'from-purple-400 to-violet-600',
              bgColor: 'bg-purple-50',
              textColor: 'text-purple-700',
              action: () => setShowEarningsModal(true)
            }
          ].map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`bg-gradient-to-r ${action.color} rounded-xl p-5 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center h-32`}
            >
              <action.icon className="h-8 w-8 mb-2" />
              <span className="font-medium">{action.name}</span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="p-5 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900">{t('my_orders')}</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-grow">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('search_orders')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <FunnelIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('filters')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    <ArrowsUpDownIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">{t('sort')}</span>
                  </button>
                </div>
              </div>
            </div>
            
            {showFilters && (
              <div className="mt-5 pt-5 border-t">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('min_amount')}</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minAmount}
                      onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('max_amount')}</label>
                    <input
                      type="number"
                      placeholder="1000"
                      value={filters.maxAmount}
                      onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('from_date')}</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('to_date')}</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t('all_statuses')}</option>
                      <option value="out-for-pickup">{t('out_for_pickup')}</option>
                      <option value="pickup-completed">{t('pickup_completed')}</option>
                      <option value="out-for-delivery">{t('out_for_delivery')}</option>
                      <option value="delivery-completed">{t('delivered')}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('pending_orders')}
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeTab === 'completed'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('completed')}
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('all_orders')}
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-5">
            {loading ? (
              <div className="text-center py-12">
                <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">{t('loading_orders')}</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 text-gray-300">
                  <ClipboardDocumentListIcon />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{t('no_orders_found')}</h3>
                <p className="mt-1 text-gray-500">{t('no_orders_description')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOrders.map((order) => (
                  <div 
                    key={order._id} 
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'delivery-completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'out-for-delivery' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'pickup-completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{order.customerInfo.name}</p>
                        </div>
                        {order.priority === 'high' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {t('high_priority')}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{order.customerInfo.address.street}, {order.customerInfo.address.city}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{order.customerInfo.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900 flex items-center">
                          <CurrencyRupeeIcon className="w-5 h-5" />
                          {order.totalAmount}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          {t('view_details')}
                          <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 px-5 py-3 flex justify-between">
                      <button 
                        onClick={() => handleOpenMaps(order.customerInfo.address)}
                        className="text-gray-600 hover:text-blue-600 flex items-center text-sm"
                      >
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {t('navigate')}
                      </button>
                      <button 
                        onClick={() => handleCallCustomer(order.customerInfo.phone)}
                        className="text-gray-600 hover:text-green-600 flex items-center text-sm"
                      >
                        <PhoneIcon className="w-4 h-4 mr-1" />
                        {t('call')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{t('order_details')}</h2>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">#{selectedOrder.orderNumber}</h3>
                    <div className="flex items-center mt-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        selectedOrder.status === 'delivery-completed' ? 'bg-green-100 text-green-800' :
                        selectedOrder.status === 'out-for-delivery' ? 'bg-purple-100 text-purple-800' :
                        selectedOrder.status === 'pickup-completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                      {selectedOrder.priority === 'high' && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {t('high_priority')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-2xl font-bold text-gray-900 flex items-center justify-end">
                      <CurrencyRupeeIcon className="w-6 h-6 mr-1" />
                      {selectedOrder.totalAmount}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  {t('customer_information')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('customer_name')}</p>
                    <p className="font-medium">{selectedOrder.customerInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('phone_number')}</p>
                    <p className="font-medium">{selectedOrder.customerInfo.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">{t('address')}</p>
                    <button 
                      onClick={() => handleOpenMaps(selectedOrder.customerInfo.address)}
                      className="text-gray-600 hover:text-blue-600 flex items-center gap-2 text-sm"
                    >
                      <MapPinIcon className="w-4 h-4" />
                      {selectedOrder.customerInfo.address.street}, {selectedOrder.customerInfo.address.city}, {selectedOrder.customerInfo.address.state} {selectedOrder.customerInfo.address.zipCode}
                    </button>
                    {selectedOrder.customerInfo.address.instructions && (
                      <div className="mt-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                        <strong>{t('special_instructions')}:</strong> {selectedOrder.customerInfo.address.instructions}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-blue-50 rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-blue-500" />
                  {t('booking_details')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('order_number')}</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('order_date')}</p>
                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('total_items')}</p>
                    <p className="font-medium">{selectedOrder.totalItems || selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('total_amount')}</p>
                    <p className="font-medium text-blue-600 flex items-center">
                      <CurrencyRupeeIcon className="w-4 h-4" />
                      {selectedOrder.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('payment_status')}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedOrder.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('payment_method')}</p>
                    <p className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                  {selectedOrder.weight && (
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="font-medium">{selectedOrder.weight}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Schedule Information */}
              <div className="bg-purple-50 rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-purple-500" />
                  {t('schedule_information')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedOrder.pickupDate && (
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">{t('pickup_date')}</p>
                      <p className="font-medium">{new Date(selectedOrder.pickupDate).toLocaleDateString()}</p>
                      <p className="text-sm">{new Date(selectedOrder.pickupDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  )}
                  {selectedOrder.deliveryDate && (
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">{t('delivery_date')}</p>
                      <p className="font-medium">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</p>
                      <p className="text-sm">{new Date(selectedOrder.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  )}
                  {selectedOrder.timeSlot && (
                    <div className="bg-white p-3 rounded border md:col-span-2">
                      <p className="text-sm text-gray-600">{t('preferred_time_slot')}</p>
                      <p className="font-medium">{selectedOrder.timeSlot}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-gray-500" />
                  {t('order_items')}
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('item')}</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">{t('service')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{t('qty')}</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">{t('price')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.service}</td>
                          <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right flex items-center justify-end">
                            <CurrencyRupeeIcon className="w-4 h-4" />
                            {item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center font-semibold text-lg">
                  <span>{t('total_amount')}:</span>
                  <span className="text-blue-600 flex items-center">
                    <CurrencyRupeeIcon className="w-5 h-5" />
                    {selectedOrder.totalAmount}
                  </span>
                </div>
              </div>

              {/* Special Instructions */}
              {(selectedOrder.specialInstructions || selectedOrder.recurring) && (
                <div className="bg-amber-50 rounded-lg p-5 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <InformationCircleIcon className="w-5 h-5 text-amber-500" />
                    {t('special_instructions')}
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.specialInstructions && (
                      <p className="text-gray-700">{selectedOrder.specialInstructions}</p>
                    )}
                    {selectedOrder.recurring && (
                      <div className="flex items-center gap-2">
                        <ArrowPathIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Recurring order ({selectedOrder.frequency})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowChatWidget(true)}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  {t('chat_with_customer')}
                </button>
                
                <button
                  onClick={handleMessageAdmin}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  {t('message_admin')}
                </button>
                
                <button
                  onClick={handleLocationUpdate}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                  <MapIcon className="w-5 h-5" />
                  {t('update_location')}
                </button>
                
                <button
                  onClick={() => setShowIncidentModal(true)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Report Incident
                </button>
                
                {selectedOrder.status !== 'delivery-completed' && (
                  <button
                    onClick={() => {
                      const nextStatus = getNextStatus(selectedOrder.status);
                      if (nextStatus) {
                        // In a real app, this would update the order status
                        console.log(`Updating order status to ${nextStatus}`);
                        setShowDetailModal(false);
                        
                        // Add success notification
                        setNotifications(prev => [{
                          id: Date.now(),
                          title: "Status Updated",
                          message: `Order status updated to ${getStatusLabel(nextStatus)}`,
                          type: "success",
                          timestamp: new Date(),
                          read: false
                        }, ...prev]);
                        setUnreadNotifications(prev => prev + 1);
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Mark as {getNextStatusLabel(selectedOrder.status)}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t('update_location')}</h3>
                <button 
                  onClick={() => setShowLocationModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('add_note')}
                  </label>
                  <textarea
                    value={locationNote}
                    onChange={(e) => setLocationNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('location_note_placeholder')}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={submitLocationUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {t('update')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{t('profile_settings')}</h3>
                <button 
                  onClick={() => setShowProfileSettings(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('vehicle_type')}
                  </label>
                  <input
                    type="text"
                    value={profileData.vehicleType}
                    onChange={(e) => setProfileData({...profileData, vehicleType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('license_plate')}
                  </label>
                  <input
                    type="text"
                    value={profileData.licensePlate}
                    onChange={(e) => setProfileData({...profileData, licensePlate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileSettings(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {profileLoading ? t('saving') : t('save_changes')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Incident Report Modal */}
      {showIncidentModal && (
        <IncidentReportModal 
          isOpen={showIncidentModal}
          onClose={() => setShowIncidentModal(false)}
          orderId={selectedOrder?._id}
          onReportSubmit={handleIncidentReport}
        />
      )}

      {/* Chat Widget */}
      {showChatWidget && (
        <div className="fixed bottom-4 right-4 z-40">
          <ChatWidget 
            isOpen={showChatWidget}
            onClose={() => setShowChatWidget(false)}
            orderId={selectedOrder?._id}
          />
        </div>
      )}

      {/* File input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default DeliveryBoyDashboardModern;