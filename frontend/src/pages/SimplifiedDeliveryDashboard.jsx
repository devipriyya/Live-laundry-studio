import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import deliveryBoyService from '../services/deliveryBoyService';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  WalletIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const SimplifiedDeliveryDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    todayPickups: 0,
    todayDeliveries: 0,
    pendingTasks: 0,
    completedTasksToday: 0,
    earningsToday: 0,
    rating: 5.0,
    isAvailable: false
  });

  // Navigation items for the sidebar
  const navItems = [
    { path: '/simplified-delivery', icon: HomeIcon, label: t('dashboard', 'Dashboard'), exact: true },
    { path: '/simplified-delivery/orders', icon: ClipboardDocumentListIcon, label: t('my_orders', 'My Orders') },
    { path: '/simplified-delivery/earnings', icon: WalletIcon, label: t('earnings', 'Earnings') },
    { path: '/simplified-delivery/performance', icon: ChartBarIcon, label: t('performance', 'Performance') },
    { path: '/simplified-delivery/profile', icon: UserCircleIcon, label: t('profile', 'Profile') },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsData = await deliveryBoyService.getStats();
        setStats({
          todayPickups: statsData.todayPickups || 0,
          todayDeliveries: statsData.todayDeliveries || 0,
          pendingTasks: statsData.pendingTasks || 0,
          completedTasksToday: statsData.completedTasksToday || 0,
          earningsToday: statsData.earningsToday || 0,
          rating: statsData.rating || 5.0,
          isAvailable: statsData.isAvailable || false
        });

        // Fetch notifications
        const notifData = await deliveryBoyService.getNotifications({ limit: 5 });
        setNotifications(notifData.notifications || []);
        setUnreadCount(notifData.unreadCount || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-16">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-blue-600">Fabrico</span>
          </div>
          <div className="p-2 -mr-2 relative flex-shrink-0 rounded-lg">
            <BellIcon className="w-6 h-6 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg border-r border-gray-200
        transform transition-transform duration-200 ease-in-out flex flex-col
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-600">Fabrico</h1>
              <p className="text-xs text-gray-500">Delivery Partner</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-blue-200">
              <span className="text-blue-700 font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'D'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || 'Delivery Partner'}
              </p>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${stats.isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <p className="text-xs text-gray-500">
                  {stats.isAvailable ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive(item.path, item.exact)
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    isActive(item.path, item.exact) ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {item.path === '/delivery-dashboard/my-orders' && stats.pendingTasks > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-semibold">
                      {stats.pendingTasks}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="font-medium">{t('logout', 'Log Out')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen bg-gray-50">
        <Outlet context={{ stats }} />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center text-xs transition-colors
                ${isActive(item.path, item.exact) 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-blue-600'
                }
              `}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default SimplifiedDeliveryDashboard;
