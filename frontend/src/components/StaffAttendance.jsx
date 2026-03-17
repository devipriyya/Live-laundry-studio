import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
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

const StaffAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedView, setSelectedView] = useState('week'); // week, month, day
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      staffId: 'STF-001',
      staffName: 'Sarah Johnson',
      date: '2024-01-15',
      checkIn: '08:55',
      checkOut: '17:05',
      status: 'present',
      hoursWorked: 8.17,
      lateBy: 5,
      earlyBy: 5,
      location: 'Main Branch'
    },
    {
      id: 2,
      staffId: 'STF-002',
      staffName: 'Mike Wilson',
      date: '2024-01-15',
      checkIn: '09:15',
      checkOut: '16:45',
      status: 'late',
      hoursWorked: 7.5,
      lateBy: 15,
      earlyBy: 15,
      location: 'Main Branch'
    },
    {
      id: 3,
      staffId: 'STF-003',
      staffName: 'Emma Davis',
      date: '2024-01-15',
      checkIn: null,
      checkOut: null,
      status: 'absent',
      hoursWorked: 0,
      lateBy: 0,
      earlyBy: 0,
      location: 'Main Branch'
    },
    {
      id: 4,
      staffId: 'STF-001',
      staffName: 'Sarah Johnson',
      date: '2024-01-14',
      checkIn: '09:00',
      checkOut: '17:00',
      status: 'present',
      hoursWorked: 8,
      lateBy: 0,
      earlyBy: 0,
      location: 'Main Branch'
    }
  ]);

  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 'STF-001', name: 'Sarah Johnson', role: 'Manager' },
    { id: 'STF-002', name: 'Mike Wilson', role: 'Technician' },
    { id: 'STF-003', name: 'Emma Davis', role: 'Supervisor' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-amber-100 text-amber-800';
      case 'early': return 'bg-blue-100 text-blue-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (selectedView === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (selectedView === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getWeekDates = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(diff + i);
      dates.push(date);
    }
    return dates;
  };

  const getAttendanceForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return attendanceRecords.filter(record => record.date === dateString);
  };

  const getAttendanceSummary = () => {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const total = attendanceRecords.length;
    
    return {
      present,
      late,
      absent,
      total,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0
    };
  };

  const AttendanceModal = ({ record, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      record || {
        staffId: '',
        date: new Date().toISOString().split('T')[0],
        checkIn: '',
        checkOut: '',
        status: 'present',
        hoursWorked: 0,
        lateBy: 0,
        earlyBy: 0,
        location: 'Main Branch'
      }
    );

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {record ? 'Edit Attendance Record' : 'Add New Attendance Record'}
              </h3>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                  <input
                    type="time"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                  <input
                    type="time"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
                  <input
                    type="number"
                    name="hoursWorked"
                    value={formData.hoursWorked}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="early">Early</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Late By (minutes)</label>
                  <input
                    type="number"
                    name="lateBy"
                    value={formData.lateBy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Early By (minutes)</label>
                  <input
                    type="number"
                    name="earlyBy"
                    value={formData.earlyBy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
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
                {record ? 'Update' : 'Create'} Record
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveRecord = (recordData) => {
    if (recordData.id) {
      // Update existing record
      setAttendanceRecords(attendanceRecords.map(record => 
        record.id === recordData.id ? recordData : record
      ));
    } else {
      // Create new record
      const newRecord = {
        ...recordData,
        id: Math.max(...attendanceRecords.map(r => r.id), 0) + 1
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  const handleDeleteRecord = (recordId) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      setAttendanceRecords(attendanceRecords.filter(record => record.id !== recordId));
    }
  };

  const weekDates = getWeekDates();
  const summary = getAttendanceSummary();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Attendance Management</h1>
            <p className="text-gray-600">Track and manage staff attendance records</p>
          </div>
          <button
            onClick={() => {
              setEditingRecord(null);
              setShowAttendanceModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.present}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Late Arrivals</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.late}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Absences</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.absent}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.attendanceRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ArrowUpIcon className="w-6 h-6 text-purple-600" />
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
                onClick={() => navigateDate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="day">Day</option>
              </select>
              <button
                onClick={() => navigateDate(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">
                {selectedView === 'week' && `Week of ${formatDate(weekDates[0])}`}
                {selectedView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                {selectedView === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5 text-gray-600" />
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

      {/* Weekly Attendance View */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 bg-gray-50 font-semibold text-gray-700">Staff</div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-4 bg-gray-50 text-center">
              <div className="font-semibold text-gray-900">{formatDate(date)}</div>
            </div>
          ))}
        </div>
        
        {staffMembers.filter(s => s.id !== 'all').map(staff => {
          const staffRecords = {};
          weekDates.forEach(date => {
            const dateString = date.toISOString().split('T')[0];
            const record = attendanceRecords.find(r => 
              r.staffId === staff.id && r.date === dateString
            );
            staffRecords[dateString] = record;
          });
          
          return (
            <div key={staff.id} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-4 bg-gray-50">
                <div className="font-medium text-gray-900">{staff.name}</div>
                <div className="text-sm text-gray-600">{staff.role}</div>
              </div>
              {weekDates.map((date, index) => {
                const dateString = date.toISOString().split('T')[0];
                const record = staffRecords[dateString];
                
                return (
                  <div key={index} className="p-4 border-l border-gray-100 flex items-center justify-center">
                    {record ? (
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* All Attendance Records */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">All Attendance Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Late By</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
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
                        <div className="text-sm text-gray-500">{record.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.checkOut || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.hoursWorked.toFixed(2)} hrs
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.lateBy > 0 ? `${record.lateBy} min` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingRecord(record);
                          setShowAttendanceModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
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

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <AttendanceModal
          record={editingRecord}
          onClose={() => {
            setShowAttendanceModal(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveRecord}
        />
      )}
    </div>
  );
};

export default StaffAttendance;