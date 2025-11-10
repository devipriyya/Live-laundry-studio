import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  UserIcon,
  PhoneIcon,
  HomeIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const DeliveryBoyDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedToday: 0,
    pendingPickups: 0,
    pendingDeliveries: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://washlab.onrender.com/api';

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/my-deliveries`, {
        params: { status: activeTab === 'all' ? 'all' : undefined },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filteredOrders = response.data.orders || [];
      
      // Filter based on active tab
      if (activeTab === 'pending') {
        filteredOrders = filteredOrders.filter(order => 
          ['out-for-pickup', 'pickup-completed', 'out-for-delivery'].includes(order.status)
        );
      } else if (activeTab === 'completed') {
        filteredOrders = filteredOrders.filter(order => 
          order.status === 'delivery-completed'
        );
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Use mock data for demo
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/my-deliveries/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use mock stats
      setStats({
        totalDeliveries: 45,
        activeDeliveries: 5,
        completedToday: 8,
        pendingPickups: 2,
        pendingDeliveries: 3
      });
    }
  };

  const getMockOrders = () => {
    return [
      {
        _id: '1',
        orderNumber: 'ORD-2024-001',
        status: 'out-for-pickup',
        customerInfo: {
          name: 'John Doe',
          phone: '+1 (555) 123-4567',
          address: {
            street: '123 Main St, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
          }
        },
        items: [
          { name: 'Shirts', quantity: 5, service: 'Wash & Iron' },
          { name: 'Pants', quantity: 3, service: 'Dry Clean' }
        ],
        totalAmount: 450,
        pickupDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '2',
        orderNumber: 'ORD-2024-002',
        status: 'out-for-delivery',
        customerInfo: {
          name: 'Jane Smith',
          phone: '+1 (555) 987-6543',
          address: {
            street: '456 Oak Ave, Suite 12',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210'
          }
        },
        items: [
          { name: 'Dresses', quantity: 2, service: 'Dry Clean' },
          { name: 'Curtains', quantity: 1, service: 'Wash & Fold' }
        ],
        totalAmount: 650,
        deliveryDate: new Date().toISOString()
      }
    ];
  };

  const updateOrderStatus = async (orderId, newStatus, note = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/orders/${orderId}/delivery-status`,
        { status: newStatus, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh orders and stats
      fetchOrders();
      fetchStats();
      setShowDetailModal(false);
      
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'out-for-pickup': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'pickup-completed': 'bg-blue-100 text-blue-800 border-blue-300',
      'out-for-delivery': 'bg-purple-100 text-purple-800 border-purple-300',
      'delivery-completed': 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'out-for-pickup': 'Out for Pickup',
      'pickup-completed': 'Pickup Completed',
      'out-for-delivery': 'Out for Delivery',
      'delivery-completed': 'Delivered'
    };
    return labels[status] || status;
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'out-for-pickup': 'pickup-completed',
      'pickup-completed': 'out-for-delivery',
      'out-for-delivery': 'delivery-completed'
    };
    return statusFlow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    return nextStatus ? getStatusLabel(nextStatus) : null;
  };

  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{order.orderNumber}</h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">{order.customerInfo.name}</p>
                <p className="text-gray-600 flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  {order.customerInfo.phone}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  {order.customerInfo.address.street}, {order.customerInfo.address.city}, {order.customerInfo.address.state} {order.customerInfo.address.zipCode}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Item</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Service</th>
                      <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{item.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{item.service}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex justify-between items-center font-semibold text-lg">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {order.status !== 'delivery-completed' && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const nextStatus = getNextStatus(order.status);
                    if (nextStatus) {
                      updateOrderStatus(order._id, nextStatus, `Status updated to ${getStatusLabel(nextStatus)}`);
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Mark as {getNextStatusLabel(order.status)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <TruckIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-orange-600">{stats.activeDeliveries}</p>
              </div>
              <TruckIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Pickups</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingPickups}</p>
              </div>
              <MapPinIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Deliveries</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pendingDeliveries}</p>
              </div>
              <HomeIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'pending'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending Orders
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'completed'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'all'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All Orders
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetailModal(true);
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">{order.customerInfo.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">
                          {order.customerInfo.address.street}, {order.customerInfo.address.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{order.customerInfo.phone}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-sm font-medium text-gray-900">
                        {order.items.length} items
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryBoyDashboard;
