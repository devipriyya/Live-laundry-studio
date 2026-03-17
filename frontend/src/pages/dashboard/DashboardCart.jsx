import React, { useContext, useState } from 'react';
import { 
  ShoppingCartIcon, 
  XMarkIcon, 
  PlusIcon, 
  MinusIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const DashboardCart = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState('');

  const handleQuantityChange = (productId, change) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        updateCartQuantity(productId, newQuantity);
      }
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setShowSuccessMessage('Your cart is empty!');
      setTimeout(() => setShowSuccessMessage(''), 3000);
      return;
    }
    
    // In a real implementation, this would redirect to checkout
    setShowSuccessMessage('Proceeding to checkout...');
    setTimeout(() => {
      setShowSuccessMessage('');
      navigate('/dashboard/checkout'); // This would be the checkout page
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {showSuccessMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/products')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back to Products</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{getCartCount()} items in your cart</p>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <ShoppingCartIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products yet</p>
          <button
            onClick={() => navigate('/dashboard/products')}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex items-center group hover:bg-gray-50/50 transition-colors">
                    <div className="w-24 h-24 rounded-2xl bg-gray-50 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {item.image && item.image.includes('.png') ? (
                        <img 
                          src={`/images/products/${item.image}`} 
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-4xl">{item.image || '🛍️'}</div>
                      )}
                    </div>
                    
                    <div className="flex-1 ml-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-1 block">{item.category}</span>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                          <p className="text-gray-500 text-xs line-clamp-1">{item.description}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                          >
                            <MinusIcon className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="mx-4 text-gray-900 font-black text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                          >
                            <PlusIcon className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                        
                        <div className="text-xl font-black text-gray-900 tracking-tight">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{(getCartTotal() * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{(getCartTotal() * 1.18).toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
              
              <button
                onClick={() => navigate('/dashboard/products')}
                className="w-full mt-3 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCart;
