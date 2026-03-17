import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  CurrencyRupeeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SimplifiedEarnings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    earningsToday: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    totalDeliveries: 0,
    averagePerDelivery: 0
  });
  const [earningsHistory, setEarningsHistory] = useState([]);

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsData = await deliveryBoyService.getStats();
      setStats({
        earningsToday: statsData.earningsToday || 0,
        weeklyEarnings: statsData.weeklyEarnings || 0,
        monthlyEarnings: statsData.monthlyEarnings || 0,
        totalDeliveries: statsData.totalDeliveries || 0,
        averagePerDelivery: statsData.totalDeliveries > 0 
          ? Math.round((statsData.monthlyEarnings || 0) / statsData.totalDeliveries) 
          : 0
      });

      // Fetch earnings history
      const historyData = await deliveryBoyService.getEarningsHistory({ period: 'last_7_days' });
      setEarningsHistory(historyData.transactions || []);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
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
        <h1 className="text-xl font-semibold text-gray-900">{t('earnings', 'Earnings')}</h1>
        <p className="text-sm text-gray-500">{t('your_earning_summary', 'Your earning summary and history')}</p>
      </div>

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('today', 'Today')}</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.earningsToday}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('this_week', 'This Week')}</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.weeklyEarnings}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('this_month', 'This Month')}</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.monthlyEarnings}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('avg_per_delivery', 'Avg per Delivery')}</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.averagePerDelivery}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <CurrencyRupeeIcon className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-900">{t('recent_earnings', 'Recent Earnings')}</h2>
        </div>
        
        {earningsHistory.length === 0 ? (
          <div className="p-8 text-center">
            <CurrencyRupeeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">{t('no_earnings_found', 'No earnings found')}</h3>
            <p className="text-sm text-gray-500">{t('earnings_history_empty', 'Your earnings history will appear here')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {earningsHistory.map((transaction, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description || `Order #${transaction.orderId}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+₹{transaction.amount}</p>
                  <p className="text-xs text-gray-500">{transaction.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Stats */}
      <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h2 className="font-medium text-gray-900 mb-4">{t('performance_stats', 'Performance')}</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
            <p className="text-sm text-gray-500">{t('total_deliveries', 'Total Deliveries')}</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalDeliveries > 0 
                ? Math.round((stats.earningsToday / stats.totalDeliveries) * 100) / 100 
                : 0}
            </p>
            <p className="text-sm text-gray-500">{t('avg_per_day', 'Avg per Day')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedEarnings;
