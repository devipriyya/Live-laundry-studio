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
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'OH', label: 'Ohio' },
    { value: 'MI', label: 'Michigan' },
    { value: 'GA', label: 'Georgia' },
    { value: 'NC', label: 'North Carolina' }
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

    // Required fields validation
    if (!scheduleData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
    if (!scheduleData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    
    // Address validation
    if (!scheduleData.address.street.trim()) newErrors.street = 'Street address is required';
    if (!scheduleData.address.city.trim()) newErrors.city = 'City is required';
    if (!scheduleData.address.state) newErrors.state = 'State is required';
    if (!scheduleData.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Contact validation
    if (!scheduleData.contact.name.trim()) newErrors.name = 'Name is required';
    if (!scheduleData.contact.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!scheduleData.contact.email.trim()) newErrors.email = 'Email is required';
    
    // Cloth selection validation
    if (Object.keys(selectedClothes).length === 0 || totalPrice === 0) {
      newErrors.clothes = 'Please select at least one item for washing';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (section, field, value) => {
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
  };

  const processPayment = () => {
    return new Promise((resolve, reject) => {
      // Create Razorpay options
      const options = {
        key: 'rzp_test_RIlW2V6HMBx49X', // Replace with your Razorpay key
        amount: totalPrice * 100, // Amount in paise
        currency: 'INR',
        name: 'Fabrico Laundry',
        description: 'Laundry Service Payment',
        image: '/logo.png',
        handler: function (response) {
          console.log('Payment successful:', response);
          resolve(response);
        },
        prefill: {
          name: scheduleData.contact.name,
          email: scheduleData.contact.email,
          contact: scheduleData.contact.phone
        },
        notes: {
          address: `${scheduleData.address.street}, ${scheduleData.address.city}`
        },
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay !== 'undefined') {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback: simulate payment success for demo
        console.log('Razorpay not loaded, simulating payment success');
        setTimeout(() => {
          resolve({
            razorpay_payment_id: 'pay_demo_' + Date.now(),
            razorpay_order_id: 'order_demo_' + Date.now(),
            razorpay_signature: 'demo_signature'
          });
        }, 2000);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('SchedulePickup: Form submission started');
    console.log('SchedulePickup: Current user:', user);
    console.log('SchedulePickup: Selected clothes:', selectedClothes);
    console.log('SchedulePickup: Total price:', totalPrice);
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstError}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

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

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white text-gray-900 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Pickup</h1>
            <div className="w-16"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Cloth Selection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Your Items</h2>
              <p className="text-gray-600">Choose the clothes you want to wash with their quantities</p>
            </div>

            {Object.entries(clothingData).map(([category, items]) => (
              <div key={category} className="mb-8">
                <div className="flex items-center mb-4">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">{category}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div key={item.name} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                          <p className="text-blue-600 font-bold">₹{item.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateClothQuantity(item.name, -1)}
                            disabled={!selectedClothes[item.name] || selectedClothes[item.name] === 0}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          
                          <span className="w-8 text-center font-semibold text-gray-900">
                            {selectedClothes[item.name] || 0}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => updateClothQuantity(item.name, 1)}
                            className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {selectedClothes[item.name] > 0 && (
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <p className="text-sm font-semibold text-blue-700">
                            Subtotal: ₹{(item.price * selectedClothes[item.name]).toFixed(0)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Price Display */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Total Amount</h3>
                  <p className="text-gray-600">Including all selected items</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">₹{totalPrice.toFixed(0)}</p>
                  <p className="text-sm text-gray-600">
                    {Object.values(selectedClothes).reduce((sum, quantity) => sum + quantity, 0)} items
                  </p>
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

          {/* Pickup Schedule */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Pickup Schedule</h2>
              <p className="text-gray-600">Set your preferred pickup date and time</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500 p-3 rounded-xl mr-4">
                    <TruckIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Pickup Details</h3>
                    <p className="text-gray-600 text-sm">When should we collect your items?</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      name="pickupDate"
                      min={getTodayDate()}
                      value={scheduleData.pickupDate}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, pickupDate: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white text-gray-900
                        ${errors.pickupDate 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                        } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                    />
                    {errors.pickupDate && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.pickupDate}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pickup Time *
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.value}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setScheduleData(prev => ({ ...prev, pickupTime: slot.value }))}
                          className={`
                            p-3 rounded-lg text-sm font-medium transition-all relative
                            ${scheduleData.pickupTime === slot.value
                              ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                              : slot.available
                                ? 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          {slot.value}
                          {slot.popular && slot.available && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></span>
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.pickupTime && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {errors.pickupTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address & Contact Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Address & Contact</h2>
              <p className="text-gray-600">Where should we pick up your items?</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Address Information */}
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <MapPinIcon className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Address</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    placeholder="123 Main Street, Apt 4B"
                    value={scheduleData.address.street}
                    onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${errors.street 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                      } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
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
                      onChange={(e) => handleInputChange('address', 'state', e.target.value)}
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
                    placeholder="12345"
                    value={scheduleData.address.zipCode}
                    onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
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
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-2">
                    <span className="text-purple-600 text-lg">📞</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Contact</h3>
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
                    placeholder="(555) 123-4567"
                    value={scheduleData.contact.phone}
                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${errors.phone 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                      } focus:ring-4 bg-white text-gray-900 placeholder-gray-500`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
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
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
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

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || totalPrice === 0}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Pay ₹{totalPrice.toFixed(0)} & Schedule Pickup
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

