import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PrinterIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock order data with comprehensive details
  const mockOrders = [
    {
      id: 'ORD-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      customerPhone: '+1 (555) 123-4567',
      customerAddress: '123 Main St, Apt 4B, New York, NY 10001',
      items: [
        { name: 'Shirt', quantity: 3, service: 'Wash & Fold', price: 15.00 },
        { name: 'Pants', quantity: 2, service: 'Dry Clean', price: 20.00 },
        { name: 'Dress', quantity: 1, service: 'Steam Press', price: 12.00 }
      ],
      totalAmount: 47.00,
      status: 'In Progress',
      priority: 'Normal',
      orderDate: '2024-01-15T10:30:00Z',
      pickupDate: '2024-01-16T14:00:00Z',
      deliveryDate: '2024-01-18T16:00:00Z',
      assignedStaff: 'Sarah Johnson',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card',
      specialInstructions: 'Handle with care, delicate fabrics',
      orderHistory: [
        { status: 'Order Placed', timestamp: '2024-01-15T10:30:00Z', note: 'Order received from customer' },
        { status: 'Pickup Scheduled', timestamp: '2024-01-15T11:00:00Z', note: 'Pickup scheduled for tomorrow' },
        { status: 'Items Collected', timestamp: '2024-01-16T14:15:00Z', note: 'Items collected from customer address' },
        { status: 'In Progress', timestamp: '2024-01-16T15:00:00Z', note: 'Processing started' }
      ]
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@email.com',
      customerPhone: '+1 (555) 987-6543',
      customerAddress: '456 Oak Ave, Suite 12, Los Angeles, CA 90210',
      items: [
        { name: 'Bedsheet Set', quantity: 1, service: 'Wash & Fold', price: 25.00 },
        { name: 'Pillowcases', quantity: 4, service: 'Wash & Fold', price: 16.00 }
      ],
      totalAmount: 41.00,
      status: 'Ready for Pickup',
      priority: 'High',
      orderDate: '2024-01-14T09:15:00Z',
      pickupDate: '2024-01-15T10:00:00Z',
      deliveryDate: '2024-01-17T14:00:00Z',
      assignedStaff: 'Mike Wilson',
      paymentStatus: 'Paid',
      paymentMethod: 'PayPal',
      specialInstructions: 'Use hypoallergenic detergent',
      orderHistory: [
        { status: 'Order Placed', timestamp: '2024-01-14T09:15:00Z', note: 'Order received from customer' },
        { status: 'Items Collected', timestamp: '2024-01-15T10:30:00Z', note: 'Items collected successfully' },
        { status: 'Processing', timestamp: '2024-01-15T11:00:00Z', note: 'Items being processed' },
        { status: 'Quality Check', timestamp: '2024-01-16T16:00:00Z', note: 'Quality check completed' },
        { status: 'Ready for Pickup', timestamp: '2024-01-17T09:00:00Z', note: 'Items ready for delivery' }
      ]
    },
    {
      id: 'ORD-2024-003',
      customerName: 'Robert Johnson',
      customerEmail: 'robert.j@email.com',
      customerPhone: '+1 (555) 456-7890',
      customerAddress: '789 Pine St, Chicago, IL 60601',
      items: [
        { name: 'Suit', quantity: 1, service: 'Dry Clean', price: 35.00 },
        { name: 'Tie', quantity: 2, service: 'Steam Press', price: 8.00 }
      ],
      totalAmount: 43.00,
      status: 'Completed',
      priority: 'Normal',
      orderDate: '2024-01-12T14:20:00Z',
      pickupDate: '2024-01-13T11:00:00Z',
      deliveryDate: '2024-01-15T15:30:00Z',
      assignedStaff: 'Emily Davis',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      specialInstructions: 'Press suit for business meeting',
      orderHistory: [
        { status: 'Order Placed', timestamp: '2024-01-12T14:20:00Z', note: 'Order received' },
        { status: 'Items Collected', timestamp: '2024-01-13T11:15:00Z', note: 'Items collected' },
        { status: 'Processing', timestamp: '2024-01-13T12:00:00Z', note: 'Dry cleaning started' },
        { status: 'Quality Check', timestamp: '2024-01-14T16:00:00Z', note: 'Quality approved' },
        { status: 'Out for Delivery', timestamp: '2024-01-15T14:00:00Z', note: 'Out for delivery' },
        { status: 'Completed', timestamp: '2024-01-15T15:30:00Z', note: 'Delivered successfully' }
      ]
    }
  ];

  useEffect(() => {
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Ready for Pickup': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Normal': return 'bg-blue-100 text-blue-800';
      case 'Low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'In Progress': return <ClockIcon className="w-5 h-5 text-blue-600" />;
      case 'Ready for Pickup': return <TruckIcon className="w-5 h-5 text-yellow-600" />;
      case 'Cancelled': return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        updatedOrder.orderHistory.push({
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: `Status updated to ${newStatus}`
        });
        return updatedOrder;
      }
      return order;
    }));
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

  const OrderModal = ({ order, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{order.id}</h2>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(order.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority} Priority
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <PrinterIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                <DocumentArrowDownIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {order.customerName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-600">Customer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <PhoneIcon className="w-5 h-5" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPinIcon className="w-5 h-5 mt-0.5" />
                  <span>{order.customerAddress}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <CalendarIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Order Date</p>
                    <p className="font-medium text-gray-900">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <TruckIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Pickup Date</p>
                    <p className="font-medium text-gray-900">{formatDate(order.pickupDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <CurrencyDollarIcon className="w-5 h-5" />
                  <div>
                    <p className="text-sm">Total Amount</p>
                    <p className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned Staff</p>
                  <p className="font-medium text-gray-900">{order.assignedStaff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Item</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Service</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 text-gray-600">{item.service}</td>
                      <td className="px-4 py-3 text-gray-900 font-medium">${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
            <div className="space-y-4">
              {order.orderHistory.map((history, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{history.status}</h4>
                      <span className="text-sm text-gray-500">{formatDate(history.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="flex gap-2 flex-wrap">
              {['Order Placed', 'Items Collected', 'In Progress', 'Quality Check', 'Ready for Pickup', 'Out for Delivery', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(order.id, status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    order.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Order Placed">Order Placed</option>
            <option value="In Progress">In Progress</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <FunnelIcon className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Items</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-sm text-gray-600">{order.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(order.priority)}`}>
                    {order.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">${order.totalAmount.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{formatDate(order.orderDate)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Edit Order"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Order"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;
