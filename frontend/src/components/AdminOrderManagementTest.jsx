// Test component to bypass auth and directly test order display
import React, { useState, useEffect } from 'react';
import {
  EyeIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  TruckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const AdminOrderManagementTest = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get token from localStorage
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Fetch orders with token
      const response = await api.get('/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 20
        }
      });
      
      console.log('Orders API response:', response.data);
      
      // Extract orders correctly
      const ordersData = response.data.orders || [];
      setOrders(ordersData);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      // Set sample data for testing
      setOrders([
        {
          _id: 'test-1',
          orderNumber: 'TEST-001',
          status: 'order-placed',
          customerInfo: {
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '+1234567890',
            address: { street: '123 Test St', city: 'Test City' }
          },
          items: [{ name: 'Test Item', quantity: 1, price: 100 }],
          totalAmount: 100,
          createdAt: new Date().toISOString(),
          userId: { name: 'Test User', email: 'test@example.com' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    return workflowStatuses.find(s => s.value === status) || workflowStatuses[0];
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

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
        <div className="text-center">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                🧪 Test Order Management
              </h1>
              <p className="text-gray-600 mt-1">Debugging component - bypasses auth</p>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="text-lg font-bold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <p className="text-red-600 mt-2 text-sm">Displaying sample data for testing</p>
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
              <p className="text-gray-500">Try refreshing or check console for errors</p>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
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
                          {order.items?.length || order.totalItems || 0} items
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">₹{order.totalAmount?.toFixed(2) || '0.00'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
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
    </div>
  );
};

export default AdminOrderManagementTest;