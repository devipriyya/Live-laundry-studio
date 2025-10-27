import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  UserCircleIcon,
  ClockIcon,
  TruckIcon,
  Cog6ToothIcon,
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  PhoneIcon,
  // EnvelopeIcon,  // Removed mail icon import
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
  LightBulbIcon, // Add this import
  HeartIcon,
  ShoppingCartIcon,
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
    if (path === '/dashboard/quality') return 'quality';
    if (path === '/dashboard/rate') return 'rate';
    if (path === '/dashboard/products') return 'products';
    if (path === '/dashboard/store') return 'store';
    if (path === '/dashboard/legal') return 'legal';
    if (path === '/dashboard/notifications') return 'notifications';
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
    { id: 'quality', name: 'Quality Approval', icon: CheckCircleIcon, path: '/dashboard/quality' },
    { id: 'rate', name: 'Get Rate Card', icon: DocumentTextIcon, path: '/dashboard/rate' },
    { id: 'products', name: 'WashLab Products', icon: TagIcon, path: '/dashboard/products', badge: 'NEW' },
    { id: 'recommendations', name: 'Recommendations', icon: LightBulbIcon, path: '/dashboard/recommendations', badge: 'AI' },
    { id: 'store', name: 'Store Locator', icon: BuildingStorefrontIcon, path: '/dashboard/store' },
    { id: 'legal', name: 'Legal Info', icon: InformationCircleIcon, path: '/dashboard/legal', hasSubmenu: true },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, path: '/dashboard/notifications' },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/dashboard/home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">WashLab</h1>
              <p className="text-xs text-gray-500">Premium Laundry Service</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
            
            <button 
              onClick={() => navigate('/dashboard/wishlist')}
              className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 relative"
            >
              <HeartIcon className="h-6 w-6" />
            </button>
            
            <button 
              onClick={() => navigate('/dashboard/cart')}
              className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all duration-200 relative"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Removed mail icon button */}
            
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4 rounded-lg max-w-7xl mx-auto">
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

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-600 mb-2 md:mb-0">
            © 2025 WashLab. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              Terms of Service
            </button>
            <button className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;