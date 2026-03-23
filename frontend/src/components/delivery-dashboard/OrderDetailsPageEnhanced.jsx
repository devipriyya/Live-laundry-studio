import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
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
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  KeyIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  PlayIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const OrderDetailsPageEnhanced = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();

  // State
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // OTP State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null);
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(null);
  const otpInputRefs = useRef([]);
  const fileInputRef = useRef(null);

  // Note/Photo State
  const [statusNote, setStatusNote] = useState('');
  const [statusPhotoUrl, setStatusPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';

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
      const data = await deliveryBoyService.getOrderDetails(orderId);
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // Fetch OTP status
  const fetchOTPStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const data = await deliveryBoyService.getOTPStatus(orderId);
      if (data.success) {
        setOtpStatus(data.otp);
      }
    } catch (err) {
      console.error('Error fetching OTP status:', err);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Status update handler
  const handleStatusUpdate = async (newStatus, bypassOTP = false) => {
    // If it's delivery completion, show OTP modal (unless bypassed)
    if (newStatus === 'delivery-completed' && order.status === 'out-for-delivery' && !bypassOTP) {
      setShowOTPModal(true);
      await fetchOTPStatus();
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      setActionSuccess(null);

      const result = await deliveryBoyService.updateOrderStatus(orderId, newStatus, statusNote, statusPhotoUrl);
      
      setActionSuccess(`Status updated to ${deliveryBoyService.getStatusLabel(newStatus)}`);
      
      // Clear note and photo
      setStatusNote('');
      setStatusPhotoUrl('');
      
      // Close OTP modal if it was open (for bypass path)
      if (showOTPModal) setShowOTPModal(false);
      
      // Refresh order details
      await fetchOrderDetails();
      
      // Clear success message after 3 seconds
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update status');
      setTimeout(() => setActionError(null), 5000);
    } finally {
      setActionLoading(false);
    }
  };

  // Generate OTP
  const handleGenerateOTP = async () => {
    setOtpLoading(true);
    setOtpError(null);
    setOtpSuccess(null);

    try {
      const result = await deliveryBoyService.generateOTP(orderId);
      if (result.success) {
        setOtpSuccess(result.message);
        await fetchOTPStatus();
      } else {
        setOtpError(result.message);
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
      const result = await deliveryBoyService.resendOTP(orderId);
      if (result.success) {
        setOtpSuccess('New OTP sent to customer');
        setOtpValue(['', '', '', '', '', '']);
        await fetchOTPStatus();
      } else {
        setOtpError(result.message);
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
      const result = await deliveryBoyService.verifyOTP(orderId, otp, statusNote, statusPhotoUrl);
      if (result.success) {
        setOtpSuccess(result.message);
        setShowOTPModal(false);
        // Clear inputs
        setStatusNote('');
        setStatusPhotoUrl('');
        // Refresh order details to show updated status
        await fetchOrderDetails();
      } else {
        setOtpError(result.message);
        if (result.attemptsExhausted) {
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
      const focusIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[focusIndex]?.focus();
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        setStatusPhotoUrl(response.data.url);
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Open OTP Modal
  const openOTPModal = async () => {
    setShowOTPModal(true);
    setOtpValue(['', '', '', '', '', '']);
    setOtpError(null);
    setOtpSuccess(null);
    await fetchOTPStatus();
  };

  // Get status color
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

  // Get phase color
  const getPhaseColor = (phase) => {
    const colors = {
      'pickup': 'from-amber-500 to-orange-500',
      'processing': 'from-blue-500 to-indigo-500',
      'delivery': 'from-green-500 to-emerald-500'
    };
    return colors[phase] || 'from-gray-500 to-gray-600';
  };

  // Get action button for current status
  const getActionButton = () => {
    if (!order) return null;

    const nextStatus = deliveryBoyService.getNextStatus(order.status);
    if (!nextStatus) return null;

    const buttonConfig = {
      'out-for-pickup': {
        text: 'Mark Out for Pickup',
        icon: ArrowUpTrayIcon,
        color: 'bg-amber-500 hover:bg-amber-600'
      },
      'pickup-completed': {
        text: 'Confirm Pickup',
        icon: CheckCircleIcon,
        color: 'bg-indigo-500 hover:bg-indigo-600'
      },
      'out-for-delivery': {
        text: 'Out for Delivery',
        icon: TruckIcon,
        color: 'bg-purple-500 hover:bg-purple-600'
      },
      'delivery-completed': {
        text: 'Confirm Delivered',
        icon: CheckBadgeIcon,
        color: 'bg-green-500 hover:bg-green-600'
      }
    };

    const config = buttonConfig[nextStatus];
    if (!config) return null;

    const needsProof = nextStatus === 'pickup-completed' || nextStatus === 'delivery-completed';

    return (
      <div className="space-y-4 w-full">
        {needsProof && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                {nextStatus === 'pickup-completed' ? 'Pickup Note' : 'Delivery Note'}
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add any customer instructions or issues..."
                className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                rows="2"
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Photo Confirmation
              </label>
              {statusPhotoUrl ? (
                <div className="relative inline-block">
                  <img 
                    src={`${API_URL.replace('/api', '')}${statusPhotoUrl}`} 
                    alt="Status Proof" 
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button 
                    onClick={() => setStatusPhotoUrl('')}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-500"
                >
                  <CameraIcon className={`w-6 h-6 mb-1 ${uploading ? 'animate-spin' : ''}`} />
                  <span className="text-xs font-medium">
                    {uploading ? 'Uploading...' : 'Tap to upload photo proof'}
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
          onClick={() => handleStatusUpdate(nextStatus)}
          disabled={actionLoading || (needsProof && uploading)}
          className={`flex items-center justify-center gap-2 w-full px-6 py-3 ${config.color} text-white font-semibold rounded-xl transition-colors shadow-lg disabled:opacity-50`}
        >
          {actionLoading ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <config.icon className="w-5 h-5" />
          )}
          {config.text}
        </button>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={fetchOrderDetails}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getPhaseColor(order.currentPhase)} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Order #{order.orderNumber}</h1>
              <p className="text-white/80 text-sm">{order.phaseLabel}</p>
            </div>
            <button
              onClick={fetchOrderDetails}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {order.statusLabel}
            </span>
            {order.priority === 'high' && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                URGENT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Messages */}
      {actionSuccess && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircleSolidIcon className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{actionSuccess}</span>
          </div>
        </div>
      )}
      {actionError && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{actionError}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Customer Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-500" />
            Customer Details
          </h3>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {order.customer?.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-lg">{order.customer?.name}</h4>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <EnvelopeIcon className="w-4 h-4" />
                {order.customer?.email}
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                <PhoneIcon className="w-4 h-4" />
                {order.customer?.phone}
              </p>
            </div>
            <button
              onClick={() => deliveryBoyService.callCustomer(order.customer?.phone)}
              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors shadow-lg"
            >
              <PhoneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-purple-500" />
            {order.currentPhase === 'pickup' ? 'Pickup Address' : 'Delivery Address'}
          </h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-800 font-medium">{order.address?.fullAddress}</p>
            {order.address?.instructions && (
              <p className="text-gray-500 text-sm mt-2 flex items-start gap-2">
                <InformationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {order.address.instructions}
              </p>
            )}
          </div>
          <button
            onClick={() => deliveryBoyService.openMapsNavigation(order.address)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
          >
            <MapIcon className="w-5 h-5" />
            Navigate with Google Maps
          </button>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-500" />
            Order Items
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">₹{item.total || item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-500" />
            Schedule
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="font-medium text-gray-800">
                {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Time Slot</p>
              <p className="font-medium text-gray-800">{order.timeSlot}</p>
            </div>
            {order.pickupDate && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Pickup Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(order.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
            {order.deliveryDate && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Delivery Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Special Instructions */}
        {(order.laundryInstructions || order.pickupNotes || order.deliveryNotes) && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-amber-500" />
              Special Instructions
            </h3>
            {order.laundryInstructions && (
              <div className="bg-amber-50 rounded-xl p-4 mb-3">
                <p className="text-sm font-medium text-amber-800 mb-1">Laundry Instructions</p>
                <p className="text-amber-700">{order.laundryInstructions}</p>
              </div>
            )}
            {order.pickupNotes && (
              <div className="bg-blue-50 rounded-xl p-4 mb-3">
                <p className="text-sm font-medium text-blue-800 mb-1">Pickup Notes</p>
                <p className="text-blue-700">{order.pickupNotes}</p>
              </div>
            )}
            {order.deliveryNotes && (
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm font-medium text-green-800 mb-1">Delivery Notes</p>
                <p className="text-green-700">{order.deliveryNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-gray-500" />
              Status History
            </h3>
            <div className="space-y-4">
              {order.statusHistory.slice().reverse().map((history, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{history.statusLabel}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(history.timestamp).toLocaleString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {history.note && (
                      <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pickup/Delivery Proof (History) */}
        {(order.pickupNote || order.pickupPhoto || order.deliveryNote || order.deliveryPhoto) && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckBadgeIcon className="w-5 h-5 text-emerald-500" />
              Service Proof
            </h3>
            <div className="space-y-6">
              {(order.pickupNote || order.pickupPhoto) && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Pickup Confirmation</p>
                  {order.pickupPhoto && (
                    <div className="mb-3">
                      <img src={`${API_URL.replace('/api', '')}${order.pickupPhoto}`} alt="Pickup Proof" className="rounded-xl w-full max-h-64 object-cover border border-gray-200 shadow-sm" />
                    </div>
                  )}
                  {order.pickupNote && (
                    <div className="flex items-start gap-2 text-gray-700 bg-white p-3 rounded-lg border border-gray-100 italic">
                      <span>"{order.pickupNote}"</span>
                    </div>
                  )}
                </div>
              )}
              {(order.deliveryNote || order.deliveryPhoto) && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Delivery Confirmation</p>
                  {order.deliveryPhoto && (
                    <div className="mb-3">
                      <img src={`${API_URL.replace('/api', '')}${order.deliveryPhoto}`} alt="Delivery Proof" className="rounded-xl w-full max-h-64 object-cover border border-gray-200 shadow-sm" />
                    </div>
                  )}
                  {order.deliveryNote && (
                    <div className="flex items-start gap-2 text-gray-700 bg-white p-3 rounded-lg border border-gray-100 italic">
                      <span>"{order.deliveryNote}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Action Button */}
      {order.status !== 'delivery-completed' && order.status !== 'cancelled' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {getActionButton()}
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                  Verify Delivery
                </h3>
                <button
                  onClick={() => setShowOTPModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Enter the 6-digit OTP received by the customer to complete the delivery.
              </p>

              {/* OTP Status */}
              {otpStatus && !otpStatus.generated && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <p className="text-blue-800 text-sm mb-3">
                    No OTP generated yet. Click below to send OTP to the customer.
                  </p>
                  <button
                    onClick={handleGenerateOTP}
                    disabled={otpLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {otpLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="w-5 h-5" />
                    )}
                    Send OTP to Customer
                  </button>
                </div>
              )}

              {/* OTP Input */}
              {otpStatus?.generated && otpStatus.canVerify && (
                <>
                  <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
                    {otpValue.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => otpInputRefs.current[index] = el}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    ))}
                  </div>

                  {/* Delivery Note and Photo Proof Section */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                        Delivery Note
                      </label>
                      <textarea
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="Add any customer instructions or issues..."
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        rows="2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Photo Confirmation
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
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-500 group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-all mb-1">
                            {uploading ? (
                              <ArrowPathIcon className="w-4 h-4 text-blue-500 animate-spin" />
                            ) : (
                              <CameraIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                            )}
                          </div>
                          <span className="text-xs font-medium">
                            {uploading ? 'Uploading...' : 'Tap to upload photo proof'}
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

                  {otpStatus.remainingAttempts < 3 && (
                    <p className="text-center text-amber-600 text-sm mb-4">
                      {otpStatus.remainingAttempts} attempt(s) remaining
                    </p>
                  )}
                </>
              )}

              {/* OTP Expired or Max Attempts */}
              {otpStatus?.generated && !otpStatus.canVerify && !otpStatus.verified && (
                <div className="bg-amber-50 rounded-xl p-4 mb-6">
                  <p className="text-amber-800 text-sm mb-3">
                    {otpStatus.expired ? 'OTP has expired.' : 'Maximum attempts exceeded.'} Please generate a new OTP.
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={otpLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {otpLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <ArrowPathIcon className="w-5 h-5" />
                    )}
                    Resend OTP
                  </button>
                </div>
              )}

              {/* Error */}
              {otpError && (
                <div className="bg-red-50 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 text-sm">{otpError}</span>
                </div>
              )}

              {/* Success */}
              {otpSuccess && (
                <div className="bg-green-50 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <CheckCircleSolidIcon className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 text-sm">{otpSuccess}</span>
                </div>
              )}

              {/* Verify Button */}
              {otpStatus?.canVerify && (
                <button
                  onClick={handleVerifyOTP}
                  disabled={otpLoading || otpValue.join('').length !== 6}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {otpLoading ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckBadgeIcon className="w-5 h-5" />
                  )}
                  Verify & Complete Delivery
                </button>
              )}

              {/* Resend Option */}
              {otpStatus?.canVerify && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleResendOTP}
                    disabled={otpLoading}
                    className="w-full mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Didn't receive OTP? Resend
                  </button>
                  
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-semibold">Or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <button
                    onClick={() => handleStatusUpdate('delivery-completed', true)}
                    disabled={actionLoading}
                    className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2"
                  >
                    Complete without OTP
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPageEnhanced;
