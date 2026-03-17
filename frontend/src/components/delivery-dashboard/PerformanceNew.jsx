import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  StarIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  FireIcon,
  BoltIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  SparklesIcon,
  RocketLaunchIcon,
  GiftIcon,
  LockClosedIcon,
  AcademicCapIcon,
  HandThumbUpIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, TrophyIcon as TrophySolid } from '@heroicons/react/24/solid';

const PerformanceNew = () => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // State
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7days');
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [achievementSummary, setAchievementSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  // Get auth headers
  const getToken = () => localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${getToken()}` }};

  // Fetch data
  useEffect(() => {
    fetchAllData();
  }, [period]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchPerformanceStats(),
        fetchLeaderboard(),
        fetchAchievements()
      ]);
    } catch (err) {
      setError('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-boy/performance/stats`,
        { ...authHeaders, params: { period } }
      );
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching performance stats:', err);
      // Set default stats on error
      setStats(getDefaultStats());
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-boy/performance/leaderboard`,
        authHeaders
      );
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard);
        setCurrentUserRank(response.data.currentUserRank);
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/delivery-boy/performance/achievements`,
        authHeaders
      );
      if (response.data.success) {
        setAchievements(response.data.achievements);
        setAchievementSummary(response.data.summary);
      }
    } catch (err) {
      console.error('Error fetching achievements:', err);
    }
  };

  const getDefaultStats = () => ({
    totalDeliveriesInPeriod: 0,
    totalPickupsInPeriod: 0,
    allTimeDeliveries: 0,
    rating: 5.0,
    totalReviews: 0,
    onTimePercentage: 100,
    efficiencyScore: 100,
    totalEarnings: 0,
    avgOrderValue: 0,
    dailyStats: [],
    bestHours: [],
    recentOrders: [],
    shiftsWorked: 0,
    totalHoursWorked: 0
  });

  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (hour) => {
    if (hour === undefined) return '';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h} ${ampm}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-yellow-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading performance data...</p>
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
                <ChartBarIcon className="w-8 h-8" />
                Performance Analytics
              </h1>
              <p className="mt-1 text-yellow-100">Track your delivery performance and achievements</p>
            </div>
            
            {/* Period Selector */}
            <div className="flex bg-white/20 rounded-lg p-1">
              {[
                { id: 'today', label: 'Today' },
                { id: '7days', label: '7 Days' },
                { id: '30days', label: '30 Days' },
                { id: 'month', label: 'Month' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    period === p.id 
                      ? 'bg-white text-yellow-600' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: ChartBarIcon },
              { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon },
              { id: 'achievements', label: 'Achievements', icon: SparklesIcon }
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

          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="p-6 space-y-6">
              {/* Performance Score Card */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreBg(stats.efficiencyScore)}`}>
                      <div className="text-center">
                        <p className={`text-3xl font-bold ${getScoreColor(stats.efficiencyScore)}`}>
                          {stats.efficiencyScore}
                        </p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Efficiency Score</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Based on on-time delivery, rating & completion rate
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <StarSolid className="w-5 h-5 text-yellow-500" />
                          <span className="font-semibold text-gray-900">{stats.rating}</span>
                          <span className="text-sm text-gray-500">({stats.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.onTimePercentage}%</p>
                      <p className="text-xs text-gray-500">On-Time</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats.allTimeDeliveries}</p>
                      <p className="text-xs text-gray-500">All-Time</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={TruckIcon}
                  label="Deliveries"
                  value={stats.totalDeliveriesInPeriod}
                  subtext={`${period === 'today' ? 'Today' : `Last ${period.replace('days', ' days')}`}`}
                  color="blue"
                />
                <StatCard
                  icon={CheckCircleIcon}
                  label="Pickups"
                  value={stats.totalPickupsInPeriod}
                  subtext="Completed"
                  color="green"
                />
                <StatCard
                  icon={CurrencyRupeeIcon}
                  label="Earnings"
                  value={formatCurrency(stats.totalEarnings)}
                  subtext={`Avg: ${formatCurrency(stats.avgOrderValue)}`}
                  color="yellow"
                />
                <StatCard
                  icon={ClockIcon}
                  label="Hours Worked"
                  value={stats.totalHoursWorked || '0'}
                  subtext={`${stats.shiftsWorked || 0} shifts`}
                  color="purple"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Performance Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-5 h-5 text-yellow-600" />
                    Daily Performance
                  </h3>
                  
                  {stats.dailyStats && stats.dailyStats.length > 0 ? (
                    <div className="space-y-3">
                      {stats.dailyStats.slice(-7).map((day, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-16">{formatDate(day.date)}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-end pr-2"
                              style={{ width: `${Math.max(10, (day.deliveries / Math.max(...stats.dailyStats.map(d => d.deliveries))) * 100)}%` }}
                            >
                              <span className="text-xs font-medium text-white">{day.deliveries}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 w-16 text-right">{formatCurrency(day.earnings)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ChartBarIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">No data for selected period</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Best Hours */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BoltIcon className="w-5 h-5 text-yellow-600" />
                    Peak Performance Hours
                  </h3>
                  
                  {stats.bestHours && stats.bestHours.length > 0 ? (
                    <div className="space-y-3">
                      {stats.bestHours.map((hour, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              idx === 0 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className="font-medium text-gray-900">{formatTime(hour.hour)}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">{hour.deliveries}</span>
                            <span className="text-sm text-gray-500 ml-1">deliveries</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ClockIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Not enough data yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TruckIcon className="w-5 h-5 text-yellow-600" />
                  Recent Completed Deliveries
                </h3>
                
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  <div className="space-y-2">
                    {stats.recentOrders.slice(0, 5).map((order, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{order.orderId}</p>
                            <p className="text-sm text-gray-500">{order.customerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{formatCurrency(order.amount)}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.completedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-gray-400">
                    <p className="text-sm">No recent deliveries</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="p-6 space-y-6">
              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="flex items-end justify-center gap-4 py-6">
                  {/* 2nd Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold ${
                        leaderboard[1]?.isCurrentUser ? 'bg-yellow-100 ring-4 ring-yellow-400' : 'bg-gray-200'
                      }`}>
                        {leaderboard[1]?.name?.charAt(0) || '?'}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                    </div>
                    <p className="mt-4 font-medium text-gray-900 text-sm truncate max-w-20">
                      {leaderboard[1]?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">{leaderboard[1]?.totalDeliveries || 0} deliveries</p>
                    <div className="h-20 w-16 mx-auto bg-gray-200 rounded-t-lg mt-2"></div>
                  </div>
                  
                  {/* 1st Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl font-bold ${
                        leaderboard[0]?.isCurrentUser ? 'bg-yellow-100 ring-4 ring-yellow-400' : 'bg-yellow-100'
                      }`}>
                        {leaderboard[0]?.name?.charAt(0) || '?'}
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <TrophySolid className="w-8 h-8 text-yellow-500" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                    </div>
                    <p className="mt-4 font-medium text-gray-900 truncate max-w-24">
                      {leaderboard[0]?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">{leaderboard[0]?.totalDeliveries || 0} deliveries</p>
                    <div className="h-28 w-20 mx-auto bg-yellow-400 rounded-t-lg mt-2"></div>
                  </div>
                  
                  {/* 3rd Place */}
                  <div className="text-center">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-bold ${
                        leaderboard[2]?.isCurrentUser ? 'bg-yellow-100 ring-4 ring-yellow-400' : 'bg-orange-100'
                      }`}>
                        {leaderboard[2]?.name?.charAt(0) || '?'}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                    </div>
                    <p className="mt-4 font-medium text-gray-900 text-sm truncate max-w-20">
                      {leaderboard[2]?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">{leaderboard[2]?.totalDeliveries || 0} deliveries</p>
                    <div className="h-14 w-16 mx-auto bg-orange-300 rounded-t-lg mt-2"></div>
                  </div>
                </div>
              )}

              {/* Full Leaderboard */}
              <div className="space-y-2">
                {leaderboard.map((entry, idx) => (
                  <div 
                    key={entry.userId}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                      entry.isCurrentUser 
                        ? 'bg-yellow-50 border-2 border-yellow-400' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-white' :
                        idx === 1 ? 'bg-gray-400 text-white' :
                        idx === 2 ? 'bg-orange-400 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          {entry.name}
                          {entry.isCurrentUser && (
                            <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">You</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{formatCurrency(entry.totalEarnings)} earned</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{entry.totalDeliveries}</p>
                      <p className="text-xs text-gray-500">deliveries</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current User Rank if not in top 10 */}
              {currentUserRank && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-400">
                  <p className="text-sm text-gray-600 mb-2">Your current ranking:</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                        {currentUserRank.rank}
                      </div>
                      <span className="font-medium text-gray-900">Your Position</span>
                    </div>
                    <span className="font-bold text-gray-900">{currentUserRank.totalDeliveries} deliveries</span>
                  </div>
                </div>
              )}

              {leaderboard.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <TrophyIcon className="w-16 h-16 mx-auto text-gray-300" />
                  <p className="mt-4">Leaderboard is being calculated...</p>
                  <p className="text-sm">Complete deliveries to appear on the board!</p>
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="p-6 space-y-6">
              {/* Summary */}
              {achievementSummary && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Your Achievements</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Unlocked {achievementSummary.unlockedCount} of {achievementSummary.totalAchievements} badges
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="w-8 h-8 text-purple-500" />
                      <span className="text-3xl font-bold text-purple-600">
                        {achievementSummary.unlockedCount}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="w-full bg-white rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(achievementSummary.unlockedCount / achievementSummary.totalAchievements) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Next milestone */}
                  {achievementSummary.nextMilestone && (
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">Next achievement:</p>
                      <p className="font-medium text-gray-900">
                        {achievementSummary.nextMilestone.icon} {achievementSummary.nextMilestone.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {achievementSummary.nextMilestone.progress} / {achievementSummary.nextMilestone.target} ({achievementSummary.nextMilestone.description})
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300' 
                        : 'bg-gray-50 border-gray-200 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                        achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                      }`}>
                        {achievement.unlocked ? achievement.icon : <LockClosedIcon className="w-6 h-6 text-gray-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                            {achievement.title}
                          </h4>
                          {achievement.unlocked && (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                        
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{achievement.progress} / {achievement.target}</span>
                            <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                achievement.unlocked 
                                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
                                  : 'bg-gray-400'
                              }`}
                              style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {achievements.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <GiftIcon className="w-16 h-16 mx-auto text-gray-300" />
                  <p className="mt-4">Achievements loading...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Performance Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-yellow-600" />
            Performance Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-800">Be On Time</h4>
              </div>
              <p className="text-sm text-blue-600">
                Timely deliveries boost your on-time percentage and improve customer satisfaction.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <HandThumbUpIcon className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">Great Service</h4>
              </div>
              <p className="text-sm text-green-600">
                Polite communication and careful handling lead to better ratings.
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RocketLaunchIcon className="w-5 h-5 text-amber-600" />
                <h4 className="font-medium text-amber-800">Stay Active</h4>
              </div>
              <p className="text-sm text-amber-600">
                Complete more deliveries during peak hours to maximize your earnings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
  };
  
  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg ${iconBgClasses[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{subtext}</p>
    </div>
  );
};

export default PerformanceNew;
