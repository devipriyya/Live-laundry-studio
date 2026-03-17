import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  TruckIcon,
  ChartBarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const DeliveryBoyDashboardMinimal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navItems = [
    { path: '/delivery-minimal', icon: HomeIcon, label: t('home', 'Home'), exact: true },
    { path: '/delivery-minimal/orders', icon: ClipboardDocumentListIcon, label: t('my_orders', 'My Orders') },
    { path: '/delivery-minimal/performance', icon: ChartBarIcon, label: t('performance', 'Performance') },
    { path: '/delivery-minimal/profile', icon: UserCircleIcon, label: t('profile', 'Profile') },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Mobile Header - Matching User Dashboard Style */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-yellow-50 rounded-lg transition-colors">
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-yellow-600">FabricSpa</span>
          </div>
          <button className="p-2 -mr-2 relative flex-shrink-0 rounded-lg hover:bg-yellow-50 transition-all" title="Notifications">
            <BellIcon className="w-6 h-6 text-gray-600 hover:text-yellow-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Matching User Dashboard Style */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-sm border-r border-gray-200
        transform transition-transform duration-200 ease-in-out flex flex-col
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo - Matching User Dashboard */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-600">FabricSpa</h1>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-6 right-4 p-1 hover:bg-gray-100 rounded-lg">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center ring-2 ring-yellow-200">
              <span className="text-yellow-700 font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'D'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Delivery Partner'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Matching User Dashboard Style */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    isActive(item.path, item.exact)
                      ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    isActive(item.path, item.exact) ? 'text-yellow-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.label}</span>
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
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - Matching Style */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center justify-center flex-1 h-full transition-colors
                ${isActive(item.path, item.exact) 
                  ? 'text-yellow-600 border-t-2 border-yellow-500 bg-yellow-50' 
                  : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-50'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DeliveryBoyDashboardMinimal;
