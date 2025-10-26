import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  CheckCircleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  PrinterIcon,
  ShareIcon,
  ArrowRightIcon,
  SparklesIcon,
  StarIcon,
  GiftIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const OrderSuccess = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data from navigation state
  const orderData = location.state?.orderData || {};
  const cartItems = location.state?.cartItems || [];
  const totalPrice = location.state?.totalPrice || 0;
  const successMessage = location.state?.message || 'Order placed successfully! We\'ll send you a confirmation shortly.';
  
  const [showConfetti, setShowConfetti] = useState(true);
  const orderNumber = orderData.orderNumber || `ORD-${Date.now()}`;
  const [estimatedDelivery] = useState(() => {
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    return delivery.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  });

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleTrackOrder = () => {
    navigate('/track-order', { 
      state: { 
        orderNumber: orderData.orderNumber || orderNumber,
        orderData: {
          ...orderData,
          cartItems,
          totalPrice,
          status: orderData.status || 'order-placed',
          estimatedDelivery
        }
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FabricSpa Order Confirmation',
        text: `My laundry order ${orderNumber} has been confirmed!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Order ${orderNumber} confirmed! Track at: ${window.location.href}`);
      alert('Order details copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <SparklesIcon className="h-6 w-6 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-pulse">
            <CheckCircleIcon className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Thank you, {user?.name?.split(' ')[0] || 'Valued Customer'}!
          </p>
          
          <p className="text-lg text-gray-500">
            {successMessage}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Confirmation</h2>
              <p className="text-gray-600">Your order has been confirmed and is being processed</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-2xl font-bold text-blue-600">{orderNumber}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                Order Items
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.length > 0 ? cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.serviceType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price} × {item.quantity}</p>
                      <p className="text-sm text-gray-600">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No specific items selected</p>
                    <p className="text-sm">Standard laundry service</p>
                  </div>
                )}
              </div>

              {totalPrice > 0 && (
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Schedule & Contact */}
            <div className="space-y-6">
              {/* Pickup Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2 text-green-600" />
                  Pickup Schedule
                </h3>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CalendarDaysIcon className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">
                      {orderData.pickupDate || 'Tomorrow'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">
                      {orderData.pickupTime || '10:00 AM - 12:00 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Estimated Delivery
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{estimatedDelivery}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">
                      {orderData.deliveryTime || '2:00 PM - 4:00 PM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              {orderData.address && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Service Address
                  </h3>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-gray-900 font-medium">{orderData.address.street}</p>
                    <p className="text-gray-700">
                      {orderData.address.city}, {orderData.address.state} {orderData.address.zipCode}
                    </p>
                    {orderData.address.instructions && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Instructions:</strong> {orderData.address.instructions}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={handleTrackOrder}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <TruckIcon className="h-5 w-5" />
            <span>Track Order</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-white text-gray-700 border-2 border-gray-200 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <PrinterIcon className="h-5 w-5" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-white text-gray-700 border-2 border-gray-200 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* What's Next Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Happens Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TruckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Pickup</h3>
              <p className="text-gray-600 text-sm">
                Our team will arrive at your location at the scheduled time to collect your items.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Professional Care</h3>
              <p className="text-gray-600 text-sm">
                Your items will be professionally cleaned using premium techniques and eco-friendly products.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Delivery</h3>
              <p className="text-gray-600 text-sm">
                Clean, fresh, and perfectly pressed items will be delivered back to you.
              </p>
            </div>
          </div>
        </div>

        {/* Rewards & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rewards Earned */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 border border-yellow-200">
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GiftIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rewards Earned!</h3>
              <p className="text-3xl font-bold text-yellow-600 mb-2">+{Math.floor(totalPrice * 0.1)} Points</p>
              <p className="text-gray-600 text-sm">
                You've earned reward points with this order. Keep collecting to unlock exclusive benefits!
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Need Help?</h3>
            <div className="space-y-3">
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <PhoneIcon className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900 font-medium">Call Support</span>
              </a>
              <a
                href="mailto:support@fabricspa.com"
                className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EnvelopeIcon className="h-5 w-5 text-purple-600" />
                <span className="text-gray-900 font-medium">Email Support</span>
              </a>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/laundry-segment')}
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Schedule Another Service</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
