import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import { 
  SparklesIcon, 
  CalendarDaysIcon, 
  ClockIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ShoppingBagIcon
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

const DashboardSteamIroning = () => {
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

  // Pricing structure for steam ironing items
  const steamIroningPricing = {
    'Basic Garments': [
      { name: 'Shirt (Cotton)', price: 50 },
      { name: 'T-Shirt', price: 40 },
      { name: 'Pants / Jeans', price: 60 },
      { name: 'Kurta (Cotton)', price: 55 },
      { name: 'Salwar / Leggings', price: 45 },
      { name: 'Dupatta / Scarf', price: 30 }
    ],
    'Formal / Outerwear': [
      { name: 'Suit (2-piece)', price: 200 },
      { name: 'Blazer / Coat', price: 150 },
      { name: 'Sweater', price: 80 },
      { name: 'Jacket', price: 100 },
      { name: 'Tie', price: 30 }
    ],
    'Ethnic Wear': [
      { name: 'Saree (Cotton)', price: 80 },
      { name: 'Saree (Silk)', price: 120 },
      { name: 'Lehenga / Gown', price: 250 },
      { name: 'Designer Kurta', price: 80 }
    ],
    'Household Items': [
      { name: 'Bedsheet (Single)', price: 100 },
      { name: 'Bedsheet (Double)', price: 150 },
      { name: 'Blanket / Quilt', price: 200 },
      { name: 'Towel (Bath)', price: 50 }
    ]
  };

  const timeSlots = [
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM'
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
      Object.values(steamIroningPricing).forEach(category => {
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
    
    // Check if user is authenticated and has required contact info
    if (!user || !user.email) {
      alert('Please log in to place an order.');
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
    // Check if user is authenticated
    if (!user || !user.email) {
      alert('Please log in to place an order. You will be redirected to the login page.');
      navigate('/login');
      return;
    }

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
        description: 'Professional Steam Ironing Service',
        image: '/logo.png',
        handler: function (response) {
          console.log('Payment Successful! Payment ID:', response.razorpay_payment_id);
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
          
          // Prepare cart items for order success page
          const cartItems = [];
          Object.entries(selectedItems).forEach(([itemName, quantity]) => {
            Object.values(steamIroningPricing).forEach(category => {
              const item = category.find(i => i.name === itemName);
              if (item) {
                cartItems.push({
                  id: itemName,
                  name: itemName,
                  icon: '熨', // Default icon for steam ironing
                  serviceType: 'Steam Ironing',
                  quantity: quantity,
                  price: item.price
                });
              }
            });
          });
          
          // Navigate to order success page with order details
          navigate('/order-success', {
            state: {
              orderData: {
                orderNumber: `ORD-${Date.now()}`,
                pickupDate,
                pickupTime,
                address,
                status: 'order-placed'
              },
              cartItems: cartItems,
              totalPrice: amount,
              message: 'Payment successful! Your steam ironing order is being processed.'
            }
          });
          
          // Create order in backend after successful navigation
          createOrderAfterPayment(response.razorpay_payment_id, amount);
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

  // Create order in backend after successful payment with improved auth handling
  const createOrderAfterPayment = async (paymentId, amount) => {
    try {
      // Prepare items array for the order
      const items = [];
      Object.entries(selectedItems).forEach(([itemName, quantity]) => {
        Object.values(steamIroningPricing).forEach(category => {
          const item = category.find(i => i.name === itemName);
          if (item) {
            items.push({
              name: itemName,
              quantity: quantity,
              price: item.price,
              service: 'steam-ironing'
            });
          }
        });
      });

      // Validate that we have items
      if (items.length === 0) {
        throw new Error('No items selected for the order');
      }

      // Prepare order data
      const orderData = {
        items: items,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        pickupAddress: address,
        contactInfo: contactInfo,
        totalAmount: amount
      };

      console.log('Creating order with data:', orderData);

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
      const response = await api.post('/orders/dry-cleaning-clothes', orderData);
      
      if (response.data) {
        console.log('Order created successfully:', response.data);
        // Dispatch event to refresh orders in other components
        window.dispatchEvent(new CustomEvent('orderPlaced'));
        // Store user email for MyOrders page
        if (contactInfo.email) {
          localStorage.setItem('userEmail', contactInfo.email);
        }
        // Reset form
        resetForm();
        // Navigate to My Orders page with success message
        alert('Order placed successfully! Redirecting to My Orders page.');
        // Use replace to avoid navigation history issues
        navigate('/my-orders', { replace: true });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
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
      
      let errorMessage = 'Order was paid but there was an issue saving your order. Please contact support with your payment ID: ' + paymentId;
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `Order creation failed: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `Order creation failed: ${error.message}`;
      }
      
      alert(errorMessage);
      // Navigate to My Orders page anyway so user can see if order was created
      // Use replace to avoid navigation history issues
      navigate('/my-orders', { replace: true });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-6">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <SparklesIcon className="h-16 w-16 text-white" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                Steam Ironing Service
              </h1>
              <p className="text-white/90 text-lg">
                Professional steam ironing for crisp, wrinkle-free clothes
              </p>
              
              {/* Stats Pills */}
              <div className="flex gap-3 mt-4">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <span className="text-white/90 text-sm font-medium">
                    {getTotalItems()} items selected
                  </span>
                </div>
                {getTotalItems() > 0 && (
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <span className="text-white font-semibold text-sm">
                      ₹{calculateTotal()} total
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {!showSummary ? (
          /* Booking Form */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Item Selection */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Select Items for Steam Ironing</h2>
                </div>
                
                <div className="space-y-8">
                  {Object.entries(steamIroningPricing).map(([category, items]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => {
                          const isSelected = selectedItems[item.name] > 0;
                          return (
                            <div
                              key={item.name}
                              className={`group relative bg-white rounded-xl p-4 border-2 transition-all duration-200 hover:shadow-md ${
                                isSelected 
                                  ? 'border-indigo-500 shadow-sm' 
                                  : 'border-gray-200 hover:border-indigo-300'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  Selected
                                </div>
                              )}
                              
                              <div className="mb-3">
                                <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                                <div className="flex items-center gap-1">
                                  <CurrencyRupeeIcon className="h-5 w-5 text-indigo-600" />
                                  <span className="text-xl font-bold text-indigo-600">{item.price}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 font-medium">Quantity</span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateItemQuantity(item.name, -1)}
                                    disabled={!selectedItems[item.name]}
                                    className="p-1.5 bg-gray-100 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <MinusIcon className="h-4 w-4 text-gray-700" />
                                  </button>
                                  <span className="w-8 text-center font-bold text-gray-900">
                                    {selectedItems[item.name] || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateItemQuantity(item.name, 1)}
                                    className="p-1.5 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
                                  >
                                    <PlusIcon className="h-4 w-4 text-indigo-700" />
                                  </button>
                                </div>
                              </div>
                              
                              {isSelected && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Subtotal</span>
                                    <span className="text-sm font-bold text-indigo-600">
                                      ₹{item.price * selectedItems[item.name]}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Pickup Schedule</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Date
                    </label>
                    <input
                      id="pickup-date"
                      type="date"
                      value={pickupDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      onBlur={() => validatePickupDate(pickupDate)}
                      min={minPickupDate}
                      max={maxPickupDate}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-gray-900 font-medium focus:ring-2 focus:ring-offset-2 ${
                        dateError 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                      aria-invalid={Boolean(dateError)}
                      aria-describedby={dateError ? 'pickup-date-error' : undefined}
                      required
                    />
                    {dateError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1" id="pickup-date-error">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {dateError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-gray-900 font-medium"
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
              </div>

              {/* Address Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Pickup Address</h2>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                      required
                    />
                    <select
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-gray-900 font-medium"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Special Instructions (optional)"
                    value={address.instructions}
                    onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-gray-900 font-medium placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    required
                  />
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={contactInfo.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={() => validatePhone(contactInfo.phone)}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-offset-2 ${
                        phoneError 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                      aria-invalid={Boolean(phoneError)}
                      aria-describedby={phoneError ? 'contact-phone-error' : undefined}
                      required
                    />
                    {phoneError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1" id="contact-phone-error">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {phoneError}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={contactInfo.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => validateEmail(contactInfo.email)}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all text-gray-900 font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-offset-2 ${
                        emailError 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={emailError ? 'contact-email-error' : undefined}
                      required
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1" id="contact-email-error">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
                        {emailError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {getTotalItems() > 0 && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 font-medium">Total Items</span>
                    <span className="text-gray-900 font-bold text-lg">{getTotalItems()}</span>
                  </div>
                  <div className="border-t-2 border-indigo-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Amount</span>
                      <div className="flex items-center gap-1">
                        <CurrencyRupeeIcon className="h-7 w-7 text-indigo-600" />
                        <span className="text-3xl font-bold text-indigo-600">{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={getTotalItems() === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="h-6 w-6" />
                <span>Proceed to Payment</span>
              </button>
            </form>
          </div>
        ) : (
          /* Booking Summary Modal */
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-green-100 rounded-full">
                      <CheckCircleIcon className="h-16 w-16 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Summary</h2>
                  <p className="text-gray-600">Review your details before payment</p>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Selected Items */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ShoppingBagIcon className="h-5 w-5 text-indigo-600" />
                      Selected Items
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(selectedItems).map(([itemName, quantity]) => {
                        let itemPrice = 0;
                        Object.values(steamIroningPricing).forEach(category => {
                          const item = category.find(i => i.name === itemName);
                          if (item) itemPrice = item.price;
                        });
                        return (
                          <div key={itemName} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                            <div>
                              <span className="text-gray-900 font-medium">{itemName}</span>
                              <span className="text-gray-500 text-sm ml-2">× {quantity}</span>
                            </div>
                            <span className="text-gray-900 font-bold">₹{itemPrice * quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pickup Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDaysIcon className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-600">Pickup Date</span>
                      </div>
                      <p className="text-gray-900 font-bold">{new Date(pickupDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ClockIcon className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-medium text-gray-600">Pickup Time</span>
                      </div>
                      <p className="text-gray-900 font-bold">{pickupTime}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Pickup Address</span>
                    </div>
                    <p className="text-gray-900 font-bold">
                      {address.street}, {address.city}, {address.state} {address.zipCode}
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Contact Person</span>
                    </div>
                    <p className="text-gray-900 font-bold">{contactInfo.name}</p>
                    <p className="text-gray-600 text-sm mt-1">{contactInfo.phone} • {contactInfo.email}</p>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">Total Amount</span>
                      <div className="flex items-center gap-1">
                        <CurrencyRupeeIcon className="h-8 w-8 text-indigo-600" />
                        <span className="text-4xl font-bold text-indigo-600">{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSummary(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-200"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <CurrencyRupeeIcon className="h-5 w-5" />
                    Pay with Razorpay
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSteamIroning;
