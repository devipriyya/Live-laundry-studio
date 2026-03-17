import React, { useContext, useState, useEffect } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
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
  LightBulbIcon,
  HeartIcon,
  ShoppingCartIcon,
  BeakerIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // ... (fetchUnreadCount effect)

  // Navigation menu items
  const menuItems = [
    { id: 'home', name: t('dashboard.nav.home'), icon: HomeIcon, path: '/dashboard/home' },
    { id: 'laundry', name: t('dashboard.nav.laundry'), icon: CubeIcon, path: '/dashboard/laundry', hasSubmenu: true },
    { id: 'schedule', name: t('dashboard.nav.schedule'), icon: CalendarDaysIcon, path: '/dashboard/schedule' },
    { id: 'track', name: t('dashboard.nav.track'), icon: TruckIcon, path: '/dashboard/track-order' },
    { id: 'payment', name: t('dashboard.nav.payment'), icon: CreditCardIcon, path: '/dashboard/payment', hasSubmenu: true },
    { id: 'payment-history', name: t('dashboard.nav.payment_history'), icon: BanknotesIcon, path: '/dashboard/payment-history' },
    { id: 'orders', name: t('dashboard.nav.orders'), icon: ShoppingBagIcon, path: '/dashboard/orders' },
    { id: 'quality', name: t('dashboard.nav.quality'), icon: CheckCircleIcon, path: '/dashboard/quality' },
    { id: 'rate', name: t('dashboard.nav.rate'), icon: DocumentTextIcon, path: '/dashboard/rate' },
    { id: 'products', name: t('dashboard.nav.products'), icon: TagIcon, path: '/dashboard/products', badge: 'NEW' },
    { id: 'recommendations', name: t('dashboard.nav.recommendations'), icon: LightBulbIcon, path: '/dashboard/recommendations', badge: 'AI' },
    { id: 'test-naive-bayes', name: t('dashboard.nav.naive_bayes'), icon: BeakerIcon, path: '/dashboard/test-naive-bayes', badge: 'ML' },
    { id: 'store', name: t('dashboard.nav.store'), icon: BuildingStorefrontIcon, path: '/dashboard/store' },
    { id: 'legal', name: t('dashboard.nav.legal'), icon: InformationCircleIcon, path: '/dashboard/legal', hasSubmenu: true },
    { id: 'feedback', name: t('dashboard.nav.feedback'), icon: ChatBubbleLeftRightIcon, path: '/dashboard/feedback' },
    { id: 'lost-found', name: t('dashboard.nav.lost_found'), icon: ExclamationTriangleIcon, path: '/dashboard/lost-items' },
    { id: 'notifications', name: t('dashboard.nav.notifications'), icon: BellIcon, path: '/dashboard/notifications' },
    { id: 'logout', name: t('common.logout'), icon: ArrowRightOnRectangleIcon }
  ];

  // ... (handleMenuClick)

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
              <p className="text-xs text-gray-500">{t('landing.hero_subtitle')}</p>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <LanguageToggle className="mx-2" />
            
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name || t('common.user')}</p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
            
            {/* ... other buttons ... */}
            
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden md:inline text-sm font-medium">{t('common.logout')}</span>
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
            © 2025 WashLab. {t('common.rights_reserved')}
          </p>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              {t('common.privacy_policy')}
            </button>
            <button className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              {t('common.terms_of_service')}
            </button>
            <button className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
              {t('common.contact_support')}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;