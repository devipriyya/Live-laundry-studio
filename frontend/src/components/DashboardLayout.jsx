import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  UserCircleIcon,
  ClockIcon,
  TruckIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CubeIcon,
  TagIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  HomeIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  // Get active menu item from current path
  const getActiveMenuItem = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/home') return 'home';
    if (path === '/dashboard/profile') return 'profile';
    if (path === '/dashboard/laundry') return 'laundry';
    if (path === '/dashboard/schedule') return 'schedule';
    if (path === '/dashboard/orders') return 'orders';
    if (path === '/dashboard/payment') return 'payment';
    if (path === '/dashboard/quality') return 'quality';
    if (path === '/dashboard/rate') return 'rate';
    if (path === '/dashboard/products') return 'products';
    if (path === '/dashboard/store') return 'store';
    if (path === '/dashboard/legal') return 'legal';
    if (path === '/dashboard/about') return 'about';
    return 'home';
  };

  const activeMenuItem = getActiveMenuItem();

  // Navigation menu items
  const menuItems = [
    { id: 'home', name: 'Home', icon: HomeIcon, path: '/dashboard/home' },
    { id: 'profile', name: 'My Profile', icon: UserCircleIcon, path: '/dashboard/profile' },
    { id: 'laundry', name: 'Laundry Segment', icon: CubeIcon, path: '/dashboard/laundry', hasSubmenu: true },
    { id: 'schedule', name: 'Schedule Wash', icon: CalendarDaysIcon, path: '/dashboard/schedule' },
    { id: 'orders', name: 'My Orders', icon: ShoppingBagIcon, path: '/dashboard/orders' },
    { id: 'payment', name: 'Online Payment', icon: CreditCardIcon, path: '/dashboard/payment' },
    { id: 'quality', name: 'Quality Approval', icon: CheckCircleIcon, path: '/dashboard/quality' },
    { id: 'rate', name: 'Get Rate Card', icon: DocumentTextIcon, path: '/dashboard/rate' },
    { id: 'products', name: 'Jivika Labs Products', icon: TagIcon, path: '/dashboard/products', badge: 'NEW' },
    { id: 'store', name: 'Store Locator', icon: BuildingStorefrontIcon, path: '/dashboard/store' },
    { id: 'legal', name: 'Legal Info', icon: InformationCircleIcon, path: '/dashboard/legal', hasSubmenu: true },
    { id: 'about', name: 'About Us', icon: QuestionMarkCircleIcon, path: '/dashboard/about' },
    { id: 'logout', name: 'Log Out', icon: ArrowRightOnRectangleIcon }
  ];

  const handleMenuClick = (item) => {
    if (item.id === 'logout') {
      logout();
      navigate('/');
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-600">fabricspa</h1>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    activeMenuItem === item.id
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${
                    activeMenuItem === item.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.hasSubmenu && (
                    <ChevronDownIcon className="h-4 w-4 ml-auto text-gray-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <BellIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <EnvelopeIcon className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <PhoneIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <p className="text-green-800 font-medium">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area - This will render the nested route components */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
