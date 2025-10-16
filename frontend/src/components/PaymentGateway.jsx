import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const PaymentGateway = ({ orderDetails, onPaymentSuccess, onPaymentError }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    walletType: 'paytm'
  });
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, American Express',
      fee: 0,
      processingTime: 'Instant'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: DevicePhoneMobileIcon,
      description: 'Google Pay, PhonePe, Paytm UPI',
      fee: 0,
      processingTime: 'Instant'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: BanknotesIcon,
      description: 'Paytm, Amazon Pay, Mobikwik',
      fee: 0,
      processingTime: 'Instant'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: GlobeAltIcon,
      description: 'All major banks supported',
      fee: 0,
      processingTime: '2-5 minutes'
    }
  ];

  const walletOptions = [
    { id: 'paytm', name: 'Paytm', logo: '💳' },
    { id: 'amazonpay', name: 'Amazon Pay', logo: '🛒' },
    { id: 'mobikwik', name: 'Mobikwik', logo: '📱' },
    { id: 'freecharge', name: 'FreeCharge', logo: '⚡' }
  ];

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpiryDate = (date) => {
    const [month, year] = date.split('/');
    if (!month || !year) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
    
    return true;
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateUPI = (upiId) => {
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(' ') : '';
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setPaymentData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (selectedMethod === 'card') {
      if (!paymentData.cardNumber || !validateCardNumber(paymentData.cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!paymentData.expiryDate || !validateExpiryDate(paymentData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date';
      }
      if (!paymentData.cvv || !validateCVV(paymentData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV';
      }
      if (!paymentData.cardholderName.trim()) {
        newErrors.cardholderName = 'Please enter cardholder name';
      }
    } else if (selectedMethod === 'upi') {
      if (!paymentData.upiId || !validateUPI(paymentData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async () => {
    if (!validateForm()) return;
    
    setProcessing(true);
    setPaymentStatus('processing');
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        const paymentResult = {
          transactionId: `TXN${Date.now()}`,
          method: selectedMethod,
          amount: orderDetails.totalAmount,
          status: 'success',
          timestamp: new Date().toISOString()
        };
        
        setPaymentStatus('success');
        onPaymentSuccess && onPaymentSuccess(paymentResult);
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      onPaymentError && onPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Card';
  };

  const PaymentStatusModal = () => {
    if (!paymentStatus) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          {paymentStatus === 'processing' && (
            <>
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </>
          )}
          
          {paymentStatus === 'success' && (
            <>
              <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
              <button
                onClick={() => setPaymentStatus(null)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Continue
              </button>
            </>
          )}
          
          {paymentStatus === 'failed' && (
            <>
              <XCircleIcon className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-4">There was an issue processing your payment. Please try again.</p>
              <button
                onClick={() => setPaymentStatus(null)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Payment Method</h2>
            
            {/* Payment Method Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-blue-600" />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Fee: {method.fee === 0 ? 'Free' : `$${method.fee}`}</span>
                      <span>{method.processingTime}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Form */}
            <div className="border-t pt-6">
              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {paymentData.cardNumber && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <span className="text-xs font-medium text-gray-500">
                            {getCardType(paymentData.cardNumber)}
                          </span>
                        </div>
                      )}
                    </div>
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength="4"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardholderName && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedMethod === 'upi' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">UPI Payment</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      value={paymentData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                      placeholder="yourname@paytm"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.upiId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.upiId && (
                      <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Quick UPI Payment</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      You'll be redirected to your UPI app to complete the payment securely.
                    </p>
                  </div>
                </div>
              )}

              {selectedMethod === 'wallet' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Digital Wallet</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {walletOptions.map((wallet) => (
                      <button
                        key={wallet.id}
                        onClick={() => setPaymentData(prev => ({ ...prev, walletType: wallet.id }))}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentData.walletType === wallet.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{wallet.logo}</div>
                        <div className="font-medium text-gray-900">{wallet.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedMethod === 'netbanking' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Net Banking</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Bank
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Choose your bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="axis">Axis Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="pnb">Punjab National Bank</option>
                    </select>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Important Note</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      You'll be redirected to your bank's website to complete the payment. Please ensure you have your net banking credentials ready.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4">
              {orderDetails.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-gray-900">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${orderDetails.subtotal?.toFixed(2) || orderDetails.totalAmount?.toFixed(2)}</span>
              </div>
              {orderDetails.tax && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${orderDetails.tax.toFixed(2)}</span>
                </div>
              )}
              {orderDetails.deliveryFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">${orderDetails.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${orderDetails.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={processPayment}
              disabled={processing}
              className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <LockClosedIcon className="w-4 h-4" />
                  Pay ${orderDetails.totalAmount?.toFixed(2)}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>

      <PaymentStatusModal />
    </div>
  );
};

export default PaymentGateway;
