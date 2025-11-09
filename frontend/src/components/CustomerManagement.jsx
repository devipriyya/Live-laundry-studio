import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
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
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CustomerManagement = ({ isAdminView = false }) => {
  const { user } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' }); // For success/error messages
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showExportModal, setShowExportModal] = useState(false);
  const searchDebounceRef = useRef(null);

  // Fetch data based on user role
  const fetchData = async () => {
    if (isAdminView && user?.role === 'admin') {
      // Admin view - fetch all users
      await fetchCustomers();
    } else {
      // Regular user view - fetch only current user
      await fetchCurrentUser();
    }
  };

  // Fetch all customers from API (admin only)
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
      // Show success notification when refreshing
      if (loading === false) { // Only show notification on manual refresh
        setNotification({
          show: true,
          message: 'Customer data refreshed successfully!',
          type: 'success'
        });
        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
      }
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

  // Fetch current user's profile from API
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/profile');
      console.log('Current user data fetched successfully:', response.data);
      // Set the current user as the only customer in the list
      const currentUser = response.data;
      setCustomers([currentUser]);
      setFilteredCustomers([currentUser]);
    } catch (err) {
      console.error('Error fetching current user:', err);
      let errorMessage = 'Failed to load profile information. Please try again.';
      
      // More detailed error message
      if (err.response) {
        console.error('Error response:', err.response);
        if (err.response.status === 401) {
          errorMessage = 'Failed to load profile: Not authorized. Please log in to access your profile.';
        } else {
          errorMessage = `Failed to load profile: ${err.response.data.message || err.response.statusText || 'Unknown error'}.`;
        }
      } else if (err.request) {
        errorMessage = 'Failed to load profile: Server not responding. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  // Handle add customer
  const handleAddCustomer = async (customerData) => {
    try {
      const response = await api.post('/auth/users', customerData);
      setCustomers([...customers, response.data.user]);
      setFilteredCustomers([...filteredCustomers, response.data.user]);
      setShowAddCustomerModal(false);
      // Show success notification
      setNotification({
        show: true,
        message: 'Customer added successfully!',
        type: 'success'
      });
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (err) {
      console.error('Error adding customer:', err);
      // Show error notification
      setNotification({
        show: true,
        message: 'Failed to add customer. Please try again.',
        type: 'error'
      });
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  // Handle view customer details
  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
    await fetchCustomerOrders(customer._id);
  };

  // Handle block/unblock user (modified for regular users)
  const handleBlockUser = async (userId, isBlocked) => {
    try {
      // Regular users should not be able to block other users
      // This functionality should only be available for admins
      setError('User blocking is only available for administrators.');
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  // Handle delete user (modified for regular users)
  const handleDeleteUser = async () => {
    try {
      // Regular users should not be able to delete other users
      // This functionality should only be available for admins
      setError('User deletion is only available for administrators.');
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await api.delete(`/auth/users/${selectedCustomer._id}`);
      setCustomers(customers.filter(c => c._id !== selectedCustomer._id));
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      // Show success notification
      setNotification({
        show: true,
        message: 'Customer deleted successfully!',
        type: 'success'
      });
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (err) {
      console.error('Error deleting customer:', err);
      // Show error notification
      setNotification({
        show: true,
        message: 'Failed to delete customer. Please try again.',
        type: 'error'
      });
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
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
      // Show success notification
      setNotification({
        show: true,
        message: newBlockStatus ? 'Customer blocked successfully!' : 'Customer unblocked successfully!',
        type: 'success'
      });
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    } catch (err) {
      console.error('Error toggling block status:', err);
      // Show error notification
      setNotification({
        show: true,
        message: 'Failed to update customer status. Please try again.',
        type: 'error'
      });
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
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

  // Export customers to PDF (using backend endpoint)
  const exportToPDF = async () => {
    try {
      // Show loading state
      const exportButton = document.querySelector('button.flex.items-center.space-x-2.px-4.py-2.bg-red-600');
      if (exportButton) {
        const originalContent = exportButton.innerHTML;
        exportButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating PDF...
        `;
        exportButton.disabled = true;
      }

      // Call backend PDF export endpoint
      const response = await api.get('/auth/users/export/pdf', {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fabrico-customers-export-${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Show success message
      setNotification({
        show: true,
        message: 'PDF exported successfully!',
        type: 'success'
      });
      
      // Reset button state
      if (exportButton) {
        setTimeout(() => {
          exportButton.innerHTML = `
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>PDF Format</span>
          `;
          exportButton.disabled = false;
        }, 1500);
      }
    } catch (error) {
      console.error('Error exporting customers as PDF:', error);
      setNotification({
        show: true,
        message: 'Failed to export customers as PDF. Please try again.',
        type: 'error'
      });
      
      // Reset button state on error
      const exportButton = document.querySelector('button.flex.items-center.space-x-2.px-4.py-2.bg-red-600');
      if (exportButton) {
        exportButton.innerHTML = `
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 00-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span>PDF Format</span>
        `;
        exportButton.disabled = false;
      }
    }
  };

  // Sort customers
  const sortCustomers = (customers) => {
    try {
      return [...customers].sort((a, b) => {
        let aValue, bValue;
        
        switch (sortBy) {
          case 'name':
            aValue = (a.name || '').toLowerCase();
            bValue = (b.name || '').toLowerCase();
            break;
          case 'email':
            aValue = (a.email || '').toLowerCase();
            bValue = (b.email || '').toLowerCase();
            break;
          case 'role':
            aValue = a.role || '';
            bValue = b.role || '';
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
            // Handle cases where neither createdAt nor stats.memberSince exist
            const aDate = a.createdAt || (a.stats?.memberSince) || new Date(0);
            const bDate = b.createdAt || (b.stats?.memberSince) || new Date(0);
            aValue = new Date(aDate);
            bValue = new Date(bDate);
            break;
        }
        
        // Handle comparison for different data types
        if (sortOrder === 'asc') {
          if (aValue < bValue) return -1;
          if (aValue > bValue) return 1;
          return 0;
        } else {
          if (aValue > bValue) return -1;
          if (aValue < bValue) return 1;
          return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting customers:', error);
      // Return original array if sorting fails
      return [...customers];
    }
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
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>CSV Format</span>
                </div>
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  onExport('excel');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Excel Format</span>
                </div>
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  onExport('pdf');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF Format</span>
                </div>
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              PDF includes business details and structured customer information
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Add Customer Modal
  const AddCustomerModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      isBlocked: false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onAdd(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery Staff</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBlocked"
                checked={formData.isBlocked}
                onChange={(e) => setFormData({ ...formData, isBlocked: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isBlocked" className="ml-2 block text-sm text-gray-900">
                Blocked Account
              </label>
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
                Add Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Load sample data for demonstration
  const loadSampleData = () => {
    if (isAdminView && user?.role === 'admin') {
      // Admin sample data
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
              address: '456 Elm St',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90001',
              isDefault: true
            }
          ],
          stats: {
            totalOrders: 3,
            totalSpent: 75.25,
            loyaltyPoints: 30,
            memberSince: new Date('2023-02-20')
          }
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 234 567 8902',
          role: 'admin',
          isBlocked: true,
          addresses: [
            {
              type: 'Home',
              address: '789 Oak St',
              city: 'Chicago',
              state: 'IL',
              zipCode: '60601',
              isDefault: true
            }
          ],
          stats: {
            totalOrders: 0,
            totalSpent: 0,
            loyaltyPoints: 0,
            memberSince: new Date('2023-03-15')
          }
        },
        {
          _id: '3',
          name: 'Alice Johnson',
          email: 'alice.johnson@example.com',
          phone: '+1 234 567 8903',
          role: 'delivery',
          isBlocked: false,
          addresses: [
            {
              type: 'Home',
              address: '101 Pine St',
              city: 'Houston',
              state: 'TX',
              zipCode: '77001',
              isDefault: true
            }
          ],
          stats: {
            totalOrders: 10,
            totalSpent: 250.00,
            loyaltyPoints: 100,
            memberSince: new Date('2023-04-10')
          }
        }
      ];
      setCustomers(sampleCustomers);
      setFilteredCustomers(sampleCustomers);
    } else {
      // Regular user sample data
      const sampleCustomers = [
        {
          _id: 'current-user',
          name: user?.name || 'Current User',
          email: user?.email || 'current.user@example.com',
          phone: '+1 234 567 8900',
          role: user?.role || 'customer',
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
            totalOrders: 5,
            totalSpent: 120.50,
            loyaltyPoints: 50,
            memberSince: new Date('2023-01-15')
          }
        }
      ];
      setCustomers(sampleCustomers);
      setFilteredCustomers(sampleCustomers);
    }
    setLoading(false);
  };

  // Memoize customer counts for stats cards
  const customerCounts = useMemo(() => {
    return {
      total: customers.length,
      customers: customers.filter(c => c.role === 'customer').length,
      admins: customers.filter(c => c.role === 'admin').length,
      blocked: customers.filter(c => c.isBlocked).length
    };
  }, [customers]);

  // Load data based on user role
  useEffect(() => {
    fetchData();
  }, [isAdminView, user]);

  // Debounce search term
  useEffect(() => {
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchTerm]);

  // Filter customers
  useEffect(() => {
    try {
      let filtered = customers;

      if (debouncedSearchTerm) {
        const trimmedSearchTerm = debouncedSearchTerm.trim().toLowerCase();
        if (trimmedSearchTerm) {
          filtered = filtered.filter(customer => {
            // Safely check if properties exist before accessing them
            const name = customer.name || '';
            const email = customer.email || '';
            const phone = customer.phone || '';
            
            return name.toLowerCase().includes(trimmedSearchTerm) ||
                   email.toLowerCase().includes(trimmedSearchTerm) ||
                   phone.includes(trimmedSearchTerm);
          });
        }
      }

      if (roleFilter !== 'all') {
        filtered = filtered.filter(customer => (customer.role || '') === roleFilter);
      }

      if (statusFilter !== 'all') {
        if (statusFilter === 'blocked') {
          filtered = filtered.filter(customer => customer.isBlocked === true);
        } else if (statusFilter === 'active') {
          filtered = filtered.filter(customer => customer.isBlocked !== true);
        }
      }

      setFilteredCustomers(filtered);
    } catch (error) {
      console.error('Error filtering customers:', error);
      // Set filtered customers to empty array if filtering fails
      setFilteredCustomers([]);
    }
  }, [debouncedSearchTerm, statusFilter, roleFilter, customers]);

  return (
    <div className="p-6">
      {/* Header with consistent admin dashboard styling */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAdminView && user?.role === 'admin' ? 'Customer Management' : 'My Profile'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isAdminView && user?.role === 'admin' 
                ? 'Manage customer relationships and track customer data' 
                : 'View and manage your account information'}
            </p>
          </div>
          
          {isAdminView && user?.role === 'admin' && (
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Customer
              </button>
            </div>
          )}
        </div>
        
        {/* Divider */}
        <div className="mt-6 border-t border-gray-200"></div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`mb-6 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex">
            {notification.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            )}
            <div className="ml-3">
              <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Only show for admin view */}
      {isAdminView && user?.role === 'admin' && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{customerCounts.total}</p>
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
                  {customerCounts.customers}
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
                  {customerCounts.admins}
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
                  {customerCounts.blocked}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <NoSymbolIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters - Only show for admin view */}
      {isAdminView && user?.role === 'admin' && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
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
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                {isAdminView && user?.role === 'admin' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                  </>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {(isAdminView && user?.role === 'admin') && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">ID: {customer._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                  </td>
                  {isAdminView && user?.role === 'admin' && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          customer.role === 'delivery' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {customer.role === 'admin' ? 'Admin' : 
                           customer.role === 'delivery' ? 'Delivery' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.stats?.totalOrders || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{(customer.stats?.totalSpent || 0).toFixed(2)}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {customer.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  {(isAdminView && user?.role === 'admin') && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>

                        {!customer.isBlocked ? (
                          <button
                            onClick={() => handleToggleBlock(customer)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <NoSymbolIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleBlock(customer)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedCustomers.length === 0 && !loading && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new customer.</p>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showModal && selectedCustomer && (
        <CustomerDetailModal 
          customer={selectedCustomer} 
          onClose={() => {
            setShowModal(false);
            setSelectedCustomer(null);
          }} 
        />
      )}
      
      {showAddCustomerModal && (
        <AddCustomerModal 
          onClose={() => setShowAddCustomerModal(false)}
          onAdd={handleAddCustomer}
        />
      )}

      {showDeleteModal && selectedCustomer && (
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
            console.log('Export format selected:', format);
            if (format === 'csv') {
              exportToCSV();
            } else if (format === 'pdf') {
              exportToPDF();
            }
            // Add other format exports here if needed
            setShowExportModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CustomerManagement;