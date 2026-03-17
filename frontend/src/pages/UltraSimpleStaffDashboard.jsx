import React, { useState } from 'react';
import {
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const UltraSimpleStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('staff');

  const tabs = [
    { id: 'staff', label: 'Staff', icon: UserGroupIcon },
    { id: 'attendance', label: 'Attendance', icon: ClockIcon },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'payroll', label: 'Payroll', icon: CurrencyDollarIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'staff':
        return <StaffListView />;
      case 'attendance':
        return <AttendanceView />;
      case 'schedule':
        return <ScheduleView />;
      case 'payroll':
        return <PayrollView />;
      default:
        return <StaffListView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Staff Management</h1>
          <div className="text-sm text-gray-600">Admin Panel</div>
        </div>
      </header>

      <div className="flex">
        {/* Simple Sidebar */}
        <nav className="w-48 bg-white shadow-sm min-h-screen">
          <ul className="py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2 px-4 py-3 text-left ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h2>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// Ultra-simple view components
const StaffListView = () => {
  const staff = [
    { id: 1, name: 'John Smith', position: 'Manager', status: 'Active' },
    { id: 2, name: 'Sarah Johnson', position: 'Cleaner', status: 'Active' },
    { id: 3, name: 'Mike Davis', position: 'Delivery', status: 'Off' },
    { id: 4, name: 'Emma Wilson', position: 'Cleaner', status: 'Active' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Staff List</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
          Add Staff
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-gray-600">Name</th>
              <th className="text-left py-2 px-3 text-gray-600">Position</th>
              <th className="text-left py-2 px-3 text-gray-600">Status</th>
              <th className="text-left py-2 px-3 text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((person) => (
              <tr key={person.id} className="border-b border-gray-100">
                <td className="py-3 px-3">{person.name}</td>
                <td className="py-3 px-3">{person.position}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    person.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {person.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AttendanceView = () => {
  const attendance = [
    { name: 'John Smith', date: '2026-03-03', status: 'Present', time: '09:00 AM' },
    { name: 'Sarah Johnson', date: '2026-03-03', status: 'Present', time: '09:05 AM' },
    { name: 'Emma Wilson', date: '2026-03-03', status: 'Absent', time: '-' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Attendance</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-700">2</div>
          <div className="text-sm text-blue-600">Present</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-700">1</div>
          <div className="text-sm text-red-600">Absent</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-gray-700">3</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-gray-600">Name</th>
              <th className="text-left py-2 px-3 text-gray-600">Date</th>
              <th className="text-left py-2 px-3 text-gray-600">Status</th>
              <th className="text-left py-2 px-3 text-gray-600">Time</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-3">{record.name}</td>
                <td className="py-3 px-3">{record.date}</td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    record.status === 'Present' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="py-3 px-3">{record.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ScheduleView = () => {
  const schedule = [
    { day: 'Monday', employee: 'John Smith', shift: '9:00 AM - 5:00 PM' },
    { day: 'Tuesday', employee: 'Sarah Johnson', shift: '9:00 AM - 5:00 PM' },
    { day: 'Wednesday', employee: 'Mike Davis', shift: '10:00 AM - 6:00 PM' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Weekly Schedule</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-gray-600">Day</th>
              <th className="text-left py-2 px-3 text-gray-600">Employee</th>
              <th className="text-left py-2 px-3 text-gray-600">Shift</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-3">{item.day}</td>
                <td className="py-3 px-3">{item.employee}</td>
                <td className="py-3 px-3">{item.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PayrollView = () => {
  const payroll = [
    { name: 'John Smith', salary: '₹15,000', bonus: '₹1,000', total: '₹16,000' },
    { name: 'Sarah Johnson', salary: '₹12,000', bonus: '₹500', total: '₹12,500' },
    { name: 'Mike Davis', salary: '₹10,000', bonus: '₹0', total: '₹10,000' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Payroll</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 text-gray-600">Employee</th>
              <th className="text-left py-2 px-3 text-gray-600">Salary</th>
              <th className="text-left py-2 px-3 text-gray-600">Bonus</th>
              <th className="text-left py-2 px-3 text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((employee, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 px-3">{employee.name}</td>
                <td className="py-3 px-3">₹{employee.salary}</td>
                <td className="py-3 px-3">₹{employee.bonus}</td>
                <td className="py-3 px-3 font-semibold">₹{employee.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UltraSimpleStaffDashboard;