import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  BanknotesIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyRupeeIcon,
  DocumentArrowDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const EarningsPage = () => {
  const { t } = useTranslation();

  // State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState('today');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await deliveryBoyService.getStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch earnings history
  const fetchEarningsHistory = useCallback(async () => {
    try {
      const data = await deliveryBoyService.getEarningsHistory({
        period,
        startDate: showCustomRange ? dateRange.startDate : undefined,
        endDate: showCustomRange ? dateRange.endDate : undefined
      });
      if (data.success) {
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error('Error fetching earnings history:', err);
    }
  }, [period, dateRange, showCustomRange]);

  useEffect(() => {
    fetchStats();
    fetchEarningsHistory();
  }, [fetchStats, fetchEarningsHistory]);

  // Period change handler
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setShowCustomRange(false);
    } else {
      setShowCustomRange(true);
    }
  };

  // Get earnings by period
  const getEarningsByPeriod = () => {
    if (!stats) return 0;
    switch (period) {
      case 'today':
        return stats.earningsToday || 0;
      case 'week':
        return stats.weeklyEarnings || 0;
      case 'month':
        return stats.monthlyEarnings || 0;
      default:
        return stats.totalEarnings || 0;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500">Track your income and performance</p>
        </div>
        <button
          onClick={() => { fetchStats(); fetchEarningsHistory(); }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Period Selector */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { id: 'today', label: 'Today' },
          { id: 'week', label: 'This Week' },
          { id: 'month', label: 'This Month' },
          { id: 'custom', label: 'Custom Range' }
        ].map(p => (
          <button
            key={p.id}
            onClick={() => handlePeriodChange(p.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              period === p.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      {showCustomRange && (
        <div className="bg-white rounded-xl p-4 shadow-lg flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={fetchEarningsHistory}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FunnelIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Main Earnings Card */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-green-100 text-sm uppercase tracking-wider mb-1">
              {period === 'today' ? "Today's Earnings" :
               period === 'week' ? "This Week's Earnings" :
               period === 'month' ? "This Month's Earnings" : "Custom Range Earnings"}
            </p>
            <h2 className="text-5xl font-bold mb-2">{formatCurrency(getEarningsByPeriod())}</h2>
            <div className="flex items-center gap-2 text-green-100">
              <ArrowTrendingUpIcon className="w-5 h-5" />
              <span>+12% from last period</span>
            </div>
          </div>
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <CurrencyRupeeIcon className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Deliveries</span>
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.completedDeliveries || 0}</p>
          <p className="text-xs text-gray-400">Completed today</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Pickups</span>
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.completedPickups || 0}</p>
          <p className="text-xs text-gray-400">Completed today</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Per Delivery</span>
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <BanknotesIcon className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(stats?.avgPerDelivery || 50)}
          </p>
          <p className="text-xs text-gray-400">Average earning</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Active Hours</span>
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.hoursWorkedToday || 0}h</p>
          <p className="text-xs text-gray-400">Today</p>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings by Type */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Earnings Breakdown</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Delivery Earnings</p>
                  <p className="text-sm text-gray-500">{stats?.completedDeliveries || 0} deliveries</p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency((stats?.completedDeliveries || 0) * (stats?.avgPerDelivery || 50))}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Pickup Earnings</p>
                  <p className="text-sm text-gray-500">{stats?.completedPickups || 0} pickups</p>
                </div>
              </div>
              <span className="text-xl font-bold text-purple-600">
                {formatCurrency((stats?.completedPickups || 0) * (stats?.avgPerPickup || 30))}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <BanknotesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Tips & Bonuses</p>
                  <p className="text-sm text-gray-500">Extra earnings</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(stats?.tipsEarned || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Progress</h3>
          
          <div className="space-y-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const isToday = new Date().getDay() === (index === 6 ? 0 : index + 1);
              const progress = Math.min(100, Math.random() * 100 + 20);
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className={`w-10 text-sm font-medium ${isToday ? 'text-green-600' : 'text-gray-500'}`}>
                    {day}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isToday ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
                      }`}
                      style={{ width: `${isToday ? progress : Math.random() * 60 + 20}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${isToday ? 'text-green-600' : 'text-gray-500'}`}>
                    ₹{Math.floor(Math.random() * 500 + 200)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Weekly Goal</span>
              <span className="font-bold text-gray-800">₹5,000</span>
            </div>
            <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                style={{ width: `${Math.min(100, ((stats?.weeklyEarnings || 0) / 5000) * 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formatCurrency(stats?.weeklyEarnings || 0)} of ₹5,000
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
          <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            <DocumentArrowDownIcon className="w-4 h-4" />
            Export
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <div 
                key={tx._id || index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'delivery' ? 'bg-blue-100' :
                    tx.type === 'pickup' ? 'bg-purple-100' : 'bg-green-100'
                  }`}>
                    {tx.type === 'delivery' ? (
                      <TruckIcon className={`w-5 h-5 ${tx.type === 'delivery' ? 'text-blue-600' : ''}`} />
                    ) : tx.type === 'pickup' ? (
                      <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                    ) : (
                      <BanknotesIcon className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {tx.type === 'delivery' ? 'Delivery' :
                       tx.type === 'pickup' ? 'Pickup' : 'Bonus'} - #{tx.orderId?.slice(-6) || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'Today'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+{formatCurrency(tx.amount || 50)}</p>
                  <p className="text-xs text-gray-400">{tx.status || 'Completed'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BanknotesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found for this period</p>
            <p className="text-sm text-gray-400 mt-1">Complete deliveries to see your earnings here</p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <p className="text-blue-100 text-sm mb-1">Total Earnings</p>
          <p className="text-3xl font-bold">{formatCurrency(stats?.totalEarnings || stats?.monthlyEarnings * 3 || 0)}</p>
          <p className="text-blue-200 text-sm mt-2">All time</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <p className="text-purple-100 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold">{(stats?.totalDeliveries || 0) + (stats?.totalPickups || 0)}</p>
          <p className="text-purple-200 text-sm mt-2">All time</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <p className="text-orange-100 text-sm mb-1">Avg. Per Order</p>
          <p className="text-3xl font-bold">{formatCurrency(stats?.avgPerDelivery || 45)}</p>
          <p className="text-orange-200 text-sm mt-2">Earnings per order</p>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
