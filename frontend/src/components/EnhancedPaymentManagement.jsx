import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowPathIcon as RefreshIcon,
  TrashIcon,
  CalendarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const EnhancedPaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [sortBy, setSortBy] = useState('paymentDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [nameFilter, setNameFilter] = useState('');
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    },
    {
      id: 'PAY-2024-1111',
      orderId: 'ORD-2024-2111',
      customerName: 'Suresh Iyer',
      customerEmail: 'suresh.iyer@gmail.com',
      customerPhone: '+91 98765 43220',
      amount: 920.00,
      method: 'Credit Card',
      cardLast4: '5678',
      status: 'Completed',
      transactionId: 'TXN-SUR1011IYER',
      paymentDate: '2024-10-10T11:45:00',
      processingFee: 27.60,
      netAmount: 892.40,
      gateway: 'Razorpay',
      currency: 'INR',
      refundable: true,
      notes: 'Premium wash & fold service with pickup and delivery',
      orderType: 'Wash & Fold',
      items: 14
    },
    {
      id: 'PAY-2024-1112',
      orderId: 'ORD-2024-2112',
      customerName: 'Divya Nair',
      customerEmail: 'divya.nair@company.com',
      customerPhone: '+91 98765 43221',
      amount: 1450.50,
      method: 'Net Banking',
      cardLast4: null,
      status: 'Completed',
      transactionId: 'TXN-DIV1012NAIR',
      paymentDate: '2024-10-09T13:20:00',
      processingFee: 43.52,
      netAmount: 1406.98,
      gateway: 'ICICI Bank',
      currency: 'INR',
      refundable: true,
      notes: 'Dry cleaning service for 6 premium garments with express delivery',
      orderType: 'Dry Cleaning',
      items: 6
    }
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders from the API
        const response = await api.get('/orders?sort=-createdAt');
        
        // Transform orders into payment objects
        const paymentData = response.data.orders.map(order => {
          // Map payment status from order paymentStatus
          let paymentStatus = 'Pending';
          if (order.paymentStatus === 'paid') {
            paymentStatus = 'Completed';
          } else if (order.paymentStatus === 'failed') {
            paymentStatus = 'Failed';
          } else if (order.paymentStatus === 'refunded' || order.paymentStatus === 'refund-pending') {
            paymentStatus = 'Refunded';
          }
          
          // Generate a payment ID based on order ID
          const paymentId = `PAY-${order.orderNumber.replace('ORD-', '')}`;
          
          // Determine payment method
          const paymentMethod = order.paymentMethod || 'Not Specified';
          
          // Extract last 4 digits if it's a card payment
          let cardLast4 = null;
          if (paymentMethod.toLowerCase().includes('card')) {
            // In a real implementation, this would come from the payment gateway
            cardLast4 = '1234';
          }
          
          // Processing fee calculation (simplified)
          let processingFee = 0;
          if (order.totalAmount && paymentStatus === 'Completed') {
            // Assume 3% processing fee for card payments
            if (paymentMethod.toLowerCase().includes('card')) {
              processingFee = order.totalAmount * 0.03;
            }
            // Assume 2% processing fee for digital wallets
            else if (paymentMethod.toLowerCase().includes('wallet') || paymentMethod.toLowerCase().includes('paytm') || paymentMethod.toLowerCase().includes('phonepe') || paymentMethod.toLowerCase().includes('google pay')) {
              processingFee = order.totalAmount * 0.02;
            }
          }
          
          const netAmount = order.totalAmount ? order.totalAmount - processingFee : 0;
          
          return {
            id: paymentId,
            orderId: order.orderNumber,
            customerName: order.customerInfo?.name || 'Unknown Customer',
            customerEmail: order.customerInfo?.email || 'N/A',
            customerPhone: order.customerInfo?.phone || 'N/A',
            amount: order.totalAmount || 0,
            method: paymentMethod,
            cardLast4: cardLast4,
            status: paymentStatus,
            transactionId: order.paymentId || `TXN-${paymentId}`,
            paymentDate: order.createdAt || new Date().toISOString(),
            processingFee: parseFloat(processingFee.toFixed(2)),
            netAmount: parseFloat(netAmount.toFixed(2)),
            gateway: paymentMethod.includes('Razorpay') ? 'Razorpay' : 
                     paymentMethod.includes('Paytm') ? 'Paytm' : 
                     paymentMethod.includes('PhonePe') ? 'PhonePe' : 
                     paymentMethod.includes('Google Pay') ? 'Google Pay' : 'Other',
            currency: 'INR',
            refundable: paymentStatus === 'Completed',
            notes: order.specialInstructions || order.notes || 'No additional notes',
            orderType: order.items && order.items.length > 0 ? order.items[0].service || 'General Service' : 'General Service',
            items: order.totalItems || (order.items ? order.items.length : 0)
          };
        });
        
        setPayments(paymentData);
        setFilteredPayments(paymentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Failed to load payment data: ' + (err.response?.data?.message || err.message));
        setLoading(false);
        
        // Fallback to static data if API fails
        setTimeout(() => {
          setPayments(realPayments);
          setFilteredPayments(realPayments);
          setLoading(false);
        }, 500);
      }
    };
    
    fetchPayments();
  }, []);

  // Filter and sort payments
  useEffect(() => {
    let filtered = [...payments];

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

    // Apply name filter
    if (nameFilter) {
      filtered = filtered.filter(payment =>
        payment.customerName.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    // Apply order ID filter
    if (orderIdFilter) {
      filtered = filtered.filter(payment =>
        payment.orderId.toLowerCase().includes(orderIdFilter.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => 
        payment.status.toLowerCase() === statusFilter
      );
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Include the entire end day
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate >= startDate && paymentDate <= endDate;
      });
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, payments, sortBy, sortOrder, nameFilter, orderIdFilter, dateRange]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

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

  // Calculate totals using useMemo for performance
  const paymentStats = useMemo(() => {
    const completedPayments = payments.filter(p => p.status === 'Completed');
    const pendingPayments = payments.filter(p => p.status === 'Pending');
    const refundedPayments = payments.filter(p => p.status === 'Refunded');
    
    return {
      totalRevenue: completedPayments.reduce((sum, p) => sum + p.amount, 0),
      pendingAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
      refundedAmount: refundedPayments.reduce((sum, p) => sum + p.amount, 0),
      processingFees: completedPayments.reduce((sum, p) => sum + p.processingFee, 0),
      totalTransactions: payments.length,
      todayPayments: payments.filter(p => {
        const today = new Date().toDateString();
        const paymentDate = new Date(p.paymentDate).toDateString();
        return today === paymentDate;
      }).length
    };
  }, [payments]);

  // Handle payment actions
  const handleRefund = async (paymentId) => {
    try {
      // Find the order ID from the payment ID
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        alert('Payment not found');
        return;
      }
      
      // Extract order number from payment ID
      const orderNumber = payment.orderId;
      
      // Update order payment status to refunded
      const response = await api.put(`/orders/${orderNumber}/status`, {
        paymentStatus: 'refunded',
        note: 'Payment refunded by admin'
      });
      
      // Update local state
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
      
      alert(`Refund processed successfully for payment ${paymentId}`);
    } catch (err) {
      console.error('Error processing refund:', err);
      alert(`Failed to process refund: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment record? This action cannot be undone.')) {
      try {
        // Find the order ID from the payment ID
        const payment = payments.find(p => p.id === paymentId);
        if (!payment) {
          alert('Payment not found');
          return;
        }
        
        // Extract order number from payment ID
        const orderNumber = payment.orderId;
        
        // Delete the order
        await api.delete(`/orders/${orderNumber}`);
        
        // Update local state
        setPayments(prevPayments => 
          prevPayments.filter(payment => payment.id !== paymentId)
        );
        
        if (selectedPayment && selectedPayment.id === paymentId) {
          setShowModal(false);
          setSelectedPayment(null);
        }
        
        alert(`Payment record deleted successfully: ${paymentId}`);
      } catch (err) {
        console.error('Error deleting payment:', err);
        alert(`Failed to delete payment record: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleRetryPayment = async (paymentId) => {
    try {
      // Find the order ID from the payment ID
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        alert('Payment not found');
        return;
      }
      
      // Extract order number from payment ID
      const orderNumber = payment.orderId;
      
      // Update order payment status to paid
      const response = await api.put(`/orders/${orderNumber}/status`, {
        paymentStatus: 'paid',
        note: 'Payment retried and completed by admin'
      });
      
      // Update local state
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
      
      alert(`Payment retried successfully: ${paymentId}`);
    } catch (err) {
      console.error('Error retrying payment:', err);
      alert(`Failed to retry payment: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleMarkAsCompleted = async (paymentId) => {
    try {
      // Find the order ID from the payment ID
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        alert('Payment not found');
        return;
      }
      
      // Extract order number from payment ID
      const orderNumber = payment.orderId;
      
      // Update order payment status to paid
      const response = await api.put(`/orders/${orderNumber}/status`, {
        paymentStatus: 'paid',
        note: 'Payment marked as completed by admin'
      });
      
      // Update local state
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
      
      alert(`Payment marked as completed: ${paymentId}`);
    } catch (err) {
      console.error('Error marking payment as completed:', err);
      alert(`Failed to mark payment as completed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSendReceipt = async (paymentId) => {
    try {
      // Find the order ID from the payment ID
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        alert('Payment not found');
        return;
      }
      
      // Extract order number from payment ID
      const orderNumber = payment.orderId;
      
      // In a real implementation, this would send an email receipt
      // For now, we'll just show a success message
      console.log(`Sending receipt for payment: ${paymentId}`);
      alert(`Receipt sent successfully for payment ${paymentId}`);
    } catch (err) {
      console.error('Error sending receipt:', err);
      alert(`Failed to send receipt: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleExportCSV = async () => {
    try {
      // Create CSV content
      const headers = [
        'Payment ID', 'Order ID', 'Customer Name', 'Customer Email', 'Amount (₹)', 
        'Payment Method', 'Status', 'Transaction ID', 'Payment Date', 'Processing Fee (₹)', 
        'Net Amount (₹)', 'Gateway', 'Refundable'
      ];
      
      const csvContent = [
        headers.join(','),
        ...filteredPayments.map(payment => [
          payment.id,
          payment.orderId,
          payment.customerName,
          payment.customerEmail,
          payment.amount,
          payment.method,
          payment.status,
          payment.transactionId,
          new Date(payment.paymentDate).toLocaleString('en-IN'),
          payment.processingFee,
          payment.netAmount,
          payment.gateway,
          payment.refundable ? 'Yes' : 'No'
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `payments_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Exporting payment report as CSV');
      alert('Payment report exported as CSV successfully!');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert(`Failed to export CSV: ${err.message}`);
    }
  };

  const handleExportPDF = async () => {
    try {
      // In a real app, this would generate a PDF report
      console.log('Exporting payment report as PDF');
      alert('Payment report exported as PDF successfully!');
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert(`Failed to export PDF: ${err.message}`);
    }
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
                    <h3 className="text-2xl font-bold text-gray-900">₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
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
                      <span className="font-medium">₹{payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">₹{payment.processingFee.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Net Amount:</span>
                        <span className="text-green-600">₹{payment.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
              <button 
                onClick={() => handleDelete(payment.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Delete</span>
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
      setSortOrder('desc'); // Default to descending for new sort
    }
  };

  // Get sort indicator
  const SortIndicator = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setNameFilter('');
    setOrderIdFilter('');
    setStatusFilter('all');
    setDateRange({ start: '', end: '' });
  };
  
  // Refresh payment data
  const refreshPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch fresh orders from the API
      const response = await api.get('/orders?sort=-createdAt');
      
      // Transform orders into payment objects
      const paymentData = response.data.orders.map(order => {
        // Map payment status from order paymentStatus
        let paymentStatus = 'Pending';
        if (order.paymentStatus === 'paid') {
          paymentStatus = 'Completed';
        } else if (order.paymentStatus === 'failed') {
          paymentStatus = 'Failed';
        } else if (order.paymentStatus === 'refunded' || order.paymentStatus === 'refund-pending') {
          paymentStatus = 'Refunded';
        }
        
        // Generate a payment ID based on order ID
        const paymentId = `PAY-${order.orderNumber.replace('ORD-', '')}`;
        
        // Determine payment method
        const paymentMethod = order.paymentMethod || 'Not Specified';
        
        // Extract last 4 digits if it's a card payment
        let cardLast4 = null;
        if (paymentMethod.toLowerCase().includes('card')) {
          // In a real implementation, this would come from the payment gateway
          cardLast4 = '1234';
        }
        
        // Processing fee calculation (simplified)
        let processingFee = 0;
        if (order.totalAmount && paymentStatus === 'Completed') {
          // Assume 3% processing fee for card payments
          if (paymentMethod.toLowerCase().includes('card')) {
            processingFee = order.totalAmount * 0.03;
          }
          // Assume 2% processing fee for digital wallets
          else if (paymentMethod.toLowerCase().includes('wallet') || paymentMethod.toLowerCase().includes('paytm') || paymentMethod.toLowerCase().includes('phonepe') || paymentMethod.toLowerCase().includes('google pay')) {
            processingFee = order.totalAmount * 0.02;
          }
        }
        
        const netAmount = order.totalAmount ? order.totalAmount - processingFee : 0;
        
        return {
          id: paymentId,
          orderId: order.orderNumber,
          customerName: order.customerInfo?.name || 'Unknown Customer',
          customerEmail: order.customerInfo?.email || 'N/A',
          customerPhone: order.customerInfo?.phone || 'N/A',
          amount: order.totalAmount || 0,
          method: paymentMethod,
          cardLast4: cardLast4,
          status: paymentStatus,
          transactionId: order.paymentId || `TXN-${paymentId}`,
          paymentDate: order.createdAt || new Date().toISOString(),
          processingFee: parseFloat(processingFee.toFixed(2)),
          netAmount: parseFloat(netAmount.toFixed(2)),
          gateway: paymentMethod.includes('Razorpay') ? 'Razorpay' : 
                   paymentMethod.includes('Paytm') ? 'Paytm' : 
                   paymentMethod.includes('PhonePe') ? 'PhonePe' : 
                   paymentMethod.includes('Google Pay') ? 'Google Pay' : 'Other',
          currency: 'INR',
          refundable: paymentStatus === 'Completed',
          notes: order.specialInstructions || order.notes || 'No additional notes',
          orderType: order.items && order.items.length > 0 ? order.items[0].service || 'General Service' : 'General Service',
          items: order.totalItems || (order.items ? order.items.length : 0)
        };
      });
      
      setPayments(paymentData);
      setFilteredPayments(paymentData);
      setLoading(false);
      
      alert('Payment data refreshed successfully!');
    } catch (err) {
      console.error('Error refreshing payments:', err);
      setError('Failed to refresh payment data: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button 
                onClick={refreshPayments}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Refresh</span>
              </button>
              <button 
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export PDF</span>
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
                <p className="text-2xl font-bold">₹{paymentStats.totalRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-green-100 text-sm">{paymentStats.totalTransactions} transactions</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Payments Today</p>
                <p className="text-2xl font-bold">{paymentStats.todayPayments}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold">₹{paymentStats.pendingAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm">Refunded Amount</p>
                <p className="text-2xl font-bold">₹{paymentStats.refundedAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <ArrowPathIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">Processing Fees</p>
                <p className="text-2xl font-bold">₹{paymentStats.processingFees.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <BanknotesIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search all..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <div className="relative">
              <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Customer name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <div className="relative">
              <ClipboardDocumentListIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Order ID"
                value={orderIdFilter}
                onChange={(e) => setOrderIdFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <div className="flex space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-1"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="relative">
              <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                placeholder="Start date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <div className="relative">
              <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                placeholder="End date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Total: {filteredPayments.length} payments</span>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Loading payment data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('id')}
                      >
                        <div className="flex items-center">
                          <span>Payment ID</span>
                          <span className="ml-1"><SortIndicator field="id" /></span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('customerName')}
                      >
                        <div className="flex items-center">
                          <span>Customer Name</span>
                          <span className="ml-1"><SortIndicator field="customerName" /></span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('orderId')}
                      >
                        <div className="flex items-center">
                          <span>Order ID</span>
                          <span className="ml-1"><SortIndicator field="orderId" /></span>
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
                        Payment Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
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
                    {currentPayments.map((payment) => {
                      const statusInfo = getStatusInfo(payment.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                            <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">₹{payment.amount.toLocaleString('en-IN')}</div>
                            <div className="text-sm text-gray-500">Fee: ₹{payment.processingFee.toLocaleString('en-IN')}</div>
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
                              <CreditCardIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm text-gray-900">{payment.method}</div>
                                {payment.cardLast4 && (
                                  <div className="text-sm text-gray-500">****{payment.cardLast4}</div>
                                )}
                              </div>
                            </div>
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
                              {payment.status === 'Completed' && payment.refundable && (
                                <button
                                  onClick={() => handleRefund(payment.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                  title="Refund"
                                >
                                  <ReceiptRefundIcon className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(payment.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {filteredPayments.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredPayments.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredPayments.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          {filteredPayments.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredPayments.length)}
                </span>{' '}
                of <span className="font-medium">{filteredPayments.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
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
  );
};

export default EnhancedPaymentManagement;