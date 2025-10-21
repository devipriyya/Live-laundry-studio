import React, { useState, useEffect } from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  NoSymbolIcon,
  CheckIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const CustomerManagementSimple = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Sample data
  const sampleCustomers = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8901',
      role: 'customer',
      isBlocked: false,
      stats: {
        totalOrders: 12,
        totalSpent: 245.50
      }
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8902',
      role: 'customer',
      isBlocked: true,
      stats: {
        totalOrders: 8,
        totalSpent: 189.75
      }
    },
    {
      _id: '3',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+1 234 567 8903',
      role: 'delivery',
      isBlocked: false,
      stats: {
        totalOrders: 0,
        totalSpent: 0
      }
    },
    {
      _id: '4',
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      phone: '+1 234 567 8904',
      role: 'customer',
      isBlocked: false,
      stats: {
        totalOrders: 15,
        totalSpent: 320.25
      }
    },
    {
      _id: '5',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '+1 234 567 8905',
      role: 'admin',
      isBlocked: false,
      stats: {
        totalOrders: 0,
        totalSpent: 0
      }
    }
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setCustomers(sampleCustomers);
      setFilteredCustomers(sampleCustomers);
      setLoading(false);
    }, 500);
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

  // Handle block/unblock customer
  const handleToggleBlock = (customer) => {
    const updatedCustomers = customers.map(c => 
      c._id === customer._id ? { ...c, isBlocked: !c.isBlocked } : c
    );
    setCustomers(updatedCustomers);
    
    // Also update filtered customers
    const updatedFiltered = filteredCustomers.map(c => 
      c._id === customer._id ? { ...c, isBlocked: !c.isBlocked } : c
    );
    setFilteredCustomers(updatedFiltered);
    
    alert(`${customer.isBlocked ? 'Unblocked' : 'Blocked'} ${customer.name} successfully!`);
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      const updatedCustomers = customers.filter(c => c._id !== customer._id);
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      alert(`${customer.name} deleted successfully!`);
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
          <p className="text-gray-600">Manage customer relationships and track customer data</p>
        </div>

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
                <UserIcon className="h-6 w-6 text-purple-600" />
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
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setCustomers(sampleCustomers);
                    setFilteredCustomers(sampleCustomers);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowPathIcon className="h-5 w-5" />
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
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No customers found</p>
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
                  {filteredCustomers.map((customer) => (
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
                            <div className="text-sm text-gray-500">ID: {customer._id}</div>
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
      </div>
    </div>
  );
};

export default CustomerManagementSimple;