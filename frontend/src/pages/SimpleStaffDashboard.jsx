import React, { useState } from 'react';
import {
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  HomeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const SimpleStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: HomeIcon },
    { id: 'staff', label: 'Staff', icon: UserGroupIcon },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'attendance', label: 'Attendance', icon: ClockIcon },
    { id: 'payroll', label: 'Payroll', icon: CurrencyDollarIcon },
    { id: 'documents', label: 'Docs', icon: DocumentTextIcon },
    { id: 'communication', label: 'Messages', icon: ChatBubbleLeftRightIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'staff':
        return <StaffView />;
      case 'schedule':
        return <ScheduleView />;
      case 'attendance':
        return <AttendanceView />;
      case 'payroll':
        return <PayrollView />;
      case 'documents':
        return <DocumentsView />;
      case 'communication':
        return <CommunicationView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Staff Dashboard</h1>
          </div>
          <div className="text-sm text-gray-500">
            Welcome back!
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <ul className="py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
              </h2>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

// Simple view components
const DashboardView = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Staff" value="24" change="+2 this week" />
      <StatCard title="Active Today" value="18" change="85% online" />
      <StatCard title="Tasks Due" value="5" change="3 urgent" />
      <StatCard title="Avg Rating" value="4.2" change="⭐⭐⭐⭐☆" />
    </div>
    
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <ActivityItem time="2 mins ago" activity="John signed in" />
        <ActivityItem time="15 mins ago" activity="Sarah completed task" />
        <ActivityItem time="1 hour ago" activity="Mike updated profile" />
      </div>
    </div>
  </div>
);

const StaffView = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {[
        { name: 'John Smith', role: 'Manager', status: 'online', avatar: 'JS' },
        { name: 'Sarah Johnson', role: 'Cleaner', status: 'busy', avatar: 'SJ' },
        { name: 'Mike Davis', role: 'Delivery', status: 'offline', avatar: 'MD' },
        { name: 'Emma Wilson', role: 'Cleaner', status: 'online', avatar: 'EW' },
      ].map((staff, index) => (
        <div key={index} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{staff.avatar}</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{staff.name}</div>
              <div className="text-sm text-gray-500">{staff.role}</div>
            </div>
          </div>
          <StatusBadge status={staff.status} />
        </div>
      ))}
    </div>
  </div>
);

const ScheduleView = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
    <div className="space-y-4">
      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-900">{day}</span>
          <div className="text-sm text-gray-600">9:00 AM - 5:00 PM</div>
        </div>
      ))}
    </div>
  </div>
);

const AttendanceView = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
    </div>
    <div className="p-4">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Today</span>
          <span className="text-sm text-gray-500">March 3, 2026</span>
        </div>
        <div className="text-2xl font-bold text-green-600">18 / 24</div>
        <div className="text-sm text-gray-500">staff present</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-green-600 font-semibold">18</div>
          <div className="text-xs text-green-600">Present</div>
        </div>
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-red-600 font-semibold">6</div>
          <div className="text-xs text-red-600">Absent</div>
        </div>
      </div>
    </div>
  </div>
);

const PayrollView = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Overview</h3>
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-2xl font-bold text-blue-600">₹42,500</div>
        <div className="text-sm text-blue-600">Total Monthly Payroll</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">24</div>
          <div className="text-xs text-gray-600">Employees</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-900">₹1,770</div>
          <div className="text-xs text-gray-600">Avg Salary</div>
        </div>
      </div>
    </div>
  </div>
);

const DocumentsView = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {[
        { name: 'Employee Handbook', type: 'PDF', size: '2.4 MB' },
        { name: 'Policy Updates', type: 'DOCX', size: '1.1 MB' },
        { name: 'Training Materials', type: 'ZIP', size: '15.2 MB' },
      ].map((doc, index) => (
        <div key={index} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{doc.name}</div>
              <div className="text-sm text-gray-500">{doc.type} • {doc.size}</div>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Download
          </button>
        </div>
      ))}
    </div>
  </div>
);

const CommunicationView = () => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
    </div>
    <div className="divide-y divide-gray-200">
      {[
        { from: 'John Smith', subject: 'Schedule Change', time: '10 min ago', unread: true },
        { from: 'Sarah Johnson', subject: 'Task Completed', time: '30 min ago', unread: false },
        { from: 'Mike Davis', subject: 'Leave Request', time: '1 hour ago', unread: true },
      ].map((msg, index) => (
        <div key={index} className={`p-4 ${msg.unread ? 'bg-blue-50' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">{msg.from}</div>
            <div className="text-sm text-gray-500">{msg.time}</div>
          </div>
          <div className="text-sm text-gray-700 mt-1">{msg.subject}</div>
        </div>
      ))}
    </div>
  </div>
);

// Helper components
const StatCard = ({ title, value, change }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="text-sm text-gray-500 mb-1">{title}</div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-500">{change}</div>
  </div>
);

const ActivityItem = ({ time, activity }) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
    <div className="flex-1">
      <div className="font-medium text-gray-900">{activity}</div>
      <div className="text-gray-500">{time}</div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    online: 'bg-green-100 text-green-800',
    busy: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
};

export default SimpleStaffDashboard;