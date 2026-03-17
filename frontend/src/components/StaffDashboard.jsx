import React, { useState, useEffect } from 'react';
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
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const StaffDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalStaff: 12,
    activeStaff: 10,
    onLeave: 2,
    avgRating: 4.6,
    totalOrders: 1250,
    pendingOrders: 15,
    processingOrders: 8,
    completedOrders: 25,
    qualityIssues: 2,
    totalEarnings: 125000,
    isAvailable: true,
    performance: {
      efficiency: 92,
      onTimeDelivery: 96,
      customerSatisfaction: 4.7,
      tasksCompleted: 1250
    }
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New order assigned - ORD-001', time: '2 min ago', read: false },
    { id: 2, message: 'Team meeting at 3:00 PM', time: '1 hour ago', read: false },
    { id: 3, message: 'Performance review completed', time: '3 hours ago', read: true }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, staff: 'Sarah Johnson', action: 'Completed order', orderId: 'ORD-001', time: '10 min ago' },
    { id: 2, staff: 'Mike Wilson', action: 'Started processing', orderId: 'ORD-002', time: '25 min ago' },
    { id: 3, staff: 'Emma Davis', action: 'Marked as pending', orderId: 'ORD-003', time: '1 hour ago' }
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const totalTasks = stats.pendingOrders + stats.processingOrders + stats.completedOrders;
  const completionRate = totalTasks > 0 ? Math.round((stats.completedOrders / totalTasks) * 100) : 0;

  const statCards = [
    {
      key: 'totalStaff',
      value: stats.totalStaff,
      label: 'Total Staff',
      icon: UserGroupIcon,
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      trend: '+12%',
      trendUp: true
    },
    {
      key: 'activeStaff',
      value: stats.activeStaff,
      label: 'Active Staff',
      icon: CheckCircleIcon,
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      trend: '+8%',
      trendUp: true
    },
    {
      key: 'avgRating',
      value: stats.avgRating,
      label: 'Average Rating',
      icon: StarIcon,
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      trend: '+0.2',
      trendUp: true
    },
    {
      key: 'totalOrders',
      value: stats.totalOrders,
      label: 'Total Orders',
      icon: ClipboardDocumentListIcon,
      bgColor: 'bg-gradient-to-br from-purple-100 to-violet-200',
      iconBg: 'bg-gradient-to-br from-purple-500 to-violet-500',
      trend: '+25%',
      trendUp: true
    }
  ];

  const quickActions = [
    { key: 'addStaff', label: 'Add Staff', icon: UserPlusIcon, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { key: 'viewSchedule', label: 'Schedule', icon: CalendarIcon, color: 'text-green-600', bgColor: 'bg-green-50' },
    { key: 'performance', label: 'Performance', icon: ChartBarIcon, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { key: 'reports', label: 'Reports', icon: PresentationChartLineIcon, color: 'text-amber-600', bgColor: 'bg-amber-50' }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', service: 'Dry Cleaning', status: 'Completed', amount: '$45.00' },
    { id: 'ORD-002', customer: 'Jane Smith', service: 'Wash & Fold', status: 'Processing', amount: '$32.00' },
    { id: 'ORD-003', customer: 'Bob Johnson', service: 'Ironing', status: 'Pending', amount: '$28.00' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{getGreeting()} 👋</h1>
            <p className="text-gray-600 mt-1">Welcome to Staff Management Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">{formattedDate}</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <UserCircleIcon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.key}
              className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs font-semibold ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {card.trend}
                    </span>
                    <span className="text-xs text-gray-500">from last month</span>
                  </div>
                </div>
                <div className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.key}
                  onClick={() => {
                    const tabMap = {
                      'addStaff': 'staff',
                      'viewSchedule': 'schedule',
                      'performance': 'performance',
                      'reports': 'performance' // Defaulting to performance if reports tab doesn't exist
                    };
                    if (onNavigate && tabMap[action.key]) {
                      onNavigate(tabMap[action.key]);
                    }
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl ${action.bgColor} hover:shadow-md transition-all duration-200 group`}
                >
                  <div className={`p-2 rounded-lg ${action.bgColor.replace('50', '100')}`}>
                    <IconComponent className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <span className="font-medium text-gray-900 group-hover:text-gray-700">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer} • {order.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    order.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Processing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6">Performance Overview</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Efficiency</span>
                <span className="text-sm font-semibold text-gray-900">{stats.performance.efficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.performance.efficiency}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                <span className="text-sm font-semibold text-gray-900">{stats.performance.onTimeDelivery}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.performance.onTimeDelivery}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                <span className="text-sm font-semibold text-gray-900">{stats.performance.customerSatisfaction}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.performance.customerSatisfaction / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Recent Activities</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UserCircleIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="text-blue-600">{activity.staff}</span> {activity.action} 
                    <span className="text-gray-600"> {activity.orderId}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Mark All as Read
          </button>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                notification.read ? 'bg-gray-400' : 'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
              {!notification.read && (
                <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;