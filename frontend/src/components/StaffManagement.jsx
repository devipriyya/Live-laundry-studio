import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  StarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  BriefcaseIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Mock staff data
  const mockStaff = [
    {
      id: 'STAFF-001',
      name: 'David Rodriguez',
      role: 'Manager',
      department: 'Operations',
      email: 'david.r@washlab.com',
      phone: '+1 555-0201',
      status: 'Active',
      rating: 4.9,
      ordersCompleted: 156,
      joinDate: '2023-03-15',
      salary: 65000,
      schedule: {
        monday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
        tuesday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
        wednesday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
        thursday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
        friday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
        saturday: { start: 'OFF', end: 'OFF', break: '' },
        sunday: { start: 'OFF', end: 'OFF', break: '' }
      },
      performance: {
        efficiency: 95,
        customerSatisfaction: 4.8,
        punctuality: 98,
        teamwork: 4.9
      }
    },
    {
      id: 'STAFF-002',
      name: 'Lisa Park',
      role: 'Senior Technician',
      department: 'Dry Cleaning',
      email: 'lisa.p@washlab.com',
      phone: '+1 555-0202',
      status: 'Active',
      rating: 4.7,
      ordersCompleted: 89,
      joinDate: '2023-06-20',
      salary: 45000,
      schedule: {
        monday: { start: '09:00', end: '18:00', break: '13:00-14:00' },
        tuesday: { start: '09:00', end: '18:00', break: '13:00-14:00' },
        wednesday: { start: '09:00', end: '18:00', break: '13:00-14:00' },
        thursday: { start: '09:00', end: '18:00', break: '13:00-14:00' },
        friday: { start: '09:00', end: '18:00', break: '13:00-14:00' },
        saturday: { start: '09:00', end: '15:00', break: '12:00-13:00' },
        sunday: { start: 'OFF', end: 'OFF', break: '' }
      },
      performance: {
        efficiency: 92,
        customerSatisfaction: 4.6,
        punctuality: 95,
        teamwork: 4.8
      }
    }
  ];

  useEffect(() => {
    setStaff(mockStaff);
    setFilteredStaff(mockStaff);
  }, []);

  // Filter staff
  useEffect(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(member => 
        member.department.toLowerCase() === departmentFilter
      );
    }

    setFilteredStaff(filtered);
  }, [searchTerm, departmentFilter, staff]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      case 'on leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Staff Detail Modal
  const StaffDetailModal = ({ staffMember, onClose }) => {
    if (!staffMember) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Staff Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Staff Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{staffMember.name}</p>
                        <p className="text-sm text-gray-500">ID: {staffMember.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{staffMember.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{staffMember.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{staffMember.role}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{staffMember.department}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        Joined: {new Date(staffMember.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Overall Rating:</span>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{staffMember.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Orders Completed:</span>
                      <span className="font-medium">{staffMember.ordersCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Efficiency:</span>
                      <span className="font-medium">{staffMember.performance.efficiency}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Punctuality:</span>
                      <span className="font-medium">{staffMember.performance.punctuality}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Weekly Schedule</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(staffMember.schedule).map(([day, times]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="font-medium capitalize">{day}:</span>
                      <span className="text-gray-600">
                        {times.start === 'OFF' ? 'OFF' : `${times.start} - ${times.end}`}
                        {times.break && ` (Break: ${times.break})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
          <p className="text-gray-600">Manage staff members, schedules, and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Staff</p>
                <p className="text-2xl font-bold text-green-600">
                  {staff.filter(s => s.status === 'Active').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {(staff.reduce((sum, s) => sum + s.rating, 0) / staff.length).toFixed(1)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Orders Completed</p>
                <p className="text-2xl font-bold text-purple-600">
                  {staff.reduce((sum, s) => sum + s.ordersCompleted, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="operations">Operations</option>
                <option value="dry cleaning">Dry Cleaning</option>
                <option value="customer service">Customer Service</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="h-5 w-5" />
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.role}</div>
                      <div className="text-sm text-gray-500">{member.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                      <div className="text-sm text-gray-500">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{member.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.ordersCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStaff(member);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded transition-colors">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Detail Modal */}
        {showModal && (
          <StaffDetailModal
            staffMember={selectedStaff}
            onClose={() => {
              setShowModal(false);
              setSelectedStaff(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StaffManagement;
