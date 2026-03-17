import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import IncidentReportModal from '../components/IncidentReportModal';
import LiveLocationTracking from '../components/LiveLocationTracking';
import NotificationsPanel from '../components/delivery-dashboard/NotificationsPanel';
import ProfileManagement from '../components/delivery-dashboard/ProfileManagement';
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
  KeyIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
  CalendarDaysIcon,
  TrashIcon,
  PhotoIcon,
  CheckIcon
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
    // Primary Dashboard Cards
    todayPickups: 0,
    todayDeliveries: 0,
    pendingTasks: 0,
    completedTasksToday: 0,
    // Legacy stats
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedToday: 0,
    pendingPickups: 0,
    pendingDeliveries: 0,
    // Earnings
    earningsToday: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    // Performance
    rating: 5.0,
    onTimePercentage: 100,
    // Status
    isAvailable: false
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
  const [trackingStates, setTrackingStates] = useState({}); // orderId -> boolean
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showProofUploadModal, setShowProofUploadModal] = useState(false);
  const [proofType, setProofType] = useState('pickup'); // 'pickup' or 'delivery'
  const [proofImage, setProofImage] = useState(null);
  const [proofUploading, setProofUploading] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [statusPhotoUrl, setStatusPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
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

  const handleTrackingToggle = (orderId, isActive) => {
    setTrackingStates(prev => ({
      ...prev,
      [orderId]: isActive
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
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats({
        // Primary Dashboard Cards
        todayPickups: response.data.todayPickups || 0,
        todayDeliveries: response.data.todayDeliveries || 0,
        pendingTasks: response.data.pendingTasks || 0,
        completedTasksToday: response.data.completedTasksToday || 0,
        // Legacy stats
        totalDeliveries: response.data.totalDeliveries || 0,
        activeDeliveries: response.data.activeDeliveries || 0,
        completedToday: response.data.completedToday || 0,
        pendingPickups: response.data.pendingPickups || 0,
        pendingDeliveries: response.data.pendingDeliveries || 0,
        // Earnings
        earningsToday: response.data.earningsToday || 0,
        weeklyEarnings: response.data.weeklyEarnings || 0,
        monthlyEarnings: response.data.monthlyEarnings || 0,
        // Performance
        rating: response.data.rating || 5.0,
        onTimePercentage: response.data.onTimePercentage || 100,
        // Status
        isAvailable: response.data.isAvailable || false
      });
      
      // Update shift status based on availability
      setShiftStatus(response.data.isAvailable ? 'online' : 'offline');
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values on error
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const notificationList = response.data.notifications || [];
      setNotifications(notificationList.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type || 'info',
        timestamp: new Date(n.createdAt),
        read: n.read
      })));
      setUnreadNotifications(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadNotifications(0);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/delivery-boy/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(prev => prev.map(n => 
        n.id === id ? {...n, read: true} : n
      ));
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
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
      const payload = { status: newStatus, note: note || statusNote, photoUrl: statusPhotoUrl };
      
      // Include location if provided
      if (locationData) {
        payload.location = locationData;
      }
      
      await axios.patch(
        `${API_URL}/orders/${orderId}/delivery-status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear status fields
      setStatusNote('');
      setStatusPhotoUrl('');
      
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setIsUploading(true);
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        setStatusPhotoUrl(response.data.url);
        // Add success notification
        setNotifications(prev => [{
          id: Date.now(),
          title: "Photo Uploaded",
          message: "Pickup/Delivery proof has been uploaded successfully.",
          type: "success",
          timestamp: new Date(),
          read: false
        }, ...prev]);
        setUnreadNotifications(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
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

  // Generate OTP for delivery completion
  const generateOtp = async () => {
    if (!selectedOrder) return;
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/delivery-boy/orders/${selectedOrder._id}/generate-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShowOtpModal(true);
      // In development, we might get the OTP back for testing
      if (response.data.otp) {
        console.log('Development OTP:', response.data.otp);
      }
      
      // Add notification
      setNotifications(prev => [{
        id: Date.now(),
        title: "OTP Sent",
        message: `OTP has been sent to the customer for order ${selectedOrder.orderNumber}`,
        type: "info",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
    } catch (error) {
      console.error('Error generating OTP:', error);
      setOtpError(error.response?.data?.message || 'Failed to generate OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP and complete delivery
  const verifyOtp = async () => {
    if (!selectedOrder || !otpValue) return;
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/delivery-boy/orders/${selectedOrder._id}/verify-otp`,
        { 
          otp: otpValue,
          deliveryNote: statusNote,
          deliveryPhoto: statusPhotoUrl
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Success - refresh orders and stats
      fetchOrders();
      fetchStats();
      setShowOtpModal(false);
      setShowDetailModal(false);
      setOtpValue('');
      setSelectedOrder(null);
      
      // Add success notification
      setNotifications(prev => [{
        id: Date.now(),
        title: "Delivery Completed",
        message: `Order ${selectedOrder.orderNumber} has been delivered successfully`,
        type: "success",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Upload proof image
  const uploadProofImage = async () => {
    if (!selectedOrder || !proofImage) return;
    
    setProofUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // For this implementation, we'll convert the image to base64
      // In production, you'd want to use a proper file upload service
      const reader = new FileReader();
      reader.readAsDataURL(proofImage);
      reader.onload = async () => {
        try {
          const imageUrl = reader.result; // base64 encoded image
          
          await axios.post(
            `${API_URL}/delivery-boy/orders/${selectedOrder._id}/proof`,
            {
              type: proofType,
              imageUrl,
              latitude: location.latitude,
              longitude: location.longitude
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setShowProofUploadModal(false);
          setProofImage(null);
          
          // Add success notification
          setNotifications(prev => [{
            id: Date.now(),
            title: "Proof Uploaded",
            message: `${proofType === 'pickup' ? 'Pickup' : 'Delivery'} proof has been uploaded for order ${selectedOrder.orderNumber}`,
            type: "success",
            timestamp: new Date(),
            read: false
          }, ...prev]);
          setUnreadNotifications(prev => prev + 1);
        } catch (error) {
          console.error('Error uploading proof:', error);
          setNotifications(prev => [{
            id: Date.now(),
            title: "Upload Failed",
            message: "Failed to upload proof image. Please try again.",
            type: "error",
            timestamp: new Date(),
            read: false
          }, ...prev]);
          setUnreadNotifications(prev => prev + 1);
        } finally {
          setProofUploading(false);
        }
      };
    } catch (error) {
      console.error('Error reading file:', error);
      setProofUploading(false);
    }
  };

  // Update location to backend
  const updateLocationToBackend = async (orderId = null) => {
    if (!location.latitude || !location.longitude) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/delivery-boy/location`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
          orderId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const toggleShiftStatus = async () => {
    const newStatus = shiftStatus === 'online' ? 'offline' : 'online';
    const isAvailable = newStatus === 'online';
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/delivery-boy/profile/availability`, 
        { isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setShiftStatus(newStatus);
      setStats(prev => ({ ...prev, isAvailable }));
      
      // Add notification
      setNotifications(prev => [{
        id: Date.now(),
        title: t('shift_status_updated', 'Status Updated'),
        message: `${t('you_are_now')} ${newStatus}`,
        type: "info",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
    } catch (error) {
      console.error('Error updating shift status:', error);
      // Show error notification
      setNotifications(prev => [{
        id: Date.now(),
        title: "Error",
        message: "Failed to update availability. Please try again.",
        type: "error",
        timestamp: new Date(),
        read: false
      }, ...prev]);
      setUnreadNotifications(prev => prev + 1);
    }
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">{t('order_details', 'Order Details')}</p>
                  <h2 className="text-2xl font-bold">{order.orderNumber}</h2>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      order.status === 'delivery-completed' 
                        ? 'bg-green-400/20 text-green-100 border-green-400/30' 
                        : 'bg-white/20 text-white border-white/30'
                    }`}>
                      {getStatusLabel(order.status)}
                    </span>
                    {order.priority === 'high' && (
                      <span className="px-3 py-1 bg-red-500/80 text-white rounded-full text-sm font-medium animate-pulse">
                        ⚡ {t('high_priority', 'High Priority')}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Modal Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Customer Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 mb-5 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                </div>
                {t('customer_information', 'Customer Information')}
              </h3>
              <div className="space-y-3">
                <p className="text-gray-900 font-semibold text-lg">{order.customerInfo.name}</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => handleCallCustomer(order.customerInfo.phone)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium text-sm"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {t('call_customer', 'Call Customer')}
                  </button>
                  <button 
                    onClick={() => handleSendMessage(order.customerInfo.phone)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {t('message_customer', 'Message')}
                  </button>
                </div>
                <button 
                  onClick={() => handleOpenMaps(order.customerInfo.address)}
                  className="w-full text-left text-gray-600 hover:text-blue-600 flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <MapPinIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm">{order.customerInfo.address.street}, {order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.zipCode}</span>
                </button>
                {order.customerInfo.address.instructions && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong className="text-amber-900">{t('special_instructions', 'Special Instructions')}:</strong> {order.customerInfo.address.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 mb-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                  <ClipboardDocumentListIcon className="w-4 h-4 text-gray-600" />
                </div>
                {t('booking_details', 'Booking Details')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('order_number', 'Order Number')}</p>
                  <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('order_date', 'Order Date')}</p>
                  <p className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('total_items', 'Total Items')}</p>
                  <p className="font-semibold text-gray-900">{order.totalItems || order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('total_amount', 'Total Amount')}</p>
                  <p className="font-semibold text-blue-600 flex items-center">
                    <CurrencyRupeeIcon className="w-4 h-4" />
                    {order.totalAmount}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('payment_status', 'Payment Status')}</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('payment_method', 'Payment Method')}</p>
                  <p className="font-semibold text-gray-900">{order.paymentMethod || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Order Schedule Information */}
            {(order.pickupDate || order.deliveryDate || order.timeSlot) && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mb-5 border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ClockIcon className="w-4 h-4 text-purple-600" />
                  </div>
                  {t('schedule_information', 'Schedule Information')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.pickupDate && (
                    <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                      <p className="text-xs text-purple-600 uppercase tracking-wide font-medium mb-1">{t('pickup_date', 'Pickup Date')}</p>
                      <p className="font-semibold text-gray-900">{new Date(order.pickupDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{new Date(order.pickupDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  )}
                  {order.deliveryDate && (
                    <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                      <p className="text-xs text-purple-600 uppercase tracking-wide font-medium mb-1">{t('delivery_date', 'Delivery Date')}</p>
                      <p className="font-semibold text-gray-900">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{new Date(order.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  )}
                  {order.timeSlot && (
                    <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm md:col-span-2">
                      <p className="text-xs text-purple-600 uppercase tracking-wide font-medium mb-1">{t('preferred_time_slot', 'Preferred Time Slot')}</p>
                      <p className="font-semibold text-gray-900">{order.timeSlot}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <DocumentTextIcon className="w-4 h-4 text-indigo-600" />
                </div>
                {t('order_items', 'Order Items')}
              </h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('item', 'Item')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('service', 'Service')}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('qty', 'Qty')}</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">{t('price', 'Price')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.service}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium flex items-center justify-end">
                          <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
                          {item.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex justify-between items-center">
                <span className="font-semibold text-gray-700">{t('total_amount', 'Total Amount')}:</span>
                <span className="text-2xl font-bold text-blue-600 flex items-center">
                  <CurrencyRupeeIcon className="w-6 h-6" />
                  {order.totalAmount}
                </span>
              </div>
            </div>

            {/* Special Instructions */}
            {(order.specialInstructions || order.recurring) && (
              <div className="bg-amber-50 rounded-xl p-5 mb-5 border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <InformationCircleIcon className="w-5 h-5" />
                  {t('special_instructions', 'Special Instructions')}
                </h3>
                <div className="space-y-2">
                  {order.specialInstructions && (
                    <p className="text-amber-800">{order.specialInstructions}</p>
                  )}
                  {order.recurring && (
                    <div className="flex items-center gap-2 text-amber-700">
                      <ArrowPathIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Recurring order ({order.frequency})</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pickup/Delivery Proof (History) */}
            {(order.pickupNote || order.pickupPhoto || order.deliveryNote || order.deliveryPhoto) && (
              <div className="bg-white rounded-xl p-5 mb-5 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckBadgeIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                  {t('service_proof', 'Service Proof')}
                </h3>
                <div className="space-y-4">
                  {(order.pickupNote || order.pickupPhoto) && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">{t('pickup_confirmation', 'Pickup Confirmation')}</p>
                      {order.pickupPhoto && (
                        <div className="mb-2">
                          <img src={`${API_URL.replace('/api', '')}${order.pickupPhoto}`} alt="Pickup Proof" className="rounded-lg max-h-48 object-cover border border-gray-200" />
                        </div>
                      )}
                      {order.pickupNote && <p className="text-sm text-gray-700 italic">"{order.pickupNote}"</p>}
                    </div>
                  )}
                  {(order.deliveryNote || order.deliveryPhoto) && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">{t('delivery_confirmation', 'Delivery Confirmation')}</p>
                      {order.deliveryPhoto && (
                        <div className="mb-2">
                          <img src={`${API_URL.replace('/api', '')}${order.deliveryPhoto}`} alt="Delivery Proof" className="rounded-lg max-h-48 object-cover border border-gray-200" />
                        </div>
                      )}
                      {order.deliveryNote && <p className="text-sm text-gray-700 italic">"{order.deliveryNote}"</p>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <button
                onClick={() => setShowChatWidget(true)}
                className="flex flex-col items-center gap-2 p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-200 group-hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-700">{t('chat', 'Chat')}</span>
              </button>
              
              <button
                onClick={handleMessageAdmin}
                className="flex flex-col items-center gap-2 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-indigo-100 group-hover:bg-indigo-200 rounded-lg flex items-center justify-center transition-colors">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-xs font-medium text-indigo-700">{t('admin', 'Admin')}</span>
              </button>
              
              <button
                onClick={handleLocationUpdate}
                className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-lg flex items-center justify-center transition-colors">
                  <MapIcon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-700">{t('location', 'Location')}</span>
              </button>
              
              <button
                onClick={() => setShowIncidentModal(true)}
                className="flex flex-col items-center gap-2 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-xs font-medium text-red-700">{t('report', 'Report')}</span>
              </button>
            </div>
            
            {order.status !== 'delivery-completed' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {(getNextStatus(order.status) === 'pickup-completed' || getNextStatus(order.status) === 'delivery-completed') && (
                  <div className="space-y-3">
                    <div className="relative">
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">
                        {getNextStatus(order.status) === 'pickup-completed' ? t('pickup_note', 'Pickup Note') : t('delivery_note', 'Delivery Note')}
                      </label>
                      <textarea
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder={t('add_a_note', 'Add any customer instructions or issues...')}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        rows="3"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        {t('photo_confirmation', 'Photo Confirmation')}
                      </label>
                      {statusPhotoUrl ? (
                        <div className="relative inline-block group">
                          <img 
                            src={`${API_URL.replace('/api', '')}${statusPhotoUrl}`} 
                            alt="Status Proof" 
                            className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                          />
                          <button 
                            onClick={() => setStatusPhotoUrl('')}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleUploadPhoto}
                          disabled={isUploading}
                          className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-500 group"
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-all mb-2">
                            {isUploading ? (
                              <ArrowPathIcon className="w-6 h-6 text-blue-500 animate-spin" />
                            ) : (
                              <CameraIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {isUploading ? t('uploading', 'Uploading...') : t('tap_to_upload_photo', 'Tap to upload pickup/delivery photo')}
                          </span>
                        </button>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*" 
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    const nextStatus = getNextStatus(order.status);
                    if (nextStatus) {
                      updateOrderStatus(order._id, nextStatus);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {t('mark_as', 'Mark as')} {getNextStatusLabel(order.status)}
                </button>
              </div>
            )}
          </div>
          
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
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-5 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                {t('update_location', 'Update Location')}
              </h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
          
          <div className="p-5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('location_note', 'Location Note')}
              </label>
              <textarea
                value={locationNote}
                onChange={(e) => setLocationNote(e.target.value)}
                placeholder={t('add_location_note', 'Add a note about your current location...')}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                rows="3"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={submitLocationUpdate}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                {t('update_location_btn', 'Update Location')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EarningsModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
          <div className="bg-emerald-600 px-5 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <WalletIcon className="w-5 h-5" />
                {t('earnings_summary', 'Earnings Summary')}
              </h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
          
          <div className="p-5 space-y-3">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-emerald-700 text-sm mb-1">{t('today_s_earnings', "Today's Earnings")}</p>
              <p className="text-2xl font-bold text-emerald-800 flex items-center">
                <CurrencyRupeeIcon className="w-6 h-6" />
                {stats.earningsToday}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">{t('this_week', 'This Week')}</p>
                <p className="text-xl font-bold text-gray-900 flex items-center">
                  <CurrencyRupeeIcon className="w-5 h-5" />
                  {stats.weeklyEarnings}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm mb-1">{t('this_month', 'This Month')}</p>
                <p className="text-xl font-bold text-gray-900 flex items-center">
                  <CurrencyRupeeIcon className="w-5 h-5" />
                  {stats.monthlyEarnings}
                </p>
              </div>
            </div>
            
            <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
              {t('view_detailed_report', 'View Detailed Report')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PerformanceModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
          <div className="bg-amber-500 px-5 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                {t('performance_summary', 'Performance Summary')}
              </h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
          
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <StarIcon className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('rating', 'Rating')}</p>
                  <p className="font-bold text-gray-900">{stats.rating}/5.0</p>
                </div>
              </div>
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <StarIcon key={star} className={`w-4 h-4 ${star <= Math.floor(stats.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div className="flex items-center gap-3">
                <ClockSolidIcon className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('on_time_delivery', 'On-Time Delivery')}</p>
                  <p className="font-bold text-gray-900">{stats.onTimePercentage}%</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TruckIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">{t('total_deliveries', 'Total Deliveries')}</p>
                  <p className="font-bold text-gray-900">{stats.totalDeliveries}</p>
                </div>
              </div>
            </div>
            
            <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
              {t('view_detailed_analytics', 'View Detailed Analytics')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const HelpModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-xl">
          <div className="bg-blue-600 px-5 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <QuestionMarkCircleIcon className="w-5 h-5" />
                Help & Support
              </h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
          
          <div className="p-5 space-y-3 overflow-y-auto max-h-[60vh]">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                {t('how_to_update_order_status', 'How to Update Order Status')}
              </h4>
              <p className="text-sm text-gray-600">
                {t('how_to_update_order_status_desc', 'Click on any order card to view details. Then use the status buttons to update the order progress.')}
              </p>
            </div>
            
            <div className="p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                <LightBulbIcon className="w-5 h-5 text-emerald-600" />
                {t('tips_for_better_performance', 'Tips for Better Performance')}
              </h4>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  {t('tip1', 'Keep your location services on for accurate tracking')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  {t('tip2', 'Communicate proactively with customers')}
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  {t('tip3', 'Complete deliveries within estimated time')}
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-600" />
                {t('contact_support', 'Contact Support')}
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {t('contact_support_desc', 'Need help? Our support team is available 24/7.')}
              </p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors">
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShiftModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-5 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                {t('shift_management', 'Shift Management')}
              </h3>
              <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors">
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{t('current_status', 'Current Status')}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                shiftStatus === 'online' ? 'bg-emerald-100 text-emerald-700' : 
                shiftStatus === 'offline' ? 'bg-gray-200 text-gray-700' : 
                'bg-amber-100 text-amber-700'
              }`}>
                {shiftStatus === 'online' ? 'Online' : shiftStatus === 'offline' ? 'Offline' : 'On Break'}
              </span>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Quick Actions</span>
              </div>
            </div>
            
            <button
              onClick={toggleShiftStatus}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                shiftStatus === 'online' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {shiftStatus === 'online' ? t('go_offline', 'Go Offline') : t('go_online', 'Go Online')}
            </button>
            
            <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <CalendarDaysIcon className="w-4 h-4" />
              {t('schedule_shift', 'Schedule Shift')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Sidebar = () => {
    return (
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Brand Section */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-semibold text-gray-900">Fabrico</span>
              <span className="block text-xs text-gray-500">{t('delivery_partner', 'Delivery Partner')}</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        
        {/* User Profile Summary */}
        <div className="p-3 mx-3 mt-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{user?.name || t('delivery_boy', 'Delivery Boy')}</p>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${shiftStatus === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                <span className="text-xs text-gray-500">{shiftStatus === 'online' ? t('online', 'Online') : t('offline', 'Offline')}</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={toggleShiftStatus}
                className={`
                  relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none 
                  ${shiftStatus === 'online' ? 'bg-emerald-500' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${shiftStatus === 'online' ? 'translate-x-4' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">{t('main_menu', 'Main Menu')}</p>
          
          
          <Link 
            to="/delivery-dashboard/my-orders"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
          >
            <ClipboardDocumentListIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('my_orders', 'My Orders')}</span>
            {stats.pendingTasks > 0 && (
              <span className="ml-auto px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                {stats.pendingTasks}
              </span>
            )}
          </Link>
          
          <Link 
            to="/delivery-dashboard/history"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors"
          >
            <ClockIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('delivery_history', 'Delivery History')}</span>
          </Link>
          
          <Link 
            to="/delivery-dashboard/earnings"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
          >
            <WalletIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('earnings', 'Earnings')}</span>
          </Link>
          
          <Link 
            to="/delivery-dashboard/performance"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-purple-600 transition-colors"
          >
            <PresentationChartLineIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('performance', 'Performance')}</span>
          </Link>
          
          <p className="px-3 py-2 mt-4 text-xs font-medium text-gray-400 uppercase tracking-wider">{t('settings', 'Settings')}</p>
          
          <Link 
            to="/delivery-dashboard/shift-management"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-amber-600 transition-colors"
          >
            <ClockIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('shift_management', 'Shift Management')}</span>
          </Link>
          
          <Link 
            to="/delivery-dashboard/help-support"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-cyan-600 transition-colors"
          >
            <InformationCircleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('help_support', 'Help & Support')}</span>
          </Link>
          
          <Link 
            to="/delivery-dashboard/profile-settings"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <CogIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('profile_settings', 'Profile & Settings')}</span>
          </Link>
        </nav>
        
        {/* Logout Button */}
        <div className="p-3 border-t border-gray-100">
          <button 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{t('logout', 'Logout')}</span>
          </button>
        </div>
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
          className="fixed inset-0 bg-black/30 z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0 flex flex-col min-h-screen">
        {/* Header - Simplified */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                    <TruckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      {t('dashboard_title', 'Dashboard')}
                    </h1>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Shift Status Toggle */}
                <button
                  onClick={toggleShiftStatus}
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    shiftStatus === 'online'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${shiftStatus === 'online' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                  {shiftStatus === 'online' ? t('online', 'Online') : t('offline', 'Offline')}
                </button>
                
                {/* Notification Bell */}
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Notifications"
                >
                  <BellIcon className="w-5 h-5 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            loadProfile();
                            setShowProfileSettings(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          {t('profile_settings', 'Profile Settings')}
                        </button>
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowSettingsModal(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <CogIcon className="w-4 h-4 text-gray-400" />
                          {t('settings', 'Settings')}
                        </button>
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowHelpModal(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                          {t('help_support', 'Help & Support')}
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          {t('logout', 'Logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area - Render Nested Routes */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet context={{ 
              // Stats and sections for DashboardHome
              stats, 
              expandedSections, 
              toggleSection,
              
              // Orders data for MyOrders
              orders,
              loading,
              filteredOrders,
              searchTerm,
              setSearchTerm,
              showFilters,
              setShowFilters,
              filters,
              setFilters,
              activeTab,
              setActiveTab,
              setSelectedOrder,
              setShowDetailModal,
              
              // Shift status for ShiftManagement
              shiftStatus,
              setShiftStatus,
              
              // Profile data for ProfileSettings
              profileData,
              setProfileData,
              handleProfileSubmit
            }} />
          </div>
        </main>
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
        <ProfileManagement
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
      
      {/* OTP Verification Modal */}
      {showOtpModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <KeyIcon className="w-5 h-5" />
                  Verify Delivery OTP
                </h3>
                <button 
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpValue('');
                    setOtpError('');
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-gray-600">
                  Enter the 6-digit OTP shared by the customer to complete delivery
                </p>
                <p className="text-sm text-gray-500 mt-1">Order: <span className="font-semibold text-gray-700">{selectedOrder.orderNumber}</span></p>
              </div>
              
              {otpError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                  {otpError}
                </div>
              )}
              
              <div className="mb-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    {t('enter_otp', 'Enter 6-digit OTP')}
                  </label>
                  <input
                  type="text"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="● ● ● ● ● ●"
                  className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all"
                  maxLength={6}
                />
              </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    {t('delivery_note', 'Delivery Note')}
                  </label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder={t('add_a_note', 'Add any customer instructions or issues...')}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    {t('photo_confirmation', 'Photo Confirmation')}
                  </label>
                  {statusPhotoUrl ? (
                    <div className="relative inline-block group">
                      <img 
                        src={`${API_URL.replace('/api', '')}${statusPhotoUrl}`} 
                        alt="Delivery Proof" 
                        className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                      />
                      <button 
                        onClick={() => setStatusPhotoUrl('')}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleUploadPhoto}
                      disabled={isUploading}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-emerald-500 hover:bg-emerald-50 transition-all text-gray-500 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-emerald-100 transition-all mb-1">
                        {isUploading ? (
                          <ArrowPathIcon className="w-4 h-4 text-emerald-500 animate-spin" />
                        ) : (
                          <CameraIcon className="w-4 h-4 text-gray-400 group-hover:text-emerald-500" />
                        )}
                      </div>
                      <span className="text-xs font-medium">
                        {isUploading ? t('uploading') : t('tap_to_upload_photo')}
                      </span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpValue('');
                    setOtpError('');
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyOtp}
                  disabled={otpLoading || otpValue.length !== 6}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/30"
                >
                  {otpLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : 'Verify & Complete'}
                </button>
              </div>
              
              <div className="mt-5 text-center">
                <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
                <button
                  onClick={generateOtp}
                  disabled={otpLoading}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Proof Upload Modal */}
      {showProofUploadModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden">
            <div className={`p-5 text-white ${proofType === 'pickup' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CameraIcon className="w-5 h-5" />
                  Upload {proofType === 'pickup' ? 'Pickup' : 'Delivery'} Proof
                </h3>
                <button 
                  onClick={() => {
                    setShowProofUploadModal(false);
                    setProofImage(null);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <span className="text-lg">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-center">
                Take a photo of the {proofType === 'pickup' ? 'collected items' : 'delivered items'}
                <br />
                <span className="text-sm text-gray-500">Order: <span className="font-semibold text-gray-700">{selectedOrder.orderNumber}</span></span>
              </p>
              
              <div className="mb-5">
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${proofImage ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'}`}>
                  {proofImage ? (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <img
                          src={URL.createObjectURL(proofImage)}
                          alt="Proof preview"
                          className="max-h-48 mx-auto rounded-xl shadow-lg"
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckIcon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <button
                        onClick={() => setProofImage(null)}
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <CameraIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-3">Tap to capture or select a photo</p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setProofImage(e.target.files[0])}
                        className="hidden"
                        id="proof-upload"
                      />
                      <label
                        htmlFor="proof-upload"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 cursor-pointer transition-all shadow-lg shadow-blue-500/30"
                      >
                        <PhotoIcon className="w-5 h-5" />
                        Select Photo
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowProofUploadModal(false);
                    setProofImage(null);
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={uploadProofImage}
                  disabled={proofUploading || !proofImage}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg ${proofType === 'pickup' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-500/30' : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/30'}`}
                >
                  {proofUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading...
                    </span>
                  ) : 'Upload Proof'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedOrder && (
        <LiveLocationTracking
          order={selectedOrder}
          isActive={trackingStates[selectedOrder._id] || false}
          onToggle={(isActive) => handleTrackingToggle(selectedOrder._id, isActive)}
        />
      )}
      
      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
};

export default DeliveryBoyDashboard;