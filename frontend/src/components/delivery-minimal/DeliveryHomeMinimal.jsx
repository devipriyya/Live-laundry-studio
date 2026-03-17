import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  TruckIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  StarIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DeliveryHomeMinimal = () => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayPickups: 0,
    todayDeliveries: 0,
    completed: 0,
    pending: 0,
    earnings: 0,
    rating: 5.0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch stats
      const statsRes = await axios.get(`${API_URL}/delivery-boy/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      
      // Fetch recent orders
      const ordersRes = await axios.get(`${API_URL}/delivery-boy/orders?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (ordersRes.data.success) {
        setRecentOrders(ordersRes.data.orders.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-xl font-semibold text-gray-900">{t('dashboard', 'Dashboard')}</h1>
        <p className="text-sm text-gray-500">{t('welcome_back', 'Welcome back!')}</p>
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
          <p className="text-2xl font-bold text-gray-900">{stats.completed || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <ClockIcon className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs text-gray-500">{t('pending', 'Pending')}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
        </div>
      </div>

      {/* Earnings Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100">{t('todays_earnings', "Today's Earnings")}</p>
            <p className="text-3xl font-bold mt-1 flex items-center">
              <CurrencyRupeeIcon className="w-7 h-7" />
              {stats.earnings || 0}
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

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">{t('recent_orders', 'Recent Orders')}</h2>
          <Link to="/delivery-minimal/orders" className="text-sm text-blue-600 hover:text-blue-700">
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
                to={`/delivery-minimal/orders/${order._id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 truncate">{order.customerInfo?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'picked_up' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'}
                  `}>
                    {order.status}
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

export default DeliveryHomeMinimal;
