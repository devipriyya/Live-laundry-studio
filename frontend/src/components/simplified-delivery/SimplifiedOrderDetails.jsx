import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowPathIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const SimplifiedOrderDetails = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await deliveryBoyService.getOrderDetails(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus, note = '') => {
    try {
      setUpdating(true);
      await deliveryBoyService.updateOrderStatus(orderId, newStatus, note);
      // Refresh order details
      fetchOrderDetails();
      // Navigate back to orders list
      navigate('/simplified-delivery/orders');
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'out-for-pickup':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pickup-completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivery-completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'order-placed': 'Order Placed',
      'order-accepted': 'Order Accepted',
      'out-for-pickup': 'Out for Pickup',
      'pickup-completed': 'Pickup Completed',
      'wash-in-progress': 'Wash in Progress',
      'wash-completed': 'Wash Completed',
      'out-for-delivery': 'Out for Delivery',
      'delivery-completed': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  };

  const callCustomer = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const messageCustomer = (phone) => {
    window.open(`sms:${phone}`, '_blank');
  };

  const openMaps = (address) => {
    deliveryBoyService.openMapsNavigation(address);
  };

  const handleGenerateOtp = async () => {
    try {
      await deliveryBoyService.generateOTP(orderId);
      setShowOtpModal(true);
    } catch (error) {
      console.error('Error generating OTP:', error);
      alert('Failed to generate OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) {
      setOtpError('Please enter the OTP');
      return;
    }

    try {
      await deliveryBoyService.verifyOTP(orderId, otpValue);
      setShowOtpModal(false);
      setOtpValue('');
      setOtpError('');
      // Refresh order details
      fetchOrderDetails();
      // Navigate back to orders list
      navigate('/simplified-delivery/orders');
    } catch (error) {
      setOtpError(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const getNextStatus = (currentStatus) => {
    const workflow = {
      'out-for-pickup': 'pickup-completed',
      'pickup-completed': 'out-for-delivery',
      'out-for-delivery': 'delivery-completed'
    };
    return workflow[currentStatus];
  };

  const getActionButtons = () => {
    if (!order) return null;

    const buttons = [];

    if (order.status === 'out-for-pickup') {
      buttons.push(
        <button
          key="pickup-complete"
          onClick={() => updateOrderStatus('pickup-completed', 'Pickup completed successfully')}
          disabled={updating}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? t('updating', 'Updating...') : t('mark_pickup_complete', 'Mark Pickup Complete')}
        </button>
      );
    } else if (order.status === 'out-for-delivery') {
      buttons.push(
        <button
          key="request-otp"
          onClick={handleGenerateOtp}
          disabled={updating}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? t('processing', 'Processing...') : t('request_otp', 'Request OTP')}
        </button>
      );
    } else if (order.status === 'pickup-completed') {
      buttons.push(
        <button
          key="start-delivery"
          onClick={() => updateOrderStatus('out-for-delivery', 'Started delivery')}
          disabled={updating}
          className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? t('updating', 'Updating...') : t('start_delivery', 'Start Delivery')}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
          <TruckIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-1">{t('order_not_found', 'Order Not Found')}</h3>
          <p className="text-sm text-gray-500">{t('order_not_found_message', 'The requested order could not be found')}</p>
          <button
            onClick={() => navigate('/simplified-delivery/orders')}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t('back_to_orders', 'Back to Orders')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/simplified-delivery/orders')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {t('back_to_orders', 'Back to Orders')}
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{t('order_details', 'Order Details')}</h1>
        <p className="text-sm text-gray-500">#{order.orderNumber}</p>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium text-gray-900">{t('status', 'Status')}</h2>
            <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <div className="text-right">
            <h2 className="font-medium text-gray-900">{t('placed_at', 'Placed At')}</h2>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()} •{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
        <h2 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
          <UserIcon className="w-5 h-5" />
          {t('customer_info', 'Customer Information')}
        </h2>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">{t('name', 'Name')}</p>
            <p className="font-medium">{order.customerInfo?.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">{t('phone', 'Phone')}</p>
            <div className="flex items-center gap-2">
              <p className="font-medium">{order.customerInfo?.phone}</p>
              <button
                onClick={() => callCustomer(order.customerInfo?.phone)}
                className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm"
              >
                <PhoneIcon className="w-4 h-4" />
                {t('call', 'Call')}
              </button>
              <button
                onClick={() => messageCustomer(order.customerInfo?.phone)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                {t('message', 'Message')}
              </button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">{t('address', 'Address')}</p>
            <div className="flex items-start gap-2">
              <p className="font-medium flex-1">
                {order.fullAddress || 
                  `${order.customerInfo?.address?.street}, ${order.customerInfo?.address?.city}, ${order.customerInfo?.address?.state} ${order.customerInfo?.address?.zipCode}`
                }
              </p>
              <button
                onClick={() => openMaps(order.customerInfo?.address)}
                className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
              >
                <MapPinIcon className="w-4 h-4" />
                {t('navigate', 'Navigate')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
        <h2 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
          <DocumentTextIcon className="w-5 h-5" />
          {t('order_items', 'Order Items')}
        </h2>
        
        <div className="space-y-3">
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.service} • Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">₹{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
        <h2 className="font-medium text-gray-900 mb-3">{t('summary', 'Summary')}</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">{t('sub_total', 'Sub Total')}</span>
            <span className="font-medium">₹{order.totalAmount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">{t('tax', 'Tax')}</span>
            <span className="font-medium">₹{order.tax || 0}</span>
          </div>
          
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="font-medium">{t('total_amount', 'Total Amount')}</span>
            <span className="font-bold text-lg">₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {getActionButtons()}
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="font-medium text-gray-900 text-lg mb-4">{t('enter_otp', 'Enter OTP')}</h3>
            
            {otpError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {otpError}
              </div>
            )}
            
            <div className="mb-4">
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder={t('enter_6_digit_otp', 'Enter 6-digit OTP')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpValue('');
                  setOtpError('');
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {t('cancel', 'Cancel')}
              </button>
              <button
                onClick={handleVerifyOtp}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {t('verify', 'Verify')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplifiedOrderDetails;
