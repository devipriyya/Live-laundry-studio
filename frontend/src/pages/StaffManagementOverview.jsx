import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  TruckIcon,
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
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const StaffManagementOverview = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const mockStaff = [
    {
      id: 'STF-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@fabricspa.com',
      phone: '+1 (555) 123-4567',
      role: 'Store Manager',
      department: 'Front Desk',
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
      role: 'Dry Cleaning Specialist',
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

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await api.get('/staff');
      if (response.data?.staff && response.data.staff.length > 0) {
        setStaff(response.data.staff);
      } else {
        setStaff(mockStaff);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff(mockStaff);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
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

  const handleDeleteStaff = async (memberId) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/staff/${memberId}`);
        setStaff(staff.filter(member => member.id !== memberId));
      } catch (error) {
        console.error('Error deleting staff:', error);
        setStaff(staff.filter(member => member.id !== memberId));
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      amber: 'bg-amber-100 text-amber-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      gray: 'bg-gray-100 text-gray-600'
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {trend}
                </span>
                <span className="text-xs text-gray-500">this month</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

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
        gender: '',
        shift: 'Morning',
        experience: '',
        idType: 'National ID',
        idNumber: '',
        password: ''
      }
    );
    const [skillInput, setSkillInput] = useState('');
    const [activeSection, setActiveSection] = useState('personal');
    const [errors, setErrors] = useState({});

    const validate = () => {
      const newErrors = {};
      if (!formData.name?.trim()) newErrors.name = 'Full name is required';
      if (!formData.email?.trim()) newErrors.email = 'Email is required';
      if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.role?.trim()) newErrors.role = 'Role is required';
      if (!formData.department?.trim()) newErrors.department = 'Department is required';
      if (!member && !formData.password?.trim()) newErrors.password = 'Initial password is required';
      if (!member && formData.password?.length < 6) newErrors.password = 'Password must be at least 6 characters';
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length > 0) {
        // Switch to the section with the first error
        if (newErrors.name || newErrors.email || newErrors.phone) {
          setActiveSection('personal');
        } else if (newErrors.role || newErrors.department) {
          setActiveSection('employment');
        }
        return false;
      }
      return true;
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
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

    const sections = [
      { id: 'personal', label: 'Personal Info', icon: UserCircleIcon },
      { id: 'employment', label: 'Employment', icon: BriefcaseIcon },
      { id: 'skills', label: 'Skills & Experience', icon: AcademicCapIcon },
      { id: 'documents', label: 'Documents', icon: ShieldCheckIcon }
    ];

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-2xl bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md group-hover:bg-blue-200 transition-all">
                  {formData.name ? (
                    <span className="text-3xl font-bold text-blue-600">{formData.name.charAt(0)}</span>
                  ) : (
                    <UserCircleIcon className="w-16 h-16 text-blue-300" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-lg text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <PencilIcon className="w-4 h-4" />
                </div>
              </div>
              <h4 className="mt-4 font-bold text-gray-900 text-center">{formData.name || 'New Member'}</h4>
              <p className="text-xs text-gray-500 text-center">{formData.role || 'Role not set'}</p>
            </div>

            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeSection === section.id
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'text-gray-500 hover:bg-white hover:text-blue-600'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full bg-white">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {member ? 'Edit Staff Member' : 'Register New Staff'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all">
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {activeSection === 'personal' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <UserCircleIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.name ? 'text-red-400' : 'text-gray-400'}`} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400 ${errors.name ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-xs text-red-500 ml-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400 ${errors.email ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <PhoneIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
                    </div>
                    {!member && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                          Login Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <LockClosedIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400 ${errors.password ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                            placeholder="Set initial password"
                          />
                        </div>
                        {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Residential Address</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                        placeholder="Street, City, State, ZIP"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Emergency Contact</label>
                    <div className="relative">
                      <ExclamationCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                        placeholder="Name - Phone Number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'employment' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Designated Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 ${errors.role ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                      >
                        <option value="">Select Role</option>
                        <option value="Laundry Operator">Laundry Operator</option>
                        <option value="Dry Cleaning Specialist">Dry Cleaning Specialist</option>
                        <option value="Ironing / Pressing Pro">Ironing / Pressing Pro</option>
                        <option value="Quality Inspector">Quality Inspector</option>
                        <option value="Stain Removal Expert">Stain Removal Expert</option>
                        <option value="Sorting Specialist">Sorting Specialist</option>
                        <option value="Store Manager">Store Manager</option>
                        <option value="Counter Staff">Counter Staff</option>
                      </select>
                      {errors.role && <p className="text-xs text-red-500 ml-1">{errors.role}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 ${errors.department ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                      >
                        <option value="">Select Department</option>
                        <option value="Washing & Drying">Washing & Drying</option>
                        <option value="Dry Cleaning">Dry Cleaning</option>
                        <option value="Finishing (Iron/Steam)">Finishing (Iron/Steam)</option>
                        <option value="Packaging & QA">Packaging & QA</option>
                        <option value="Front Desk">Front Desk</option>
                        <option value="Logistics">Logistics</option>
                      </select>
                      {errors.department && <p className="text-xs text-red-500 ml-1">{errors.department}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Shift Schedule</label>
                      <select
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                      >
                        <option value="Morning">Morning (08:00 - 16:00)</option>
                        <option value="Afternoon">Afternoon (14:00 - 22:00)</option>
                        <option value="Night">Night (22:00 - 06:00)</option>
                        <option value="Full Day">Full Day</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Current Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 font-bold"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Training">Training</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Joining Date</label>
                      <div className="relative">
                        <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="hireDate"
                          value={formData.hireDate}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Monthly Salary</label>
                      <div className="relative">
                        <CurrencyDollarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'skills' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Total Experience (Years)</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                      placeholder="e.g., 5 years in dry cleaning"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Technical Skills & Specializations</label>
                    <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                        <SparklesIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
                          placeholder="e.g., Silk Pressing, Wool Handling"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-6 py-3.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {formData.skills.length === 0 && (
                        <p className="text-sm text-gray-400 italic py-4">No skills added yet. Add skills like "Steam Ironing", "Stain Removal", etc.</p>
                      )}
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="group flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100 animate-scaleIn"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-blue-400 hover:text-red-500 transition-colors"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                    <div className="flex gap-3">
                      <LightBulbIcon className="w-6 h-6 text-amber-500 shrink-0" />
                      <div>
                        <h5 className="font-bold text-amber-900 text-sm">Suggested Laundry Skills</h5>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['Machine Operation', 'Stain Analysis', 'Fabric Knowledge', 'Steam Ironing', 'Industrial Washing', 'Packaging'].map(suggested => (
                            <button
                              key={suggested}
                              type="button"
                              onClick={() => {
                                if (!formData.skills.includes(suggested)) {
                                  setFormData(prev => ({ ...prev, skills: [...prev.skills, suggested] }));
                                }
                              }}
                              className="text-[10px] font-bold uppercase tracking-tighter px-2 py-1 bg-white text-amber-700 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              + {suggested}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'documents' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Identity Document Type</label>
                      <select
                        name="idType"
                        value={formData.idType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                      >
                        <option value="National ID">National ID / Aadhar</option>
                        <option value="Passport">Passport</option>
                        <option value="Drivers License">Driver's License</option>
                        <option value="Voter ID">Voter ID</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Document Number</label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                        placeholder="Enter ID number"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Verification Documents</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
                        <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                        <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">ID Front Side</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG (Max 5MB)</span>
                      </div>
                      <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
                        <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                        <span className="text-sm font-bold text-gray-600 group-hover:text-blue-600">ID Back Side</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG (Max 5MB)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-blue-900">Background Verification</h5>
                      <p className="text-sm text-blue-700 mt-1">
                        All staff members must undergo mandatory background checks before being assigned to home delivery or premium fabric handling.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white px-8 py-6 flex justify-between items-center border-t border-gray-50">
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400 italic">Form progress: {activeSection === 'documents' ? 'Final Step' : 'More steps remaining'}</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all font-bold"
                >
                  Discard
                </button>
                <button
                  onClick={() => {
                    if (validate()) {
                      onSave(formData);
                    }
                  }}
                  className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {member ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </div>
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
                  <ClockIcon className="w-8 h-8 text-cyan-600" />
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

  const renderStaffManagement = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Staff"
          value={staff.length}
          icon={UserGroupIcon}
          trend="+12%"
          color="blue"
        />
        <StatCard
          title="Active Staff"
          value={staff.filter(s => s.status === 'Active').length}
          icon={CheckCircleIcon}
          trend="+8%"
          color="green"
        />
        <StatCard
          title="Avg Rating"
          value={(staff.reduce((sum, s) => sum + s.rating, 0) / staff.length || 0).toFixed(1)}
          icon={StarIcon}
          trend="+0.2"
          color="amber"
        />
        <StatCard
          title="Total Orders"
          value={staff.reduce((sum, s) => sum + s.completedOrders, 0)}
          icon={ClipboardDocumentListIcon}
          trend="+25%"
          color="purple"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
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
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${member.status === 'Active'
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
    </div>
  );

  return (
    <div className="space-y-6">
      {renderStaffManagement()}

      {/* Modals */}
      {showAddModal && (
        <StaffModal
          member={selectedStaff}
          onClose={() => {
            setShowAddModal(false);
            setSelectedStaff(null);
          }}
          onSave={async (newStaffData) => {
            try {
              if (selectedStaff) {
                // Update existing staff via API
                const response = await api.put(`/staff/${selectedStaff.id}`, newStaffData);
                if (response.data?.staff) {
                  setStaff(prev => prev.map(s => s.id === selectedStaff.id ? { ...s, ...response.data.staff } : s));
                } else {
                  setStaff(prev => prev.map(s => s.id === selectedStaff.id ? { ...s, ...newStaffData } : s));
                }
              } else {
                // Create new staff via API
                const response = await api.post('/staff', newStaffData);
                if (response.data?.staff) {
                  setStaff(prev => [...prev, response.data.staff]);
                } else {
                  const newId = `STF-${String(staff.length + 1).padStart(3, '0')}`;
                  setStaff(prev => [...prev, { ...newStaffData, id: newId, rating: 0, completedOrders: 0 }]);
                }
              }
            } catch (error) {
              console.error('Error saving staff:', error);
              alert(error.response?.data?.message || 'Error saving staff member');
            }
            setShowAddModal(false);
            setSelectedStaff(null);
          }}
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

export default StaffManagementOverview;
