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
  SparklesIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BellIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  UserPlusIcon,
  PresentationChartLineIcon,
  QueueListIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  EnvelopeOpenIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  GiftIcon,
  CalendarDaysIcon,
  ClockIcon as ClockOutlineIcon,
  UserIcon,
  KeyIcon,
  LockOpenIcon,
  LockClosedIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  WrenchScrewdriverIcon,
  ScissorsIcon,
  TagIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const EnhancedStaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAssignOrderModal, setShowAssignOrderModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [trainingRecords, setTrainingRecords] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    stats: true,
    staff: true,
    attendance: false,
    training: false,
    payroll: false
  });

  // Mock data
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
        saturday: { start: '10:00', end: '14:00', break: '' },
        sunday: 'Off'
      }
    }
  ];

  const departments = [...new Set(mockStaff.map(member => member.department))];
  const roles = [...new Set(mockStaff.map(member => member.role))];

  useEffect(() => {
    setStaff(mockStaff);
    setFilteredStaff(mockStaff);
    // Initialize mock data
    setOrders([
      { id: 'ORD-001', customer: 'John Doe', status: 'Processing', assignedTo: 'STF-001' },
      { id: 'ORD-002', customer: 'Jane Smith', status: 'Pending', assignedTo: 'STF-001' },
      { id: 'ORD-003', customer: 'Bob Johnson', status: 'Completed', assignedTo: 'STF-001' },
      { id: 'ORD-004', customer: 'Alice Brown', status: 'Processing', assignedTo: 'STF-002' },
      { id: 'ORD-005', customer: 'Charlie Wilson', status: 'Pending', assignedTo: 'STF-002' }
    ]);
    
    setAttendanceRecords([
      { id: 'ATT-001', staffId: 'STF-001', date: '2024-01-15', status: 'Present', hours: 8 },
      { id: 'ATT-002', staffId: 'STF-002', date: '2024-01-15', status: 'Present', hours: 8 }
    ]);
    
    setTrainingRecords([
      { id: 'TRN-001', staffId: 'STF-001', course: 'Advanced Customer Service', status: 'Completed', date: '2023-12-01' },
      { id: 'TRN-002', staffId: 'STF-002', course: 'Equipment Safety', status: 'In Progress', date: '2024-01-10' }
    ]);
    
    setPayrollRecords([
      { id: 'PAY-001', staffId: 'STF-001', month: 'January 2024', salary: 55000, status: 'Paid' },
      { id: 'PAY-002', staffId: 'STF-002', month: 'January 2024', salary: 42000, status: 'Pending' }
    ]);
    
    setDocuments([
      { id: 'DOC-001', staffId: 'STF-001', name: 'ID Proof', type: 'Identity', uploaded: '2023-01-15' },
      { id: 'DOC-002', staffId: 'STF-002', name: 'Certificate', type: 'Qualification', uploaded: '2023-03-20' }
    ]);
    
    setMessages([
      { id: 'MSG-001', from: 'Admin', to: 'STF-001', subject: 'Meeting Reminder', date: '2024-01-15', read: false },
      { id: 'MSG-002', from: 'HR', to: 'STF-002', subject: 'Training Schedule', date: '2024-01-14', read: true }
    ]);
  }, []);

  // Filter staff
  useEffect(() => {
    let filtered = staff;
    
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }
    
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(member => member.department === departmentFilter);
    }
    
    setFilteredStaff(filtered);
  }, [staff, searchTerm, roleFilter, statusFilter, departmentFilter]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSaveStaff = (staffData) => {
    if (staffData.id) {
      setStaff(staff.map(member => 
        member.id === staffData.id ? staffData : member
      ));
    } else {
      const newStaff = {
        ...staffData,
        id: `STF-${String(staff.length + 1).padStart(3, '0')}`,
        rating: 0,
        completedOrders: 0,
        assignedOrders: [],
        performance: {
          efficiency: 0,
          onTimeDelivery: 0,
          customerSatisfaction: 0,
          tasksCompleted: 0,
          avgCompletionTime: '0 hours',
          qualityScore: 0
        }
      };
      setStaff([...staff, newStaff]);
    }
    setShowAddModal(false);
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (memberId) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      setStaff(staff.filter(member => member.id !== memberId));
    }
  };

  // Modal Components
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
    const [skillInput, setSkillInput] = useState('');

    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.role) newErrors.role = 'Role is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if (!formData.hireDate) newErrors.hireDate = 'Hire date is required';
      if (formData.salary <= 0) newErrors.salary = 'Salary must be greater than 0';

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
      if (validateForm()) {
        onSave(formData);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    const addSkill = () => {
      if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
        setSkillInput('');
      }
    };

    const removeSkill = (skillToRemove) => {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <UserPlusIcon className="w-6 h-6" />
                {member ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Role</option>
                  <option value="Manager">Manager</option>
                  <option value="Technician">Technician</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Assistant">Assistant</option>
                  <option value="Quality Control">Quality Control</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Department</option>
                  <option value="Operations">Operations</option>
                  <option value="Dry Cleaning">Dry Cleaning</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hire Date</label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter salary"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter full address"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter emergency contact"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Skills</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <CheckCircleIcon className="w-5 h-5" />
              {member ? 'Update' : 'Create'} Staff
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PerformanceModal = ({ member, onClose }) => {
    if (!member) return null;
    
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6" />
                Performance Analytics - {member.name}
              </h3>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-blue-900">Tasks Completed</h4>
                  <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-900">{member.performance.tasksCompleted}</p>
                <p className="text-sm text-blue-600 mt-1">Total orders processed</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-green-900">Efficiency</h4>
                  <ArrowTrendingUpIcon className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-900">{member.performance.efficiency}%</p>
                <p className="text-sm text-green-600 mt-1">Work efficiency rate</p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-amber-900">On-Time Delivery</h4>
                  <ClockIcon className="w-8 h-8 text-amber-600" />
                </div>
                <p className="text-3xl font-bold text-amber-900">{member.performance.onTimeDelivery}%</p>
                <p className="text-sm text-amber-600 mt-1">Delivery punctuality</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-purple-900">Customer Rating</h4>
                  <StarIcon className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-900">{member.performance.customerSatisfaction}</p>
                <p className="text-sm text-purple-600 mt-1">Average customer score</p>
              </div>
              
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-5 rounded-2xl border border-rose-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-rose-900">Quality Score</h4>
                  <ShieldCheckIcon className="w-8 h-8 text-rose-600" />
                </div>
                <p className="text-3xl font-bold text-rose-900">{member.performance.qualityScore}%</p>
                <p className="text-sm text-rose-600 mt-1">Work quality rating</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-5 rounded-2xl border border-cyan-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-cyan-900">Avg Completion Time</h4>
                  <ClockOutlineIcon className="w-8 h-8 text-cyan-600" />
                </div>
                <p className="text-3xl font-bold text-cyan-900">{member.performance.avgCompletionTime}</p>
                <p className="text-sm text-cyan-600 mt-1">Average time per task</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Skills Overview</h4>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Staff Management</h1>
        <p className="text-gray-600">Comprehensive staff management with advanced features</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{staff.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {staff.filter(member => member.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {(staff.reduce((sum, member) => sum + member.rating, 0) / staff.length || 0).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {staff.reduce((sum, member) => sum + member.completedOrders, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Department</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{member.role}</div>
                      <div className="text-sm text-gray-500">{member.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{member.phone}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      member.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : member.status === 'On Leave'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-amber-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{member.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {member.completedOrders} completed
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setShowPerformanceModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Performance"
                      >
                        <ChartBarIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setShowScheduleModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900 p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                        title="Schedule"
                      >
                        <CalendarIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setShowAssignOrderModal(true);
                        }}
                        className="text-green-600 hover:text-green-900 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                        title="Assign Orders"
                      >
                        <ClipboardDocumentListIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStaff(member);
                          setShowAddModal(true);
                        }}
                        className="text-amber-600 hover:text-amber-900 p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member.id)}
                        className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
      </div>

      {/* Modals */}
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

export default EnhancedStaffManagement;