import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const NewOrder = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    services: [],
    items: {},
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    delivery: 0,
    total: 0,
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: ''
    },
    contact: {
      name: user?.displayName || '',
      phone: '',
      email: user?.email || '',
      alternateContact: ''
    },
    preferences: {
      detergent: 'standard',
      softener: true,
      starch: false,
      temperature: 'warm',
      specialInstructions: ''
    },
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Services data
  const services = [
    {
      id: 'wash-fold',
      name: 'Wash & Fold',
      description: 'Professional washing, drying, and folding service',
      icon: '👕',
      price: 2.99,
      unit: 'per lb',
      minItems: 5,
      turnaround: '24-48 hours',
      rating: 4.9,
      popular: true,
      features: ['Eco-friendly detergent', 'Fabric softener included', 'Neatly folded']
    },
    {
      id: 'dry-clean',
      name: 'Dry Cleaning',
      description: 'Premium dry cleaning for delicate and formal wear',
      icon: '🧥',
      price: 12.99,
      unit: 'per item',
      minItems: 1,
      turnaround: '2-3 days',
      rating: 4.8,
      features: ['Professional pressing', 'Stain removal', 'Protective covering']
    },
    {
      id: 'ironing',
      name: 'Ironing Service',
      description: 'Professional pressing and steaming',
      icon: '👔',
      price: 4.50,
      unit: 'per item',
      minItems: 3,
      turnaround: '24 hours',
      rating: 4.7,
      features: ['Steam pressing', 'Wrinkle removal', 'Hanger service']
    },
    {
      id: 'alterations',
      name: 'Alterations',
      description: 'Custom tailoring and garment modifications',
      icon: '✂️',
      price: 25.00,
      unit: 'starts at',
      minItems: 1,
      turnaround: '3-5 days',
      rating: 4.9,
      premium: true,
      features: ['Custom fitting', 'Expert tailoring', 'Quality guarantee']
    },
    {
      id: 'shoe-care',
      name: 'Shoe Care',
      description: 'Professional shoe cleaning and polishing',
      icon: '👞',
      price: 15.99,
      unit: 'per pair',
      minItems: 1,
      turnaround: '2-3 days',
      rating: 4.6,
      features: ['Deep cleaning', 'Polish & shine', 'Odor treatment']
    },
    {
      id: 'luxury-care',
      name: 'Luxury Care',
      description: 'Premium care for high-end garments',
      icon: '👗',
      price: 35.99,
      unit: 'per item',
      minItems: 1,
      turnaround: '5-7 days',
      rating: 5.0,
      premium: true,
      features: ['Hand washing', 'Specialized care', 'White-glove service']
    }
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  // Calculate totals when services/items change
  useEffect(() => {
    calculateTotal();
  }, [orderData.services, orderData.items]);

  const calculateTotal = () => {
    let subtotal = 0;
    let totalItems = 0;

    orderData.services.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      const itemCount = orderData.items[serviceId] || 0;
      if (service && itemCount > 0) {
        subtotal += service.price * itemCount;
        totalItems += itemCount;
      }
    });

    const delivery = subtotal > 50 ? 0 : 4.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax + delivery;

    setOrderData(prev => ({
      ...prev,
      subtotal,
      tax,
      delivery,
      total,
      totalItems
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setOrderData(prev => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId];
      
      // Remove items for unselected services
      const items = { ...prev.items };
      if (!services.includes(serviceId)) {
        delete items[serviceId];
      }
      
      return { ...prev, services, items };
    });
  };

  const handleItemQuantityChange = (serviceId, change) => {
    setOrderData(prev => {
      const currentCount = prev.items[serviceId] || 0;
      const service = services.find(s => s.id === serviceId);
      const newCount = Math.max(0, currentCount + change);
      
      // Allow user to increment items freely - validation happens at step level
      return {
        ...prev,
        items: {
          ...prev.items,
          [serviceId]: newCount === 0 ? undefined : newCount
        }
      };
    });
  };

  const handleInputChange = (section, field, value) => {
    setOrderData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${section}.${field}`]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (orderData.services.length === 0) {
          newErrors.services = 'Please select at least one service';
        }
        
        // Check if all selected services have minimum items
        orderData.services.forEach(serviceId => {
          const service = services.find(s => s.id === serviceId);
          const itemCount = orderData.items[serviceId] || 0;
          if (itemCount < service.minItems) {
            newErrors[serviceId] = `Minimum ${service.minItems} items required for ${service.name}`;
          }
        });
        break;
        
      case 2:
        if (!orderData.pickupDate) newErrors['pickupDate'] = 'Pickup date is required';
        if (!orderData.pickupTime) newErrors['pickupTime'] = 'Pickup time is required';
        if (!orderData.deliveryDate) newErrors['deliveryDate'] = 'Delivery date is required';
        if (!orderData.deliveryTime) newErrors['deliveryTime'] = 'Delivery time is required';
        
        // Validate pickup address fields for dry cleaning services (shoe care and clothes)
        if (orderData.services.includes('shoe-care') || orderData.services.includes('dry-clean')) {
          if (!orderData.address.street) newErrors['address.street'] = 'Street address is required for dry cleaning service';
          if (!orderData.address.city) newErrors['address.city'] = 'City is required for dry cleaning service';
          if (!orderData.address.state) newErrors['address.state'] = 'State is required for dry cleaning service';
          if (!orderData.address.zipCode) newErrors['address.zipCode'] = 'ZIP code is required for dry cleaning service';
        }
        break;
        
      case 3:
        if (!orderData.address.street) newErrors['address.street'] = 'Street address is required';
        if (!orderData.address.city) newErrors['address.city'] = 'City is required';
        if (!orderData.address.state) newErrors['address.state'] = 'State is required';
        if (!orderData.address.zipCode) newErrors['address.zipCode'] = 'ZIP code is required';
        if (!orderData.contact.phone) newErrors['contact.phone'] = 'Phone number is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      // Prepare order data for submission
      const orderItems = orderData.services.map(serviceId => {
        const service = services.find(s => s.id === serviceId);
        const itemCount = orderData.items[serviceId] || 0;
        return {
          name: service.name,
          quantity: itemCount,
          price: service.price,
          service: serviceId
        };
      }).filter(item => item.quantity > 0);

      // Prepare the order object to match the backend Order model
      const orderPayload = {
        serviceId: null, // Will be set by backend if needed
        orderNumber: `ORD-${Date.now()}`,
        customerInfo: {
          name: orderData.contact.name,
          email: orderData.contact.email,
          phone: orderData.contact.phone,
          address: {
            street: orderData.address.street,
            city: orderData.address.city,
            state: orderData.address.state,
            zipCode: orderData.address.zipCode,
            instructions: orderData.address.instructions
          }
        },
        items: orderItems,
        totalAmount: orderData.total,
        totalItems: orderData.totalItems,
        pickupDate: orderData.pickupDate,
        timeSlot: orderData.pickupTime,
        deliveryDate: orderData.deliveryDate,
        specialInstructions: orderData.preferences.specialInstructions,
        paymentMethod: orderData.paymentMethod,
        status: 'order-placed',
        paymentStatus: 'pending'
      };

      // Check if this is a dry cleaning order (shoe care or clothes)
      const isDryCleaningOrder = orderData.services.includes('shoe-care');
      const isClothesDryCleaningOrder = orderData.services.includes('dry-clean');
      
      // Submit to backend API
      let endpoint = '/orders';
      let requestData = orderPayload;

      if (isDryCleaningOrder) {
        // Shoe care dry cleaning
        endpoint = '/orders/dry-cleaning';
        requestData = {
          shoeType: 'Shoes',
          serviceType: 'shoe-care',
          numberOfPairs: orderData.items['shoe-care'] || 1,
          pickupDate: orderData.pickupDate,
          pickupTime: orderData.pickupTime,
          pickupAddress: {
            street: orderData.address.street,
            city: orderData.address.city,
            state: orderData.address.state,
            zipCode: orderData.address.zipCode,
            instructions: orderData.address.instructions
          },
          contactInfo: {
            name: orderData.contact.name,
            phone: orderData.contact.phone,
            email: orderData.contact.email
          }
        };
      } else if (isClothesDryCleaningOrder) {
        // Clothes dry cleaning
        endpoint = '/orders/dry-cleaning-clothes';
        requestData = {
          items: orderItems,
          pickupDate: orderData.pickupDate,
          pickupTime: orderData.pickupTime,
          pickupAddress: {
            street: orderData.address.street,
            city: orderData.address.city,
            state: orderData.address.state,
            zipCode: orderData.address.zipCode,
            instructions: orderData.address.instructions
          },
          contactInfo: {
            name: orderData.contact.name,
            phone: orderData.contact.phone,
            email: orderData.contact.email
          },
          totalAmount: orderData.total
        };
      }

      const response = await api.post(endpoint, requestData);

      const createdOrder = response.data;
      console.log('Order created successfully:', createdOrder);

      // Store the user's email in localStorage for MyOrders to use
      if (orderData.contact.email) {
        localStorage.setItem('userEmail', orderData.contact.email);
      }

      // Dispatch event to refresh orders in MyOrders component
      window.dispatchEvent(new CustomEvent('orderPlaced'));

      // Redirect to order success page with order details
      navigate('/order-success', {
        state: {
          orderData: createdOrder.order,
          message: 'Order placed successfully! We\'ll send you a confirmation shortly.'
        }
      });
    } catch (error) {
      console.error('Order submission failed:', error);
      setErrors({ submit: 'Failed to submit order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <React.Fragment key={step}>
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors
            ${currentStep >= step 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
            }
          `}>
            {step}
          </div>
          {step < 5 && (
            <div className={`
              w-16 h-1 mx-2 transition-colors
              ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Services</h2>
        <p className="text-gray-600">Select the services you need for your order</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className={`
            relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
            ${orderData.services.includes(service.id)
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
            }
          `} onClick={() => handleServiceToggle(service.id)}>
            
            {/* Premium/Popular badges */}
            {service.premium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Premium
              </div>
            )}
            {service.popular && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
            )}

            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{service.description}</p>
              
              {/* Rating */}
              <div className="flex items-center justify-center mb-2">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
              </div>
              
              <div className="text-2xl font-bold text-blue-600">
                ${service.price} <span className="text-sm font-normal text-gray-500">{service.unit}</span>
              </div>
              <p className="text-sm text-gray-500">{service.turnaround}</p>
            </div>

            {/* Features */}
            <ul className="text-xs text-gray-600 mb-4">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-1">
                  <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Quantity selector for selected services */}
            {orderData.services.includes(service.id) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemQuantityChange(service.id, -1);
                    }}
                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="text-lg font-semibold min-w-[3rem] text-center">
                    {orderData.items[service.id] || 0}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemQuantityChange(service.id, 1);
                    }}
                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Minimum requirement indicator */}
                {(orderData.items[service.id] || 0) < service.minItems && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    Minimum {service.minItems} items required for {service.name}
                  </p>
                )}
              </div>
            )}

            {errors[service.id] && (
              <p className="text-red-500 text-sm mt-2 text-center">{errors[service.id]}</p>
            )}
          </div>
        ))}
      </div>
      
      {errors.services && (
        <p className="text-red-500 text-center">{errors.services}</p>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Schedule Pickup & Delivery</h2>
        <p className="text-gray-600">Choose convenient times for pickup and delivery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pickup Schedule */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <TruckIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Pickup Schedule</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={orderData.pickupDate}
                onChange={(e) => setOrderData(prev => ({ ...prev, pickupDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Time
              </label>
              <select
                value={orderData.pickupTime}
                onChange={(e) => setOrderData(prev => ({ ...prev, pickupTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>}
            </div>
            
            {/* Pickup Address Section for Shoe Care Service */}
            {orderData.services.includes('shoe-care') && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Pickup Address</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      value={orderData.address.street}
                      onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors['address.street'] && <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="City"
                        value={orderData.address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        value={orderData.address.state}
                        onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        {/* Add more states as needed */}
                      </select>
                      {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      placeholder="12345"
                      value={orderData.address.zipCode}
                      onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors['address.zipCode'] && <p className="text-red-500 text-sm mt-1">{errors['address.zipCode']}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      placeholder="Apartment number, gate code, special pickup instructions..."
                      value={orderData.address.instructions}
                      onChange={(e) => handleInputChange('address', 'instructions', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Schedule */}
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <CalendarDaysIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Delivery Schedule</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                min={orderData.pickupDate}
                value={orderData.deliveryDate}
                onChange={(e) => setOrderData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {errors.deliveryDate && <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time
              </label>
              <select
                value={orderData.deliveryTime}
                onChange={(e) => setOrderData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Schedule Options */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const dayAfter = new Date();
              dayAfter.setDate(dayAfter.getDate() + 3);
              setOrderData(prev => ({
                ...prev,
                pickupDate: tomorrow.toISOString().split('T')[0],
                pickupTime: '9:00 AM',
                deliveryDate: dayAfter.toISOString().split('T')[0],
                deliveryTime: '2:00 PM'
              }));
            }}
            className="p-4 border border-gray-300 rounded-xl hover:bg-white hover:shadow-md transition-all"
          >
            <div className="text-center">
              <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-semibold">Express Service</p>
              <p className="text-sm text-gray-600">Pick up tomorrow, deliver in 2 days</p>
            </div>
          </button>
          
          <button
            onClick={() => {
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              const delivery = new Date();
              delivery.setDate(delivery.getDate() + 10);
              setOrderData(prev => ({
                ...prev,
                pickupDate: nextWeek.toISOString().split('T')[0],
                pickupTime: '10:00 AM',
                deliveryDate: delivery.toISOString().split('T')[0],
                deliveryTime: '3:00 PM'
              }));
            }}
            className="p-4 border border-gray-300 rounded-xl hover:bg-white hover:shadow-md transition-all"
          >
            <div className="text-center">
              <CalendarDaysIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-semibold">Standard Service</p>
              <p className="text-sm text-gray-600">Pick up next week, standard timing</p>
            </div>
          </button>
          
          <button
            onClick={() => {
              // Weekend pickup
              const weekend = new Date();
              const daysToSaturday = 6 - weekend.getDay();
              weekend.setDate(weekend.getDate() + daysToSaturday);
              const mondayDelivery = new Date(weekend);
              mondayDelivery.setDate(mondayDelivery.getDate() + 2);
              
              setOrderData(prev => ({
                ...prev,
                pickupDate: weekend.toISOString().split('T')[0],
                pickupTime: '11:00 AM',
                deliveryDate: mondayDelivery.toISOString().split('T')[0],
                deliveryTime: '4:00 PM'
              }));
            }}
            className="p-4 border border-gray-300 rounded-xl hover:bg-white hover:shadow-md transition-all"
          >
            <div className="text-center">
              <ShoppingBagIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold">Weekend Pickup</p>
              <p className="text-sm text-gray-600">Saturday pickup, Monday delivery</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Address & Contact Information</h2>
        <p className="text-gray-600">Where should we pick up and deliver your items?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Address Information */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <MapPinIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Address</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                placeholder="123 Main Street"
                value={orderData.address.street}
                onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors['address.street'] && <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={orderData.address.city}
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={orderData.address.state}
                  onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">State</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  {/* Add more states as needed */}
                </select>
                {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                placeholder="12345"
                value={orderData.address.zipCode}
                onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors['address.zipCode'] && <p className="text-red-500 text-sm mt-1">{errors['address.zipCode']}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                placeholder="Apartment number, gate code, special delivery instructions..."
                value={orderData.address.instructions}
                onChange={(e) => handleInputChange('address', 'instructions', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-green-50 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <UserIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Contact</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={orderData.contact.name}
                onChange={(e) => handleInputChange('contact', 'name', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="(555) 123-4567"
                value={orderData.contact.phone}
                onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              {errors['contact.phone'] && <p className="text-red-500 text-sm mt-1">{errors['contact.phone']}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={orderData.contact.email}
                onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternate Contact (Optional)
              </label>
              <input
                type="tel"
                placeholder="(555) 987-6543"
                value={orderData.contact.alternateContact}
                onChange={(e) => handleInputChange('contact', 'alternateContact', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Care Preferences</h2>
        <p className="text-gray-600">Tell us how you'd like your items cared for</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Washing Preferences */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Washing Preferences</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Detergent Type
              </label>
              <div className="space-y-2">
                {[
                  { id: 'standard', name: 'Standard Detergent', desc: 'Our regular eco-friendly detergent' },
                  { id: 'sensitive', name: 'Sensitive Skin', desc: 'Hypoallergenic, fragrance-free' },
                  { id: 'premium', name: 'Premium Organic', desc: 'High-end organic detergent (+$2)' }
                ].map(option => (
                  <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="detergent"
                      value={option.id}
                      checked={orderData.preferences.detergent === option.id}
                      onChange={(e) => handleInputChange('preferences', 'detergent', e.target.value)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Water Temperature
              </label>
              <div className="space-y-2">
                {[
                  { id: 'cold', name: 'Cold', desc: 'Best for colors, energy efficient' },
                  { id: 'warm', name: 'Warm', desc: 'Good balance for most fabrics' },
                  { id: 'hot', name: 'Hot', desc: 'Best for whites and sanitizing' }
                ].map(option => (
                  <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="temperature"
                      value={option.id}
                      checked={orderData.preferences.temperature === option.id}
                      onChange={(e) => handleInputChange('preferences', 'temperature', e.target.value)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Options</h3>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={orderData.preferences.softener}
                  onChange={(e) => handleInputChange('preferences', 'softener', e.target.checked)}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Fabric Softener</p>
                  <p className="text-sm text-gray-600">Makes clothes softer and reduces static</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={orderData.preferences.starch}
                  onChange={(e) => handleInputChange('preferences', 'starch', e.target.checked)}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium text-gray-900">Light Starch (+$1)</p>
                  <p className="text-sm text-gray-600">For crisp, professional appearance</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Care Instructions
              </label>
              <textarea
                placeholder="Any specific care instructions for your items..."
                value={orderData.preferences.specialInstructions}
                onChange={(e) => handleInputChange('preferences', 'specialInstructions', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Payment</h2>
        <p className="text-gray-600">Please review your order before confirming</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-4">
          {orderData.services.map(serviceId => {
            const service = services.find(s => s.id === serviceId);
            const itemCount = orderData.items[serviceId] || 0;
            const itemTotal = service.price * itemCount;
            
            return (
              <div key={serviceId} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>
                  <p className="text-sm text-gray-600">{itemCount} {service.unit.includes('per') ? service.unit.split(' ')[1] : 'items'}</p>
                </div>
                <p className="font-semibold text-gray-900">${itemTotal.toFixed(2)}</p>
              </div>
            );
          })}
          
          <div className="pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <p>Subtotal</p>
              <p>${orderData.subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>Tax (8%)</p>
              <p>${orderData.tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>Delivery {orderData.subtotal > 50 ? '(Free!)' : ''}</p>
              <p>{orderData.delivery === 0 ? 'FREE' : `$${orderData.delivery.toFixed(2)}`}</p>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
              <p>Total</p>
              <p>${orderData.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup & Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Pickup Schedule</h4>
          <p className="text-blue-700">{orderData.pickupDate} at {orderData.pickupTime}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 mb-2">Delivery Schedule</h4>
          <p className="text-green-700">{orderData.deliveryDate} at {orderData.deliveryTime}</p>
        </div>
      </div>

      {/* Address */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Service Address</h4>
        <p className="text-gray-700">
          {orderData.address.street}, {orderData.address.city}, {orderData.address.state} {orderData.address.zipCode}
        </p>
        {orderData.address.instructions && (
          <p className="text-sm text-gray-600 mt-1">Note: {orderData.address.instructions}</p>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="space-y-3">
          {[
            { id: 'card', name: 'Credit/Debit Card', desc: 'Secure payment with your card', icon: CreditCardIcon },
            { id: 'paypal', name: 'PayPal', desc: 'Pay with your PayPal account', icon: CreditCardIcon },
            { id: 'cash', name: 'Cash on Delivery', desc: 'Pay cash when we deliver', icon: CreditCardIcon }
          ].map(method => (
            <label key={method.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={orderData.paymentMethod === method.id}
                onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="text-blue-600 focus:ring-blue-500"
              />
              <method.icon className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <div className="flex items-start space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Important Notes:</p>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Please be available at the scheduled pickup and delivery times</li>
              <li>• We'll contact you 30 minutes before arrival</li>
              <li>• Items will be cleaned according to care labels and your preferences</li>
              <li>• 100% satisfaction guarantee or we'll re-clean for free</li>
            </ul>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700">{errors.submit}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">New Order</h1>
              <p className="text-sm text-gray-600">Step {currentStep} of 5</p>
            </div>
            <div className="w-24"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="text-center">
            {orderData.totalItems > 0 && (
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                {orderData.totalItems} items • ${orderData.total.toFixed(2)}
              </div>
            )}
          </div>

          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-colors font-semibold flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Place Order</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewOrder;