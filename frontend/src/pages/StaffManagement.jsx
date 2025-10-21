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
  StarIcon,
  TruckIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
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
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [orders, setOrders] = useState([]);

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
      assignedOrders: ['ORD-001', 'ORD-002', 'ORD-003'],
      performance: {
        efficiency: 96,
        onTimeDelivery: 98,
        customerSatisfaction: 4.8,
        tasksCompleted: 1250,
        avgCompletionTime: '2.5 hours',
        qualityScore: 95
      },
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
      assignedOrders: ['ORD-004', 'ORD-005'],
      performance: {
        efficiency: 92,
        onTimeDelivery: 94,
        customerSatisfaction: 4.6,
        tasksCompleted: 890,
        avgCompletionTime: '3 hours',
        qualityScore: 93
      },
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
      assignedOrders: ['ORD-006'],
      performance: {
        efficiency: 97,
        onTimeDelivery: 99,
        customerSatisfaction: 4.9,
        tasksCompleted: 650,
        avgCompletionTime: '1.5 hours',
        qualityScore: 98
      },
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
      assignedOrders: [],
      performance: {
        efficiency: 88,
        onTimeDelivery: 90,
        customerSatisfaction: 4.4,
        tasksCompleted: 420,
        avgCompletionTime: '1 hour',
        qualityScore: 87
      },
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
    // Mock orders for assignment
    setOrders([
      { id: 'ORD-001', orderNumber: 'ORD-001', customerName: 'John Doe', status: 'order-placed', totalAmount: 450 },
      { id: 'ORD-002', orderNumber: 'ORD-002', customerName: 'Jane Smith', status: 'order-accepted', totalAmount: 320 },
      { id: 'ORD-003', orderNumber: 'ORD-003', customerName: 'Bob Wilson', status: 'out-for-pickup', totalAmount: 680 },
      { id: 'ORD-004', orderNumber: 'ORD-004', customerName: 'Alice Brown', status: 'wash-in-progress', totalAmount: 520 },
      { id: 'ORD-005', orderNumber: 'ORD-005', customerName: 'Charlie Davis', status: 'order-placed', totalAmount: 290 },
      { id: 'ORD-006', orderNumber: 'ORD-006', customerName: 'Diana Garcia', status: 'out-for-delivery', totalAmount: 410 }
    ]);
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
        skills: [],
        performance: {
          efficiency: 0,
          onTimeDelivery: 0,
          customerSatisfaction: 0,
          tasksCompleted: 0,
          avgCompletionTime: '0 hours',
          qualityScore: 0
        },
        schedule: {
          monday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
          tuesday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
          wednesday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
          thursday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
          friday: { start: '09:00', end: '17:00', break: '12:00-13:00' },
          saturday: 'Off',
          sunday: 'Off'
        }
      }
    );

    const [skillInput, setSkillInput] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      const newMember = {
        ...formData,
        id: member ? member.id : `STF-${String(Date.now()).slice(-3).padStart(3, '0')}`,
        rating: member ? member.rating : 0,
        completedOrders: member ? member.completedOrders : 0,
        assignedOrders: member ? member.assignedOrders : []
      };
      onSave(newMember);
      onClose();
    };

    const addSkill = () => {
      if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
        setSkillInput('');
      }
    };

    const removeSkill = (skill) => {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {member ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h3>
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
                    <option value="Washer">Washer</option>
                    <option value="Quality Inspector">Quality Inspector</option>
                    <option value="Supervisor">Supervisor</option>
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
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-purple-600" />
                  Skills & Expertise
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill (e.g., Dry Cleaning, Ironing)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-blue-900"
                        >
                          <XCircleIcon className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
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

  // Assign Order Modal
  const AssignOrderModal = ({ member, onClose }) => {
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [orderSearchTerm, setOrderSearchTerm] = useState('');

    const unassignedOrders = orders.filter(order => 
      !member.assignedOrders?.includes(order.orderNumber) &&
      (order.status === 'order-placed' || order.status === 'order-accepted' || order.status === 'wash-in-progress')
    );

    const filteredOrders = unassignedOrders.filter(order =>
      order.orderNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearchTerm.toLowerCase())
    );

    const handleAssignOrders = () => {
      const updatedStaff = staff.map(s => {
        if (s.id === member.id) {
          return {
            ...s,
            assignedOrders: [...(s.assignedOrders || []), ...selectedOrders]
          };
        }
        return s;
      });
      setStaff(updatedStaff);
      alert(`${selectedOrders.length} order(s) assigned to ${member.name}`);
      onClose();
    };

    const toggleOrderSelection = (orderNumber) => {
      setSelectedOrders(prev =>
        prev.includes(orderNumber)
          ? prev.filter(o => o !== orderNumber)
          : [...prev, orderNumber]
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
                  Assign Orders to {member.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Select orders to assign to this staff member</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Current Assignments */}
            {member.assignedOrders && member.assignedOrders.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Currently Assigned Orders:</h3>
                <div className="flex flex-wrap gap-2">
                  {member.assignedOrders.map(orderNum => (
                    <span key={orderNum} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                      {orderNum}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Orders */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No available orders to assign</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedOrders.includes(order.orderNumber)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => toggleOrderSelection(order.orderNumber)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.orderNumber)}
                            onChange={() => toggleOrderSelection(order.orderNumber)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                            <p className="text-sm text-gray-600">{order.customerName}</p>
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

  // Performance Modal
  const PerformanceModal = ({ member, onClose }) => {
    const performance = member.performance || {};

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ChartBarIcon className="w-7 h-7 text-purple-600" />
                  Performance Analytics - {member.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Detailed performance metrics and task completion</p>
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
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Tasks Completed</p>
                    <p className="text-2xl font-bold text-blue-900">{performance.tasksCompleted || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">Efficiency</p>
                    <p className="text-2xl font-bold text-green-900">{performance.efficiency || 0}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <StarIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Quality Score</p>
                    <p className="text-2xl font-bold text-purple-900">{performance.qualityScore || 0}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-600 p-2 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Avg Time</p>
                    <p className="text-xl font-bold text-orange-900">{performance.avgCompletionTime || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Performance Bars */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-500" />
                  Performance Metrics
                </h3>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Efficiency</span>
                    <span className="text-sm font-semibold text-gray-900">{performance.efficiency || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${performance.efficiency || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                    <span className="text-sm font-semibold text-gray-900">{performance.onTimeDelivery || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${performance.onTimeDelivery || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Quality Score</span>
                    <span className="text-sm font-semibold text-gray-900">{performance.qualityScore || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${performance.qualityScore || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                    <span className="text-sm font-semibold text-gray-900">{performance.customerSatisfaction || 0}/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full transition-all"
                      style={{ width: `${((performance.customerSatisfaction || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                  Task Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Total Tasks Completed</span>
                    <span className="font-bold text-gray-900">{performance.tasksCompleted || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Current Assigned Orders</span>
                    <span className="font-bold text-gray-900">{member.assignedOrders?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Overall Rating</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold text-gray-900">{member.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Average Completion Time</span>
                    <span className="font-bold text-gray-900">{performance.avgCompletionTime || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            {member.skills && member.skills.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setSelectedStaff(member);
                        setShowPerformanceModal(true);
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="View Performance"
                    >
                      <ChartBarIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStaff(member);
                        setShowAssignOrderModal(true);
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      title="Assign Orders"
                    >
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                    </button>
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

      {/* Assign Order Modal */}
      {showAssignOrderModal && selectedStaff && (
        <AssignOrderModal
          member={selectedStaff}
          onClose={() => {
            setShowAssignOrderModal(false);
            setSelectedStaff(null);
          }}
        />
      )}

      {/* Performance Modal */}
      {showPerformanceModal && selectedStaff && (
        <PerformanceModal
          member={selectedStaff}
          onClose={() => {
            setShowPerformanceModal(false);
            setSelectedStaff(null);
          }}
        />
      )}
    </div>
  );
};

export default StaffManagement;
