import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
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

const StaffSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedView, setSelectedView] = useState('week'); // week, month, day
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [shifts, setShifts] = useState([
    {
      id: 1,
      staffId: 'STF-001',
      staffName: 'Sarah Johnson',
      staffRole: 'Manager',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '17:00',
      breakTime: '12:00-13:00',
      status: 'confirmed',
      location: 'Main Branch'
    },
    {
      id: 2,
      staffId: 'STF-002',
      staffName: 'Mike Wilson',
      staffRole: 'Technician',
      date: '2024-01-15',
      startTime: '08:00',
      endTime: '16:00',
      breakTime: '12:00-13:00',
      status: 'confirmed',
      location: 'Main Branch'
    },
    {
      id: 3,
      staffId: 'STF-003',
      staffName: 'Emma Davis',
      staffRole: 'Supervisor',
      date: '2024-01-15',
      startTime: '10:00',
      endTime: '18:00',
      breakTime: '14:00-15:00',
      status: 'pending',
      location: 'Branch 2'
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
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  };

  const getShiftsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === dateString);
  };

  const ShiftModal = ({ shift, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      shift || {
        staffId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        breakTime: '12:00-13:00',
        location: 'Main Branch',
        status: 'confirmed'
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
                {shift ? 'Edit Shift' : 'Add New Shift'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Break Time</label>
                <input
                  type="text"
                  name="breakTime"
                  value={formData.breakTime}
                  onChange={handleInputChange}
                  placeholder="e.g., 12:00-13:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
                {shift ? 'Update' : 'Create'} Shift
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveShift = (shiftData) => {
    if (shiftData.id) {
      // Update existing shift
      setShifts(shifts.map(shift => 
        shift.id === shiftData.id ? shiftData : shift
      ));
    } else {
      // Create new shift
      const newShift = {
        ...shiftData,
        id: Math.max(...shifts.map(s => s.id), 0) + 1
      };
      setShifts([...shifts, newShift]);
    }
  };

  const handleDeleteShift = (shiftId) => {
    if (confirm('Are you sure you want to delete this shift?')) {
      setShifts(shifts.filter(shift => shift.id !== shiftId));
    }
  };

  const weekDates = getWeekDates();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Schedule Management</h1>
            <p className="text-gray-600">Manage and view staff schedules</p>
          </div>
          <button
            onClick={() => {
              setEditingShift(null);
              setShowShiftModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Shift
          </button>
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

      {/* Weekly Schedule View */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 bg-gray-50 font-semibold text-gray-700">Time</div>
          {weekDates.map((date, index) => (
            <div key={index} className="p-4 bg-gray-50 text-center">
              <div className="font-semibold text-gray-900">{formatDate(date)}</div>
              <div className="text-sm text-gray-600">
                {getShiftsForDate(date).length} shifts
              </div>
            </div>
          ))}
        </div>
        
        {/* Time slots */}
        {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
          <div key={time} className="grid grid-cols-8 border-b border-gray-100">
            <div className="p-3 bg-gray-50 text-sm text-gray-600 font-medium">{time}</div>
            {weekDates.map((date, index) => {
              const dateString = date.toISOString().split('T')[0];
              const shift = shifts.find(s => 
                s.date === dateString && 
                s.startTime <= time && 
                s.endTime > time
              );
              
              return (
                <div key={index} className="p-2 border-l border-gray-100 min-h-16">
                  {shift && (
                    <div className={`p-2 rounded-lg border ${
                      shift.status === 'confirmed' ? 'bg-green-50 border-green-200' :
                      shift.status === 'pending' ? 'bg-amber-50 border-amber-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="font-medium text-sm text-gray-900">{shift.staffName}</div>
                      <div className="text-xs text-gray-600">{shift.startTime} - {shift.endTime}</div>
                      <div className="text-xs text-gray-500">{shift.location}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Staff Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {staffMembers.filter(s => s.id !== 'all').map(staff => {
          const staffShifts = shifts.filter(shift => shift.staffId === staff.id);
          const confirmedShifts = staffShifts.filter(shift => shift.status === 'confirmed');
          const totalHours = staffShifts.reduce((total, shift) => {
            const [startHour] = shift.startTime.split(':');
            const [endHour] = shift.endTime.split(':');
            const start = parseInt(startHour);
            const end = parseInt(endHour);
            return total + (end - start);
          }, 0);
          
          return (
            <div key={staff.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold">
                    {staff.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                  <p className="text-sm text-gray-600">{staff.role}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Shifts</span>
                  <span className="font-medium text-gray-900">{staffShifts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Confirmed</span>
                  <span className="font-medium text-gray-900">{confirmedShifts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Hours</span>
                  <span className="font-medium text-gray-900">{totalHours} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Hours/Day</span>
                  <span className="font-medium text-gray-900">{(totalHours / 7).toFixed(1)} hrs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Shifts Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">All Scheduled Shifts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Break</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-blue-700 font-semibold text-sm">
                          {shift.staffName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{shift.staffName}</div>
                        <div className="text-sm text-gray-500">{shift.staffRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(shift.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {shift.startTime} - {shift.endTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {shift.breakTime}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {shift.location}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(shift.status)}`}>
                      {shift.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingShift(shift);
                          setShowShiftModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteShift(shift.id)}
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

      {/* Shift Modal */}
      {showShiftModal && (
        <ShiftModal
          shift={editingShift}
          onClose={() => {
            setShowShiftModal(false);
            setEditingShift(null);
          }}
          onSave={handleSaveShift}
        />
      )}
    </div>
  );
};

export default StaffSchedule;
