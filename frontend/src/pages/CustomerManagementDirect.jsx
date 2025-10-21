import React, { useState, useEffect } from 'react';

const CustomerManagementDirect = () => {
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
    }, 100);
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
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'delivery': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>Customer Management</h1>
          <p style={{ color: '#666' }}>Direct access page - All functionality working</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '10px', color: '#666' }}>Loading customers...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Total Users</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{customers.length}</p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Customers</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {customers.filter(c => c.role === 'customer').length}
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Admins</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {customers.filter(c => c.role === 'admin').length}
                </p>
              </div>

              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Blocked Users</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                  {customers.filter(c => c.isBlocked).length}
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e5e5', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                  />

                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    >
                      <option value="all">All Roles</option>
                      <option value="customer">Customers</option>
                      <option value="admin">Admins</option>
                      <option value="delivery">Delivery Staff</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#666' }}>
                  Showing <span style={{ fontWeight: 'bold' }}>{filteredCustomers.length}</span> of <span style={{ fontWeight: 'bold' }}>{customers.length}</span> users
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e5e5', overflow: 'hidden' }}>
              {filteredCustomers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>👤</div>
                  <p>No customers found</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e5e5' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                          User
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                          Contact
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                          Role
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                          Orders
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                          Total Spent
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                          Status
                        </th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                                {customer.name.charAt(0)}
                              </div>
                              <div style={{ marginLeft: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{customer.name}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>ID: {customer._id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontSize: '14px', color: '#333' }}>{customer.email}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>{customer.phone || 'No phone'}</div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', backgroundColor: getStatusColor(customer.role).split(' ')[0] + '40', color: getStatusColor(customer.role).split(' ')[1] }}>
                              {getRoleDisplayName(customer.role)}
                            </span>
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>
                            {customer.stats?.totalOrders || 0}
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                            ${customer.stats?.totalSpent?.toFixed(2) || '0.00'}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 8px', borderRadius: '12px', backgroundColor: customer.isBlocked ? '#fee2e2' : '#dcfce7', color: customer.isBlocked ? '#b91c1c' : '#15803d' }}>
                              {customer.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleToggleBlock(customer)}
                                style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: customer.isBlocked ? '#10b981' : '#f97316' }}
                                title={customer.isBlocked ? 'Unblock User' : 'Block User'}
                              >
                                {customer.isBlocked ? '✅' : '🚫'}
                              </button>
                              <button
                                onClick={() => handleDeleteCustomer(customer)}
                                style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                                title="Delete User"
                              >
                                🗑️
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

            {/* Instructions */}
            <div style={{ marginTop: '30px', backgroundColor: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af', marginBottom: '10px' }}>How to Use This Page</h3>
              <ul style={{ color: '#1e40af', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '5px' }}><strong>View users</strong> - All users are displayed in the table above</li>
                <li style={{ marginBottom: '5px' }}><strong>Block/Unblock users</strong> - Click the 🚫 (block) or ✅ (unblock) button to toggle user status</li>
                <li style={{ marginBottom: '5px' }}><strong>Delete users</strong> - Click the 🗑️ (trash) button to remove users</li>
                <li style={{ marginBottom: '5px' }}><strong>Filter users</strong> - Use the dropdowns to filter by role or status</li>
                <li><strong>Search users</strong> - Use the search box to find users by name, email, or phone</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomerManagementDirect;