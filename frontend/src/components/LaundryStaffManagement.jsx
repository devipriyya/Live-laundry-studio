import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const LaundryStaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    isBlocked: false
  });
  const [errors, setErrors] = useState({});

  // Fetch laundry staff
  const fetchLaundryStaff = async () => {
    try {
      setLoading(true);
      console.log('Fetching laundry staff...');
      const response = await api.get('/laundry-staff/laundry-staff');
      console.log('Laundry staff response:', response.data);
      setStaff(response.data.laundryStaff || []);
      setFilteredStaff(response.data.laundryStaff || []);
    } catch (error) {
      console.error('Error fetching laundry staff:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to fetch laundry staff: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaundryStaff();
  }, []);

  // Filter staff based on search term
  useEffect(() => {
    let filtered = staff;
    
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStaff(filtered);
  }, [searchTerm, staff]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!editingStaff && !formData.password) {
      newErrors.password = 'Password is required for new staff';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (editingStaff) {
        // Update existing staff
        await api.put(`/laundry-staff/laundry-staff/${editingStaff._id}`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isBlocked: formData.isBlocked
        });
        alert('Laundry staff updated successfully!');
      } else {
        // Create new staff
        await api.post('/laundry-staff/laundry-staff', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        alert('Laundry staff created successfully!');
      }
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        isBlocked: false
      });
      setErrors({});
      setShowAddEditModal(false);
      fetchLaundryStaff();
    } catch (error) {
      console.error('Error saving laundry staff:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save laundry staff';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      password: '',
      isBlocked: staffMember.isBlocked
    });
    setShowAddEditModal(true);
  };

  // Handle delete
  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this laundry staff member? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/laundry-staff/laundry-staff/${staffId}`);
      alert('Laundry staff deleted successfully!');
      fetchLaundryStaff();
    } catch (error) {
      console.error('Error deleting laundry staff:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete laundry staff';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Toggle block status
  const toggleBlockStatus = async (staffMember) => {
    try {
      setLoading(true);
      await api.put(`/laundry-staff/laundry-staff/${staffMember._id}`, {
        name: staffMember.name,
        email: staffMember.email,
        phone: staffMember.phone,
        isBlocked: !staffMember.isBlocked
      });
      
      alert(`Staff member ${staffMember.isBlocked ? 'unblocked' : 'blocked'} successfully!`);
      fetchLaundryStaff();
    } catch (error) {
      console.error('Error updating staff status:', error);
      alert('Failed to update staff status');
    } finally {
      setLoading(false);
    }
  };

  // Open add modal
  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      isBlocked: false
    });
    setErrors({});
    setShowAddEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                👕 Laundry Staff Management
              </h1>
              <p className="text-gray-600 mt-1">Add, edit, and manage laundry staff accounts</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={openAddModal}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transition-all"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span>Add Staff</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Staff</p>
                <p className="text-3xl font-bold text-gray-900">{filteredStaff.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Staff</p>
                <p className="text-3xl font-bold text-green-600">{filteredStaff.filter(s => !s.isBlocked).length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Blocked Staff</p>
                <p className="text-3xl font-bold text-red-600">{filteredStaff.filter(s => s.isBlocked).length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <NoSymbolIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Staff Utilization</p>
                <p className="text-3xl font-bold text-purple-600">
                  {filteredStaff.length > 0 
                    ? `${Math.round((filteredStaff.filter(s => !s.isBlocked).length / filteredStaff.length) * 100)}%` 
                    : '0%'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <ArrowPathIcon className="h-6 w-6 animate-spin text-purple-600" />
                <span className="text-gray-600 font-medium">Loading staff...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Staff ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStaff.map((staffMember) => (
                    <tr key={staffMember._id} className="hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-gray-600">{staffMember._id.substring(0, 8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {staffMember.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium text-gray-900">{staffMember.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{staffMember.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{staffMember.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          staffMember.isBlocked 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}>
                          {staffMember.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(staffMember)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Staff"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleBlockStatus(staffMember)}
                            className={`p-2 rounded-lg transition-colors ${
                              staffMember.isBlocked
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-yellow-600 hover:bg-yellow-50'
                            }`}
                            title={staffMember.isBlocked ? 'Unblock Staff' : 'Block Staff'}
                          >
                            {staffMember.isBlocked ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : (
                              <NoSymbolIcon className="w-4 h-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(staffMember._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Staff"
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
          )}
        </div>

        {!loading && filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Laundry Staff Found</h3>
            <p className="text-gray-500">Get started by adding your first laundry staff member.</p>
            <button
              onClick={openAddModal}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transition-all"
            >
              Add Staff
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingStaff ? 'Edit Staff' : 'Add New Staff'}
              </h2>
              <button 
                onClick={() => {
                  setShowAddEditModal(false);
                  setEditingStaff(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    isBlocked: false
                  });
                  setErrors({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter staff name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter staff email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              {!editingStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              )}
              
              {editingStaff && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isBlocked"
                    checked={formData.isBlocked}
                    onChange={(e) => setFormData({...formData, isBlocked: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isBlocked" className="ml-2 block text-sm text-gray-900">
                    Block this staff member
                  </label>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Saving...' : editingStaff ? 'Update Staff' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEditModal(false);
                    setEditingStaff(null);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      password: '',
                      isBlocked: false
                    });
                    setErrors({});
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryStaffManagement;