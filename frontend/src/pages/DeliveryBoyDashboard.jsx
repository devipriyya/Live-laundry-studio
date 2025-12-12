import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import IncidentReportModal from '../components/IncidentReportModal';
import LiveLocationTracking from '../components/LiveLocationTracking';
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
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import ChatWidget from '../components/ChatWidget';

const DeliveryBoyDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, getProfile, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedToday: 0,
    pendingPickups: 0,
    pendingDeliveries: 0,
    earningsToday: 0,
    rating: 0,
    onTimePercentage: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0
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
  const [shiftStatus, setShiftStatus] = useState('offline'); // offline, online, break
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

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchNotifications();
  }, [activeTab]);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [orders, searchTerm, sortBy, sortOrder, filters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/my-deliveries`, {
        params: { status: activeTab === 'all' ? 'all' : undefined },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filteredOrders = response.data.orders || [];
      
      // Filter based on active tab
      if (activeTab === 'pending') {
        filteredOrders = filteredOrders.filter(order => 
          ['out-for-pickup', 'pickup-completed', 'out-for-delivery'].includes(order.status)
        );
      } else if (activeTab === 'completed') {
        filteredOrders = filteredOrders.filter(order => 
          order.status === 'delivery-completed'
        );
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Use mock data for demo
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/my-deliveries/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add mock earnings and rating for demo
      setStats({
        ...response.data,
        earningsToday: 1250,
        rating: 4.8,
        onTimePercentage: 92,
        weeklyEarnings: 7800,
        monthlyEarnings: 32000
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use mock stats
      setStats({
        totalDeliveries: 45,
        activeDeliveries: 5,
        completedToday: 8,
        pendingPickups: 2,
        pendingDeliveries: 3,
        earningsToday: 1250,
        rating: 4.8,
        onTimePercentage: 92,
        weeklyEarnings: 7800,
        monthlyEarnings: 32000
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      // Mock notifications for demo
      const mockNotifications = [
        {
          id: 1,
          title: "New Order Assigned",
          message: "Order #ORD-2024-005 has been assigned to you",
          type: "info",
          timestamp: new Date(Date.now() - 3600000),
          read: false
        },
        {
          id: 2,
          title: "Payment Received",
          message: "Payment of ₹650 received for order #ORD-2024-002",
          type: "success",
          timestamp: new Date(Date.now() - 86400000),
          read: true
        },
        {
          id: 3,
          title: "Performance Bonus",
          message: "Congratulations! You've earned a ₹200 bonus for excellent performance this week",
          type: "success",
          timestamp: new Date(Date.now() - 172800000),
          read: true
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
    setUnreadNotifications(prev => prev - 1);
  };

  const applyFiltersAndSorting = () => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerInfo.name.toLowerCase().includes(term) ||
        order.customerInfo.phone.includes(term)
      );
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
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(order => new Date(order.createdAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      result = result.filter(order => new Date(order.createdAt) <= toDate);
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case 'customer':
          aValue = a.customerInfo.name;
          bValue = b.customerInfo.name;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default: // createdAt
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredOrders(result);
  };

  const getMockOrders = () => {
    return [
      {
        _id: '1',
        orderNumber: 'ORD-2024-001',
        status: 'out-for-pickup',
        customerInfo: {
          name: 'John Doe',
          phone: '+1 (555) 123-4567',
          address: {
            street: '123 Main St, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        },
        items: [
          { name: 'Shirts', quantity: 5, service: 'Wash & Iron' },
          { name: 'Pants', quantity: 3, service: 'Dry Clean' }
        ],
        totalAmount: 450,
        pickupDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        priority: 'normal'
      },
      {
        _id: '2',
        orderNumber: 'ORD-2024-002',
        status: 'out-for-delivery',
        customerInfo: {
          name: 'Jane Smith',
          phone: '+1 (555) 987-6543',
          address: {
            street: '456 Oak Ave, Suite 12',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210'
          }
        },
        items: [
          { name: 'Dresses', quantity: 2, service: 'Dry Clean' },
          { name: 'Curtains', quantity: 1, service: 'Wash & Fold' }
        ],
        totalAmount: 650,
        deliveryDate: new Date().toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        priority: 'high'
      },
      {
        _id: '3',
        orderNumber: 'ORD-2024-003',
        status: 'pickup-completed',
        customerInfo: {
          name: 'Robert Johnson',
          phone: '+1 (555) 456-7890',
          address: {
            street: '789 Pine St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601'
          }
        },
        items: [
          { name: 'Suits', quantity: 1, service: 'Dry Clean' },
          { name: 'Ties', quantity: 3, service: 'Wash & Iron' }
        ],
        totalAmount: 320,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        priority: 'low'
      }
    ];
  };

  const updateOrderStatus = async (orderId, newStatus, note = '', locationData = null) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { status: newStatus, note };
      
      // Include location if provided
      if (locationData) {
        payload.location = locationData;
      }
      
      await axios.patch(
        `${API_URL}/orders/${orderId}/delivery-status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh orders and stats
      fetchOrders();
      fetchStats();
      setShowDetailModal(false);
      
      // Add success notification
      setNotifications(prev => [{
        id: Date.now(),
        title: "Status Updated",
        message: `Order status updated to ${getStatusLabel(newStatus)}`,
        type: "success",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
      
    } catch (error) {
      console.error('Error updating order:', error);
      // Add error notification
      setNotifications(prev => [{
        id: Date.now(),
        title: "Update Failed",
        message: "Failed to update order status. Please try again.",
        type: "error",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'out-for-pickup': 'bg-yellow-100 text-yellow-800 border-yellow-300',
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
      
      updateOrderStatus(
        selectedOrder._id, 
        getNextStatus(selectedOrder.status), 
        `Location updated: ${locationNote}`,
        locationData
      );
      
      setShowLocationModal(false);
      setLocationNote('');
    }
  };

  const toggleShiftStatus = () => {
    const newStatus = shiftStatus === 'online' ? 'offline' : 'online';
    setShiftStatus(newStatus);
    
    // In a real app, this would update the backend
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
      setProfileError(t('failed_to_load_profile'));
      console.error('Error loading profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    
    try {
      const result = await updateProfile(profileData);
      setProfileSuccess(t('profile_updated_successfully'));
      
      // Update the user in context
      // The updateProfile function already handles this in the AuthContext
      
    } catch (error) {
      setProfileError(t('failed_to_update_profile'));
      console.error('Error updating profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    // Function to message admin
    const handleMessageAdmin = () => {
      // In a real app, this would open a chat or email interface
      alert('Messaging admin functionality would be implemented here');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  {order.priority === 'high' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      High Priority
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                {t('customer_information')}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{order.customerInfo.name}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleCallCustomer(order.customerInfo.phone)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {t('call_customer')}
                  </button>
                  <button 
                    onClick={() => handleSendMessage(order.customerInfo.phone)}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {t('message_customer')}
                  </button>
                </div>
                <button 
                  onClick={() => handleOpenMaps(order.customerInfo.address)}
                  className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
                >
                  <MapPinIcon className="w-4 h-4" />
                  {order.customerInfo.address.street}, {order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.zipCode}
                </button>
                {order.customerInfo.address.instructions && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-gray-700">
                    <strong>{t('special_instructions')}:</strong> {order.customerInfo.address.instructions}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-5 h-5" />
                {t('booking_details')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('order_number')}</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('order_date')}</p>
                  <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('total_items')}</p>
                  <p className="font-medium">{order.totalItems || order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('total_amount')}</p>
                  <p className="font-medium text-blue-600 flex items-center">
                    <CurrencyRupeeIcon className="w-4 h-4" />
                    {order.totalAmount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('payment_status')}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('payment_method')}</p>
                  <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
                </div>
                {order.weight && (
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-medium">{order.weight}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Schedule Information */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                {t('schedule_information')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.pickupDate && (
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-600">{t('pickup_date')}</p>
                    <p className="font-medium">{new Date(order.pickupDate).toLocaleDateString()}</p>
                    <p className="text-sm">{new Date(order.pickupDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                )}
                {order.deliveryDate && (
                  <div className="bg-white p-3 rounded border">
                    <p className="text-sm text-gray-600">{t('delivery_date')}</p>
                    <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                    <p className="text-sm">{new Date(order.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                )}
                {order.timeSlot && (
                  <div className="bg-white p-3 rounded border md:col-span-2">
                    <p className="text-sm text-gray-600">{t('preferred_time_slot')}</p>
                    <p className="font-medium">{order.timeSlot}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5" />
                {t('order_items')}
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">{t('item')}</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">{t('service')}</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">{t('qty')}</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">{t('price')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.service}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-right flex items-center justify-end">
                          <CurrencyRupeeIcon className="w-4 h-4" />
                          {item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-between items-center font-semibold text-lg">
                <span>{t('total_amount')}:</span>
                <span className="text-blue-600 flex items-center">
                  <CurrencyRupeeIcon className="w-5 h-5" />
                  {order.totalAmount}
                </span>
              </div>
            </div>

            {/* Special Instructions */}
            {(order.specialInstructions || order.recurring) && (
              <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <InformationCircleIcon className="w-5 h-5" />
                  {t('special_instructions')}
                </h3>
                <div className="space-y-2">
                  {order.specialInstructions && (
                    <p className="text-gray-700">{order.specialInstructions}</p>
                  )}
                  {order.recurring && (
                    <div className="flex items-center gap-2">
                      <ArrowPathIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Recurring order ({order.frequency})</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
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
              
              {order.status !== 'delivery-completed' && (
                <button
                  onClick={() => {
                    const nextStatus = getNextStatus(order.status);
                    if (nextStatus) {
                      updateOrderStatus(order._id, nextStatus, `Status updated to ${getStatusLabel(nextStatus)}`);
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Mark as {getNextStatusLabel(order.status)}
                </button>
              )}
            </div>          </div>
          
          {/* Chat Widget */}
          {showChatWidget && (
            <ChatWidget 
              orderId={order._id}
              customerName={order.customerInfo.name}
              onClose={() => setShowChatWidget(false)}
            />
          )}
        </div>
      </div>
    );
  };

  const LocationUpdateModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('update_location')}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('location_note')}
              </label>
              <textarea
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder={t('update_location_btn')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={submitLocationUpdate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {t('update_location_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EarningsModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('earnings_summary')}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">{t('today_s_earnings')}</span>
                  <span className="text-green-800 font-bold text-xl flex items-center">
                    <CurrencyRupeeIcon className="w-5 h-5" />
                    {stats.earningsToday}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">{t('this_week')}</span>
                  <span className="text-blue-800 font-bold text-xl flex items-center">
                    <CurrencyRupeeIcon className="w-5 h-5" />
                    {stats.weeklyEarnings}
                  </span>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-purple-800 font-medium">{t('this_month')}</span>
                  <span className="text-purple-800 font-bold text-xl flex items-center">
                    <CurrencyRupeeIcon className="w-5 h-5" />
                    {stats.monthlyEarnings}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  {t('view_detailed_report')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PerformanceModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('performance_summary')}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">{t('rating')}</span>
                </div>
                <span className="font-bold text-lg">{stats.rating}/5.0</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ClockSolidIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium">{t('on_time_delivery')}</span>
                </div>
                <span className="font-bold text-lg">{stats.onTimePercentage}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{t('total_deliveries')}</span>
                </div>
                <span className="font-bold text-lg">{stats.totalDeliveries}</span>
              </div>
              
              <div className="pt-4 border-t">
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  {t('view_detailed_analytics')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const HelpModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Help & Support</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 flex items-center gap-2">
                  <InformationCircleIcon className="w-5 h-5" />
                  {t('how_to_update_order_status')}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {t('how_to_update_order_status_desc')}
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 flex items-center gap-2">
                  <LightBulbIcon className="w-5 h-5" />
                  {t('tips_for_better_performance')}
                </h4>
                <ul className="text-sm text-gray-600 mt-1 list-disc pl-5 space-y-1">
                  <li>{t('tip1')}</li>
                  <li>{t('tip2')}</li>
                  <li>{t('tip3')}</li>
                </ul>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  {t('contact_support')}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {t('contact_support_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShiftModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('shift_management')}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t('current_status')}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  shiftStatus === 'online' ? 'bg-green-100 text-green-800' : 
                  shiftStatus === 'offline' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {shiftStatus.charAt(0).toUpperCase() + shiftStatus.slice(1)}
                </span>
              </div>
              
              <button
                onClick={toggleShiftStatus}
                className={`w-full py-3 rounded-lg font-medium ${
                  shiftStatus === 'online' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {shiftStatus === 'online' ? t('go_offline') : t('go_online')}
              </button>
              
              <div className="pt-4 border-t">
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  {t('schedule_shift')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileSettingsModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('profile_settings')}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            {profileLoading && (
              <div className="text-center py-4">
                <ArrowPathIcon className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                <p className="text-gray-600 mt-2">{t('loading_profile')}</p>
              </div>
            )}
            
            {profileError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
                {profileError}
              </div>
            )}
            
            {profileSuccess && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
                {profileSuccess}
              </div>
            )}
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('full_name')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enter_your_full_name')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email_address')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enter_your_email')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone_number')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t('enter_your_phone_number')}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('vehicle_type')}
                </label>
                <select
                  value={profileData.vehicleType}
                  onChange={(e) => setProfileData({...profileData, vehicleType: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{t('select_vehicle_type')}</option>
                  <option value="bike">{t('bike')}</option>
                  <option value="car">{t('car')}</option>
                  <option value="van">{t('van')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('license_plate')}
                </label>
                <input
                  type="text"
                  value={profileData.licensePlate}
                  onChange={(e) => setProfileData({...profileData, licensePlate: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('enter_your_vehicle_license_plate')}
                />
              </div>
              
              <div className="pt-4 border-t flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {profileLoading ? 'Saving...' : t('save_changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => {
    return (
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <TruckIcon className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-lg">Fabrico</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => {
              setActiveTab('pending');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
              activeTab === 'pending' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
            }`}
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            <span>{t('my_orders')}</span>
          </button>
          
          <button 
            onClick={() => {
              setShowEarningsModal(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100"
          >
            <WalletIcon className="w-5 h-5" />
            <span>{t('earnings')}</span>
          </button>
          
          <button 
            onClick={() => {
              setShowPerformanceModal(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100"
          >
            <PresentationChartLineIcon className="w-5 h-5" />
            <span>{t('performance')}</span>
          </button>
          
          <button 
            onClick={() => {
              setShowShiftModal(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100"
          >
            <ClockIcon className="w-5 h-5" />
            <span>{t('shift_management')}</span>
          </button>
          
          <button 
            onClick={() => {
              setShowHelpModal(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100"
          >
            <InformationCircleIcon className="w-5 h-5" />
            <span>{t('help_support')}</span>
          </button>
          
          <button 
            onClick={() => {
              loadProfile();
              setShowProfileSettings(true);
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100"
          >
            <CogIcon className="w-5 h-5" />
            <span>{t('profile_settings')}</span>
          </button>
          
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-gray-100 text-red-600"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>{t('logout')}</span>
          </button>
        </nav>
      </div>
    );
  };

  const SettingsModal = ({ onClose, theme, setTheme, language, setLanguage }) => {
    const { t, i18n } = useTranslation();
    const [notificationPreferences, setNotificationPreferences] = useState({
      email: true,
      sms: true,
      push: true
    });

    const handleNotificationPreferenceChange = (pref) => {
      setNotificationPreferences(prev => ({
        ...prev,
        [pref]: !prev[pref]
      }));
    };

    const handleThemeChange = (newTheme) => {
      console.log('Theme change requested:', newTheme);
      setTheme(newTheme);
      // Save to localStorage
      localStorage.setItem('deliveryDashboardTheme', newTheme);
      // In a real app, this would update the theme across the app
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      // Also apply to body for consistency
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(newTheme);
      console.log('Theme changed to:', newTheme);
    };

    const handleLanguageChange = (newLanguage) => {
      console.log('Language change requested:', newLanguage);
      setLanguage(newLanguage);
      // Save to localStorage
      localStorage.setItem('deliveryDashboardLanguage', newLanguage);
      // Update i18n language
      i18n.changeLanguage(newLanguage);
      console.log('Language changed to:', newLanguage);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{t('settings')}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Notification Preferences */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('notification_preferences')}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                      <span>{t('email_notifications')}</span>
                    </div>
                    <button
                      onClick={() => handleNotificationPreferenceChange('email')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notificationPreferences.email ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationPreferences.email ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-500" />
                      <span>{t('sms_notifications')}</span>
                    </div>
                    <button
                      onClick={() => handleNotificationPreferenceChange('sms')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notificationPreferences.sms ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationPreferences.sms ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BellIcon className="w-5 h-5 text-gray-500" />
                      <span>{t('push_notifications')}</span>
                    </div>
                    <button
                      onClick={() => handleNotificationPreferenceChange('push')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        notificationPreferences.push ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationPreferences.push ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Theme Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('display_theme')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-lg border-2 ${
                      theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full mb-2"></div>
                      <span>{t('light_mode')}</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-lg border-2 ${
                      theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-gray-700 rounded-full mb-2"></div>
                      <span>{t('dark_mode')}</span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Language Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">{t('language')}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`p-3 rounded-lg border-2 ${
                      language === 'en' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t('english')}
                  </button>
                  
                  <button
                    onClick={() => handleLanguageChange('ml')}
                    className={`p-3 rounded-lg border-2 ${
                      language === 'ml' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {t('malayalam')}
                  </button>
                </div>
              </div>
              
              {/* Logout Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 mr-2"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
                <TruckIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t('delivery_dashboard')}</h1>
                  <p className="text-sm text-gray-600">{t('welcome')}, {user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-gray-900"
                  >
                    <BellIcon className="w-6 h-6" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold">{t('notifications')}</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div 
                              key={notification.id}
                              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex justify-between">
                                <h4 className="font-medium">{notification.title}</h4>
                                {!notification.read && (
                                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            {t('no_notifications')}
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          {t('view_all')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            loadProfile();
                            setShowProfileSettings(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                        >
                          <CogIcon className="w-4 h-4" />
                          {t('profile_settings')}
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
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div 
            className="bg-white rounded-lg shadow mb-6"
          >
            <div 
              className="flex justify-between items-center p-4 border-b cursor-pointer"
              onClick={() => toggleSection('stats')}
            >
              <h2 className="text-lg font-semibold text-gray-900">{t('performance_overview')}</h2>
              {expandedSections.stats ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              )}
            </div>
            
            {expandedSections.stats && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">{t('total_deliveries')}</p>
                        <p className="text-2xl font-bold">{stats.totalDeliveries}</p>
                      </div>
                      <TruckIcon className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">{t('completed_today')}</p>
                        <p className="text-2xl font-bold">{stats.completedToday}</p>
                      </div>
                      <CheckCircleIcon className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">{t('earnings_today')}</p>
                        <p className="text-2xl font-bold flex items-center">
                          <CurrencyRupeeIcon className="w-6 h-6" />
                          {stats.earningsToday}
                        </p>
                      </div>
                      <WalletIcon className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">{t('rating')}</p>
                        <p className="text-2xl font-bold flex items-center">
                          <StarIcon className="w-6 h-6 mr-1" />
                          {stats.rating}
                        </p>
                      </div>
                      <ShieldCheckIcon className="w-8 h-8 opacity-80" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('on_time_delivery')}</p>
                        <p className="text-xl font-bold text-green-600">{stats.onTimePercentage}%</p>
                      </div>
                      <ClockSolidIcon className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('weekly_earnings')}</p>
                        <p className="text-xl font-bold text-blue-600 flex items-center">
                          <CurrencyRupeeIcon className="w-5 h-5" />
                          {stats.weeklyEarnings}
                        </p>
                      </div>
                      <ArrowTrendingUpIcon className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{t('monthly_earnings')}</p>
                        <p className="text-xl font-bold text-purple-600 flex items-center">
                          <CurrencyRupeeIcon className="w-5 h-5" />
                          {stats.monthlyEarnings}
                        </p>
                      </div>
                      <GiftIcon className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Location Tracking */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('live_location_tracking')}</h2>
              <LiveLocationTracking />
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('search_orders')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <FunnelIcon className="w-5 h-5" />
                    {t('filters')}
                  </button>
                  <button
                    onClick={() => {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowsUpDownIcon className="w-5 h-5" />
                    {t('sort')}
                  </button>
                </div>
              </div>
              
              {showFilters && (
                <div className="mt-4 pt-4 border-t">
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
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'pending'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('pending_orders')}
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'completed'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('completed')}
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'all'
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('all_orders')}
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                  <p className="text-gray-600">{t('loading_orders')}</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">{t('no_orders_found')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailModal(true);
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          {order.priority === 'high' && (
                            <span className="mt-1 px-1 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                              {t('high_priority')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">
                            {order.customerInfo.address.street}, {order.customerInfo.address.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4" />
                          <span>{order.customerInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        {(order.pickupDate || order.deliveryDate) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ClockIcon className="w-4 h-4" />
                            <span>
                              {order.pickupDate && `${t('pickup_date')}: ${new Date(order.pickupDate).toLocaleDateString()}`}
                              {order.deliveryDate && `${t('delivery_date')}: ${new Date(order.deliveryDate).toLocaleDateString()}`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm font-medium text-gray-900">
                          {order.items.length} {t('items')}
                        </span>
                        <span className="text-sm font-bold text-blue-600 flex items-center">
                          <CurrencyRupeeIcon className="w-4 h-4" />
                          {order.totalAmount}
                        </span>
                      </div>
                      
                      {/* Service types preview */}
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(order.items.map(item => item.service))).slice(0, 3).map((service, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {service}
                            </span>
                          ))}
                          {Array.from(new Set(order.items.map(item => item.service))).length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              +{Array.from(new Set(order.items.map(item => item.service))).length - 3} {t('items')}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Incident Reporting Button */}
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowIncidentModal(true);
                          }}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800"
                        >
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          <span>Report Issue</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showLocationModal && (
        <LocationUpdateModal
          onClose={() => {
            setShowLocationModal(false);
            setLocationNote('');
          }}
        />
      )}

      {showEarningsModal && (
        <EarningsModal
          onClose={() => {
            setShowEarningsModal(false);
          }}
        />
      )}

      {showPerformanceModal && (
        <PerformanceModal
          onClose={() => {
            setShowPerformanceModal(false);
          }}
        />
      )}

      {showHelpModal && (
        <HelpModal
          onClose={() => {
            setShowHelpModal(false);
          }}
        />
      )}

      {showShiftModal && (
        <ShiftModal
          onClose={() => {
            setShowShiftModal(false);
          }}
        />
      )}

      {showProfileSettings && (
        <ProfileSettingsModal
          onClose={() => {
            setShowProfileSettings(false);
          }}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          onClose={() => {
            setShowSettingsModal(false);
          }}
          theme={theme}
          setTheme={setTheme}
          language={language}
          setLanguage={setLanguage}
        />
      )}
      
      {showIncidentModal && selectedOrder && (
        <IncidentReportModal
          order={selectedOrder}
          onClose={() => {
            setShowIncidentModal(false);
            setSelectedOrder(null);
          }}
          onSubmit={(incident) => {
            console.log('Incident reported:', incident);
            setShowIncidentModal(false);
            setSelectedOrder(null);
            // Optionally refresh orders or show a success message
          }}
        />
      )}
    </div>
  );
};

export default DeliveryBoyDashboard;