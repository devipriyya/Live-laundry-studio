import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ArrowsPointingOutIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  QueueListIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  GiftIcon,
  CalendarDaysIcon,
  ClockIcon as ClockOutlineIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const StaffPayroll = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [payrollRecords, setPayrollRecords] = useState([
    {
      id: 1,
      staffId: 'STF-001',
      staffName: 'Sarah Johnson',
      staffRole: 'Manager',
      month: 1,
      year: 2024,
      baseSalary: 55000,
      hoursWorked: 160,
      overtimeHours: 8,
      overtimeRate: 1.5,
      bonus: 500,
      deductions: 2000,
      netPay: 53750,
      tax: 8062.5,
      status: 'paid',
      paymentDate: '2024-02-01'
    },
    {
      id: 2,
      staffId: 'STF-002',
      staffName: 'Mike Wilson',
      staffRole: 'Technician',
      month: 1,
      year: 2024,
      baseSalary: 42000,
      hoursWorked: 155,
      overtimeHours: 3,
      overtimeRate: 1.5,
      bonus: 200,
      deductions: 1500,
      netPay: 40800,
      tax: 6120,
      status: 'paid',
      paymentDate: '2024-02-01'
    },
    {
      id: 3,
      staffId: 'STF-003',
      staffName: 'Emma Davis',
      staffRole: 'Supervisor',
      month: 1,
      year: 2024,
      baseSalary: 48000,
      hoursWorked: 160,
      overtimeHours: 5,
      overtimeRate: 1.5,
      bonus: 300,
      deductions: 1800,
      netPay: 46650,
      tax: 6997.5,
      status: 'pending',
      paymentDate: null
    }
  ]);

  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 'STF-001', name: 'Sarah Johnson', role: 'Manager' },
    { id: 'STF-002', name: 'Mike Wilson', role: 'Technician' },
    { id: 'STF-003', name: 'Emma Davis', role: 'Supervisor' }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i + 1);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const getPayrollSummary = () => {
    const filteredRecords = payrollRecords.filter(record => 
      record.month === selectedMonth && record.year === selectedYear
    );
    
    const totalBaseSalary = filteredRecords.reduce((sum, record) => sum + record.baseSalary, 0);
    const totalNetPay = filteredRecords.reduce((sum, record) => sum + record.netPay, 0);
    const totalTax = filteredRecords.reduce((sum, record) => sum + record.tax, 0);
    const totalBonus = filteredRecords.reduce((sum, record) => sum + record.bonus, 0);
    const totalDeductions = filteredRecords.reduce((sum, record) => sum + record.deductions, 0);
    const paidRecords = filteredRecords.filter(r => r.status === 'paid').length;
    const pendingRecords = filteredRecords.filter(r => r.status === 'pending').length;
    
    return {
      totalBaseSalary,
      totalNetPay,
      totalTax,
      totalBonus,
      totalDeductions,
      paidRecords,
      pendingRecords,
      totalRecords: filteredRecords.length
    };
  };

  const PayrollModal = ({ payroll, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      payroll || {
        staffId: '',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        baseSalary: 0,
        hoursWorked: 0,
        overtimeHours: 0,
        overtimeRate: 1.5,
        bonus: 0,
        deductions: 0,
        tax: 0,
        netPay: 0,
        status: 'pending',
        paymentDate: ''
      }
    );

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateNetPay = () => {
      const base = parseFloat(formData.baseSalary) || 0;
      const bonus = parseFloat(formData.bonus) || 0;
      const deductions = parseFloat(formData.deductions) || 0;
      const gross = base + bonus;
      const tax = (gross - deductions) * 0.15; // 15% tax rate
      const net = gross - deductions - tax;
      
      setFormData(prev => ({
        ...prev,
        tax: parseFloat(tax.toFixed(2)),
        netPay: parseFloat(net.toFixed(2))
      }));
    };

    useEffect(() => {
      calculateNetPay();
    }, [formData.baseSalary, formData.bonus, formData.deductions]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {payroll ? 'Edit Payroll Record' : 'Add New Payroll Record'}
              </h3>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                <select
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Staff</option>
                  {staffMembers.filter(s => s.id !== 'all').map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
                <input
                  type="number"
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                <input
                  type="number"
                  name="hoursWorked"
                  value={formData.hoursWorked}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Hours</label>
                <input
                  type="number"
                  name="overtimeHours"
                  value={formData.overtimeHours}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Rate</label>
                <input
                  type="number"
                  name="overtimeRate"
                  value={formData.overtimeRate}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
                <input
                  type="number"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                <input
                  type="number"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Pay</label>
                <input
                  type="number"
                  name="netPay"
                  value={formData.netPay}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-semibold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {payroll ? 'Update' : 'Create'} Payroll
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSavePayroll = (payrollData) => {
    if (payrollData.id) {
      // Update existing record
      setPayrollRecords(payrollRecords.map(record => 
        record.id === payrollData.id ? payrollData : record
      ));
    } else {
      // Create new record
      const newRecord = {
        ...payrollData,
        id: Math.max(...payrollRecords.map(r => r.id), 0) + 1
      };
      setPayrollRecords([...payrollRecords, newRecord]);
    }
  };

  const handleDeletePayroll = (payrollId) => {
    if (confirm('Are you sure you want to delete this payroll record?')) {
      setPayrollRecords(payrollRecords.filter(record => record.id !== payrollId));
    }
  };

  const handleProcessPayment = (payrollId) => {
    setPayrollRecords(payrollRecords.map(record => 
      record.id === payrollId ? { ...record, status: 'paid', paymentDate: new Date().toISOString().split('T')[0] } : record
    ));
  };

  const summary = getPayrollSummary();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Payroll Management</h1>
            <p className="text-gray-600">Manage and process staff compensation</p>
          </div>
          <button
            onClick={() => {
              setEditingPayroll(null);
              setShowPayrollModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Payroll
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Base Salary</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${summary.totalBaseSalary.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${summary.totalNetPay.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tax</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">${summary.totalTax.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalRecords}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {staffMembers.map(staff => (
              <option key={staff.id} value={staff.id}>{staff.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Payroll Records - {months[selectedMonth]} {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Salary</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Overtime</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bonus</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Pay</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollRecords
                .filter(record => 
                  record.month === selectedMonth && 
                  record.year === selectedYear &&
                  (selectedStaff === 'all' || record.staffId === selectedStaff)
                )
                .map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-700 font-semibold text-sm">
                            {record.staffName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{record.staffName}</div>
                          <div className="text-sm text-gray-500">{record.staffRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${record.baseSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.hoursWorked} hrs
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.overtimeHours} hrs @ {record.overtimeRate}x
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${record.bonus.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${record.tax.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${record.netPay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {record.status === 'pending' && (
                          <button
                            onClick={() => handleProcessPayment(record.id)}
                            className="text-green-600 hover:text-green-900 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                            title="Process Payment"
                          >
                            <CurrencyDollarIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingPayroll(record);
                            setShowPayrollModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePayroll(record.id)}
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

      {/* Payroll Modal */}
      {showPayrollModal && (
        <PayrollModal
          payroll={editingPayroll}
          onClose={() => {
            setShowPayrollModal(false);
            setEditingPayroll(null);
          }}
          onSave={handleSavePayroll}
        />
      )}
    </div>
  );
};

export default StaffPayroll;
