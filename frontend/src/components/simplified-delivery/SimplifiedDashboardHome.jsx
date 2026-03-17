import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  TruckIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  StarIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const SimplifiedDashboardHome = ({ stats: initialStats }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(initialStats || {
    todayPickups: 0,
    todayDeliveries: 0,
    pendingTasks: 0,
    completedTasksToday: 0,
    earningsToday: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    rating: 5.0,
    isAvailable: false
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsData = await deliveryBoyService.getStats();
      setStats({
        todayPickups: statsData.todayPickups || 0,
        todayDeliveries: statsData.todayDeliveries || 0,
        pendingTasks: statsData.pendingTasks || 0,
        completedTasksToday: statsData.completedTasksToday || 0,
        earningsToday: statsData.earningsToday || 0,
        weeklyEarnings: statsData.weeklyEarnings || 0,
        monthlyEarnings: statsData.monthlyEarnings || 0,
        rating: statsData.rating || 5.0,
        isAvailable: statsData.isAvailable || false
      });
      
      // Fetch recent orders
      const ordersData = await deliveryBoyService.getAssignedOrders({ limit: 5 });
      setRecentOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion rate
  const totalTasks = stats.todayPickups + stats.todayDeliveries;
  const completedTasks = stats.completedTasksToday;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('good_morning', 'Good Morning');
    if (hour < 17) return t('good_afternoon', 'Good Afternoon');
    if (hour < 21) return t('good_evening', 'Good Evening');
    return t('good_night', 'Good Night');
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          {getGreeting()}, {stats.deliveryBoyName || 'Partner'}!
        </h1>
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <ArrowUpTrayIcon className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">{t('pickups', 'Pickups')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todayPickups || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <ArrowDownTrayIcon className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">{t('deliveries', 'Deliveries')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.todayDeliveries || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">{t('completed', 'Completed')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completedTasksToday || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <ClockIcon className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">{t('pending', 'Pending')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pendingTasks || 0}</p>
        </div>
      </div>

      {/* Earnings Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100">{t('todays_earnings', "Today's Earnings")}</p>
            <p className="text-3xl font-bold mt-1 flex items-center">
              <CurrencyRupeeIcon className="w-7 h-7" />
              {stats.earningsToday || 0}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-blue-100">
              <StarIcon className="w-4 h-4" />
              <span className="text-sm">{t('rating', 'Rating')}</span>
            </div>
            <p className="text-2xl font-bold">{stats.rating || 5.0}</p>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-gray-900">{t('todays_progress', "Today's Progress")}</h2>
          <span className="text-sm font-medium text-gray-500">
            {completedTasks}/{totalTasks} {t('tasks', 'tasks')}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">{completionRate}% {t('complete', 'complete')}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link 
          to="/simplified-delivery/orders" 
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ClipboardDocumentListIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('view_orders', 'View Orders')}</p>
              <p className="text-xs text-gray-500">{stats.pendingTasks} pending</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/simplified-delivery/earnings" 
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CurrencyRupeeIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('earnings', 'Earnings')}</p>
              <p className="text-xs text-gray-500">₹{stats.earningsToday}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">{t('recent_orders', 'Recent Orders')}</h2>
          <Link to="/simplified-delivery/orders" className="text-sm text-blue-600 hover:text-blue-700">
            {t('view_all', 'View All')}
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <TruckIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t('no_orders_yet', 'No orders assigned yet')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <Link
                key={order._id}
                to={`/simplified-delivery/order/${order._id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 truncate">{order.customerInfo?.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    ₹{order.totalAmount} • {order.status.replace(/-/g, ' ')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${order.status === 'delivery-completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'out-for-delivery' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'out-for-pickup' ? 'bg-yellow-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'}
                  `}>
                    {order.status.replace(/-/g, ' ')}
                  </span>
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplifiedDashboardHome;
