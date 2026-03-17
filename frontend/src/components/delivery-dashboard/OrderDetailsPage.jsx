import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  ArrowLeftIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  SparklesIcon,
  ScaleIcon,
  UserIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  MapIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  KeyIcon,
  PaperAirplaneIcon,
  CameraIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // OTP State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null);
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const otpInputRefs = useRef([]);

  // Fetch order details
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setError('No order ID provided');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError(response.data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [API_URL, orderId]);

  // Fetch OTP status
  const fetchOTPStatus = useCallback(async () => {
    if (!orderId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/order/${orderId}/otp-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOtpStatus(response.data.otp);
      }
    } catch (err) {
      console.error('Error fetching OTP status:', err);
    }
  }, [API_URL, orderId]);

  // Generate OTP
  const handleGenerateOTP = async () => {
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/delivery-boy/order/${orderId}/generate-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOtpSuccess(response.data.message);
        await fetchOTPStatus();
      } else {
        setOtpError(response.data.message);
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to generate OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/delivery-boy/order/${orderId}/resend-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOtpSuccess('New OTP sent to customer');
        setOtpValue(['', '', '', '', '', '']);
        await fetchOTPStatus();
      } else {
        setOtpError(response.data.message);
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otp = otpValue.join('');
    if (otp.length !== 6) {
      setOtpError('Please enter complete 6-digit OTP');
      return;
    }
    
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/delivery-boy/order/${orderId}/verify-otp`,
        { 
          otp,
          deliveryNote,
          deliveryPhoto: photoPreview // Sending base64 photo
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOtpSuccess(response.data.message);
        setShowOTPModal(false);
        // Refresh order details to show updated status
        await fetchOrderDetails();
      } else {
        setOtpError(response.data.message);
        if (response.data.attemptsExhausted) {
          await fetchOTPStatus();
        }
      }
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to verify OTP');
      if (err.response?.data?.attemptsExhausted) {
        await fetchOTPStatus();
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);
    setOtpError(null);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP key down (for backspace)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otpValue];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpValue(newOtp);
      // Focus last filled input or last input
      const focusIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  // Open OTP Modal
  const openOTPModal = async () => {
    setShowOTPModal(true);
    setOtpValue(['', '', '', '', '', '']);
    setDeliveryNote('');
    setDeliveryPhoto(null);
    setPhotoPreview(null);
    setOtpError(null);
    setOtpSuccess(null);
    await fetchOTPStatus();
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      'order-placed': 'bg-gray-100 text-gray-800 border-gray-200',
      'order-accepted': 'bg-blue-100 text-blue-800 border-blue-200',
      'out-for-pickup': 'bg-amber-100 text-amber-800 border-amber-200',
      'pickup-completed': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'wash-in-progress': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'wash-completed': 'bg-teal-100 text-teal-800 border-teal-200',
      'drying': 'bg-orange-100 text-orange-800 border-orange-200',
      'quality-check': 'bg-pink-100 text-pink-800 border-pink-200',
      'out-for-delivery': 'bg-purple-100 text-purple-800 border-purple-200',
      'delivery-completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPhaseColor = (phase) => {
    const colors = {
      'pickup': 'from-amber-500 to-orange-500',
      'processing': 'from-blue-500 to-indigo-500',
      'delivery': 'from-green-500 to-emerald-500'
    };
    return colors[phase] || 'from-gray-500 to-gray-600';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'high': { bg: 'bg-red-100', text: 'text-red-800', icon: '⚡' },
      'normal': { bg: 'bg-gray-100', text: 'text-gray-600', icon: '📋' },
      'low': { bg: 'bg-green-100', text: 'text-green-800', icon: '🕐' }
    };
    return badges[priority] || badges['normal'];
  };

  const getServiceIcon = (serviceType) => {
    const type = serviceType?.toLowerCase() || '';
    if (type.includes('wash') || type.includes('laundry')) return '🧺';
    if (type.includes('iron') || type.includes('press')) return '👔';
    if (type.includes('dry') && type.includes('clean')) return '✨';
    if (type.includes('shoe')) return '👟';
    return '🧹';
  };

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleOpenMaps = (mapsLink) => {
    if (mapsLink) {
      window.open(mapsLink, '_blank');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading_order_details', 'Loading order details...')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ExclamationCircleIcon className="w-16 h-16 text-red-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{t('error', 'Error')}</h3>
            <p className="mt-1 text-gray-500">{error}</p>
            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {t('go_back', 'Go Back')}
              </button>
              <button
                onClick={fetchOrderDetails}
                className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                {t('try_again', 'Try Again')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No order found
  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{t('order_not_found', 'Order Not Found')}</h3>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              {t('go_back', 'Go Back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const priorityBadge = getPriorityBadge(order.priority);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>{t('back_to_orders', 'Back to Orders')}</span>
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {t('order', 'Order')} #{order.orderNumber}
              <button
                onClick={fetchOrderDetails}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                title={t('refresh', 'Refresh')}
              >
                <ArrowPathIcon className="w-5 h-5 text-gray-400" />
              </button>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {t('placed_on', 'Placed on')} {formatDateTime(order.orderDate)}
            </p>
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {order.status === 'delivery-completed' ? (
                <CheckCircleIcon className="w-4 h-4" />
              ) : order.status === 'cancelled' ? (
                <ExclamationCircleIcon className="w-4 h-4" />
              ) : (
                <ClockIcon className="w-4 h-4" />
              )}
              {order.statusLabel}
            </span>
            {order.priority === 'high' && (
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${priorityBadge.bg} ${priorityBadge.text}`}>
                {priorityBadge.icon} {order.priorityLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Phase Banner */}
      <div className={`bg-gradient-to-r ${getPhaseColor(order.currentPhase)} rounded-xl p-4 mb-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {order.currentPhase === 'pickup' ? (
              <div className="bg-white/20 rounded-full p-2">
                <TruckIcon className="w-6 h-6" />
              </div>
            ) : order.currentPhase === 'delivery' ? (
              <div className="bg-white/20 rounded-full p-2">
                <CheckBadgeIcon className="w-6 h-6" />
              </div>
            ) : (
              <div className="bg-white/20 rounded-full p-2">
                <SparklesIcon className="w-6 h-6" />
              </div>
            )}
            <div>
              <p className="text-sm opacity-90">{t('current_phase', 'Current Phase')}</p>
              <p className="text-lg font-bold">{order.phaseLabel}</p>
            </div>
          </div>
          {order.timeSlot && order.timeSlot !== 'Not specified' && (
            <div className="text-right">
              <p className="text-sm opacity-90">{t('time_slot', 'Time Slot')}</p>
              <p className="font-semibold">{order.timeSlot}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-500" />
              {t('customer_details', 'Customer Details')}
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Customer Name */}
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('name', 'Name')}</p>
                <p className="font-semibold text-gray-900 text-lg">{order.customer.name}</p>
              </div>
            </div>
            
            {/* Phone Number - Clickable */}
            <div className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                <PhoneIcon className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">{t('phone', 'Phone')}</p>
                <a 
                  href={order.customer.phoneLink}
                  onClick={(e) => { e.preventDefault(); handleCall(order.customer.phone); }}
                  className="font-semibold text-blue-600 hover:text-blue-800 text-lg flex items-center gap-2 group"
                >
                  {order.customer.phone}
                  <span className="text-xs text-gray-400 group-hover:text-blue-600">
                    {t('tap_to_call', '(Tap to call)')}
                  </span>
                </a>
              </div>
            </div>

            {/* Email */}
            {order.customer.email && order.customer.email !== 'N/A' && (
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
                  <EnvelopeIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('email', 'Email')}</p>
                  <p className="text-gray-700">{order.customer.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Card with Map Link */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-amber-500" />
              {order.currentPhase === 'pickup' ? t('pickup_address', 'Pickup Address') : t('delivery_address', 'Delivery Address')}
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Full Address */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HomeIcon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  {order.address.street && (
                    <p className="font-medium text-gray-900">{order.address.street}</p>
                  )}
                  <p className="text-gray-600">
                    {[order.address.city, order.address.state].filter(Boolean).join(', ')}
                  </p>
                  {order.address.zipCode && (
                    <p className="text-gray-500">{order.address.zipCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Instructions */}
            {order.address.instructions && (
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{t('address_instructions', 'Address Instructions')}</p>
                    <p className="text-yellow-700 mt-1">{order.address.instructions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Laundry Instructions & Notes */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Laundry Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-purple-500" />
              {t('laundry_instructions', 'Laundry Instructions')}
            </h2>
          </div>
          <div className="p-5">
            {order.laundryInstructions ? (
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-purple-900">{order.laundryInstructions}</p>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{t('no_special_instructions', 'No special instructions provided')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pickup/Delivery Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-teal-500" />
              {order.currentPhase === 'pickup' ? t('pickup_notes', 'Pickup Notes') : t('delivery_notes', 'Delivery Notes')}
            </h2>
          </div>
          <div className="p-5">
            {(order.currentPhase === 'pickup' ? order.pickupNotes : order.deliveryNotes) ? (
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                <p className="text-teal-900">
                  {order.currentPhase === 'pickup' ? order.pickupNotes : order.deliveryNotes}
                </p>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{t('no_notes', 'No notes available')}</p>
              </div>
            )}

            {/* Delivery Photo (Proof of Delivery) */}
            {order.currentPhase === 'delivery' && order.deliveryPhoto && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <PhotoIcon className="w-4 h-4 text-purple-500" />
                  {t('proof_of_delivery', 'Proof of Delivery')}
                </h3>
                <div className="rounded-xl overflow-hidden border-2 border-purple-100 shadow-sm relative group">
                  <img 
                    src={order.deliveryPhoto} 
                    alt="Proof of Delivery" 
                    className="w-full h-auto max-h-64 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => window.open(order.deliveryPhoto, '_blank')}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs text-center">{t('click_to_view_full', 'Click to view full image')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service & Items Details */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-500" />
            {t('service_items', 'Service & Items')}
          </h2>
        </div>
        <div className="p-5">
          {/* Service Type */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-indigo-50 rounded-lg">
            <span className="text-2xl">
              {order.serviceTypes?.map(s => getServiceIcon(s)).join(' ')}
            </span>
            <div>
              <p className="text-sm text-gray-500">{t('service_type', 'Service Type')}</p>
              <p className="font-semibold text-gray-900">{order.serviceTypeDisplay}</p>
            </div>
            {order.weight && order.weight !== 'N/A' && (
              <div className="ml-auto flex items-center gap-2 text-gray-600">
                <ScaleIcon className="w-5 h-5" />
                <span className="font-medium">{order.weight}</span>
              </div>
            )}
          </div>

          {/* Items List */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-gray-700 mb-3">{t('items', 'Items')} ({order.totalQuantity})</p>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getServiceIcon(item.service)}</span>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 flex items-center">
                        <CurrencyRupeeIcon className="w-4 h-4" />
                        {item.total || (item.quantity * item.price)}
                      </p>
                      <p className="text-xs text-gray-500">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-gray-500">{t('total_amount', 'Total Amount')}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.paymentStatus === 'paid' ? t('paid', 'Paid') : t('payment_pending', 'Payment Pending')}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 flex items-center">
              <CurrencyRupeeIcon className="w-6 h-6" />
              {order.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Information */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-500" />
            {t('schedule', 'Schedule')}
          </h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <CalendarIcon className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('order_date', 'Order Date')}</p>
              <p className="font-semibold text-gray-900">{formatDate(order.orderDate)}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <TruckIcon className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('pickup_date', 'Pickup Date')}</p>
              <p className="font-semibold text-gray-900">{formatDate(order.pickupDate)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('delivery_date', 'Delivery Date')}</p>
              <p className="font-semibold text-gray-900">{formatDate(order.deliveryDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-slate-500" />
              {t('status_history', 'Status History')}
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              {order.statusHistory.slice().reverse().map((history, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                    index === 0 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{history.statusLabel}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(history.timestamp)}</p>
                    </div>
                    {history.note && (
                      <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {t('by', 'By')}: {history.updatedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 sticky bottom-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
        <div className="flex gap-3">
          <button
            onClick={() => handleCall(order.customer.phone)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneIcon className="w-5 h-5" />
            {t('call', 'Call')}
          </button>
          <button
            onClick={() => handleOpenMaps(order.address.mapsLink)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <MapIcon className="w-5 h-5" />
            {t('navigate', 'Navigate')}
          </button>
          {/* OTP Verification Button - Only show for out-for-delivery orders */}
          {order.status === 'out-for-delivery' && (
            <button
              onClick={openOTPModal}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheckIcon className="w-5 h-5" />
              {t('verify_delivery', 'Verify & Deliver')}
            </button>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 text-white relative">
              <button
                onClick={() => setShowOTPModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-full p-3">
                  <ShieldCheckIcon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t('delivery_verification', 'Delivery Verification')}</h3>
                  <p className="text-purple-100 text-sm">Order #{order.orderNumber}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Success Message */}
              {otpSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                  <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{otpSuccess}</span>
                </div>
              )}

              {/* Error Message */}
              {otpError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
                  <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{otpError}</span>
                </div>
              )}

              {/* OTP Status Info */}
              {otpStatus && (
                <div className="mb-6">
                  {!otpStatus.generated ? (
                    // No OTP generated yet
                    <div className="text-center py-4">
                      <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <KeyIcon className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t('generate_otp_title', 'Generate Delivery OTP')}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        {t('generate_otp_desc', 'Send a 6-digit OTP to the customer for delivery verification.')}
                      </p>
                      <button
                        onClick={handleGenerateOTP}
                        disabled={otpLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        {otpLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            {t('sending', 'Sending...')}
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="w-5 h-5" />
                            {t('send_otp', 'Send OTP to Customer')}
                          </>
                        )}
                      </button>
                    </div>
                  ) : otpStatus.verified ? (
                    // OTP already verified
                    <div className="text-center py-4">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <CheckBadgeIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-green-800 mb-2">
                        {t('otp_verified', 'OTP Already Verified')}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {t('otp_verified_desc', 'This order has been verified and marked as delivered.')}
                      </p>
                    </div>
                  ) : otpStatus.expired || otpStatus.attemptsExhausted ? (
                    // OTP expired or max attempts reached
                    <div className="text-center py-4">
                      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                      </div>
                      <h4 className="font-semibold text-red-800 mb-2">
                        {otpStatus.expired ? t('otp_expired', 'OTP Expired') : t('attempts_exhausted', 'Too Many Attempts')}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        {otpStatus.expired 
                          ? t('otp_expired_desc', 'The OTP has expired. Please generate a new one.')
                          : t('attempts_exhausted_desc', 'Maximum verification attempts reached. Please generate a new OTP.')
                        }
                      </p>
                      <button
                        onClick={handleResendOTP}
                        disabled={otpLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        {otpLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            {t('sending', 'Sending...')}
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className="w-5 h-5" />
                            {t('generate_new_otp', 'Generate New OTP')}
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    // OTP ready to verify
                    <div>
                      <div className="text-center mb-6">
                        <p className="text-sm text-gray-600 mb-1">
                          {t('enter_otp_from_customer', 'Enter the 6-digit OTP from customer')}
                        </p>
                        <p className="text-xs text-gray-400">
                          {otpStatus.remainingAttempts} {t('attempts_remaining', 'attempts remaining')}
                        </p>
                      </div>

                      {/* OTP Input Fields */}
                      <div className="flex justify-center gap-2 mb-6">
                        {otpValue.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (otpInputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                          />
                        ))}
                      </div>
                      
                      {/* Delivery Notes */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('delivery_notes_label', 'Delivery Notes (Optional)')}
                        </label>
                        <textarea
                          value={deliveryNote}
                          onChange={(e) => setDeliveryNote(e.target.value)}
                          placeholder={t('delivery_notes_placeholder', 'Add details like: customer not available, left at doorstep, etc.')}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm resize-none"
                          rows="3"
                        ></textarea>
                      </div>

                      {/* Photo Confirmation */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('delivery_photo_label', 'Proof of Delivery Photo')}
                        </label>
                        
                        {photoPreview ? (
                          <div className="relative rounded-lg overflow-hidden border-2 border-purple-200 shadow-inner">
                            <img src={photoPreview} alt="Delivery proof" className="w-full h-48 object-cover" />
                            <button
                              onClick={() => {
                                setDeliveryPhoto(null);
                                setPhotoPreview(null);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all border-purple-100 hover:border-purple-300">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <CameraIcon className="w-8 h-8 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">{t('click_to_upload_photo', 'Click to capture/upload photo')}</p>
                              </div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*" 
                                capture="environment"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setDeliveryPhoto(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setPhotoPreview(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Verify Button */}
                      <button
                        onClick={handleVerifyOTP}
                        disabled={otpLoading || otpValue.join('').length !== 6}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        {otpLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            {t('verifying', 'Verifying...')}
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-5 h-5" />
                            {t('verify_and_complete', 'Verify & Complete Delivery')}
                          </>
                        )}
                      </button>

                      {/* Resend OTP Link */}
                      <div className="mt-4 text-center">
                        <button
                          onClick={handleResendOTP}
                          disabled={otpLoading}
                          className="text-sm text-purple-600 hover:text-purple-800 disabled:text-gray-400"
                        >
                          {t('resend_otp', "Didn't receive OTP? Resend")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Loading state for OTP status */}
              {!otpStatus && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 text-center">
                {t('otp_security_note', 'The customer will receive the OTP via email and SMS. Ask them to share it with you for verification.')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
