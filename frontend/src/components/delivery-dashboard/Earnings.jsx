import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CurrencyRupeeIcon, 
  ArrowTrendingUpIcon, 
  GiftIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Earnings = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('today_s_earnings')}</p>
              <p className="text-3xl font-bold mt-1 flex items-center">
                <CurrencyRupeeIcon className="w-6 h-6 mr-1" />
                {stats.earningsToday}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <CurrencyRupeeIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stats.earningsToday / 2000) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-90">{t('daily_target')}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('weekly_earnings')}</p>
              <p className="text-3xl font-bold mt-1 flex items-center">
                <CurrencyRupeeIcon className="w-6 h-6 mr-1" />
                {stats.weeklyEarnings}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <ArrowTrendingUpIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stats.weeklyEarnings / 10000) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-90">{t('weekly_target')}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{t('monthly_earnings')}</p>
              <p className="text-3xl font-bold mt-1 flex items-center">
                <CurrencyRupeeIcon className="w-6 h-6 mr-1" />
                {stats.monthlyEarnings}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <GiftIcon className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{ width: `${Math.min(100, (stats.monthlyEarnings / 40000) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-2 opacity-90">{t('monthly_target')}</p>
          </div>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{t('earnings_chart')}</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              {t('week')}
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">
              {t('month')}
            </button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">
              {t('year')}
            </button>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-gray-500">{t('earnings_chart_placeholder')}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('recent_transactions')}</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CurrencyRupeeIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Order #{'ORD-2024-' + (100 + item)}</h3>
                  <p className="text-sm text-gray-500">{new Date(Date.now() - item * 86400000).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 flex items-center">
                  <CurrencyRupeeIcon className="w-4 h-4" />
                  {500 + item * 50}
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {t('completed')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earnings;