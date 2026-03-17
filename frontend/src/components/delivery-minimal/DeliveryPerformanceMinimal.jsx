import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  TruckIcon,
  StarIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const DeliveryPerformanceMinimal = () => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedDeliveries: 0,
    onTimeRate: 0,
    rating: 5.0,
    totalEarnings: 0,
    thisWeekDeliveries: 0,
    thisMonthDeliveries: 0,
    avgDeliveryTime: 0
  });
  const [period, setPeriod] = useState('week');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/performance?period=${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching performance stats:', error);
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

  const statCards = [
    {
      label: t('total_deliveries', 'Total Deliveries'),
      value: stats.totalDeliveries || 0,
      icon: TruckIcon,
      color: 'blue'
    },
    {
      label: t('completed', 'Completed'),
      value: stats.completedDeliveries || 0,
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      label: t('on_time_rate', 'On-Time Rate'),
      value: `${stats.onTimeRate || 0}%`,
      icon: ClockIcon,
      color: 'amber'
    },
    {
      label: t('rating', 'Rating'),
      value: stats.rating?.toFixed(1) || '5.0',
      icon: StarIcon,
      color: 'purple'
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', text: 'text-green-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-600' }
  };

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t('performance', 'Performance')}</h1>
          <p className="text-sm text-gray-500">{t('your_delivery_stats', 'Your delivery statistics')}</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">{t('this_week', 'This Week')}</option>
          <option value="month">{t('this_month', 'This Month')}</option>
          <option value="all">{t('all_time', 'All Time')}</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className={`${colorClasses[stat.color].bg} rounded-xl p-4 border border-gray-100`}
          >
            <div className={`w-10 h-10 rounded-lg ${colorClasses[stat.color].icon} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Earnings Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 mb-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <CurrencyRupeeIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-indigo-100">{t('total_earnings', 'Total Earnings')}</p>
            <p className="text-2xl font-bold">₹{stats.totalEarnings || 0}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div>
            <p className="text-xs text-indigo-100">{t('this_week', 'This Week')}</p>
            <p className="text-lg font-semibold">₹{stats.weekEarnings || 0}</p>
          </div>
          <div>
            <p className="text-xs text-indigo-100">{t('this_month', 'This Month')}</p>
            <p className="text-lg font-semibold">₹{stats.monthEarnings || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">{t('quick_stats', 'Quick Stats')}</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">{t('this_week_deliveries', 'This Week Deliveries')}</span>
            </div>
            <span className="font-medium text-gray-900">{stats.thisWeekDeliveries || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">{t('this_month_deliveries', 'This Month Deliveries')}</span>
            </div>
            <span className="font-medium text-gray-900">{stats.thisMonthDeliveries || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <ClockIcon className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm text-gray-600">{t('avg_delivery_time', 'Avg. Delivery Time')}</span>
            </div>
            <span className="font-medium text-gray-900">{stats.avgDeliveryTime || 0} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPerformanceMinimal;
