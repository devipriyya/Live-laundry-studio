import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  CurrencyRupeeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ClockIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  TruckIcon,
  CheckCircleIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
  FireIcon,
  SparklesIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CurrencyRupeeIcon as CurrencyRupeeSolid } from '@heroicons/react/24/solid';

const EarningsNew = () => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // State
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState(null);
  const [charts, setCharts] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('30days');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [transactionSummary, setTransactionSummary] = useState(null);

  // Get auth headers
  const getToken = () => localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${getToken()}` }};

  // Fetch data
  useEffect(() => {
    fetchAllData();
  }, [period]);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [transactionFilter, currentPage, activeTab]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchEarningsStats(),
        fetchBreakdown()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEarningsStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-boy/earnings/stats`,
        { ...authHeaders, params: { period } }
      );
      if (response.data.success) {
        setEarnings(response.data.earnings);
        setCharts(response.data.charts);
      }
    } catch (err) {
      console.error('Error fetching earnings stats:', err);
      setEarnings(getDefaultEarnings());
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-boy/earnings/transactions`,
        { ...authHeaders, params: { page: currentPage, limit: 15, filter: transactionFilter } }
      );
      if (response.data.success) {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination);
        setTransactionSummary(response.data.summary);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchBreakdown = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-boy/earnings/breakdown`,
        { ...authHeaders, params: { period } }
      );
      if (response.data.success) {
        setBreakdown(response.data.breakdown);
        setInsights(response.data.insights);
      }
    } catch (err) {
      console.error('Error fetching breakdown:', err);
    }
  };

  const getDefaultEarnings = () => ({
    today: { amount: 0, deliveries: 0, target: 2000, progress: 0 },
    weekly: { amount: 0, deliveries: 0, target: 10000, progress: 0 },
    monthly: { amount: 0, deliveries: 0, target: 40000, progress: 0 },
    yearly: { amount: 0, deliveries: 0 },
    allTime: { amount: 0, deliveries: 0 },
    growth: { percentage: 0, isPositive: true }
  });

  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatHour = (hour) => {
    if (hour === undefined) return '';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h} ${ampm}`;
  };

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'card':
      case 'credit_card':
      case 'debit_card':
        return <CreditCardIcon className="w-5 h-5" />;
      case 'upi':
      case 'online':
        return <WalletIcon className="w-5 h-5" />;
      default:
        return <BanknotesIcon className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method?.toLowerCase()) {
      case 'card':
      case 'credit_card':
        return 'Card';
      case 'debit_card':
        return 'Debit Card';
      case 'upi':
        return 'UPI';
      case 'online':
        return 'Online';
      default:
        return 'Cash';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-yellow-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 pb-8">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <CurrencyRupeeIcon className="w-8 h-8" />
                My Earnings
              </h1>
              <p className="mt-1 text-yellow-100">Track your income and transactions</p>
            </div>
            
            {/* All-time earnings badge */}
            {earnings && (
              <div className="bg-white/20 rounded-xl px-5 py-3">
                <p className="text-xs text-yellow-100">All-Time Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(earnings.allTime?.amount)}</p>
                <p className="text-xs text-yellow-100">{earnings.allTime?.deliveries} deliveries</p>
              </div>
            )}
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-1 inline-flex">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: '30days', label: '30 Days' },
              { id: 'month', label: 'This Month' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  period === p.id 
                    ? 'bg-yellow-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings Summary Cards */}
        {earnings && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Today's Earnings */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-green-100">Today's Earnings</p>
                <div className="bg-white/20 p-2 rounded-lg">
                  <CurrencyRupeeSolid className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(earnings.today?.amount)}</p>
              <p className="text-sm text-green-100 mt-1">{earnings.today?.deliveries} deliveries</p>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-green-100 mb-1">
                  <span>Daily Target</span>
                  <span>{earnings.today?.progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${earnings.today?.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-100 mt-1 text-right">
                  Goal: {formatCurrency(earnings.today?.target)}
                </p>
              </div>
            </div>

            {/* Weekly Earnings */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-blue-100">Weekly Earnings</p>
                <div className="bg-white/20 p-2 rounded-lg">
                  <CalendarDaysIcon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(earnings.weekly?.amount)}</p>
              <p className="text-sm text-blue-100 mt-1">{earnings.weekly?.deliveries} deliveries</p>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-blue-100 mb-1">
                  <span>Weekly Target</span>
                  <span>{earnings.weekly?.progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${earnings.weekly?.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-100 mt-1 text-right">
                  Goal: {formatCurrency(earnings.weekly?.target)}
                </p>
              </div>
            </div>

            {/* Monthly Earnings */}
            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-purple-100">Monthly Earnings</p>
                <div className="bg-white/20 p-2 rounded-lg">
                  <ChartBarIcon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(earnings.monthly?.amount)}</p>
              <p className="text-sm text-purple-100 mt-1">{earnings.monthly?.deliveries} deliveries</p>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-purple-100 mb-1">
                  <span>Monthly Target</span>
                  <span>{earnings.monthly?.progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${earnings.monthly?.progress || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-purple-100 mt-1 text-right">
                  Goal: {formatCurrency(earnings.monthly?.target)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Growth Indicator */}
        {earnings?.growth && (
          <div className={`rounded-xl p-4 flex items-center justify-between ${
            earnings.growth.isPositive ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {earnings.growth.isPositive ? (
                <div className="bg-green-100 p-2 rounded-lg">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded-lg">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
                </div>
              )}
              <div>
                <p className={`font-semibold ${earnings.growth.isPositive ? 'text-green-800' : 'text-red-800'}`}>
                  {earnings.growth.isPositive ? '+' : ''}{earnings.growth.percentage}% vs previous period
                </p>
                <p className="text-sm text-gray-600">
                  Previous: {formatCurrency(earnings.growth.previousPeriod)} → Current: {formatCurrency(earnings.growth.currentPeriod)}
                </p>
              </div>
            </div>
            <SparklesIcon className={`w-8 h-8 ${earnings.growth.isPositive ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Analytics', icon: ChartBarIcon },
              { id: 'transactions', label: 'Transactions', icon: DocumentTextIcon },
              { id: 'insights', label: 'Insights', icon: FireIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-yellow-600 border-b-2 border-yellow-500 bg-yellow-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Analytics Tab */}
          {activeTab === 'overview' && charts && (
            <div className="p-6 space-y-6">
              {/* Daily Earnings Chart */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-yellow-600" />
                  Daily Earnings Trend
                </h3>
                
                {charts.daily && charts.daily.length > 0 ? (
                  <div className="space-y-2">
                    {charts.daily.slice(-10).map((day, idx) => {
                      const maxEarnings = Math.max(...charts.daily.map(d => d.earnings), 1);
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-20">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center px-3"
                              style={{ width: `${Math.max(15, (day.earnings / maxEarnings) * 100)}%` }}
                            >
                              <span className="text-xs font-medium text-white whitespace-nowrap">
                                {formatCurrency(day.earnings)}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 w-16 text-right">
                            {day.deliveries} orders
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No earnings data for selected period</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Weekly Comparison */}
              {charts.weekly && charts.weekly.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-yellow-600" />
                    Weekly Comparison
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {charts.weekly.map((week, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">{week.week}</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(week.earnings)}</p>
                        <p className="text-xs text-gray-500">{week.deliveries} deliveries</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="p-6 space-y-6">
              {/* Filter and Summary */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FunnelIcon className="w-5 h-5 text-gray-400" />
                  <select
                    value={transactionFilter}
                    onChange={(e) => {
                      setTransactionFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
                
                {transactionSummary && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">
                      {transactionSummary.totalOrders} orders
                    </span>
                    <span className="font-semibold text-green-600">
                      Total: {formatCurrency(transactionSummary.totalAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Transaction List */}
              <div className="space-y-2">
                {transactions.length > 0 ? (
                  transactions.map((txn, idx) => (
                    <div 
                      key={txn.id || idx}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-2.5 rounded-xl">
                          <CheckCircleIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{txn.orderId}</p>
                          <p className="text-sm text-gray-500">{txn.customerName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {formatDate(txn.completedAt)} at {formatTime(txn.completedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{formatCurrency(txn.amount)}</p>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                          {getPaymentMethodIcon(txn.paymentMethod)}
                          <span>{getPaymentMethodLabel(txn.paymentMethod)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <DocumentTextIcon className="w-16 h-16 mx-auto text-gray-300" />
                    <p className="mt-4">No transactions found</p>
                    <p className="text-sm">Complete deliveries to see your earnings here</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={!pagination.hasMore}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && breakdown && (
            <div className="p-6 space-y-6">
              {/* Best Performance */}
              {insights && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.bestDay && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <CalendarDaysIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Best Day</p>
                          <p className="text-xl font-bold text-gray-900">{insights.bestDay.day}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{insights.bestDay.deliveries} deliveries</span>
                        <span className="font-semibold text-amber-600">{formatCurrency(insights.bestDay.amount)}</span>
                      </div>
                    </div>
                  )}
                  
                  {insights.bestHour && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <ClockIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Peak Hour</p>
                          <p className="text-xl font-bold text-gray-900">{formatHour(insights.bestHour.hour)}</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{insights.bestHour.deliveries} deliveries</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(insights.bestHour.amount)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Method Breakdown */}
              {breakdown.byPaymentMethod && breakdown.byPaymentMethod.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <WalletIcon className="w-5 h-5 text-yellow-600" />
                    Payment Methods
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {breakdown.byPaymentMethod.map((method, idx) => {
                      const total = breakdown.byPaymentMethod.reduce((sum, m) => sum + m.amount, 0);
                      const percentage = total > 0 ? Math.round((method.amount / total) * 100) : 0;
                      return (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {getPaymentMethodIcon(method.method)}
                            <span className="font-medium text-gray-900 capitalize">
                              {getPaymentMethodLabel(method.method)}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(method.amount)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-yellow-500 h-1.5 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{percentage}%</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{method.count} orders</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Day of Week Breakdown */}
              {breakdown.byDayOfWeek && breakdown.byDayOfWeek.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-yellow-600" />
                    Earnings by Day
                  </h3>
                  <div className="space-y-2">
                    {breakdown.byDayOfWeek.map((day, idx) => {
                      const maxAmount = Math.max(...breakdown.byDayOfWeek.map(d => d.amount), 1);
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-24">{day.day}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center px-2"
                              style={{ width: `${Math.max(10, (day.amount / maxAmount) * 100)}%` }}
                            >
                              <span className="text-xs font-medium text-white">{formatCurrency(day.amount)}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 w-16 text-right">{day.count} orders</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hourly Breakdown */}
              {breakdown.byHour && breakdown.byHour.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-yellow-600" />
                    Earnings by Hour
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {breakdown.byHour.map((hour, idx) => {
                      const maxAmount = Math.max(...breakdown.byHour.map(h => h.amount), 1);
                      const intensity = (hour.amount / maxAmount);
                      return (
                        <div 
                          key={idx} 
                          className="text-center p-3 rounded-lg transition-colors"
                          style={{ 
                            backgroundColor: `rgba(251, 191, 36, ${Math.max(0.1, intensity)})` 
                          }}
                        >
                          <p className="text-xs font-medium text-gray-700">{formatHour(hour.hour)}</p>
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(hour.amount)}</p>
                          <p className="text-xs text-gray-500">{hour.count}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <InformationCircleIcon className="w-5 h-5 text-yellow-600" />
            Earning Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">Work Peak Hours</h4>
              </div>
              <p className="text-sm text-green-600">
                Maximize earnings by working during busy hours (11 AM - 2 PM, 6 PM - 9 PM).
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TruckIcon className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">Quick Deliveries</h4>
              </div>
              <p className="text-sm text-blue-600">
                Complete more deliveries by planning efficient routes between pickups.
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDaysIcon className="w-5 h-5 text-amber-600" />
                <h4 className="font-medium text-amber-800">Weekend Bonus</h4>
              </div>
              <p className="text-sm text-amber-600">
                Weekends often have higher order volumes. Plan shifts accordingly!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsNew;
