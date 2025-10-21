import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  SparklesIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const DashboardShoeCleaning = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Log Razorpay configuration on mount (for debugging)
  React.useEffect(() => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'rzp_test_YOUR_KEY_ID') {
      console.warn('⚠️ Razorpay API key not configured. Please add VITE_RAZORPAY_KEY_ID to your frontend/.env file');
    } else {
      console.log('✅ Razorpay configured');
    }
  }, []);
  
  // Form state
  const [shoeType, setShoeType] = useState('');
  const [numberOfPairs, setNumberOfPairs] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Pricing structure
  const shoePricing = {
    'Formal Leather': { polishing: 150, cleaning: 200, both: 300 },
    'Sports/Sneakers': { polishing: 120, cleaning: 180, both: 250 },
    'Casual Shoes': { polishing: 100, cleaning: 150, both: 200 },
    'Boots': { polishing: 180, cleaning: 250, both: 350 },
    'Sandals': { polishing: 80, cleaning: 120, both: 150 },
    'Designer/Premium': { polishing: 250, cleaning: 350, both: 500 }
  };

  const shoeTypes = Object.keys(shoePricing);
  const serviceTypes = [
    { value: 'polishing', label: 'Polishing Only', icon: '✨' },
    { value: 'cleaning', label: 'Cleaning Only', icon: '🧼' },
    { value: 'both', label: 'Polishing + Cleaning', icon: '💎', popular: true }
  ];

  // Calculate total price
  const calculateTotal = () => {
    if (!shoeType || !serviceType) return 0;
    const basePrice = shoePricing[shoeType][serviceType];
    return basePrice * numberOfPairs;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shoeType || !serviceType || !pickupDate || !pickupTime) {
      alert('Please fill all required fields');
      return;
    }
    setShowSummary(true);
  };

  // Initialize Razorpay payment
  const handlePayment = async () => {
    const amount = calculateTotal();
    
    // Check if Razorpay key is configured
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'rzp_test_YOUR_KEY_ID') {
      alert('Payment configuration error: Razorpay key not configured. Please add your Razorpay API key to the .env file.');
      console.error('Razorpay key not found. Please add VITE_RAZORPAY_KEY_ID to your .env file');
      return;
    }
    
    // Check if Razorpay script is already loaded
    if (window.Razorpay) {
      openRazorpayCheckout(amount, razorpayKey);
      return;
    }
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      openRazorpayCheckout(amount, razorpayKey);
    };
    
    script.onerror = () => {
      alert('Oops! Something went wrong. Payment failed. Unable to load Razorpay. Please check your internet connection and try again.');
      console.error('Failed to load Razorpay script');
    };
  };
  
  // Open Razorpay checkout
  const openRazorpayCheckout = (amount, razorpayKey) => {
    try {
      const options = {
        key: razorpayKey,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Fabricspa',
        description: 'Shoe Cleaning & Polishing Service',
        image: '/logo.png',
        handler: function (response) {
          // Payment successful
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          // Here you can send booking details to your backend
          console.log('Booking Details:', {
            user: user?.email,
            shoeType,
            numberOfPairs,
            serviceType,
            pickupDate,
            pickupTime,
            amount,
            paymentId: response.razorpay_payment_id
          });
          // Reset form
          resetForm();
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
          }
        },
        prefill: {
          name: user?.name || user?.displayName || '',
          email: user?.email || '',
          contact: user?.phone || user?.phoneNumber || ''
        },
        theme: {
          color: '#06B6D4'
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        alert(`Payment Failed! ${response.error.description}`);
        console.error('Payment failed:', response.error);
      });
      
      razorpay.open();
    } catch (error) {
      alert('Oops! Something went wrong. Payment failed. Please try again.');
      console.error('Error opening Razorpay:', error);
    }
  };

  const resetForm = () => {
    setShoeType('');
    setNumberOfPairs(1);
    setServiceType('');
    setPickupDate('');
    setPickupTime('');
    setShowSummary(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-semibold">Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full shadow-lg">
              <SparklesIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Shoe Polishing & Cleaning
          </h1>
          <p className="text-gray-600 text-lg">
            Professional shoe care service at your doorstep
          </p>
        </div>

        {!showSummary ? (
          /* Booking Form */
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shoe Type Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Select Shoe Type *
                </label>
                <select
                  value={shoeType}
                  onChange={(e) => setShoeType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-gray-900 font-medium"
                  required
                >
                  <option value="">Choose shoe type...</option>
                  {shoeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Select Service Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {serviceTypes.map((service) => (
                    <button
                      key={service.value}
                      type="button"
                      onClick={() => setServiceType(service.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        serviceType === service.value
                          ? 'border-yellow-500 bg-yellow-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-yellow-300 hover:shadow-md'
                      }`}
                    >
                      {service.popular && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                          Popular
                        </span>
                      )}
                      <div className="text-3xl mb-2">{service.icon}</div>
                      <p className="font-bold text-gray-900 text-sm">{service.label}</p>
                      {shoeType && (
                        <p className="text-yellow-600 font-bold mt-2">
                          ₹{shoePricing[shoeType][service.value]}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Pairs */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Number of Pairs *
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setNumberOfPairs(Math.max(1, numberOfPairs - 1))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <MinusIcon className="h-5 w-5 text-gray-700" />
                  </button>
                  <div className="flex-1 text-center">
                    <input
                      type="number"
                      value={numberOfPairs}
                      onChange={(e) => setNumberOfPairs(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-gray-900 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setNumberOfPairs(Math.min(20, numberOfPairs + 1))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  <CalendarDaysIcon className="h-5 w-5 inline mr-2" />
                  Pickup Date *
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-gray-900 font-medium"
                  required
                />
              </div>

              {/* Pickup Time */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  <ClockIcon className="h-5 w-5 inline mr-2" />
                  Pickup Time *
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all duration-300 text-gray-900 font-medium"
                  required
                >
                  <option value="">Select time slot...</option>
                  <option value="08:00-10:00">08:00 AM - 10:00 AM</option>
                  <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                  <option value="12:00-14:00">12:00 PM - 02:00 PM</option>
                  <option value="14:00-16:00">02:00 PM - 04:00 PM</option>
                  <option value="16:00-18:00">04:00 PM - 06:00 PM</option>
                  <option value="18:00-20:00">06:00 PM - 08:00 PM</option>
                </select>
              </div>

              {/* Price Summary */}
              {shoeType && serviceType && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 font-medium">Base Price:</span>
                    <span className="text-gray-900 font-bold">₹{shoePricing[shoeType][serviceType]}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 font-medium">Number of Pairs:</span>
                    <span className="text-gray-900 font-bold">× {numberOfPairs}</span>
                  </div>
                  <div className="border-t-2 border-yellow-300 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                      <span className="text-3xl font-extrabold text-yellow-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        ) : (
          /* Booking Summary */
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Summary</h2>
              <p className="text-gray-600">Review your details before payment</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Shoe Type:</span>
                <span className="text-gray-900 font-bold">{shoeType}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Service:</span>
                <span className="text-gray-900 font-bold">
                  {serviceTypes.find(s => s.value === serviceType)?.label}
                </span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Number of Pairs:</span>
                <span className="text-gray-900 font-bold">{numberOfPairs}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Pickup Date:</span>
                <span className="text-gray-900 font-bold">{new Date(pickupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Pickup Time:</span>
                <span className="text-gray-900 font-bold">{pickupTime}</span>
              </div>
              <div className="flex justify-between p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-300">
                <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                <span className="text-3xl font-extrabold text-yellow-600">₹{calculateTotal()}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSummary(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Edit Details
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <CurrencyRupeeIcon className="h-5 w-5 mr-2" />
                Pay with Razorpay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardShoeCleaning;
