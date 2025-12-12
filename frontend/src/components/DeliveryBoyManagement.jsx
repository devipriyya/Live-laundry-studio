import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const DeliveryBoyManagement = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [filteredDeliveryBoys, setFilteredDeliveryBoys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch delivery boys from API
  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/delivery-boys');
      setDeliveryBoys(response.data.deliveryBoys || []);
      setFilteredDeliveryBoys(response.data.deliveryBoys || []);
    } catch (error) {
      console.error('Error fetching delivery boys:', error);
      // Fallback to mock data
      const mockDeliveryBoys = [
        {
          _id: '1',
          name: 'Mike Johnson',
          email: 'mike.johnson@fabrico.com',
          phone: '+1 (555) 123-4567',
          role: 'deliveryBoy',
          status: 'Active',
          activeOrders: 5,
          completedOrders: 120,
          rating: 4.8,
          joinDate: '2023-05-15',
          address: '123 Main St, New York, NY 10001'
        },
        {
          _id: '2',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@fabrico.com',
          phone: '+1 (555) 234-5678',
          role: 'deliveryBoy',
          status: 'Active',
          activeOrders: 3,
          completedOrders: 95,
          rating: 4.9,
          joinDate: '2023-07-22',
          address: '456 Oak Ave, Los Angeles, CA 90210'
        },
        {
          _id: '3',
          name: 'Tom Parker',
          email: 'tom.parker@fabrico.com',
          phone: '+1 (555) 345-6789',
          role: 'deliveryBoy',
          status: 'On Leave',
          activeOrders: 0,
          completedOrders: 78,
          rating: 4.6,
          joinDate: '2023-09-10',
          address: '789 Pine Rd, Chicago, IL 60601'
        }
      ];
      setDeliveryBoys(mockDeliveryBoys);
      setFilteredDeliveryBoys(mockDeliveryBoys);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  useEffect(() => {
    let filtered = deliveryBoys;

    if (searchTerm) {
      filtered = filtered.filter(boy =>
        boy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boy.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'Active') {
        filtered = filtered.filter(boy => !boy.isBlocked);
      } else if (statusFilter === 'Inactive') {
        filtered = filtered.filter(boy => boy.isBlocked);
      }
    }

    setFilteredDeliveryBoys(filtered);
  }, [searchTerm, statusFilter, deliveryBoys]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Blocked': 
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DeliveryBoyModal = ({ deliveryBoy, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      deliveryBoy ? {
        ...deliveryBoy,
        isBlocked: deliveryBoy.isBlocked || false
      } : {
        name: '',
        email: '',
        phone: '',
        password: '',
        isBlocked: false
      }
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (deliveryBoy) {
          // Update existing delivery boy
          await api.put(`/auth/delivery-boys/${deliveryBoy._id}`, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          });
          
          // If isBlocked status changed, update it separately
          if (formData.isBlocked !== deliveryBoy.isBlocked) {
            await api.patch(`/auth/delivery-boys/${deliveryBoy._id}/block`, { 
              isBlocked: formData.isBlocked 
            });
          }
        } else {
          // Create new delivery boy - only send the required fields
          await api.post('/auth/delivery-boys', {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          });
        }
        await fetchDeliveryBoys();
        onClose();
      } catch (error) {
        console.error('Error saving delivery boy:', error);
        alert('Failed to save delivery boy');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {deliveryBoy ? 'Edit Delivery Boy' : 'Add New Delivery Boy'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {!deliveryBoy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required={!deliveryBoy}
                  />
                </div>
              )}

              {deliveryBoy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <div className="flex items-center">
                    <span className={`mr-3 ${formData.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                      {formData.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isBlocked: !formData.isBlocked})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isBlocked ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {deliveryBoy ? 'Update Delivery Boy' : 'Add Delivery Boy'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Performance Modal
  const PerformanceModal = ({ deliveryBoy, onClose }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await api.get(`/auth/delivery-boys/${deliveryBoy._id}/orders`);
          setOrders(response.data.orders || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      fetchOrders();
    }, [deliveryBoy]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ChartBarIcon className="w-7 h-7 text-purple-600" />
                  Performance Analytics - {deliveryBoy.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Detailed performance metrics and order history</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <TruckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Active Orders</p>
                    <p className="text-2xl font-bold text-blue-900">{deliveryBoy.activeOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-green-900">{deliveryBoy.completedOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <StarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Rating</p>
                    <p className="text-2xl font-bold text-purple-900">{deliveryBoy.rating}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600 p-2 rounded-lg">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Joined</p>
                    <p className="text-sm font-bold text-orange-900">
                      {new Date(deliveryBoy.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                Recent Orders
              </h3>
              
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Order #</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.slice(0, 10).map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{order.customerInfo?.name}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">₹{order.totalAmount}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Assign Order Modal
  const AssignOrderModal = ({ deliveryBoy, onClose }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);

    useEffect(() => {
      const fetchUnassignedOrders = async () => {
        try {
          const response = await api.get('/orders', {
            params: { status: 'order-accepted' }
          });
          setOrders(response.data.orders || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      fetchUnassignedOrders();
    }, []);

    const handleAssignOrders = async () => {
      try {
        for (const orderId of selectedOrders) {
          await api.patch(`/orders/${orderId}/assign`, {
            deliveryBoyId: deliveryBoy._id
          });
        }
        alert(`${selectedOrders.length} order(s) assigned successfully`);
        onClose();
      } catch (error) {
        console.error('Error assigning orders:', error);
        alert('Failed to assign orders');
      }
    };

    const toggleOrderSelection = (orderId) => {
      setSelectedOrders(prev =>
        prev.includes(orderId)
          ? prev.filter(id => id !== orderId)
          : [...prev, orderId]
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                  Assign Orders to {deliveryBoy.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Select orders to assign to this delivery boy</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Available Orders */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No available orders to assign</p>
                </div>
              ) : (
                orders.map(order => (
                  <div
                    key={order._id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOrders.includes(order._id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => toggleOrderSelection(order._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => toggleOrderSelection(order._id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerInfo?.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{order.totalAmount}</p>
                        <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAssignOrders}
                disabled={selectedOrders.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Assign {selectedOrders.length > 0 && `(${selectedOrders.length})`} Order(s)
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveDeliveryBoy = async (formData, deliveryBoy = null) => {
    try {
      if (deliveryBoy) {
        // Update existing delivery boy
        await api.put(`/auth/users/${deliveryBoy._id}`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: 'deliveryBoy'
        });
        
        // If isBlocked status changed, update it separately
        if (formData.isBlocked !== deliveryBoy.isBlocked) {
          await api.patch(`/auth/delivery-boys/${deliveryBoy._id}/block`, { 
            isBlocked: formData.isBlocked 
          });
        }
      } else {
        // Create new delivery boy - only send the required fields
        await api.post('/auth/delivery-boys', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      }
      await fetchDeliveryBoys();
      onClose();
    } catch (error) {
      console.error('Error saving delivery boy:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to save delivery boy. Please try again.';
      
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else {
            errorMessage = 'Invalid data provided. Please check all fields are filled correctly.';
          }
        } else if (error.response.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied. You do not have permission to perform this action.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteDeliveryBoy = async (deliveryBoyId) => {
    if (window.confirm('Are you sure you want to delete this delivery boy?')) {
      try {
        await api.delete(`/auth/delivery-boys/${deliveryBoyId}`);
        await fetchDeliveryBoys();
      } catch (error) {
        console.error('Error deleting delivery boy:', error);
        alert('Failed to delete delivery boy');
      }
    }
  };

  const handleBlockUnblock = async (deliveryBoyId, isBlocked) => {
    try {
      await api.patch(`/auth/delivery-boys/${deliveryBoyId}/block`, { isBlocked });
      await fetchDeliveryBoys();
    } catch (error) {
      console.error('Error updating delivery boy status:', error);
      alert('Failed to update delivery boy status');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Boy Management</h1>
        <p className="text-gray-600">Manage delivery personnel, assignments, and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Delivery Boys</p>
              <p className="text-2xl font-bold text-gray-900">{deliveryBoys.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryBoys.filter(boy => !boy.isBlocked).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircleIcon className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryBoys.filter(boy => boy.isBlocked).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TruckIcon className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryBoys.reduce((sum, boy) => sum + boy.activeOrders, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <StarIcon className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {deliveryBoys.length > 0 
                  ? (deliveryBoys.reduce((sum, boy) => sum + boy.rating, 0) / deliveryBoys.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search delivery boys by name or email..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Blocked</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Delivery Boy
          </button>
        </div>
      </div>

      {/* Delivery Boys Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delivery boys...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Delivery Boy</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Contact</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Performance</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Orders</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDeliveryBoys.map((boy) => (
                <tr key={boy._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <TruckIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{boy.name}</div>
                        <div className="text-sm text-gray-600">{boy.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{boy.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(boy.isBlocked ? 'Inactive' : 'Active')}`}>
                      {boy.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-gray-900">{boy.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Active: {boy.activeOrders}</div>
                      <div>Completed: {boy.completedOrders}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedDeliveryBoy(boy);
                          setShowPerformanceModal(true);
                        }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="View Performance"
                      >
                        <ChartBarIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDeliveryBoy(boy);
                          setShowAssignOrderModal(true);
                        }}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Assign Orders"
                      >
                        <ClipboardDocumentListIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDeliveryBoy(boy);
                          setShowAddModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDeliveryBoy(boy._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <DeliveryBoyModal
          deliveryBoy={selectedDeliveryBoy}
          onClose={() => {
            setShowAddModal(false);
            setSelectedDeliveryBoy(null);
          }}
          onSave={handleSaveDeliveryBoy}
        />
      )}

      {/* Performance Modal */}
      {showPerformanceModal && selectedDeliveryBoy && (
        <PerformanceModal
          deliveryBoy={selectedDeliveryBoy}
          onClose={() => {
            setShowPerformanceModal(false);
            setSelectedDeliveryBoy(null);
          }}
        />
      )}

      {/* Assign Order Modal */}
      {showAssignOrderModal && selectedDeliveryBoy && (
        <AssignOrderModal
          deliveryBoy={selectedDeliveryBoy}
          onClose={() => {
            setShowAssignOrderModal(false);
            setSelectedDeliveryBoy(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryBoyManagement;