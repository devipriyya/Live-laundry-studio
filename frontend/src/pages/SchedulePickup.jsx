import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import {
  CalendarDaysIcon,
  ClockIcon,
  TruckIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const SchedulePickup = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get order data from navigation state or default
  const orderServices = location.state?.orderData?.services || [];
  
  const [scheduleData, setScheduleData] = useState({
    pickupDate: '',
    pickupTime: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: ''
    },
    contact: {
      name: user?.displayName || user?.name || '',
      phone: '',
      email: user?.email || '',
    },
    recurring: false,
    frequency: 'weekly',
    notes: ''
  });

  const [selectedClothes, setSelectedClothes] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);

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

  const clothingData = {
    'Basic Garments': [
      { name: 'Shirt (Cotton)', price: 25 },
      { name: 'T-Shirt', price: 20 },
      { name: 'Pants / Jeans', price: 30 },
      { name: 'Kurta (Cotton)', price: 35 },
      { name: 'Salwar / Leggings', price: 25 },
      { name: 'Dupatta / Scarf', price: 15 },
      { name: 'Shorts', price: 20 },
      { name: 'Skirt', price: 25 },
      { name: 'Blouse', price: 20 }
    ],
    'Formal / Outerwear': [
      { name: 'Suit (2-piece)', price: 120 },
      { name: 'Blazer / Coat', price: 80 },
      { name: 'Sweater', price: 50 },
      { name: 'Jacket', price: 70 },
      { name: 'Tie', price: 15 }
    ],
    'Ethnic & Delicate Wear': [
      { name: 'Saree (Cotton)', price: 60 },
      { name: 'Saree (Silk / Designer)', price: 120 },
      { name: 'Lehenga / Gown', price: 150 },
      { name: 'Dupatta (Heavy / Embroidered)', price: 40 },
      { name: 'Kurta (Designer)', price: 60 }
    ],
    'Household Items': [
      { name: 'Bedsheet (Single)', price: 40 },
      { name: 'Bedsheet (Double)', price: 60 },
      { name: 'Pillow Cover', price: 15 },
      { name: 'Blanket / Quilt', price: 100 },
      { name: 'Towel (Bath)', price: 25 },
      { name: 'Curtain (Medium Size)', price: 70 }
    ]
  };

  // Auto-fill address from user profile or localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      setScheduleData(prev => ({
        ...prev,
        address: { ...prev.address, ...JSON.parse(savedAddress) }
      }));
    }
  }, []);

  // Calculate total price whenever selectedClothes changes
  useEffect(() => {
    let total = 0;
    Object.entries(selectedClothes).forEach(([itemName, quantity]) => {
      if (quantity > 0) {
        // Find the item in clothingData to get its price
        Object.values(clothingData).forEach(category => {
          const item = category.find(cloth => cloth.name === itemName);
          if (item) {
            total += item.price * quantity;
          }
        });
      }
    });
    setTotalPrice(total);
  }, [selectedClothes]);

  // Add helper functions for date validation
  const getTodayDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Add function to get max date (3 months from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Add enhanced validation functions
  const validatePickupDate = (dateString) => {
    if (!dateString) return 'Pickup date is required';
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Set selected date time to 0 for accurate comparison
    selectedDate.setHours(0, 0, 0, 0);
    
    // Check if date is in the past
    if (selectedDate < today) {
      return 'Pickup date cannot be in the past';
    }
    
    // Check if date exceeds 3 months from today
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    maxDate.setHours(0, 0, 0, 0);
    if (selectedDate > maxDate) {
      return 'Pickup date cannot be more than 3 months from today';
    }
    
    return '';
  };

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

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Real-time form validation
  useEffect(() => {
    console.log('Schedule data changed:', scheduleData);
    // Only validate if the user has started filling the form
    if (
      scheduleData.pickupDate ||
      scheduleData.pickupTime ||
      scheduleData.address.street ||
      scheduleData.address.city ||
      scheduleData.address.state ||
      scheduleData.address.zipCode ||
      scheduleData.contact.name ||
      scheduleData.contact.phone ||
      scheduleData.contact.email
    ) {
      console.log('Validating form...');
      validateForm();
    }
  }, [scheduleData]);

  const handleInputChange = (section, field, value) => {
    console.log(`Input changed: section=${section}, field=${field}, value=${value}`);
    
    // Special handling for phone number formatting
    if (section === 'contact' && field === 'phone') {
      // Remove all non-digit characters
      let digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      digitsOnly = digitsOnly.slice(0, 10);
      value = digitsOnly;
    }
    
    setScheduleData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear errors when typing
    if (errors[field] || errors[`${section}.${field}`]) {
      setErrors(prev => ({ 
        ...prev, 
        [field]: '', 
        [`${section}.${field}`]: '' 
      }));
    }
    
    // Real-time validation for specific fields
    if (section === 'address') {
      switch (field) {
        case 'street':
          if (value.trim().length > 0 && value.trim().length < 5) {
            setErrors(prev => ({ 
              ...prev, 
              street: 'Street address must be at least 5 characters' 
            }));
          }
          break;
        case 'city':
          if (value.trim().length > 0 && !/^[a-zA-Z\s]+$/.test(value.trim())) {
            setErrors(prev => ({ 
              ...prev, 
              city: 'City must contain letters and spaces only' 
            }));
          }
          break;
        case 'zipCode':
          if (value.trim().length > 0 && !/^\d{6}$/.test(value.trim())) {
            setErrors(prev => ({ 
              ...prev, 
              zipCode: 'ZIP code must be exactly 6 digits' 
            }));
          }
          break;
      }
    } else if (section === 'contact') {
      switch (field) {
        case 'name':
          if (value.trim().length > 0 && !/^[a-zA-Z\s]+$/.test(value.trim())) {
            setErrors(prev => ({ 
              ...prev, 
              name: 'Name must contain letters and spaces only' 
            }));
          }
          break;
        case 'phone':
          // Enhanced phone validation
          const phoneError = validatePhoneNumber(value);
          if (phoneError) {
            setErrors(prev => ({ ...prev, phone: phoneError }));
          } else {
            setErrors(prev => ({ ...prev, phone: '' }));
          }
          break;
        case 'email':
          // Enhanced email validation
          const emailError = validateEmail(value);
          if (emailError) {
            setErrors(prev => ({ ...prev, email: emailError }));
          } else {
            setErrors(prev => ({ ...prev, email: '' }));
          }
          break;
      }
    }
  };

  const updateClothQuantity = (itemName, change) => {
    setSelectedClothes(prev => {
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

  const validateForm = () => {
    const newErrors = {};
    
    // Get today's date for future date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Enhanced Pickup Date validation
    const dateError = validatePickupDate(scheduleData.pickupDate);
    if (dateError) {
      newErrors.pickupDate = dateError;
    }

    // Pickup Time validation: required
    if (!scheduleData.pickupTime) {
      newErrors.pickupTime = 'Pickup time is required';
    }

    // Address validation
    // Street Address: required, min 5 chars
    if (!scheduleData.address.street.trim()) {
      newErrors.street = 'Street address is required';
    } else if (scheduleData.address.street.trim().length < 5) {
      newErrors.street = 'Street address must be at least 5 characters';
    }

    // City: required, letters only
    if (!scheduleData.address.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!/^[a-zA-Z\s]+$/.test(scheduleData.address.city.trim())) {
      newErrors.city = 'City must contain letters and spaces only';
    }

    // State: required (not "Select State")
    if (!scheduleData.address.state || scheduleData.address.state === '') {
      newErrors.state = 'State is required';
    }

    // ZIP Code: required, exactly 6 digits
    if (!scheduleData.address.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(scheduleData.address.zipCode.trim())) {
      newErrors.zipCode = 'ZIP code must be exactly 6 digits';
    }

    // Contact validation with enhanced validation
    // Name: required, letters and spaces only
    if (!scheduleData.contact.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(scheduleData.contact.name.trim())) {
      newErrors.name = 'Name must contain letters and spaces only';
    }

    // Phone Number: required, exactly 10 digits, numbers only
    const phoneError = validatePhoneNumber(scheduleData.contact.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    // Email: required, must match valid email format
    const emailError = validateEmail(scheduleData.contact.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Cloth selection validation
    if (Object.keys(selectedClothes).length === 0 || totalPrice === 0) {
      newErrors.clothes = 'Please select at least one item for washing';
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('SchedulePickup: Form submission started');
    console.log('SchedulePickup: Current user:', user);
    console.log('SchedulePickup: Selected clothes:', selectedClothes);
    console.log('SchedulePickup: Total price:', totalPrice);
    
    // Validate form before submission
    const isFormValid = validateForm();
    console.log('Form validation result:', isFormValid);
    console.log('Current errors:', errors);
    
    // Since state updates are async, we need to check errors directly from validation
    // The validateForm function returns true if there are no errors
    if (!isFormValid) {
      console.log('Form is not valid, preventing submission');
      // Scroll to first error after a brief delay to allow state update
      setTimeout(() => {
        const errorKeys = Object.keys(errors);
        if (errorKeys.length > 0) {
          const firstError = errorKeys[0];
          console.log('First error field:', firstError);
          const errorElement = document.querySelector(`[name="${firstError}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            // Try to find the first error element by ID or other means
            const errorElements = document.querySelectorAll('[class*="error"], [class*="red"]');
            if (errorElements.length > 0) {
              errorElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      }, 10);
      return;
    }

    console.log('Form is valid, proceeding with submission');
    setLoading(true);
    try {
      // Process payment first
      const paymentResponse = await processPayment();
      console.log('Payment completed:', paymentResponse);

      // Save address to localStorage for future use
      localStorage.setItem('userAddress', JSON.stringify(scheduleData.address));

      // Create cart items from selected clothes
      const cartItems = Object.entries(selectedClothes).map(([itemName, quantity]) => {
        let itemPrice = 0;
        Object.values(clothingData).forEach(category => {
          const item = category.find(cloth => cloth.name === itemName);
          if (item) {
            itemPrice = item.price;
          }
        });
        return {
          name: itemName,
          quantity: quantity,
          price: itemPrice
        };
      });

      const orderNumber = `ORD-${Date.now()}`;
      
      // Calculate delivery date (3 days from pickup)
      const pickupDateObj = new Date(scheduleData.pickupDate);
      const deliveryDateObj = new Date(pickupDateObj);
      deliveryDateObj.setDate(deliveryDateObj.getDate() + 3);
      
      // Create order data matching backend model structure
      const newOrderData = {
        orderNumber: orderNumber,
        // serviceId is optional - will be set by admin if needed
        customerInfo: {
          name: scheduleData.contact.name,
          email: scheduleData.contact.email,
          phone: scheduleData.contact.phone,
          address: {
            street: scheduleData.address.street,
            city: scheduleData.address.city,
            state: scheduleData.address.state,
            zipCode: scheduleData.address.zipCode,
            instructions: scheduleData.address.instructions
          }
        },
        items: cartItems,
        orderDate: new Date(),
        pickupDate: new Date(scheduleData.pickupDate),
        deliveryDate: deliveryDateObj,
        estimatedDelivery: `${deliveryDateObj.toISOString().split('T')[0]} ${scheduleData.pickupTime}`,
        timeSlot: scheduleData.pickupTime,
        totalAmount: totalPrice,
        totalItems: Object.values(selectedClothes).reduce((sum, quantity) => sum + quantity, 0),
        weight: `${(Object.values(selectedClothes).reduce((sum, quantity) => sum + quantity, 0) * 0.5).toFixed(1)} lbs`,
        status: 'order-placed',
        paymentStatus: 'paid', // Set to 'paid' since payment was successful
        paymentId: paymentResponse.razorpay_payment_id,
        paymentMethod: 'razorpay',
        priority: 'normal',
        specialInstructions: scheduleData.notes,
        recurring: scheduleData.recurring || false,
        frequency: scheduleData.frequency
      };

      // Save order to backend API
      console.log('Sending order data:', newOrderData);
      const response = await api.post('/orders', newOrderData);
      const savedOrder = response.data;
      
      if (!savedOrder) {
        throw new Error('Failed to save order');
      }

      console.log('Order saved successfully:', savedOrder);

      // Dispatch custom event to refresh orders in other components
      window.dispatchEvent(new CustomEvent('orderPlaced', {
        detail: { order: savedOrder }
      }));

      // Navigate to order success page
      navigate('/order-success', {
        state: {
          cartItems: cartItems,
          totalPrice: totalPrice,
          orderData: {
            ...scheduleData,
            services: orderServices,
            orderNumber: savedOrder.orderNumber,
            status: savedOrder.status,
            paymentStatus: savedOrder.paymentStatus,
            orderId: savedOrder._id
          }
        }
      });
    } catch (error) {
      console.error('Schedule submission failed:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.message.includes('Payment cancelled')) {
        setErrors({ submit: 'Payment was cancelled. Please try again.' });
      } else if (error.response?.data?.message) {
        setErrors({ submit: `Failed to process order: ${error.response.data.message}` });
      } else if (error.response?.status === 401) {
        setErrors({ submit: 'Please log in to place an order.' });
      } else if (error.response?.status === 400) {
        setErrors({ submit: 'Invalid order data. Please check your information and try again.' });
      } else {
        setErrors({ submit: 'Failed to process order. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Modern Header */}
      <div className="bg-white border-b-2 border-teal-500 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-lg"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Schedule Pickup</h1>
              <p className="text-sm text-gray-600 mt-1">Easy 3-step booking process</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <span className="text-xs font-medium text-teal-600 mt-2">Select Items</span>
              </div>
              <div className="w-20 h-1 bg-teal-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <span className="text-xs font-medium text-teal-600 mt-2">Schedule</span>
              </div>
              <div className="w-20 h-1 bg-teal-200 mx-2"></div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  3
                </div>
                <span className="text-xs font-medium text-teal-600 mt-2">Confirm</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Modern Cloth Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-teal-100">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Select Your Items</h2>
                  <p className="text-sm text-gray-600">Choose clothes and quantities</p>
                </div>
              </div>
            </div>

            {Object.entries(clothingData).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                  {category}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <div key={item.name} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-4 border-2 border-teal-100 hover:border-teal-300 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-teal-600 font-bold text-lg">₹{item.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-600 font-medium">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateClothQuantity(item.name, -1)}
                            disabled={!selectedClothes[item.name] || selectedClothes[item.name] === 0}
                            className="w-7 h-7 rounded-lg bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors font-bold"
                          >
                            −
                          </button>
                          
                          <span className="w-10 text-center font-bold text-gray-900 text-lg">
                            {selectedClothes[item.name] || 0}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => updateClothQuantity(item.name, 1)}
                            className="w-7 h-7 rounded-lg bg-white border-2 border-teal-300 text-teal-600 hover:bg-teal-50 flex items-center justify-center transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {selectedClothes[item.name] > 0 && (
                        <div className="mt-3 pt-3 border-t-2 border-teal-200">
                          <p className="text-sm font-bold text-teal-700">
                            Subtotal: ₹{(item.price * selectedClothes[item.name]).toFixed(0)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Modern Total Price Display */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-5 shadow-md border-2 border-teal-400">
              <div className="flex justify-between items-center">
                <div className="text-white">
                  <h3 className="text-lg font-bold">Total Amount</h3>
                  <p className="text-teal-50 text-sm">
                    {Object.values(selectedClothes).reduce((sum, quantity) => sum + quantity, 0)} items selected
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white">₹{totalPrice.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {errors.clothes && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{errors.clothes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Modern Pickup Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-teal-100">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Pickup Schedule</h2>
                  <p className="text-sm text-gray-600">When should we collect?</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-teal-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5 text-teal-600" />
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    min={getTodayDate()}
                    max={getMaxDate()}
                    value={scheduleData.pickupDate}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      console.log('Date changed:', selectedDate);
                      setScheduleData(prev => ({ ...prev, pickupDate: selectedDate }));
                      
                      // Clear error when date is selected
                      if (errors.pickupDate) {
                        setErrors(prev => ({ ...prev, pickupDate: '' }));
                      }
                      
                      // Enhanced date validation
                      const dateError = validatePickupDate(selectedDate);
                      console.log('Date validation result:', dateError);
                      if (dateError) {
                        setErrors(prev => ({ ...prev, pickupDate: dateError }));
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all bg-white text-gray-900 font-medium
                    ${errors.pickupDate 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-teal-200 focus:border-teal-500 focus:ring-teal-200'
                    } focus:ring-4`}
                  />
                  {errors.pickupDate && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      {errors.pickupDate}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-teal-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-teal-600" />
                    Pickup Time *
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.value}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => {
                          setScheduleData(prev => ({ ...prev, pickupTime: slot.value }));
                          
                          // Clear error when time is selected
                          if (errors.pickupTime) {
                            setErrors(prev => ({ ...prev, pickupTime: '' }));
                          }
                        }}
                        className={`
                          p-2.5 rounded-lg text-sm font-semibold transition-all relative
                          ${scheduleData.pickupTime === slot.value
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md border-2 border-teal-400'
                            : slot.available
                              ? 'bg-white border-2 border-teal-200 text-gray-700 hover:border-teal-400 hover:bg-teal-50'
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
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      {errors.pickupTime}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modern Address & Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-teal-100">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Address & Contact</h2>
                  <p className="text-sm text-gray-600">Pickup location details</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Address Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded"></div>
                  <h3 className="text-lg font-bold text-gray-800">Pickup Address</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    placeholder="123 Main Street, Apt 4B"
                    value={scheduleData.address.street}
                    onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all font-medium
                      ${errors.street 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                      } focus:ring-4 bg-white text-gray-900 placeholder-gray-400`}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1 font-medium">{errors.street}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={scheduleData.address.city}
                      onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                        ${errors.city 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                        } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      value={scheduleData.address.state}
                      onChange={(e) => {
                        const selectedState = e.target.value;
                        handleInputChange('address', 'state', selectedState);
                        
                        // Clear error when state is selected
                        if (errors.state && selectedState !== '') {
                          setErrors(prev => ({ ...prev, state: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                        ${errors.state 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                        } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                    >
                      {states.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="123456"
                    value={scheduleData.address.zipCode}
                    onChange={(e) => {
                      // Only allow digits
                      const value = e.target.value.replace(/\D/g, '');
                      handleInputChange('address', 'zipCode', value);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${errors.zipCode 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                      } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    placeholder="Gate code, buzzer number, parking instructions..."
                    value={scheduleData.address.instructions}
                    onChange={(e) => handleInputChange('address', 'instructions', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded"></div>
                  <h3 className="text-lg font-bold text-gray-800">Contact Details</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={scheduleData.contact.name}
                    onChange={(e) => handleInputChange('contact', 'name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                      } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={scheduleData.contact.phone}
                    onChange={(e) => {
                      handleInputChange('contact', 'phone', e.target.value);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${errors.phone 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                      } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={scheduleData.contact.email}
                    onChange={(e) => {
                      console.log('Email changed:', e.target.value);
                      handleInputChange('contact', 'email', e.target.value);
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                      } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Recurring Schedule Option */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleData.recurring}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, recurring: e.target.checked }))}
                      className="mt-1 h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Make this a recurring service</p>
                      <p className="text-sm text-gray-600">Schedule regular pickups and deliveries</p>
                    </div>
                  </label>
                  
                  {scheduleData.recurring && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={scheduleData.frequency}
                        onChange={(e) => setScheduleData(prev => ({ ...prev, frequency: e.target.value }))}
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    placeholder="Any special requests or information we should know..."
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Modern Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || totalPrice === 0 || Object.keys(errors).length > 0}
              onClick={() => console.log('Submit button clicked, errors:', errors, 'errors length:', Object.keys(errors).length)}
              className="px-8 py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Pay ₹{totalPrice.toFixed(0)} & Schedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchedulePickup;

