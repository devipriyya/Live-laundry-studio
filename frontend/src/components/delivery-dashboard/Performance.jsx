import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  StarIcon, 
  ClockIcon, 
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Performance = ({ stats }) => {
  const { t } = useTranslation();

  // Mock data for performance trends
  const performanceData = [
    { day: 'Mon', rating: 4.2, deliveries: 8 },
    { day: 'Tue', rating: 4.5, deliveries: 12 },
    { day: 'Wed', rating: 4.7, deliveries: 10 },
    { day: 'Thu', rating: 4.8, deliveries: 15 },
    { day: 'Fri', rating: 4.6, deliveries: 11 },
    { day: 'Sat', rating: 4.9, deliveries: 18 },
    { day: 'Sun', rating: 4.8, deliveries: 14 }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('rating')}</p>
              <p className="text-3xl font-bold mt-1 flex items-center">
                <StarIcon className="w-6 h-6 mr-1" />
                {stats.rating}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <StarIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${stats.rating * 20}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-90">{t('performance_score')}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('on_time_delivery')}</p>
              <p className="text-3xl font-bold mt-1">{stats.onTimePercentage}%</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <ClockIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${stats.onTimePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-90">{t('target_95_percent')}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('total_deliveries')}</p>
              <p className="text-3xl font-bold mt-1">{stats.totalDeliveries}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <TrophyIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stats.totalDeliveries / 100) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-90">{t('monthly_target')}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('completed_today')}</p>
              <p className="text-3xl font-bold mt-1">{stats.completedToday}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <ChartBarIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stats.completedToday / 20) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-90">{t('daily_goal')}</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('performance_trend')}</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              {t('week')}
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">
              {t('month')}
            </button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-gray-500">{t('performance_chart_placeholder')}</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('top_customers')}</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Customer {item}</h3>
                    <p className="text-sm text-gray-500">{5 - item + 1} {t('orders')}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-amber-400" />
                  <span className="ml-1 text-gray-900 font-medium">{(4.8 - item * 0.1).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('performance_tips')}</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 flex items-center gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5" />
                {t('tip_be_on_time')}
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                {t('tip_be_on_time_desc')}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-800 flex items-center gap-2">
                <StarIcon className="w-5 h-5" />
                {t('tip_keep_high_rating')}
              </h3>
              <p className="text-sm text-green-600 mt-1">
                {t('tip_keep_high_rating_desc')}
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium text-amber-800 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                {t('tip_increase_deliveries')}
              </h3>
              <p className="text-sm text-amber-600 mt-1">
                {t('tip_increase_deliveries_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;
