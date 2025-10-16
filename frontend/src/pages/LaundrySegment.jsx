import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  ClockIcon,
  TruckIcon,
  CreditCardIcon,
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  ShoppingBagIcon,
  HomeIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
  CubeIcon,
  TagIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  StarIcon,
  FireIcon,
  HeartIcon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const LaundrySegment = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('clothing');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Service categories
  const categories = [
    { 
      id: 'clothing', 
      name: 'Clothing', 
      icon: '👔', 
      color: 'blue',
      description: 'Shirts, pants, dresses, and casual wear'
    },
    { 
      id: 'formal', 
      name: 'Formal Wear', 
      icon: '🤵', 
      color: 'purple',
      description: 'Suits, blazers, and formal attire'
    },
    { 
      id: 'bedding', 
      name: 'Bedding', 
      icon: '🛏️', 
      color: 'green',
      description: 'Bed sheets, pillows, and comforters'
    },
    { 
      id: 'curtains', 
      name: 'Curtains', 
      icon: '🪟', 
      color: 'orange',
      description: 'Curtains, drapes, and window treatments'
    },
    { 
      id: 'leather', 
      name: 'Leather & Suede', 
      icon: '🧥', 
      color: 'red',
      description: 'Leather jackets, suede items, and bags'
    },
    { 
      id: 'specialty', 
      name: 'Specialty Items', 
      icon: '✨', 
      color: 'pink',
      description: 'Wedding dresses, delicate fabrics'
    }
  ];

  // Laundry items with pricing
  const laundryItems = {
    clothing: [
      { id: 'shirt', name: 'Shirt', price: 25, washPrice: 15, dryCleanPrice: 35, icon: '👔' },
      { id: 'tshirt', name: 'T-Shirt', price: 20, washPrice: 12, dryCleanPrice: 25, icon: '👕' },
      { id: 'jeans', name: 'Jeans', price: 30, washPrice: 20, dryCleanPrice: 40, icon: '👖' },
      { id: 'dress', name: 'Dress', price: 45, washPrice: 25, dryCleanPrice: 60, icon: '👗' },
      { id: 'skirt', name: 'Skirt', price: 25, washPrice: 15, dryCleanPrice: 35, icon: '🩱' },
      { id: 'shorts', name: 'Shorts', price: 20, washPrice: 12, dryCleanPrice: 28, icon: '🩳' }
    ],
    formal: [
      { id: 'suit', name: 'Suit (2-piece)', price: 120, washPrice: 80, dryCleanPrice: 150, icon: '🤵' },
      { id: 'blazer', name: 'Blazer', price: 60, washPrice: 40, dryCleanPrice: 80, icon: '🧥' },
      { id: 'tie', name: 'Tie', price: 15, washPrice: 10, dryCleanPrice: 20, icon: '👔' },
      { id: 'formal-shirt', name: 'Formal Shirt', price: 30, washPrice: 18, dryCleanPrice: 40, icon: '👔' },
      { id: 'waistcoat', name: 'Waistcoat', price: 35, washPrice: 22, dryCleanPrice: 45, icon: '🦺' }
    ],
    bedding: [
      { id: 'bedsheet', name: 'Bed Sheet', price: 40, washPrice: 25, dryCleanPrice: 55, icon: '🛏️' },
      { id: 'pillow-cover', name: 'Pillow Cover', price: 15, washPrice: 10, dryCleanPrice: 20, icon: '🛏️' },
      { id: 'comforter', name: 'Comforter', price: 80, washPrice: 50, dryCleanPrice: 120, icon: '🛏️' },
      { id: 'blanket', name: 'Blanket', price: 60, washPrice: 35, dryCleanPrice: 85, icon: '🛏️' },
      { id: 'mattress-cover', name: 'Mattress Cover', price: 50, washPrice: 30, dryCleanPrice: 70, icon: '🛏️' }
    ],
    curtains: [
      { id: 'curtain-small', name: 'Curtain (Small)', price: 45, washPrice: 25, dryCleanPrice: 65, icon: '🪟' },
      { id: 'curtain-large', name: 'Curtain (Large)', price: 80, washPrice: 45, dryCleanPrice: 120, icon: '🪟' },
      { id: 'drapes', name: 'Drapes', price: 100, washPrice: 60, dryCleanPrice: 150, icon: '🪟' },
      { id: 'valance', name: 'Valance', price: 25, washPrice: 15, dryCleanPrice: 35, icon: '🪟' }
    ],
    leather: [
      { id: 'leather-jacket', name: 'Leather Jacket', price: 150, washPrice: 0, dryCleanPrice: 200, icon: '🧥' },
      { id: 'leather-bag', name: 'Leather Bag', price: 80, washPrice: 0, dryCleanPrice: 120, icon: '👜' },
      { id: 'suede-jacket', name: 'Suede Jacket', price: 120, washPrice: 0, dryCleanPrice: 160, icon: '🧥' },
      { id: 'leather-shoes', name: 'Leather Shoes', price: 60, washPrice: 0, dryCleanPrice: 80, icon: '👞' }
    ],
    specialty: [
      { id: 'wedding-dress', name: 'Wedding Dress', price: 300, washPrice: 0, dryCleanPrice: 400, icon: '👰' },
      { id: 'silk-saree', name: 'Silk Saree', price: 80, washPrice: 0, dryCleanPrice: 120, icon: '🥻' },
      { id: 'designer-gown', name: 'Designer Gown', price: 200, washPrice: 0, dryCleanPrice: 280, icon: '👗' },
      { id: 'vintage-item', name: 'Vintage Item', price: 100, washPrice: 0, dryCleanPrice: 150, icon: '✨' }
    ]
  };

  // Service types
  const serviceTypes = [
    { 
      id: 'wash-fold', 
      name: 'Wash & Fold', 
      icon: '💧', 
      description: 'Regular washing with folding',
      multiplier: 0.6
    },
    { 
      id: 'dry-clean', 
      name: 'Dry Clean', 
      icon: '🧼', 
      description: 'Professional dry cleaning',
      multiplier: 1.0
    },
    { 
      id: 'steam-press', 
      name: 'Steam & Press', 
      icon: '🔥', 
      description: 'Steam cleaning with pressing',
      multiplier: 0.8
    }
  ];

  const [selectedService, setSelectedService] = useState('dry-clean');


  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      const price = selectedService === 'wash-fold' ? item.washPrice : 
                   selectedService === 'dry-clean' ? item.dryCleanPrice : 
                   item.price;
      setCart([...cart, { ...item, quantity: 1, serviceType: selectedService, price }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Please add items to cart first');
      return;
    }
    // Navigate to checkout or schedule pickup with cart data
    navigate('/schedule-pickup', { state: { cartItems: cart, totalPrice: getTotalPrice() } });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Please add items to cart first');
      return;
    }
    
    // Create order data
    const orderData = {
      orderNumber: `ORD-${Date.now()}`,
      items: cart,
      totalPrice: getTotalPrice(),
      totalItems: getTotalItems(),
      serviceType: selectedService,
      orderDate: new Date().toISOString(),
      status: 'Confirmed'
    };
    
    // Navigate directly to order success page
    navigate('/order-success', { 
      state: { 
        cartItems: cart, 
        totalPrice: getTotalPrice(),
        orderData: orderData
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard/home')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Laundry Services</h1>
                <p className="text-gray-600">Choose your items and service type</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <EnvelopeIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Service Type Selection */}
          <div className="bg-white p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {serviceTypes.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedService === service.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-white p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                    selectedCategory === category.id
                      ? `border-${category.color}-500 bg-${category.color}-50 shadow-md`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{category.name}</h4>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name} Items
              </h3>
              <div className="text-sm text-gray-600">
                Service: <span className="font-medium text-blue-600">
                  {serviceTypes.find(s => s.id === selectedService)?.name}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {laundryItems[selectedCategory]?.map((item) => {
                const price = selectedService === 'wash-fold' ? item.washPrice : 
                             selectedService === 'dry-clean' ? item.dryCleanPrice : 
                             item.price;
                const cartItem = cart.find(cartItem => cartItem.id === item.id);
                
                return (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                      <div className="text-lg font-bold text-blue-600">₹{price}</div>
                      {selectedService === 'wash-fold' && item.washPrice === 0 && (
                        <p className="text-xs text-red-500 mt-1">Not available for wash & fold</p>
                      )}
                    </div>
                    
                    {selectedService !== 'wash-fold' || item.washPrice > 0 ? (
                      <div className="flex items-center justify-center space-x-3">
                        {cartItem ? (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                              className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="font-semibold text-lg min-w-[2rem] text-center">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                              className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-sm text-gray-400">Service not available</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="bg-white border-t border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cart Summary</h3>
                <div className="text-2xl font-bold text-blue-600">₹{getTotalPrice()}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Type:</span>
                    <span className="font-medium">{serviceTypes.find(s => s.id === selectedService)?.name}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold"
                  >
                    Place Order Now
                  </button>
                  <button
                    onClick={handleProceedToCheckout}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Schedule Pickup
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full shadow-xl overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.serviceType}</p>
                        <p className="text-sm font-semibold text-blue-600">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>
                        <span className="font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                        >
                          <PlusIcon className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-blue-600">₹{getTotalPrice()}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold"
                      >
                        Place Order Now
                      </button>
                      <button
                        onClick={handleProceedToCheckout}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                      >
                        Schedule Pickup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundrySegment;
