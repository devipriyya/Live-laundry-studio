import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const mockStaff = [
    {
      id: 'STF-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@fabricspa.com',
      phone: '+1 (555) 123-4567',
      role: 'Manager',
      department: 'Operations',
      status: 'Active',
      hireDate: '2023-01-15',
      salary: 55000,
      address: '123 Main St, New York, NY 10001',
      emergencyContact: 'John Johnson - +1 (555) 987-6543',
      skills: ['Team Leadership', 'Quality Control', 'Customer Service'],
      rating: 4.8,
      completedOrders: 1250,
      schedule: {
        monday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        tuesday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        wednesday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        thursday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        friday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
        saturday: 'Off',
        sunday: 'Off'
      }
    },
    {
      id: 'STF-002',
      name: 'Mike Wilson',
      email: 'mike.wilson@fabricspa.com',
      phone: '+1 (555) 234-5678',
      role: 'Technician',
      department: 'Dry Cleaning',
      status: 'Active',
      hireDate: '2023-03-20',
      salary: 42000,
      address: '456 Oak Ave, Los Angeles, CA 90210',
      emergencyContact: 'Lisa Wilson - +1 (555) 876-5432',
      skills: ['Dry Cleaning', 'Stain Removal', 'Equipment Maintenance'],
      rating: 4.6,
      completedOrders: 890,
      schedule: {
        monday: { start: '08:00', end: '16:00', break: '12:00-13:00' },
        tuesday: { start: '08:00', end: '16:00', break: '12:00-13:00' },
        wednesday: { start: '08:00', end: '16:00', break: '12:00-13:00' },
        thursday: { start: '08:00', end: '16:00', break: '12:00-13:00' },
        friday: { start: '08:00', end: '16:00', break: '12:00-13:00' },
        saturday: { start: '10:00', end: '14:00', break: 'None' },
        sunday: 'Off'
      }
    },
    {
      id: 'STF-003',
      name: 'Emily Davis',
      email: 'emily.davis@fabricspa.com',
      phone: '+1 (555) 345-6789',
      role: 'Driver',
      department: 'Delivery',
      status: 'Active',
      hireDate: '2023-06-10',
      salary: 38000,
      address: '789 Pine St, Chicago, IL 60601',
      emergencyContact: 'Robert Davis - +1 (555) 765-4321',
      skills: ['Safe Driving', 'Customer Service', 'Route Planning'],
      rating: 4.9,
      completedOrders: 650,
      schedule: {
        monday: { start: '07:00', end: '15:00', break: '11:00-12:00' },
        tuesday: { start: '07:00', end: '15:00', break: '11:00-12:00' },
        wednesday: { start: '07:00', end: '15:00', break: '11:00-12:00' },
        thursday: { start: '07:00', end: '15:00', break: '11:00-12:00' },
        friday: { start: '07:00', end: '15:00', break: '11:00-12:00' },
        saturday: 'Off',
        sunday: 'Off'
      }
    },
    {
      id: 'STF-004',
      name: 'Alex Thompson',
      email: 'alex.thompson@fabricspa.com',
      phone: '+1 (555) 456-7890',
      role: 'Customer Service',
      department: 'Support',
      status: 'On Leave',
      hireDate: '2023-08-05',
      salary: 35000,
      address: '321 Elm St, Miami, FL 33101',
      emergencyContact: 'Maria Thompson - +1 (555) 654-3210',
      skills: ['Customer Support', 'Problem Solving', 'Communication'],
      rating: 4.4,
      completedOrders: 420,
      schedule: {
        monday: { start: '10:00', end: '18:00', break: '14:00-15:00' },
        tuesday: { start: '10:00', end: '18:00', break: '14:00-15:00' },
        wednesday: { start: '10:00', end: '18:00', break: '14:00-15:00' },
        thursday: { start: '10:00', end: '18:00', break: '14:00-15:00' },
        friday: { start: '10:00', end: '18:00', break: '14:00-15:00' },
        saturday: 'Off',
        sunday: 'Off'
      }
    }
  ];

  useEffect(() => {
    setStaff(mockStaff);
    setFilteredStaff(mockStaff);
  }, []);

  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    setFilteredStaff(filtered);
  }, [searchTerm, roleFilter, statusFilter, staff]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Manager': return 'bg-purple-100 text-purple-800';
      case 'Technician': return 'bg-blue-100 text-blue-800';
      case 'Driver': return 'bg-green-100 text-green-800';
      case 'Customer Service': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const roles = [...new Set(staff.map(member => member.role))];

  const StaffModal = ({ member, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      member || {
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        status: 'Active',
        hireDate: '',
        salary: 0,
        address: '',
        emergencyContact: '',
        skills: []
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      const newMember = {
        ...formData,
        id: member ? member.id : `STF-${Date.now()}`,
        rating: member ? member.rating : 0,
        completedOrders: member ? member.completedOrders : 0
      };
      onSave(newMember);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {member ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Manager">Manager</option>
                    <option value="Technician">Technician</option>
                    <option value="Driver">Driver</option>
                    <option value="Customer Service">Customer Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date
                  </label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  placeholder="Name - Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {member ? 'Update Staff Member' : 'Add Staff Member'}
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

  const ScheduleModal = ({ member, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Schedule - {member.name}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(member.schedule).map(([day, schedule]) => (
              <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 capitalize w-24">
                  {day}
                </div>
                <div className="flex-1 text-center">
                  {typeof schedule === 'string' ? (
                    <span className="text-gray-500">{schedule}</span>
                  ) : (
                    <span className="text-gray-900">
                      {schedule.start} - {schedule.end}
                      {schedule.break !== 'None' && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Break: {schedule.break})
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const handleSaveStaff = (member) => {
    if (selectedStaff) {
      setStaff(staff.map(s => s.id === member.id ? member : s));
    } else {
      setStaff([...staff, member]);
    }
  };

  const handleDeleteStaff = (memberId) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(member => member.id !== memberId));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <p className="text-gray-600">Manage team members, schedules, and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(member => member.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClockIcon className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-gray-900">
                {staff.filter(member => member.status === 'On Leave').length}
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
                {(staff.reduce((sum, member) => sum + member.rating, 0) / staff.length).toFixed(1)}
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
            placeholder="Search staff by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Staff Member</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Department</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Orders</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStaff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900">{member.department}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-gray-900">{member.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900">{member.completedOrders}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedStaff(member);
                        setShowScheduleModal(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="View Schedule"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStaff(member);
                        setShowAddModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
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
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <StaffModal
          member={selectedStaff}
          onClose={() => {
            setShowAddModal(false);
            setSelectedStaff(null);
          }}
          onSave={handleSaveStaff}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedStaff && (
        <ScheduleModal
          member={selectedStaff}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedStaff(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffManagement;
