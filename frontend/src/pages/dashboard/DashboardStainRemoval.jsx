import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  BeakerIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const formatDateForInput = (date) => {
  const offsetMillis = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMillis).toISOString().split('T')[0];
};

const parseInputDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const startOfDay = (date) => {
  const clonedDate = new Date(date);
  clonedDate.setHours(0, 0, 0, 0);
  return clonedDate;
};

const DashboardStainRemoval = () => {
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
  const [selectedItems, setSelectedItems] = useState({});
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dateError, setDateError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: ''
  });
  const [contactInfo, setContactInfo] = useState({
    name: user?.displayName || user?.name || '',
    phone: '',
    email: user?.email || ''
  });
  const [showSummary, setShowSummary] = useState(false);

  // Pricing structure for stain removal items
  const stainRemovalPricing = {
    'Clothing Items': [
      { name: 'Shirt', price: 150 },
      { name: 'T-Shirt', price: 120 },
      { name: 'Pants / Jeans', price: 180 },
      { name: 'Dress', price: 250 },
      { name: 'Jacket', price: 200 },
      { name: 'Suit (2-piece)', price: 400 }
    ],
    'Ethnic Wear': [
      { name: 'Saree (Cotton)', price: 220 },
      { name: 'Saree (Silk)', price: 350 },
      { name: 'Kurta', price: 180 },
      { name: 'Lehenga', price: 500 }
    ]
  };

  // Stain types with pricing
  const stainTypes = [
    { name: 'Oil/Grease', price: 50 },
    { name: 'Blood', price: 70 },
    { name: 'Wine', price: 60 },
    { name: 'Ink', price: 80 },
    { name: 'Grass', price: 40 },
    { name: 'Sweat', price: 30 },
    { name: 'Makeup', price: 60 },
    { name: 'Coffee', price: 50 }
  ];

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 02:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ];

  const states = [
    'Ahmedabad', 'Bangalore', 'Chennai', 'Delhi', 'Hyderabad', 
    'Jaipur', 'Kerala', 'Kolkata', 'Lucknow', 'Mumbai', 'Pune'
  ];

  const today = startOfDay(new Date());
  const maxAllowedDate = startOfDay(new Date(today));
  maxAllowedDate.setMonth(maxAllowedDate.getMonth() + 3);
  const minPickupDate = formatDateForInput(today);
  const maxPickupDate = formatDateForInput(maxAllowedDate);

  const sanitizePhoneNumber = (value) => value.replace(/\D/g, '').slice(0, 10);

  const validatePickupDate = (value) => {
    if (!value) {
      setDateError('Pickup date is required.');
      return false;
    }

    const selected = parseInputDate(value);
    if (!selected || Number.isNaN(selected.getTime())) {
      setDateError('Please select a valid date.');
      return false;
    }

    const selectedDay = startOfDay(selected);

    if (selectedDay < today) {
      setDateError('Pickup date cannot be in the past.');
      return false;
    }

    if (selectedDay > maxAllowedDate) {
      setDateError('Pickup date cannot exceed 3 months from today.');
      return false;
    }

    setDateError('');
    return true;
  };

  const validatePhone = (value) => {
    if (!value) {
      setPhoneError('Phone number is required.');
      return false;
    }

    if (value.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return false;
    }

    setPhoneError('');
    return true;
  };

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Email is required.');
      return false;
    }

    const emailPattern = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
    if (!emailPattern.test(value)) {
      setEmailError('Please enter a valid Gmail address (e.g., example@gmail.com).');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleDateChange = (value) => {
    setPickupDate(value);
    validatePickupDate(value);
  };

  const handlePhoneChange = (value) => {
    const sanitizedValue = sanitizePhoneNumber(value);
    setContactInfo((prev) => ({ ...prev, phone: sanitizedValue }));
    validatePhone(sanitizedValue);
  };

  const handleEmailChange = (value) => {
    setContactInfo((prev) => ({ ...prev, email: value }));
    validateEmail(value);
  };

  // Update item quantity
  const updateItemQuantity = (itemName, change) => {
    setSelectedItems(prev => {
      const currentQuantity = prev[itemName] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      if (newQuantity === 0) {
        const { [itemName]: removed, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [itemName]: newQuantity
      };
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedItems).forEach(([itemName, quantity]) => {
      Object.values(stainRemovalPricing).forEach(category => {
        const item = category.find(i => i.name === itemName);
        if (item) {
          total += item.price * quantity;
        }
      });
    });
    return total;
  };

  // Get total items count
  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (getTotalItems() === 0) {
      alert('Please select at least one item');
      return;
    }
    
    const isDateValid = validatePickupDate(pickupDate);
    const isPhoneValid = validatePhone(contactInfo.phone);
    const isEmailValid = validateEmail(contactInfo.email);

    if (!pickupDate || !pickupTime) {
      alert('Please select pickup date and time');
      return;
    }

    if (!isDateValid) {
      alert('Please fix the pickup date before proceeding.');
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode) {
      alert('Please fill all address fields');
      return;
    }
    
    if (!contactInfo.name || !contactInfo.phone || !contactInfo.email) {
      alert('Please fill all contact information');
      return;
    }

    if (!isPhoneValid || !isEmailValid) {
      alert('Please fix the highlighted contact information fields.');
      return;
    }
    
    setShowSummary(true);
  };

  // Initialize Razorpay payment
  const handlePayment = async () => {
    const amount = calculateTotal();
    
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'rzp_test_YOUR_KEY_ID') {
      alert('Payment configuration error: Razorpay key not configured. Please add your Razorpay API key to the .env file.');
      console.error('Razorpay key not found. Please add VITE_RAZORPAY_KEY_ID to your .env file');
      return;
    }
    
    if (window.Razorpay) {
      openRazorpayCheckout(amount, razorpayKey);
      return;
    }
    
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
  
  const openRazorpayCheckout = (amount, razorpayKey) => {
    try {
      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency: 'INR',
        name: 'Fabricspa',
        description: 'Professional Stain Removal Service',
        image: '/logo.png',
        handler: function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          console.log('Booking Details:', {
            user: user?.email,
            items: selectedItems,
            pickupDate,
            pickupTime,
            address,
            contact: contactInfo,
            amount,
            paymentId: response.razorpay_payment_id
          });
          resetForm();
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
          }
        },
        prefill: {
          name: contactInfo.name,
          email: contactInfo.email,
          contact: contactInfo.phone
        },
        theme: {
          color: '#A855F7'
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
    setSelectedItems({});
    setPickupDate('');
    setPickupTime('');
    setAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: ''
    });
    setContactInfo({
      name: user?.displayName || user?.name || '',
      phone: '',
      email: user?.email || ''
    });
    setShowSummary(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 p-6">
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
            <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full shadow-lg">
              <BeakerIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Professional Stain Removal
          </h1>
          <p className="text-gray-600 text-lg">
            Expert stain removal service for your precious garments
          </p>
        </div>

        {!showSummary ? (
          /* Booking Form */
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5 text-purple-600" />
                  Select Items for Stain Removal *
                </label>
                <div className="space-y-6">
                  {Object.entries(stainRemovalPricing).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item) => (
                          <div
                            key={item.name}
                            className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border-2 border-purple-200 hover:border-purple-400 transition-all"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                <p className="text-purple-600 font-bold text-lg">₹{item.price}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-xs text-gray-600 font-medium">Quantity:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateItemQuantity(item.name, -1)}
                                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  <MinusIcon className="h-4 w-4 text-gray-700" />
                                </button>
                                <span className="w-10 text-center font-bold text-gray-900 text-lg">
                                  {selectedItems[item.name] || 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateItemQuantity(item.name, 1)}
                                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                  <PlusIcon className="h-4 w-4 text-gray-700" />
                                </button>
                              </div>
                            </div>
                            {selectedItems[item.name] > 0 && (
                              <div className="mt-3 pt-3 border-t-2 border-purple-300">
                                <p className="text-sm font-bold text-purple-700">
                                  Subtotal: ₹{item.price * selectedItems[item.name]}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3" htmlFor="pickup-date">
                    <CalendarDaysIcon className="h-5 w-5 inline mr-2" />
                    Pickup Date *
                  </label>
                  <input
                    id="pickup-date"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    onBlur={() => validatePickupDate(pickupDate)}
                    min={minPickupDate}
                    max={maxPickupDate}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium focus:ring-4 ${dateError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
                    aria-invalid={Boolean(dateError)}
                    aria-describedby={dateError ? 'pickup-date-error' : undefined}
                    required
                  />
                  {dateError && (
                    <p className="mt-2 text-sm text-red-600" id="pickup-date-error">
                      {dateError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    <ClockIcon className="h-5 w-5 inline mr-2" />
                    Pickup Time *
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 font-medium"
                    required
                  >
                    <option value="">Select time slot...</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Pickup Address *
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 font-medium"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 font-medium"
                      required
                    />
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 font-medium"
                      required
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 font-medium"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Special Instructions (optional)"
                    value={address.instructions}
                    onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 font-medium"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Contact Information *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-900 font-medium"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={contactInfo.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={() => validatePhone(contactInfo.phone)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium focus:ring-4 ${phoneError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={phoneError ? 'contact-phone-error' : undefined}
                    required
                  />
                  {phoneError && (
                    <p className="text-sm text-red-600" id="contact-phone-error">
                      {phoneError}
                    </p>
                  )}
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={contactInfo.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => validateEmail(contactInfo.email)}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 text-gray-900 font-medium focus:ring-4 ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'contact-email-error' : undefined}
                    required
                  />
                  {emailError && (
                    <p className="text-sm text-red-600" id="contact-email-error">
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              {getTotalItems() > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 font-medium">Total Items:</span>
                    <span className="text-gray-900 font-bold">{getTotalItems()} items</span>
                  </div>
                  <div className="border-t-2 border-purple-300 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                      <span className="text-3xl font-extrabold text-purple-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={getTotalItems() === 0}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
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
              {/* Selected Items */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium block mb-2">Selected Items:</span>
                <div className="space-y-1">
                  {Object.entries(selectedItems).map(([itemName, quantity]) => {
                    let itemPrice = 0;
                    Object.values(stainRemovalPricing).forEach(category => {
                      const item = category.find(i => i.name === itemName);
                      if (item) itemPrice = item.price;
                    });
                    return (
                      <div key={itemName} className="flex justify-between text-sm">
                        <span className="text-gray-700">{itemName} x {quantity}</span>
                        <span className="text-gray-900 font-bold">₹{itemPrice * quantity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Pickup Date:</span>
                <span className="text-gray-900 font-bold">{new Date(pickupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Pickup Time:</span>
                <span className="text-gray-900 font-bold">{pickupTime}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Address:</span>
                <span className="text-gray-900 font-bold text-right">
                  {address.street}, {address.city}, {address.state} {address.zipCode}
                </span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Contact:</span>
                <span className="text-gray-900 font-bold">{contactInfo.name}</span>
              </div>
              <div className="flex justify-between p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-300">
                <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                <span className="text-3xl font-extrabold text-purple-600">₹{calculateTotal()}</span>
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

export default DashboardStainRemoval;