import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TruckIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const AdminOrderManagement = () => {
  const { user, adminDemoLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authRetryAttempted, setAuthRetryAttempted] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Enhanced order workflow statuses
  const workflowStatuses = [
    { value: 'order-placed', label: 'Order Placed', icon: '📋', color: 'bg-yellow-100 text-yellow-800', step: 1 },
    { value: 'order-accepted', label: 'Order Accepted', icon: '✅', color: 'bg-blue-100 text-blue-800', step: 2 },
    { value: 'out-for-pickup', label: 'Out for Pickup', icon: '🚗', color: 'bg-purple-100 text-purple-800', step: 3 },
    { value: 'pickup-completed', label: 'Picked Up', icon: '📦', color: 'bg-indigo-100 text-indigo-800', step: 4 },
    { value: 'wash-in-progress', label: 'Washing', icon: '🧼', color: 'bg-cyan-100 text-cyan-800', step: 5 },
    { value: 'wash-completed', label: 'Drying', icon: '💨', color: 'bg-sky-100 text-sky-800', step: 6 },
    { value: 'out-for-delivery', label: 'Quality Check', icon: '🔍', color: 'bg-pink-100 text-pink-800', step: 7 },
    { value: 'delivery-completed', label: 'Delivery', icon: '🚚', color: 'bg-orange-100 text-orange-800', step: 8 },
    { value: 'cancelled', label: 'Completed', icon: '✨', color: 'bg-green-100 text-green-800', step: 9 }
  ];

  // Sample orders for testing
  const generateSampleOrders = () => {
    return [
      {
        _id: '1',
        orderNumber: 'ORD-2025-001',
        status: 'order-placed',
        customerInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 234-567-8900',
          address: { street: '123 Main St', city: 'New York' }
        },
        items: [
          { name: 'Shirt - Dry Clean', quantity: 3, price: 150 },
          { name: 'Pants - Iron', quantity: 2, price: 100 }
        ],
        totalAmount: 650,
        createdAt: new Date().toISOString(),
        statusHistory: [
          { status: 'order-placed', note: 'Order received', timestamp: new Date().toISOString() }
        ]
      },
      {
        _id: '2',
        orderNumber: 'ORD-2025-002',
        status: 'wash-in-progress',
        customerInfo: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 234-567-8901',
          address: { street: '456 Oak Ave', city: 'Los Angeles' }
        },
        items: [
          { name: 'Dress - Dry Clean', quantity: 1, price: 300 },
          { name: 'Suit - Premium Clean', quantity: 1, price: 500 }
        ],
        totalAmount: 800,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        deliveryBoyId: { name: 'Mike Driver' },
        statusHistory: [
          { status: 'order-placed', note: 'Order received', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { status: 'wash-in-progress', note: 'Washing started', timestamp: new Date().toISOString() }
        ]
      },
      {
        _id: '3',
        orderNumber: 'ORD-2025-003',
        status: 'order-accepted',
        customerInfo: {
          name: 'Robert Johnson',
          email: 'robert.j@example.com',
          phone: '+1 234-567-8902',
          address: { street: '789 Pine Rd', city: 'Chicago' }
        },
        items: [
          { name: 'Bedsheet - Wash & Fold', quantity: 4, price: 80 },
          { name: 'Blanket - Dry Clean', quantity: 2, price: 200 }
        ],
        totalAmount: 720,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        statusHistory: [
          { status: 'order-placed', note: 'Order received', timestamp: new Date(Date.now() - 172800000).toISOString() },
          { status: 'order-accepted', note: 'Order confirmed', timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]
      },
      {
        _id: '4',
        orderNumber: 'ORD-2025-004',
        status: 'delivery-completed',
        customerInfo: {
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          phone: '+1 234-567-8903',
          address: { street: '321 Elm St', city: 'Houston' }
        },
        items: [
          { name: 'Jacket - Dry Clean', quantity: 2, price: 250 },
          { name: 'Scarf - Delicate Wash', quantity: 3, price: 50 }
        ],
        totalAmount: 650,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        deliveryBoyId: { name: 'Sarah Delivery' },
        statusHistory: [
          { status: 'order-placed', note: 'Order received', timestamp: new Date(Date.now() - 259200000).toISOString() },
          { status: 'delivery-completed', note: 'Delivered successfully', timestamp: new Date().toISOString() }
        ]
      },
      {
        _id: '5',
        orderNumber: 'ORD-2025-005',
        status: 'out-for-pickup',
        customerInfo: {
          name: 'Michael Brown',
          email: 'michael.b@example.com',
          phone: '+1 234-567-8904',
          address: { street: '555 Maple Dr', city: 'Phoenix' }
        },
        items: [
          { name: 'Curtains - Dry Clean', quantity: 6, price: 150 },
          { name: 'Pillow Covers - Wash', quantity: 8, price: 40 }
        ],
        totalAmount: 1220,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        deliveryBoyId: { name: 'Tom Pickup' },
        statusHistory: [
          { status: 'order-placed', note: 'Order received', timestamp: new Date(Date.now() - 43200000).toISOString() },
          { status: 'out-for-pickup', note: 'Driver dispatched', timestamp: new Date().toISOString() }
        ]
      }
    ];
  };

  useEffect(() => {
    const ensureAdminAccess = async () => {
      if (isAuthorized) {
        setCheckingAuth(false);
        return;
      }
      setCheckingAuth(true);
      if (!user) {
        setCheckingAuth(false);
        navigate('/admin-login-test');
        return;
      }
      if (user.role !== 'admin') {
        setCheckingAuth(false);
        navigate('/');
        return;
      }
      let token = localStorage.getItem('token');
      console.log('AdminOrderManagement: Current token status:', token ? 'Present' : 'Missing');
      if (!token && typeof adminDemoLogin === 'function') {
        console.log('AdminOrderManagement: No token found, calling adminDemoLogin');
        try {
          await adminDemoLogin();
          token = localStorage.getItem('token');
          console.log('AdminOrderManagement: Token after adminDemoLogin:', token ? 'Present' : 'Missing');
        } catch (err) {
          console.error('AdminOrderManagement: Error in adminDemoLogin:', err);
          setCheckingAuth(false);
          navigate('/admin-login-test');
          return;
        }
      }
      if (!token) {
        console.log('AdminOrderManagement: Still no token after adminDemoLogin, redirecting to login');
        setCheckingAuth(false);
        navigate('/admin-login-test');
        return;
      }
      console.log('AdminOrderManagement: Token found, setting authorized');
      setIsAuthorized(true);
      setAuthRetryAttempted(false);
      setCheckingAuth(false);
    };
    ensureAdminAccess();
  }, [user, adminDemoLogin, navigate, isAuthorized]);

  const handleUnauthorized = async () => {
    console.log('AdminOrderManagement: Handling unauthorized access');
    if (authRetryAttempted) {
      console.log('AdminOrderManagement: Auth retry already attempted, redirecting to login');
      setIsAuthorized(false);
      navigate('/admin-login-test');
      return false;
    }
    if (typeof adminDemoLogin === 'function') {
      try {
        console.log('AdminOrderManagement: Calling adminDemoLogin for reauthorization');
        setAuthRetryAttempted(true);
        await adminDemoLogin();
        const token = localStorage.getItem('token');
        console.log('AdminOrderManagement: Token after reauthorization:', token ? 'Present' : 'Missing');
        if (token) {
          setIsAuthorized(true);
          return true;
        }
      } catch (error) {
        console.error('AdminOrderManagement: Error in reauthorization:', error);
        setIsAuthorized(false);
        navigate('/admin-login-test');
        return false;
      }
    }
    setIsAuthorized(false);
    navigate('/admin-login-test');
    return false;
  };

  const fetchOrders = async () => {
    if (!isAuthorized) {
      return;
    }
    try {
      setLoading(true);
      const response = await api.get('/orders', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          search: searchTerm || undefined
        }
      });
      
      // Correctly extract orders from the paginated response
      const ordersData = response.data.orders || [];
      
      // Ensure ordersData is an array
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } else {
        // Fallback to empty array if no orders
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const reauthorized = await handleUnauthorized();
        if (reauthorized) {
          await fetchOrders();
        }
        return;
      }
      console.error('Error fetching orders:', error);
      // Fallback to empty array on error
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    if (!isAuthorized) {
      return;
    }
    try {
      const response = await api.get('/auth/users', {
        params: { role: 'deliveryBoy' }
      });
      if (Array.isArray(response.data.users)) {
        setStaffMembers(response.data.users);
      } else {
        setStaffMembers([]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const reauthorized = await handleUnauthorized();
        if (reauthorized) {
          await fetchStaff();
        }
        return;
      }
      console.error('Error fetching staff:', error);
      setStaffMembers([
        { _id: '1', name: 'Mike Johnson', email: 'mike@fabrico.com' },
        { _id: '2', name: 'Sarah Wilson', email: 'sarah@fabrico.com' },
        { _id: '3', name: 'Tom Parker', email: 'tom@fabrico.com' }
      ]);
    }
  };

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }
    fetchOrders();
    fetchStaff();
  }, [statusFilter, isAuthorized]);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        const filtered = orders.filter(order =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
      } else {
        setFilteredOrders(orders);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, orders, isAuthorized]);

  const getStatusInfo = (status) => {
    return workflowStatuses.find(s => s.value === status) || workflowStatuses[0];
  };

  const getNextStatus = (currentStatus) => {
    const current = getStatusInfo(currentStatus);
    const nextStep = workflowStatuses.find(s => s.step === current.step + 1);
    return nextStep || null;
  };

  const updateOrderStatus = async (orderId, newStatus, note = '') => {
    try {
      setLoading(true);
      await api.patch(`/orders/${orderId}/status`, {
        status: newStatus,
        note: note || `Status updated to ${getStatusInfo(newStatus).label}`
      });
      await fetchOrders();
      if (selectedOrder?._id === orderId) {
        const updated = await api.get(`/orders/${orderId}`);
        setSelectedOrder(updated.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const reauthorized = await handleUnauthorized();
        if (reauthorized) {
          await updateOrderStatus(orderId, newStatus, note);
        }
        return;
      }
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const assignStaffToOrder = async (orderId) => {
    if (!selectedStaff) {
      alert('Please select a staff member');
      return;
    }
    try {
      setLoading(true);
      await api.patch(`/orders/${orderId}/assign`, {
        deliveryBoyId: selectedStaff
      });
      await fetchOrders();
      setShowStaffModal(false);
      setSelectedStaff('');
      alert('Staff assigned successfully');
    } catch (error) {
      console.error('Error assigning staff:', error);
      alert('Failed to assign staff');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (orderId) => {
    try {
      const response = await api.get(`/invoice/${orderId}`);
      const invoiceWindow = window.open('', '_blank');
      invoiceWindow.document.write(generateInvoiceHTML(response.data));
      invoiceWindow.document.close();
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice');
    }
  };

  const generateInvoiceHTML = (invoice) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .company-info { flex: 1; }
          .invoice-info { text-align: right; }
          .customer-info { margin: 20px 0; padding: 20px; background: #f5f5f5; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #4F46E5; color: white; }
          .total-row { font-weight: bold; background: #f9f9f9; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #4F46E5; text-align: center; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>🧺 ${invoice.companyInfo.name}</h1>
            <p>${invoice.companyInfo.address}</p>
            <p>Phone: ${invoice.companyInfo.phone}</p>
            <p>Email: ${invoice.companyInfo.email}</p>
          </div>
          <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>${invoice.invoiceNumber}</strong></p>
            <p>Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p>Order: ${invoice.orderNumber}</p>
          </div>
        </div>
        <div class="customer-info">
          <h3>Bill To:</h3>
          <p><strong>${invoice.customer.name}</strong></p>
          <p>${invoice.customer.email}</p>
          <p>${invoice.customer.phone}</p>
          <p>${invoice.customer.address.street}, ${invoice.customer.address.city}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${item.subtotal.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3">Subtotal</td>
              <td>₹${invoice.pricing.subtotal}</td>
            </tr>
            <tr>
              <td colspan="3">Tax (10%)</td>
              <td>₹${invoice.pricing.tax}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>TOTAL</strong></td>
              <td><strong>₹${invoice.pricing.total}</strong></td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>Thank you for your business!</p>
          <button onclick="window.print()" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Invoice</button>
        </div>
      </body>
      </html>
    `;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const OrderDetailModal = ({ order, onClose }) => {
    const currentStatus = getStatusInfo(order.status);
    const nextStatus = getNextStatus(order.status);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h2>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${currentStatus.color} mt-2`}>
                  {currentStatus.icon} {currentStatus.label}
                </span>
              </div>
              <button onClick={onClose} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Progress</h3>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                {workflowStatuses.filter(s => s.step > 0 && s.step < 9).map((status, idx) => (
                  <div key={status.value} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        status.step <= currentStatus.step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {status.icon}
                      </div>
                      <span className="text-xs mt-2 text-center font-medium">{status.label}</span>
                    </div>
                    {idx < workflowStatuses.filter(s => s.step > 0 && s.step < 9).length - 1 && (
                      <ChevronRightIcon className="w-6 h-6 text-gray-400 mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {order.customerInfo.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">{order.customerInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>{order.customerInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <PhoneIcon className="w-5 h-5" />
                    <span>{order.customerInfo.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-blue-800">
                    <MapPinIcon className="w-5 h-5 mt-0.5" />
                    <span>
                      {order.customerInfo.address?.street}, {order.customerInfo.address?.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-green-700" />
                    <div>
                      <p className="text-sm text-green-700">Order Date</p>
                      <p className="font-bold text-green-900">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CurrencyDollarIcon className="w-5 h-5 text-green-700" />
                    <div>
                      <p className="text-sm text-green-700">Total Amount</p>
                      <p className="font-bold text-2xl text-green-900">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  {order.deliveryBoyId && (
                    <div className="flex items-center gap-3">
                      <TruckIcon className="w-5 h-5 text-green-700" />
                      <div>
                        <p className="text-sm text-green-700">Assigned Staff</p>
                        <p className="font-bold text-green-900">{order.deliveryBoyId.name || 'Staff Member'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Order Items</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Item</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-3 text-gray-900">{item.name}</td>
                        <td className="px-6 py-3 text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-3 text-gray-900">₹{item.price.toFixed(2)}</td>
                        <td className="px-6 py-3 text-gray-900 font-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap pt-6 border-t border-gray-200">
              {nextStatus && order.status !== 'cancelled' && (
                <button
                  onClick={() => updateOrderStatus(order._id, nextStatus.value)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Move to: {nextStatus.label}
                </button>
              )}
              <button
                onClick={() => {
                  setShowStaffModal(true);
                  setShowOrderModal(false);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                <UserPlusIcon className="w-5 h-5" />
                Assign Staff
              </button>
              <button
                onClick={() => generateInvoice(order._id)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                <DocumentTextIcon className="w-5 h-5" />
                Generate Invoice
              </button>
              {order.status !== 'cancelled' && currentStatus.step < 4 && (
                <button
                  onClick={() => updateOrderStatus(order._id, 'cancelled', 'Order cancelled by admin')}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  <XCircleIcon className="w-5 h-5" />
                  Cancel Order
                </button>
              )}
            </div>

            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Status History</h3>
                <div className="space-y-3">
                  {order.statusHistory.slice().reverse().map((history, idx) => (
                    <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{getStatusInfo(history.status).label}</p>
                        <p className="text-sm text-gray-600">{history.note}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(history.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StaffAssignmentModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Assign Staff Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <XCircleIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Staff Member
          </label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select a staff member...</option>
            {staffMembers.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name} - {staff.email}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => assignStaffToOrder(selectedOrder._id)}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
            disabled={!selectedStaff}
          >
            Assign
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const exportOrders = async (format) => {
    try {
      setExportLoading(true);
      const response = await api.get(`/orders/export/${format}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-export.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error exporting orders as ${format}:`, error);
      alert(`Failed to export orders as ${format.toUpperCase()}`);
    } finally {
      setExportLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                🛍️ Admin Order Management
              </h1>
              <p className="text-gray-600 mt-1">Manage workflow, assign staff, and generate invoices</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button
                  onClick={() => exportOrders('csv')}
                  disabled={exportLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  {exportLoading ? 'Exporting...' : 'Export CSV'}
                </button>
              </div>
              <div className="relative">
                <button
                  onClick={() => exportOrders('pdf')}
                  disabled={exportLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 disabled:opacity-50"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  {exportLoading ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
              <button
                onClick={fetchOrders}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700"
              >
                <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              {workflowStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Orders', value: filteredOrders.length, icon: '📊', color: 'from-blue-500 to-blue-600' },
            { label: 'Pending', value: filteredOrders.filter(o => o.status === 'order-placed').length, icon: '⏳', color: 'from-yellow-500 to-yellow-600' },
            { label: 'In Progress', value: filteredOrders.filter(o => ['wash-in-progress', 'wash-completed'].includes(o.status)).length, icon: '🔄', color: 'from-purple-500 to-purple-600' },
            { label: 'Completed', value: filteredOrders.filter(o => o.status === 'delivery-completed').length, icon: '✅', color: 'from-green-500 to-green-600' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-white shadow-lg`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <ArrowPathIcon className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{order.orderNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.customerInfo.name}</div>
                          <div className="text-sm text-gray-600">{order.customerInfo.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo(order.status).color}`}>
                          {getStatusInfo(order.status).icon} {getStatusInfo(order.status).label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {order.items?.length || order.totalItems} items
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStaffModal(true);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Assign Staff"
                          >
                            <UserPlusIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => generateInvoice(order._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Generate Invoice"
                          >
                            <DocumentTextIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showOrderModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}

      {showStaffModal && selectedOrder && (
        <StaffAssignmentModal
          onClose={() => {
            setShowStaffModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminOrderManagement;
