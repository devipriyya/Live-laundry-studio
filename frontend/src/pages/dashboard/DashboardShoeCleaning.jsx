import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api'; // Add this import for API calls
import { 
  SparklesIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
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
  // Add address state
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: ''
  });
  // Add contact state
  const [contact, setContact] = useState({
    name: user?.name || user?.displayName || '',
    phone: user?.phone || user?.phoneNumber || '',
    email: user?.email || ''
  });
  // Add recurring and notes state
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [notes, setNotes] = useState('');
  // Add errors state
  const [errors, setErrors] = useState({});

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

  const states = [
    { value: '', label: 'Select State' },
    { value: 'AH', label: 'Ahmedabad' },
    { value: 'BL', label: 'Bangalore' },
    { value: 'CH', label: 'Chennai' },
    { value: 'DL', label: 'Delhi' },
    { value: 'HY', label: 'Hyderabad' },
    { value: 'JA', label: 'Jaipur' },
    { value: 'KO', label: 'Kolkata' },
    { value: 'KE', label: 'Kerala' },
    { value: 'LU', label: 'Lucknow' },
    { value: 'MU', label: 'Mumbai' },
    { value: 'PU', label: 'Pune' }
  ];

  const timeSlots = [
    { value: '8:00 AM', available: true, popular: false },
    { value: '9:00 AM', available: true, popular: true },
    { value: '10:00 AM', available: true, popular: true },
    { value: '11:00 AM', available: false, popular: false },
    { value: '12:00 PM', available: true, popular: false },
    { value: '1:00 PM', available: true, popular: true },
    { value: '2:00 PM', available: true, popular: true },
    { value: '3:00 PM', available: true, popular: false },
    { value: '4:00 PM', available: false, popular: false },
    { value: '5:00 PM', available: true, popular: false },
    { value: '6:00 PM', available: true, popular: false },
  ];

  // Calculate total price
  const calculateTotal = () => {
    if (!shoeType || !serviceType) return 0;
    const basePrice = shoePricing[shoeType][serviceType];
    return basePrice * numberOfPairs;
  };

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required';
    // Remove any non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }
    // Check if it starts with a valid Indian mobile prefix (6, 7, 8, or 9)
    if (!/^[6-9]/.test(digitsOnly)) {
      return 'Phone number must start with 6, 7, 8, or 9';
    }
    return '';
  };

  // Validate email
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Handle input changes with validation
  const handleInputChange = (section, field, value) => {
    // Special handling for phone number formatting
    if (section === 'contact' && field === 'phone') {
      // Remove all non-digit characters
      let digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      digitsOnly = digitsOnly.slice(0, 10);
      value = digitsOnly;
    }
    
    if (section === 'address') {
      setAddress(prev => ({ ...prev, [field]: value }));
    } else if (section === 'contact') {
      setContact(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear errors when typing
    if (errors[field] || errors[`${section}.${field}`]) {
      setErrors(prev => ({ 
        ...prev, 
        [field]: '', 
        [`${section}.${field}`]: '' 
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Shoe type validation
    if (!shoeType) {
      newErrors.shoeType = 'Please select a shoe type';
    }
    
    // Service type validation
    if (!serviceType) {
      newErrors.serviceType = 'Please select a service type';
    }
    
    // Pickup date validation
    if (!pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    }
    
    // Pickup time validation
    if (!pickupTime) {
      newErrors.pickupTime = 'Pickup time is required';
    }
    
    // Address validation
    if (!address.street.trim()) {
      newErrors.street = 'Street address is required';
    } else if (address.street.trim().length < 5) {
      newErrors.street = 'Street address must be at least 5 characters';
    }
    
    if (!address.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(address.city.trim())) {
      newErrors.city = 'City must contain letters and spaces only';
    }
    
    if (!address.state || address.state === '') {
      newErrors.state = 'State is required';
    }
    
    if (!address.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(address.zipCode.trim())) {
      newErrors.zipCode = 'ZIP code must be exactly 6 digits';
    }
    
    // Contact validation
    if (!contact.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(contact.name.trim())) {
      newErrors.name = 'Name must contain letters and spaces only';
    }
    
    const phoneError = validatePhoneNumber(contact.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }
    
    const emailError = validateEmail(contact.email);
    if (emailError) {
      newErrors.email = emailError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSummary(true);
    }
  };

  // Initialize Razorpay payment
  const handlePayment = async () => {
    // Check if user is authenticated
    if (!user || !user.email) {
      alert('Please log in to place an order. You will be redirected to the login page.');
      navigate('/login');
      return;
    }

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
        amount: amount * 100,
        currency: 'INR',
        name: 'Fabricspa',
        description: 'Professional Shoe Cleaning & Polishing Service',
        image: '/logo.png',
        handler: function (response) {
          console.log('Payment Successful! Payment ID:', response.razorpay_payment_id);
          console.log('Booking Details:', {
            user: user?.email,
            shoeType,
            serviceType,
            numberOfPairs,
            pickupDate,
            pickupTime,
            address,
            contact: contact,
            amount,
            paymentId: response.razorpay_payment_id
          });
          
          // Prepare cart items for order success page
          const serviceLabel = serviceTypes.find(s => s.value === serviceType)?.label || serviceType;
          const cartItems = [{
            id: shoeType,
            name: `${shoeType} Shoes`,
            icon: '👟', // Default icon for shoes
            serviceType: serviceLabel,
            quantity: numberOfPairs,
            price: amount / numberOfPairs
          }];
          
          // Navigate to order success page with order details
          navigate('/order-success', {
            state: {
              orderData: {
                orderNumber: `SHOE-${Date.now()}`,
                pickupDate,
                pickupTime,
                address,
                status: 'order-placed'
              },
              cartItems: cartItems,
              totalPrice: amount,
              message: 'Payment successful! Your shoe cleaning order is being processed.'
            }
          });
          
          // Create order in backend after successful navigation
          createOrder(response.razorpay_payment_id);
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
          }
        },
        prefill: {
          name: contact.name || user?.name || user?.displayName || '',
          email: contact.email || user?.email || '',
          contact: contact.phone || user?.phone || user?.phoneNumber || ''
        },
        config: {
          display: {
            language: 'en',
            hide: [
              {
                method: 'paylater'
              }
            ],
            preferences: {
              show_default_blocks: true
            }
          }
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

  // Create order in the backend after successful payment with improved auth handling
  const createOrder = async (paymentId) => {
    try {
      console.log('Creating order for user:', user);
      console.log('User email:', user?.email);
      console.log('User name:', user?.name);
      console.log('User phone:', user?.phone);

      // Validate user data
      if (!user?.email) {
        throw new Error('User email is required to create order. Please ensure you are logged in.');
      }

      const amount = calculateTotal();
      const serviceLabel = serviceTypes.find(s => s.value === serviceType)?.label || serviceType;

      // Prepare order data
      const orderData = {
        orderNumber: `SHOE-${Date.now()}`,
        customerInfo: {
          name: contact.name || user?.name || user?.displayName || 'Customer',
          email: contact.email || user?.email,
          phone: contact.phone || user?.phone || user?.phoneNumber || '',
          address: address // Include the address
        },
        items: [{
          name: `${shoeType} Shoes`,
          quantity: numberOfPairs,
          price: amount,
          service: 'shoe-care' // Use the correct service identifier for filtering
        }],
        totalAmount: amount,
        totalItems: numberOfPairs,
        pickupDate: pickupDate,
        timeSlot: pickupTime,
        specialInstructions: notes,
        recurring: recurring,
        frequency: recurring ? frequency : undefined,
        status: 'order-placed',
        paymentStatus: 'paid',
        paymentId: paymentId,
        paymentMethod: 'razorpay'
      };

      // Enhanced token handling - ensure we have a valid token before proceeding
      let token = localStorage.getItem('token');
      console.log('Token status before order creation:', token ? 'Present' : 'Missing');
      
      // If no token, try to refresh authentication for privileged users only
      if (!token) {
        console.log('No token found, checking user role');
        // Try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          console.log('Stored user:', user);
          // Only try to refresh token for admin or delivery users
          if (user.role === 'admin' || user.role === 'deliveryBoy') {
            console.log('Attempting to refresh token for privileged user');
            try {
              // Try to refresh by making a simple authenticated request
              const profileResponse = await api.get('/auth/profile');
              console.log('Profile request successful, token should be refreshed');
              // Get the new token
              token = localStorage.getItem('token');
            } catch (refreshError) {
              console.log('Token refresh failed:', refreshError.message);
            }
          }
          // For regular customers, we'll proceed without a token as they use Firebase auth
          else if (user.role === 'customer') {
            console.log('Regular customer, proceeding without JWT token');
          }
        }
      }

      // For customer users, we don't require a token as they use Firebase auth
      // Only redirect to login for privileged users without tokens
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Only require token for admin/delivery users
        if ((user.role === 'admin' || user.role === 'deliveryBoy') && !token) {
          console.log('Privileged user without token, redirecting to login');
          alert('Session expired. Please log in again to complete your order.');
          // Use replace to avoid navigation history issues
          navigate('/login', { replace: true });
          return;
        }
      }

      // Send order to backend with better error handling
      const response = await api.post('/orders', orderData);
      
      if (response.data) {
        console.log('Order created successfully:', response.data);
        // Dispatch event to refresh orders in other components
        window.dispatchEvent(new CustomEvent('orderPlaced'));
        // Store user email for MyOrders page
        if (contact.email || user?.email) {
          localStorage.setItem('userEmail', contact.email || user?.email);
        }
        // Reset form
        resetForm();
        // Navigate to My Orders page with success message
        alert('Order placed successfully! Redirecting to My Orders page.');
        // Use replace to avoid navigation history issues
        navigate('/my-orders', { replace: true });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      
      // Handle authorization errors specifically
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Order creation failed: Not authorized. Please try logging in again and then place your order.');
        // Use replace to avoid navigation history issues
        navigate('/login', { replace: true });
        return;
      }
      
      // Handle network errors
      if (!error.response) {
        alert('Network error: Unable to connect to server. Please check your internet connection and try again.');
        // Stay on current page to allow retry
        return;
      }
      
      alert('Order was paid but there was an issue saving your order. Please contact support with your payment ID: ' + paymentId);
      // Navigate to My Orders page anyway so user can see if order was created
      // Use replace to avoid navigation history issues
      navigate('/my-orders', { replace: true });
    }
  };

  const resetForm = () => {
    setShoeType('');
    setNumberOfPairs(1);
    setServiceType('');
    setPickupDate('');
    setPickupTime('');
    setAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: ''
    });
    setContact({
      name: user?.name || user?.displayName || '',
      phone: user?.phone || user?.phoneNumber || '',
      email: user?.email || ''
    });
    setRecurring(false);
    setFrequency('weekly');
    setNotes('');
    setShowSummary(false);
    setErrors({});
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
                  onChange={(e) => {
                    setShoeType(e.target.value);
                    if (errors.shoeType) setErrors(prev => ({ ...prev, shoeType: '' }));
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 transition-all duration-300 text-gray-900 font-medium
                    ${errors.shoeType 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-100'
                    }`}
                >
                  <option value="">Choose shoe type...</option>
                  {shoeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.shoeType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.shoeType}
                  </p>
                )}
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
                      onClick={() => {
                        setServiceType(service.value);
                        if (errors.serviceType) setErrors(prev => ({ ...prev, serviceType: '' }));
                      }}
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
                {errors.serviceType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    {errors.serviceType}
                  </p>
                )}
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

              {/* Pickup Schedule */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5 text-yellow-600" />
                  Pickup Schedule
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => {
                        setPickupDate(e.target.value);
                        if (errors.pickupDate) setErrors(prev => ({ ...prev, pickupDate: '' }));
                      }}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all font-medium
                        ${errors.pickupDate 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-yellow-200 focus:border-yellow-500 focus:ring-yellow-200'
                        } focus:ring-4 bg-white text-gray-900`}
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        {errors.pickupDate}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Pickup Time *
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.value}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => {
                            setPickupTime(slot.value);
                            if (errors.pickupTime) setErrors(prev => ({ ...prev, pickupTime: '' }));
                          }}
                          className={`
                            p-2.5 rounded-lg text-sm font-semibold transition-all relative
                            ${pickupTime === slot.value
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md border-2 border-yellow-400'
                              : slot.available
                                ? 'bg-white border-2 border-yellow-200 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                            }
                          `}
                        >
                          {slot.value}
                          {slot.popular && slot.available && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.pickupTime && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        {errors.pickupTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pickup Address Section */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-yellow-600" />
                  Pickup Address
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                      placeholder="123 Main Street, Apt 4B"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                        ${errors.street 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-200'
                        } focus:ring-4 bg-white text-gray-900 placeholder-gray-400`}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1 font-medium flex items-center gap-1">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        {errors.street}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        placeholder="City"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                          ${errors.city 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-200'
                          } focus:ring-4 bg-white text-gray-900 placeholder-gray-400`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) => {
                          handleInputChange('address', 'state', e.target.value);
                          if (errors.state && e.target.value !== '') setErrors(prev => ({ ...prev, state: '' }));
                        }}
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                          ${errors.state 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-200'
                          } focus:ring-4 bg-white text-gray-900`}
                      >
                        {states.map(state => (
                          <option key={state.value} value={state.value}>{state.label}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          {errors.state}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('address', 'zipCode', value);
                      }}
                      placeholder="123456"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                        ${errors.zipCode 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-200'
                        } focus:ring-4 bg-white text-gray-900 placeholder-gray-400`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      value={address.instructions}
                      onChange={(e) => handleInputChange('address', 'instructions', e.target.value)}
                      placeholder="Gate code, buzzer number, parking instructions..."
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-yellow-600" />
                  Contact Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleInputChange('contact', 'name', e.target.value)}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                        ${errors.name 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-200'
                        } focus:ring-4 bg-white text-gray-900 placeholder-gray-400`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                        placeholder="9876543210"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                          ${errors.phone 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-200'
                          } focus:ring-4 bg-white text-gray-900 placeholder-gray-400`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          {errors.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium
                          ${errors.email 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200 focus:border-yellow-500 focus:ring-yellow-200'
                          } focus:ring-4 bg-white text-gray-900 placeholder-gray-400`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recurring Service Option */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    className="mt-1 h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Make this a recurring service</p>
                    <p className="text-sm text-gray-600">Schedule regular pickups and deliveries</p>
                  </div>
                </label>
                
                {recurring && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-900"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <InformationCircleIcon className="h-5 w-5 text-yellow-600" />
                  Additional Notes
                </h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or information we should know..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 transition-all duration-200 bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
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
              <div className="flex justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Recurring Service:</span>
                <span className="text-gray-900 font-bold">{recurring ? `Yes (${frequency})` : 'No'}</span>
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