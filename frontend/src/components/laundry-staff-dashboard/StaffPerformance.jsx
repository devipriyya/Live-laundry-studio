import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChartBarIcon, 
  StarIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  BoltIcon,
  CurrencyRupeeIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import laundryStaffService from '../../services/laundryStaffService';

const StaffPerformance = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await laundryStaffService.getPerformanceMetrics();
      setMetrics(data.metrics || null);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Use real metrics from API with safe defaults
  const displayMetrics = metrics || {
    overallRating: 0,
    completionRate: 0,
    onTimePercentage: 0,
    totalOrdersCompleted: 0,
    efficiencyScore: 0,
    qualityScore: 0,
    earnings: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    },
    weeklyProgress: [
      { day: 'Mon', count: 0 },
      { day: 'Tue', count: 0 },
      { day: 'Wed', count: 0 },
      { day: 'Thu', count: 0 },
      { day: 'Fri', count: 0 },
      { day: 'Sat', count: 0 },
      { day: 'Sun', count: 0 }
    ],
    topStrengths: []
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('my_performance', 'My Performance')}</h1>
          <p className="text-gray-500 text-sm">{t('performance_subtitle', 'Track your efficiency and quality metrics')}</p>
        </div>
        <button 
          onClick={fetchMetrics}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh', 'Refresh')}
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
              <StarSolidIcon className="w-7 h-7 text-amber-500" />
            </div>
            <div className="text-right">
              <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                2.4%
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{t('overall_rating', 'Overall Rating')}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-gray-900">{displayMetrics.overallRating}</p>
            <p className="text-sm text-gray-400 font-medium">/ 5.0</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <BoltIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-right">
              <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full">
                <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                5%
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{t('efficiency', 'Efficiency')}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-gray-900">{displayMetrics.efficiencyScore}%</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <CheckCircleIcon className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="text-right">
              <span className="flex items-center text-red-600 text-xs font-bold bg-red-50 px-2 py-0.5 rounded-full">
                <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                1%
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{t('completion_rate', 'Completion Rate')}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-gray-900">{displayMetrics.completionRate}%</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <TrophyIcon className="w-7 h-7 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{t('orders_completed', 'Total Completed')}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-gray-900">{displayMetrics.totalOrdersCompleted}</p>
            <p className="text-sm text-gray-400 font-medium">{t('orders', 'Orders')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart (Simplified CSS implementation) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-indigo-500" />
              {t('weekly_activity', 'Weekly Activity')}
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                {t('orders', 'Orders')}
              </span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {displayMetrics.weeklyProgress.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-500 cursor-pointer shadow-sm group-hover:shadow-md"
                    style={{ height: `${item.count * 8}px`, minHeight: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Quality */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-blue-700 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrophyIcon className="w-6 h-6 text-indigo-200" />
              {t('top_strengths', 'Top Strengths')}
            </h3>
            <div className="space-y-3">
              {displayMetrics.topStrengths.map((strength, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                  <div className="w-8 h-8 bg-indigo-400/30 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5 text-indigo-100" />
                  </div>
                  <span className="font-semibold text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CurrencyRupeeIcon className="w-5 h-5 text-emerald-500" />
              {t('earnings_summary', 'Earnings Summary')}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm font-medium">{t('today', 'Today')}</span>
                <span className="font-bold text-gray-900">₹{displayMetrics.earnings.today}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-50">
                <span className="text-gray-500 text-sm font-medium">{t('this_week', 'This Week')}</span>
                <span className="font-bold text-gray-900">₹{displayMetrics.earnings.thisWeek}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-50">
                <span className="text-gray-500 text-sm font-medium">{t('this_month', 'This Month')}</span>
                <span className="font-bold text-gray-900">₹{displayMetrics.earnings.thisMonth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;
