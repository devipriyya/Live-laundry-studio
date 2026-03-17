import React, { useContext, useState, useEffect } from 'react';
import { 
  ArrowLeftIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const DashboardCheckout = () => {
  const { cart, getCartTotal, getCartCount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    paymentMethod: 'card' // 'card' or 'cod'
  });

  const [loyaltySummary, setLoyaltySummary] = useState(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        const response = await api.get('/loyalty/summary');
        setLoyaltySummary(response.data);
      } catch (error) {
        console.error('Error fetching loyalty:', error);
      }
    };
    fetchLoyalty();
  }, []);

  const isFormValid = () => {
    const requiredShipping = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const shippingValid = requiredShipping.every(field => formData[field]?.trim() !== '');
    
    if (formData.paymentMethod === 'cod') {
      return shippingValid;
    }
    
    const requiredCard = ['cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
    return shippingValid && requiredCard.every(field => formData[field]?.trim() !== '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyPoints = () => {
    const maxRedeemable = Math.min(loyaltySummary?.balance || 0, Math.floor(getCartTotal() * 2)); // 100 points = ₹50, so max points = Amount * 2
    if (pointsToRedeem > 0 && pointsToRedeem <= maxRedeemable) {
      setRedeemSuccess(true);
    } else {
      alert(`You can redeem up to ${maxRedeemable} points for this order.`);
      setPointsToRedeem(0);
    }
  };

  const discountAmount = redeemSuccess ? pointsToRedeem * 0.5 : 0;
  const finalTotal = (getCartTotal() * 1.18 - discountAmount).toFixed(2);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const orderPayload = {
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        },
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          service: item.category
        })),
        totalAmount: parseFloat(finalTotal),
        pickupDate: new Date(),
        timeSlot: '10:00 AM - 12:00 PM',
        paymentMethod: formData.paymentMethod,
        pointsRedeemed: redeemSuccess ? pointsToRedeem : 0
      };

      const response = await api.post('/orders', orderPayload);
      
      setOrderDetails({
        orderId: response.data.order.orderNumber,
        total: finalTotal,
        items: cart.length,
        date: new Date().toLocaleDateString()
      });
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="space-y-12 max-w-4xl mx-auto py-12">
        <div className="text-center animate-scale-in">
          <div className="mx-auto bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100/50">
            <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Order Placed!</h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">Your premium laundry care products are on their way to you.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Order Number</p>
              <h2 className="text-2xl font-black tracking-tight">{orderDetails.orderId}</h2>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Order Date</p>
              <p className="font-bold">{orderDetails.date}</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium italic">Items Purchased</span>
                <span className="font-black text-gray-900">{orderDetails.items} Products</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-gray-900 font-bold text-xl">Total Paid</span>
                <span className="font-black text-3xl text-pink-600 tracking-tight">₹{orderDetails.total}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/dashboard/orders')}
                className="py-4 bg-gray-900 hover:bg-black text-white rounded-2xl transition-all shadow-lg active:scale-95 font-bold text-sm"
              >
                Track My Order
              </button>
              <button
                onClick={() => navigate('/dashboard/products')}
                className="py-4 border-2 border-gray-100 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-bold text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/dashboard/cart')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          <span>Back to Cart</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
          <button
            onClick={() => navigate('/dashboard/products')}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 p-2 rounded-lg mr-3">
                  <TruckIcon className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                    placeholder="400001"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="bg-pink-100 p-2 rounded-lg mr-3">
                  <CreditCardIcon className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Selection</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all ${
                    formData.paymentMethod === 'card' 
                      ? 'border-pink-500 bg-pink-50 shadow-md' 
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    formData.paymentMethod === 'card' ? 'bg-pink-500 text-white' : 'bg-white text-gray-400'
                  }`}>
                    <CreditCardIcon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${formData.paymentMethod === 'card' ? 'text-pink-900' : 'text-gray-900'}`}>Credit/Debit Card</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Pay securely online</p>
                  </div>
                </button>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all ${
                    formData.paymentMethod === 'cod' 
                      ? 'border-pink-500 bg-pink-50 shadow-md' 
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    formData.paymentMethod === 'cod' ? 'bg-pink-500 text-white' : 'bg-white text-gray-400'
                  }`}>
                    <TruckIcon className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${formData.paymentMethod === 'cod' ? 'text-pink-900' : 'text-gray-900'}`}>Cash on Delivery</p>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Pay when you receive</p>
                  </div>
                </button>
              </div>
              
              {formData.paymentMethod === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card *</label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all placeholder:text-gray-300"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 group">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-1 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                        {item.image && item.image.includes('.png') ? (
                          <img src={`/images/products/${item.image}`} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-xl">{item.image || '🛍️'}</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-4 space-y-4">
                  {loyaltySummary?.balance > 0 && (
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <GiftIcon className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Loyalty Points</span>
                        </div>
                        <span className="text-xs font-black text-blue-600">{loyaltySummary.balance} Available</span>
                      </div>
                      {!redeemSuccess ? (
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            value={pointsToRedeem}
                            onChange={(e) => setPointsToRedeem(Math.max(0, parseInt(e.target.value) || 0))}
                            placeholder="Points"
                            className="flex-grow px-3 py-2 text-sm border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button 
                            onClick={handleApplyPoints}
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700"
                          >
                            Redeem
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-blue-200">
                          <span className="text-xs font-bold text-blue-700">₹{discountAmount.toFixed(2)} Discount Applied!</span>
                          <button 
                            onClick={() => {setRedeemSuccess(false); setPointsToRedeem(0);}}
                            className="text-[10px] font-black text-pink-600 uppercase tracking-widest"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span className="font-medium">₹{(getCartTotal() * 0.18).toFixed(2)}</span>
                    </div>
                    {redeemSuccess && (
                      <div className="flex justify-between text-green-600 font-bold italic">
                        <span>Loyalty Discount</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-xl text-gray-900">
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid() || loading}
                className={`w-full py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 mt-6 ${
                  isFormValid() && !loading
                    ? 'bg-gray-900 hover:bg-black text-white shadow-gray-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {loading ? 'Processing...' : (formData.paymentMethod === 'cod' ? 'Confirm Order' : 'Place Order & Pay')}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms and Conditions
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCheckout;