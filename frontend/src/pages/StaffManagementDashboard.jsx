import React, { useState } from 'react';
import {
  UserGroupIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  BuildingOfficeIcon,
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
  ChatBubbleLeftRightIcon as ChatOutlineIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  GiftIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const StaffManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, component: 'Dashboard' },
    { id: 'staff', label: 'Staff Management', icon: UserGroupIcon, component: 'StaffManagementOverview' },
    { id: 'performance', label: 'Performance', icon: StarIcon, component: 'StaffPerformance' },
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon, component: 'StaffSchedule' },
    { id: 'attendance', label: 'Attendance', icon: ClockIcon, component: 'StaffAttendance' },
    { id: 'payroll', label: 'Payroll', icon: CurrencyDollarIcon, component: 'StaffPayroll' },
    { id: 'training', label: 'Training', icon: AcademicCapIcon, component: 'StaffTraining' },
    { id: 'documents', label: 'Documents', icon: DocumentTextIcon, component: 'StaffDocuments' },
    { id: 'communication', label: 'Communication', icon: ChatBubbleLeftRightIcon, component: 'StaffCommunication' }
  ];

  // Import components dynamically
  const Dashboard = React.lazy(() => import('../components/StaffDashboard'));
  const StaffManagementOverview = React.lazy(() => import('./StaffManagementOverview'));
  const StaffPerformance = React.lazy(() => import('../components/StaffPerformance'));
  const StaffSchedule = React.lazy(() => import('../components/StaffSchedule'));
  const StaffAttendance = React.lazy(() => import('../components/StaffAttendance'));
  const StaffPayroll = React.lazy(() => import('../components/StaffPayroll'));
  const StaffTraining = React.lazy(() => import('../components/StaffTraining'));
  const StaffDocuments = React.lazy(() => import('../components/StaffDocuments'));
  const StaffCommunication = React.lazy(() => import('../components/StaffCommunication'));

  const renderComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'staff':
        return <StaffManagementOverview />;
      case 'performance':
        return <StaffPerformance />;
      case 'schedule':
        return <StaffSchedule />;
      case 'attendance':
        return <StaffAttendance />;
      case 'payroll':
        return <StaffPayroll />;
      case 'training':
        return <StaffTraining />;
      case 'documents':
        return <StaffDocuments />;
      case 'communication':
        return <StaffCommunication />;
      default:
        return <Dashboard />;
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          <React.Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            {renderComponent()}
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};

export default StaffManagementDashboard;
