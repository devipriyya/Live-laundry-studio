import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import laundryStaffService from '../services/laundryStaffService';
import {
  WrenchIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ClockIcon,
  ShieldCheckIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const LaundryStaffDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    qualityIssues: 0,
    totalEarnings: 0,
    rating: 5.0,
    isAvailable: false
  });

  // Navigation items for the sidebar
  const navItems = [
    { path: '/laundry-staff-dashboard/orders', icon: ClipboardDocumentListIcon, label: t('my_orders', 'My Orders') },
    { path: '/laundry-staff-dashboard/schedule', icon: ClockIcon, label: t('schedule', 'Schedule') },
    { path: '/laundry-staff-dashboard/performance', icon: ChartBarIcon, label: t('performance', 'Performance') },
    { path: '/laundry-staff-dashboard/profile', icon: UserCircleIcon, label: t('profile', 'Profile') },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleToggleAvailability = async () => {
    try {
      const newStatus = !stats.isAvailable;
      const response = await laundryStaffService.updateAvailability(newStatus);
      if (response.success) {
        setStats(prev => ({ ...prev, isAvailable: newStatus }));
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats
        const statsData = await laundryStaffService.getStats();
        setStats({
          pendingOrders: statsData.pendingOrders || 0,
          processingOrders: statsData.processingOrders || 0,
          completedOrders: statsData.completedOrders || 0,
          qualityIssues: statsData.qualityIssues || 0,
          totalEarnings: statsData.totalEarnings || 0,
          rating: statsData.rating || 5.0,
          isAvailable: statsData.isAvailable || false
        });

        // Fetch notifications
        const notifData = await laundryStaffService.getNotifications({ limit: 5 });
        setNotifications(notifData.notifications || []);
        setUnreadCount(notifData.unreadCount || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50
        transform transition-all duration-300 ease-in-out flex flex-col shadow-2xl shadow-slate-200/50
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-blue-50">
                <WrenchIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">Fabrico</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Laundry Expert</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-blue-700 font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'L'}
                  </span>
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${stats.isAvailable ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.name || 'Laundry Staff'}
                </p>
                <p className="text-[10px] font-medium text-slate-500">
                  {stats.isAvailable ? t('available_now', 'Available') : t('off_duty', 'Off Duty')}
                </p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleToggleAvailability}
                  className={`
                    relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
                    ${stats.isAvailable ? 'bg-emerald-500' : 'bg-slate-200'}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${stats.isAvailable ? 'translate-x-4' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 mt-4">{t('main_menu', 'Main Menu')}</p>
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${active 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-[1.02]' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:translate-x-1'
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                  {item.path.includes('orders') && stats.pendingOrders > 0 && (
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
                      {stats.pendingOrders}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200 font-bold text-sm"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>{t('logout', 'Sign Out')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72 relative">
        {/* Top Header (Desktop) */}
        <header className="hidden lg:flex sticky top-0 z-30 h-20 items-center justify-between px-8 bg-slate-50/80 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {navItems.find(item => isActive(item.path, item.exact))?.label || t('dashboard_title', 'Dashboard')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{t('welcome_back_staff', 'Ready for a productive day?')}</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm group">
              <BellIcon className="w-5 h-5 group-hover:animate-swing" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
              )}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] font-medium text-slate-500">{t('staff_id', 'Staff ID')}: {user?.id?.slice(-6).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-4">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-100">
              <WrenchIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">Fabrico</span>
          </div>
          <button className="relative p-2 text-slate-500">
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            )}
          </button>
        </header>

        {/* Main Content View */}
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-0 pb-24 lg:pb-8 max-w-7xl mx-auto w-full">
          <Outlet context={{ stats }} />
        </main>

        {/* Mobile Nav (Floating) */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
          <nav className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-2 py-2 flex items-center justify-around">
            {navItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative p-3 rounded-xl transition-all duration-300
                    ${active ? 'text-blue-400 bg-white/10' : 'text-slate-400 hover:text-white'}
                  `}
                >
                  <item.icon className="w-6 h-6" />
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></span>
                  )}
                  {item.path.includes('orders') && stats.pendingOrders > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center rounded-full border-2 border-slate-900">
                      {stats.pendingOrders}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LaundryStaffDashboard;
