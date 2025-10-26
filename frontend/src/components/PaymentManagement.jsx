import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  ReceiptRefundIcon,
  ArrowPathIcon as RefreshIcon
} from '@heroicons/react/24/outline';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [sortBy, setSortBy] = useState('paymentDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Enhanced real static payment data with more realistic business scenarios
  const realPayments = [
    {
      id: 'PAY-2024-1101',
      orderId: 'ORD-2024-2101',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@gmail.com',
      customerPhone: '+91 98765 43210',
      amount: 895.00,
      method: 'Credit Card',
      cardLast4: '4532',
      status: 'Completed',
      transactionId: 'TXN-RAJ1001KUMAR',
      paymentDate: '2024-10-20T14:30:00',
      processingFee: 26.85,
      netAmount: 868.15,
      gateway: 'Razorpay',
      currency: 'INR',
      refundable: true,
      notes: 'Premium wash & fold service with pickup and delivery - Monthly subscription',
      orderType: 'Wash & Fold',
      items: 12
    },
    {
      id: 'PAY-2024-1102',
      orderId: 'ORD-2024-2102',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@outlook.com',
      customerPhone: '+91 98765 43211',
      amount: 1250.75,
      method: 'Digital Wallet',
      cardLast4: null,
      status: 'Completed',
      transactionId: 'TXN-PRI1002SHARMA',
      paymentDate: '2024-10-19T16:45:00',
      processingFee: 37.52,
      netAmount: 1213.23,
      gateway: 'Paytm',
      currency: 'INR',
      refundable: true,
      notes: 'Dry cleaning service for 5 premium garments',
      orderType: 'Dry Cleaning',
      items: 5
    },
    {
      id: 'PAY-2024-1103',
      orderId: 'ORD-2024-2103',
      customerName: 'Amit Patel',
      customerEmail: 'amit.patel@yahoo.com',
      customerPhone: '+91 98765 43212',
      amount: 420.00,
      method: 'UPI',
      cardLast4: null,
      status: 'Pending',
      transactionId: 'TXN-AMI1003PATEL',
      paymentDate: '2024-10-18T11:20:00',
      processingFee: 0.00,
      netAmount: 420.00,
      gateway: 'Google Pay',
      currency: 'INR',
      refundable: false,
      notes: 'Steam ironing service - payment confirmation pending',
      orderType: 'Steam Ironing',
      items: 8
    },
    {
      id: 'PAY-2024-1104',
      orderId: 'ORD-2024-2104',
      customerName: 'Sneha Reddy',
      customerEmail: 'sneha.reddy@gmail.com',
      customerPhone: '+91 98765 43213',
      amount: 1560.00,
      method: 'Debit Card',
      cardLast4: '8901',
      status: 'Failed',
      transactionId: 'TXN-SNE1004REDDY',
      paymentDate: '2024-10-17T09:15:00',
      processingFee: 0.00,
      netAmount: 0.00,
      gateway: 'PhonePe',
      currency: 'INR',
      refundable: false,
      notes: 'Shoe cleaning service for 4 pairs - payment failed due to insufficient balance',
      orderType: 'Shoe Care',
      items: 4
    },
    {
      id: 'PAY-2024-1105',
      orderId: 'ORD-2024-2105',
      customerName: 'Vikram Singh',
      customerEmail: 'vikram.singh@hotmail.com',
      customerPhone: '+91 98765 43214',
      amount: 2150.00,
      method: 'Net Banking',
      cardLast4: null,
      status: 'Completed',
      transactionId: 'TXN-VIK1005SINGH',
      paymentDate: '2024-10-16T13:45:00',
      processingFee: 64.50,
      netAmount: 2085.50,
      gateway: 'HDFC Bank',
      currency: 'INR',
      refundable: true,
      notes: 'Premium dry cleaning package for 8 garments with express delivery',
      orderType: 'Dry Cleaning',
      items: 8
    },
    {
      id: 'PAY-2024-1106',
      orderId: 'ORD-2024-2106',
      customerName: 'Anjali Mehta',
      customerEmail: 'anjali.mehta@gmail.com',
      customerPhone: '+91 98765 43215',
      amount: 325.25,
      method: 'Credit Card',
      cardLast4: '6743',
      status: 'Refunded',
      transactionId: 'TXN-ANJ1006MEHTA',
      paymentDate: '2024-10-15T10:30:00',
      processingFee: 9.76,
      netAmount: 315.49,
      gateway: 'Razorpay',
      currency: 'INR',
      refundable: false,
      notes: 'Stain removal service for 2 garments - customer requested refund due to dissatisfaction',
      orderType: 'Stain Removal',
      items: 2
    },
    {
      id: 'PAY-2024-1107',
      orderId: 'ORD-2024-2107',
      customerName: 'Karan Desai',
      customerEmail: 'karan.desai@company.com',
      customerPhone: '+91 98765 43216',
      amount: 699.99,
      method: 'Digital Wallet',
      cardLast4: null,
      status: 'Completed',
      transactionId: 'TXN-KAR1007DESAI',
      paymentDate: '2024-10-14T15:20:00',
      processingFee: 21.00,
      netAmount: 678.99,
      gateway: 'Amazon Pay',
      currency: 'INR',
      refundable: true,
      notes: 'Regular wash & fold service with express delivery - Corporate package',
      orderType: 'Wash & Fold',
      items: 10
    },
    {
      id: 'PAY-2024-1108',
      orderId: 'ORD-2024-2108',
      customerName: 'Neha Gupta',
      customerEmail: 'neha.gupta@university.edu',
      customerPhone: '+91 98765 43217',
      amount: 1850.00,
      method: 'UPI',
      cardLast4: null,
      status: 'Completed',
      transactionId: 'TXN-NEH1008GUPTA',
      paymentDate: '2024-10-13T12:15:00',
      processingFee: 55.50,
      netAmount: 1794.50,
      gateway: 'PhonePe',
      currency: 'INR',
      refundable: true,
      notes: 'Monthly subscription package for premium services with pickup and delivery',
      orderType: 'Subscription',
      items: 15
    },
    {
      id: 'PAY-2024-1109',
      orderId: 'ORD-2024-2109',
      customerName: 'Rohan Malhotra',
      customerEmail: 'rohan.malhotra@gmail.com',
      customerPhone: '+91 98765 43218',
      amount: 725.50,
      method: 'Credit Card',
      cardLast4: '2345',
      status: 'Completed',
      transactionId: 'TXN-ROH1009MALHOTRA',
      paymentDate: '2024-10-12T14:20:00',
      processingFee: 21.77,
      netAmount: 703.73,
      gateway: 'Razorpay',
      currency: 'INR',
      refundable: true,
      notes: 'Dry cleaning service for 3 premium suits with same-day delivery',
      orderType: 'Dry Cleaning',
      items: 3
    },
    {
      id: 'PAY-2024-1110',
      orderId: 'ORD-2024-2110',
      customerName: 'Pooja Verma',
      customerEmail: 'pooja.verma@yahoo.com',
      customerPhone: '+91 98765 43219',
      amount: 380.00,
      method: 'Debit Card',
      cardLast4: '6789',
      status: 'Pending',
      transactionId: 'TXN-POO1010VERMA',
      paymentDate: '2024-10-11T16:30:00',
      processingFee: 0.00,
      netAmount: 380.00,
      gateway: 'PhonePe',
      currency: 'INR',
      refundable: false,
      notes: 'Steam ironing service for 6 garments - payment confirmation pending',
      orderType: 'Steam Ironing',
      items: 6
    }
  ];

  useEffect(() => {
    setPayments(realPayments);
    setFilteredPayments(realPayments);
  }, []);

  // Filter and sort payments
  useEffect(() => {
    let filtered = payments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => 
        payment.status.toLowerCase() === statusFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'paymentDate':
          aValue = new Date(a.paymentDate);
          bValue = new Date(b.paymentDate);
          break;
        case 'customerName':
          aValue = a.customerName.toLowerCase();
          bValue = b.customerName.toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments, sortBy, sortOrder]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircleIcon,
          bgColor: 'bg-green-50'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: ClockIcon,
          bgColor: 'bg-yellow-50'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircleIcon,
          bgColor: 'bg-red-50'
        };
      case 'refunded':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: ArrowPathIcon,
          bgColor: 'bg-purple-50'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: ExclamationTriangleIcon,
          bgColor: 'bg-gray-50'
        };
    }
  };

  // Calculate totals
  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0);
  const processingFees = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.processingFee, 0);
  const totalTransactions = payments.length;

  // Handle payment actions
  const handleRefund = (paymentId) => {
    setPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'Refunded', refundable: false } 
          : payment
      )
    );
    if (selectedPayment && selectedPayment.id === paymentId) {
      setSelectedPayment(prev => ({ ...prev, status: 'Refunded', refundable: false }));
    }
    // In a real app, this would call an API endpoint
    console.log(`Processing refund for payment: ${paymentId}`);
  };

  const handleRetryPayment = (paymentId) => {
    setPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'Completed', paymentDate: new Date().toISOString() } 
          : payment
      )
    );
    if (selectedPayment && selectedPayment.id === paymentId) {
      setSelectedPayment(prev => ({ ...prev, status: 'Completed', paymentDate: new Date().toISOString() }));
    }
    // In a real app, this would call an API endpoint
    console.log(`Retrying payment: ${paymentId}`);
  };

  const handleMarkAsCompleted = (paymentId) => {
    setPayments(prevPayments => 
      prevPayments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'Completed', paymentDate: new Date().toISOString() } 
          : payment
      )
    );
    if (selectedPayment && selectedPayment.id === paymentId) {
      setSelectedPayment(prev => ({ ...prev, status: 'Completed', paymentDate: new Date().toISOString() }));
    }
    // In a real app, this would call an API endpoint
    console.log(`Marking payment as completed: ${paymentId}`);
  };

  const handleSendReceipt = (paymentId) => {
    // In a real app, this would call an API endpoint to send receipt
    console.log(`Sending receipt for payment: ${paymentId}`);
    alert(`Receipt sent successfully for payment ${paymentId}`);
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting payment report');
    alert('Payment report exported successfully!');
  };

  // Payment Detail Modal
  const PaymentDetailModal = ({ payment, onClose }) => {
    if (!payment) return null;

    const statusInfo = getStatusInfo(payment.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <p className="text-gray-600">Transaction ID: {payment.transactionId}</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Payment Summary */}
            <div className={`rounded-xl p-5 ${statusInfo.bgColor}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${statusInfo.color.replace('text', 'bg').replace('border', 'bg')}`}>
                    <StatusIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">₹{payment.amount.toFixed(2)}</h3>
                    <p className="text-gray-600">{payment.orderType} • {payment.items} items</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium">{payment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{payment.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-sm break-all">{payment.transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="h-4 w-4" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{payment.method}</span>
                  </div>
                  {payment.cardLast4 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Card:</span>
                      <span className="font-medium">****{payment.cardLast4}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gateway:</span>
                    <span className="font-medium">{payment.gateway}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium">
                      {new Date(payment.paymentDate).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <UserIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.customerName}</p>
                      <p className="text-gray-600 text-sm">{payment.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{payment.customerPhone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-gray-700">
                      {new Date(payment.paymentDate).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">₹{payment.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Net Amount:</span>
                        <span className="text-green-600">₹{payment.netAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {payment.notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-gray-700">{payment.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              {payment.status === 'Completed' && payment.refundable && (
                <button 
                  onClick={() => handleRefund(payment.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ReceiptRefundIcon className="h-5 w-5" />
                  <span>Process Refund</span>
                </button>
              )}
              {payment.status === 'Failed' && (
                <button 
                  onClick={() => handleRetryPayment(payment.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshIcon className="h-5 w-5" />
                  <span>Retry Payment</span>
                </button>
              )}
              {payment.status === 'Pending' && (
                <button 
                  onClick={() => handleMarkAsCompleted(payment.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Mark as Completed</span>
                </button>
              )}
              <button 
                onClick={() => handleSendReceipt(payment.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Send Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Get sort indicator
  const SortIndicator = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
              <p className="text-gray-600">Track payments, process refunds, and manage transactions in Indian Rupees (₹)</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={handleExportReport}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-green-100 text-sm">{totalTransactions} transactions</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold">₹{pendingAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Refunded Amount</p>
                <p className="text-2xl font-bold">₹{refundedAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <ArrowPathIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm">Processing Fees</p>
                <p className="text-2xl font-bold">₹{processingFees.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <BanknotesIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Net Revenue</p>
                <p className="text-2xl font-bold">₹{(totalRevenue - processingFees).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      <span>Payment</span>
                      <span className="ml-1"><SortIndicator field="id" /></span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('customerName')}
                  >
                    <div className="flex items-center">
                      <span>Customer</span>
                      <span className="ml-1"><SortIndicator field="customerName" /></span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      <span>Amount</span>
                      <span className="ml-1"><SortIndicator field="amount" /></span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('paymentDate')}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      <span className="ml-1"><SortIndicator field="paymentDate" /></span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const statusInfo = getStatusInfo(payment.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                          <div className="text-sm text-gray-500">{payment.orderId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                          <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</div>
                        <div className="text-sm text-gray-500">Fee: ₹{payment.processingFee.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCardIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">{payment.method}</div>
                            {payment.cardLast4 && (
                              <div className="text-sm text-gray-500">****{payment.cardLast4}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className="h-4 w-4 mr-2" />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusInfo.color}`}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>

        {/* Payment Detail Modal */}
        {showModal && (
          <PaymentDetailModal
            payment={selectedPayment}
            onClose={() => {
              setShowModal(false);
              setSelectedPayment(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;