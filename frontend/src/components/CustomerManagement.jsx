import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  StarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
  CheckIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  InformationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch all customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/auth/users');
      console.log('Customer data fetched successfully:', response.data);
      // Filter out admin@gmail.com from the list
      const filteredUsers = response.data.users.filter(user => user.email !== 'admin@gmail.com');
      setCustomers(filteredUsers);
      setFilteredCustomers(filteredUsers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      let errorMessage = 'Failed to load customers. Please try again. Showing sample data.';
      
      // More detailed error message
      if (err.response) {
        console.error('Error response:', err.response);
        if (err.response.status === 401) {
          errorMessage = 'Failed to load customers: Not authorized. Please log in as an administrator to access customer management.';
        } else if (err.response.status === 403) {
          errorMessage = 'Failed to load customers: Access denied. This feature is only available to administrators.';
        } else {
          errorMessage = `Failed to load customers: ${err.response.data.message || err.response.statusText || 'Unknown error'}. Showing sample data.`;
        }
      } else if (err.request) {
        errorMessage = 'Failed to load customers: Server not responding. Please check your connection. Showing sample data.';
      }
      
      setError(errorMessage);
      // Always load sample data as fallback for any error
      loadSampleData();
    } finally {
      setLoading(false);
    }
  };

  // Load sample data for demonstration
  const loadSampleData = () => {
    const sampleCustomers = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8901',
        role: 'customer',
        isBlocked: false,
        addresses: [
          {
            type: 'Home',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            isDefault: true
          }
        ],
        stats: {
          totalOrders: 12,
          totalSpent: 245.50,
          loyaltyPoints: 120,
          memberSince: new Date('2023-01-15')
        }
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 234 567 8902',
        role: 'customer',
        isBlocked: true,
        addresses: [
          {
            type: 'Office',
            address: '456 Business Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            isDefault: true
          }
        ],
        stats: {
          totalOrders: 8,
          totalSpent: 189.75,
          loyaltyPoints: 85,
          memberSince: new Date('2023-03-22')
        }
      },
      {
        _id: '3',
        name: 'Robert Johnson',
        email: 'robert.j@example.com',
        phone: '+1 234 567 8903',
        role: 'delivery',
        isBlocked: false,
        addresses: [],
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          memberSince: new Date('2023-05-10')
        }
      },
      {
        _id: '4',
        name: 'Sarah Williams',
        email: 'sarah.w@example.com',
        phone: '+1 234 567 8904',
        role: 'customer',
        isBlocked: false,
        addresses: [
          {
            type: 'Home',
            address: '789 Park Ave',
            city: 'Boston',
            state: 'MA',
            zipCode: '02101',
            isDefault: true
          }
        ],
        stats: {
          totalOrders: 15,
          totalSpent: 320.25,
          loyaltyPoints: 150,
          memberSince: new Date('2022-11-05')
        }
      },
      {
        _id: '5',
        name: 'Michael Brown',
        email: 'michael.b@example.com',
        phone: '+1 234 567 8905',
        role: 'admin',
        isBlocked: false,
        addresses: [],
        stats: {
          totalOrders: 0,
          totalSpent: 0,
          loyaltyPoints: 0,
          memberSince: new Date('2023-01-10')
        }
      }
    ];
    setCustomers(sampleCustomers);
    setFilteredCustomers(sampleCustomers);
    // Ensure loading is set to false when loading sample data
    setLoading(false);
  };

  // Load sample data immediately if API fails
  useEffect(() => {
    // Try to fetch customers, but if it fails, load sample data after 3 seconds
    fetchCustomers();
    
    // Fallback to sample data if API doesn't respond quickly
    const fallbackTimer = setTimeout(() => {
      if (loading && customers.length === 0) {
        console.log('Loading sample data as fallback');
        loadSampleData();
      }
    }, 3000);
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Filter customers
  useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(customer => customer.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'blocked') {
        filtered = filtered.filter(customer => customer.isBlocked);
      } else if (statusFilter === 'active') {
        filtered = filtered.filter(customer => !customer.isBlocked);
      }
    }

    setFilteredCustomers(filtered);
  }, [searchTerm, statusFilter, roleFilter, customers]);

  // Fetch customer orders
  const fetchCustomerOrders = async (customerId) => {
    try {
      setLoadingOrders(true);
      const response = await api.get(`/auth/users/${customerId}/orders`);
      setCustomerOrders(response.data.orders);
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Handle view customer details
  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
    await fetchCustomerOrders(customer._id);
  };

  // Handle edit customer
  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  // Handle update customer
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/auth/users/${selectedCustomer._id}`, selectedCustomer);
      setCustomers(customers.map(c => 
        c._id === selectedCustomer._id ? response.data.user : c
      ));
      setShowEditModal(false);
      setSelectedCustomer(null);
      alert('Customer updated successfully!');
    } catch (err) {
      console.error('Error updating customer:', err);
      alert('Failed to update customer. Please try again.');
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await api.delete(`/auth/users/${selectedCustomer._id}`);
      setCustomers(customers.filter(c => c._id !== selectedCustomer._id));
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      alert('Customer deleted successfully!');
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer. Please try again.');
    }
  };

  // Handle block/unblock customer
  const handleToggleBlock = async (customer) => {
    try {
      const newBlockStatus = !customer.isBlocked;
      const response = await api.patch(`/auth/users/${customer._id}/block`, {
        isBlocked: newBlockStatus
      });
      setCustomers(customers.map(c => 
        c._id === customer._id ? response.data.user : c
      ));
      alert(newBlockStatus ? 'Customer blocked successfully!' : 'Customer unblocked successfully!');
    } catch (err) {
      console.error('Error toggling block status:', err);
      alert('Failed to update customer status. Please try again.');
    }
  };

  // Get status color
  const getStatusColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'customer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivery': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      'admin': 'Admin',
      'customer': 'Customer',
      'delivery': 'Delivery Staff'
    };
    return roleNames[role] || role;
  };

  // Customer Detail Modal
  const CustomerDetailModal = ({ customer, onClose }) => {
    if (!customer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Customer Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">Customer ID: {customer._id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-700">{customer.phone}</span>
                      </div>
                    )}
                    {customer.addresses && customer.addresses.length > 0 && (
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          {customer.addresses.map((addr, idx) => (
                            <div key={idx} className="text-gray-700 mb-2">
                              <span className="font-medium">{addr.type}:</span> {addr.address}, {addr.city}, {addr.state} {addr.zipCode}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        Joined: {new Date(customer.createdAt || customer.stats?.memberSince).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status & Role</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(customer.role)}`}>
                        {getRoleDisplayName(customer.role)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Account Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        customer.isBlocked 
                          ? 'bg-red-100 text-red-800 border-red-200' 
                          : 'bg-green-100 text-green-800 border-green-200'
                      }`}>
                        {customer.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                    {customer.stats?.loyaltyPoints !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Loyalty Points:</span>
                        <span className="font-medium text-purple-600">{customer.stats.loyaltyPoints}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold text-blue-900">{customer.stats?.totalOrders || 0}</p>
                          <p className="text-sm text-blue-600">Total Orders</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-green-900">${customer.stats?.totalSpent?.toFixed(2) || '0.00'}</p>
                          <p className="text-sm text-green-600">Total Spent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {customer.preferences && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Preferences</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{customer.preferences.language?.toUpperCase() || 'EN'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Currency:</span>
                        <span className="font-medium">{customer.preferences.currency || 'INR'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Theme:</span>
                        <span className="font-medium capitalize">{customer.preferences.theme || 'Light'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h3>
              {loadingOrders ? (
                <div className="text-center py-8 text-gray-500">Loading orders...</div>
              ) : customerOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No orders found</div>
              ) : (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order Number</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customerOrders.slice(0, 5).map((order) => (
                        <tr key={order._id}>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'in-progress' || order.status === 'picked-up' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
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
      </div>
    );
  };

  // Edit Customer Modal
  const EditCustomerModal = ({ customer, onClose, onSave }) => {
    if (!customer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Edit Customer</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={onSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setSelectedCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setSelectedCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={customer.phone || ''}
                  onChange={(e) => setSelectedCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={customer.role}
                  onChange={(e) => setSelectedCustomer({ ...customer, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery Staff</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = ({ customer, onClose, onConfirm }) => {
    if (!customer) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Customer</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Export customers to CSV
  const exportToCSV = () => {
    const headers = ['Name,Email,Phone,Role,Status,Total Orders,Total Spent,Member Since'];
    const csvContent = sortedCustomers.map(customer => {
      return [
        `"${customer.name}"`,
        `"${customer.email}"`,
        `"${customer.phone || ''}"`,
        `"${customer.role}"`,
        `"${customer.isBlocked ? 'Blocked' : 'Active'}"`,
        customer.stats?.totalOrders || 0,
        customer.stats?.totalSpent?.toFixed(2) || '0.00',
        `"${new Date(customer.createdAt || customer.stats?.memberSince).toLocaleDateString()}"`
      ].join(',');
    });
    
    const csv = [...headers, ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sort customers
  const sortCustomers = (customers) => {
    return [...customers].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'orders':
          aValue = a.stats?.totalOrders || 0;
          bValue = b.stats?.totalOrders || 0;
          break;
        case 'spent':
          aValue = a.stats?.totalSpent || 0;
          bValue = b.stats?.totalSpent || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt || a.stats?.memberSince);
          bValue = new Date(b.createdAt || b.stats?.memberSince);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  // Get sorted customers
  const sortedCustomers = sortCustomers(filteredCustomers);

  // Export Modal
  const ExportModal = ({ onClose, onExport }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Customers</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Choose the format to export customer data:</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  onExport('csv');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span>CSV Format</span>
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  onExport('excel');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span>Excel Format</span>
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  onExport('pdf');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <span>PDF Format</span>
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage customer relationships and track customer data</p>
        </div>

        {/* Authentication Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{error}</span>
            <button 
              onClick={fetchCustomers}
              className="ml-auto text-red-800 hover:text-red-900 font-medium flex items-center space-x-1"
            >
              <span>Retry</span>
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Admin Access Guidance */}
        {error && (error.includes('Not authorized') || error.includes('Access denied')) && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Admin Access Required</p>
                <p className="text-sm mb-3">Customer management is only available to administrators. Please log in with an admin account to access this feature.</p>
                <div className="flex space-x-2">
                  <a 
                    href="/admin-login-debug" 
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ShieldCheckIcon className="h-4 w-4 mr-1" />
                    Go to Admin Login
                  </a>
                  <button
                    onClick={fetchCustomers}
                    className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Customers</p>
                <p className="text-2xl font-bold text-blue-600">
                  {customers.filter(c => c.role === 'customer').length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {customers.filter(c => c.role === 'admin').length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <StarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Blocked Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {customers.filter(c => c.isBlocked).length}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <NoSymbolIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 flex-1">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="admin">Admins</option>
                  <option value="delivery">Delivery Staff</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="email-asc">Email (A-Z)</option>
                  <option value="email-desc">Email (Z-A)</option>
                  <option value="orders-desc">Most Orders</option>
                  <option value="spent-desc">Highest Spent</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Export</span>
                </button>
                <button 
                  onClick={fetchCustomers}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredCustomers.length}</span> of <span className="font-semibold">{customers.length}</span> users
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading customers...</p>
            </div>
          ) : sortedCustomers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No customers found</p>
              <button 
                onClick={fetchCustomers}
                className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Refresh Data</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
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
                  {sortedCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">ID: {customer._id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(customer.role)}`}>
                          {getRoleDisplayName(customer.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.stats?.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${customer.stats?.totalSpent?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                          customer.isBlocked 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}>
                          {customer.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                            title="Edit User"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleBlock(customer)}
                            className={`${customer.isBlocked ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'} p-1 rounded transition-colors`}
                            title={customer.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {customer.isBlocked ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <NoSymbolIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer)}
                            className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                            title="Delete User"
                          >
                            <TrashIcon className="h-4 w-4" />
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

        {/* Modals */}
        {showModal && (
          <CustomerDetailModal
            customer={selectedCustomer}
            onClose={() => {
              setShowModal(false);
              setSelectedCustomer(null);
              setCustomerOrders([]);
            }}
          />
        )}

        {showEditModal && (
          <EditCustomerModal
            customer={selectedCustomer}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCustomer(null);
            }}
            onSave={handleUpdateCustomer}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            customer={selectedCustomer}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedCustomer(null);
            }}
            onConfirm={confirmDelete}
          />
        )}

        {showExportModal && (
          <ExportModal
            onClose={() => setShowExportModal(false)}
            onExport={(format) => {
              if (format === 'csv') {
                exportToCSV();
              } else {
                alert(`${format.toUpperCase()} export is not implemented yet.`);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;