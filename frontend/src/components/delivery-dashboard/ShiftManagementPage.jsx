import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  ClockIcon,
  CalendarIcon,
  PlayIcon,
  StopIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChartBarIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const ShiftManagementPage = () => {
  const { t } = useTranslation();

  // State
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [shiftStats, setShiftStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [expandedShift, setExpandedShift] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // Fetch current shift
  const fetchCurrentShift = useCallback(async () => {
    try {
      const data = await deliveryBoyService.getCurrentShift();
      setCurrentShift(data.shift);
    } catch (err) {
      console.error('Error fetching current shift:', err);
    }
  }, []);

  // Fetch shift history
  const fetchShiftHistory = useCallback(async (page = 1) => {
    try {
      setHistoryLoading(true);
      const data = await deliveryBoyService.getShiftHistory({
        period: selectedPeriod,
        page,
        limit: 10
      });
      setShiftHistory(data.shifts || []);
      setPagination(data.pagination || { currentPage: 1, totalPages: 1 });
    } catch (err) {
      console.error('Error fetching shift history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [selectedPeriod]);

  // Fetch shift stats
  const fetchShiftStats = useCallback(async () => {
    try {
      const data = await deliveryBoyService.getShiftStats({ period: selectedPeriod });
      setShiftStats(data.stats);
    } catch (err) {
      console.error('Error fetching shift stats:', err);
    }
  }, [selectedPeriod]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchCurrentShift(),
        fetchShiftHistory(),
        fetchShiftStats()
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchCurrentShift, fetchShiftHistory, fetchShiftStats]);

  // Refetch when period changes
  useEffect(() => {
    fetchShiftHistory();
    fetchShiftStats();
  }, [selectedPeriod, fetchShiftHistory, fetchShiftStats]);

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          () => resolve({}),
          { timeout: 5000 }
        );
      } else {
        resolve({});
      }
    });
  };

  // Start shift handler
  const handleStartShift = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const location = await getCurrentLocation();
      const data = await deliveryBoyService.startShift(location);
      setCurrentShift(data.shift);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start shift');
    } finally {
      setActionLoading(false);
    }
  };

  // End shift handler
  const handleEndShift = async () => {
    if (!window.confirm('Are you sure you want to end your shift?')) return;
    
    try {
      setActionLoading(true);
      setError(null);
      const location = await getCurrentLocation();
      await deliveryBoyService.endShift(location);
      setCurrentShift(null);
      // Refresh history
      fetchShiftHistory();
      fetchShiftStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end shift');
    } finally {
      setActionLoading(false);
    }
  };

  // Start break handler
  const handleStartBreak = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const data = await deliveryBoyService.startBreak();
      setCurrentShift(data.shift);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start break');
    } finally {
      setActionLoading(false);
    }
  };

  // End break handler
  const handleEndBreak = async () => {
    try {
      setActionLoading(true);
      setError(null);
      const data = await deliveryBoyService.endBreak();
      setCurrentShift(data.shift);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end break');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate shift duration
  const getShiftDuration = (shift) => {
    if (!shift?.startTime) return '0h 0m';
    const start = new Date(shift.startTime);
    const end = shift.endTime ? new Date(shift.endTime) : new Date();
    const diffMs = end - start;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Format time
  const formatTime = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'on-break': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading shift data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('shift_management', 'Shift Management')}</h1>
          <p className="text-gray-500">Manage your work shifts and track your hours</p>
        </div>
        <button
          onClick={() => {
            fetchCurrentShift();
            fetchShiftHistory();
            fetchShiftStats();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      {/* Current Shift Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ClockIcon className="w-6 h-6" />
            Current Shift
          </h2>
          {currentShift && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentShift.status === 'active' ? 'bg-green-400/20 text-green-100' :
              currentShift.status === 'on-break' ? 'bg-yellow-400/20 text-yellow-100' :
              'bg-white/20'
            }`}>
              {currentShift.status === 'active' ? '● Active' : currentShift.status === 'on-break' ? '● On Break' : currentShift.status}
            </span>
          )}
        </div>

        {currentShift ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Started At</p>
                <p className="text-2xl font-bold">{formatTime(currentShift.startTime)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Duration</p>
                <p className="text-2xl font-bold">{getShiftDuration(currentShift)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Deliveries</p>
                <p className="text-2xl font-bold">{currentShift.deliveriesCompleted || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-blue-100 text-sm mb-1">Earnings</p>
                <p className="text-2xl font-bold">₹{currentShift.earnings || 0}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {currentShift.status === 'active' ? (
                <>
                  <button
                    onClick={handleStartBreak}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PauseIcon className="w-5 h-5" />}
                    Take Break
                  </button>
                  <button
                    onClick={handleEndShift}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <StopIcon className="w-5 h-5" />}
                    End Shift
                  </button>
                </>
              ) : currentShift.status === 'on-break' ? (
                <>
                  <button
                    onClick={handleEndBreak}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PlayIcon className="w-5 h-5" />}
                    Resume Work
                  </button>
                  <button
                    onClick={handleEndShift}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <StopIcon className="w-5 h-5" />}
                    End Shift
                  </button>
                </>
              ) : null}
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-white/70" />
            </div>
            <p className="text-blue-100 mb-4">You're currently off duty</p>
            <button
              onClick={handleStartShift}
              disabled={actionLoading}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors mx-auto disabled:opacity-50"
            >
              {actionLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PlayIcon className="w-5 h-5" />}
              Start Shift
            </button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {shiftStats && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-500" />
              Statistics Overview
            </h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-600">Total Hours</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{shiftStats.totalHoursWorked || 0}h</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <TruckIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-600">Deliveries</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{shiftStats.totalDeliveries || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <CurrencyRupeeIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-600">Earnings</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">₹{shiftStats.totalEarnings || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <FireIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-600">Total Shifts</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{shiftStats.totalShifts || 0}</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Hours/Shift</p>
              <p className="text-lg font-semibold text-gray-800">{shiftStats.avgHoursPerShift || 0}h</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Earnings/Shift</p>
              <p className="text-lg font-semibold text-gray-800">₹{shiftStats.avgEarningsPerShift || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Break Time</p>
              <p className="text-lg font-semibold text-gray-800">{shiftStats.totalBreakTime || 0} min</p>
            </div>
          </div>
        </div>
      )}

      {/* Shift History */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          Shift History
        </h3>

        {historyLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : shiftHistory.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No shift history found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shiftHistory.map((shift) => (
              <div 
                key={shift.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <div 
                  onClick={() => setExpandedShift(expandedShift === shift.id ? null : shift.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{formatDate(shift.date)}</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(shift.status)}`}>
                      {shift.status === 'completed' ? 'Completed' : shift.status}
                    </span>
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-gray-800">{shift.hoursWorked}h</p>
                      <p className="text-sm text-green-600">₹{shift.earnings}</p>
                    </div>
                    {expandedShift === shift.id ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedShift === shift.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Duration</p>
                        <p className="font-medium text-gray-800">{shift.totalDuration}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Break Time</p>
                        <p className="font-medium text-gray-800">{shift.breakTime} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Deliveries</p>
                        <p className="font-medium text-gray-800">{shift.deliveries}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pickups</p>
                        <p className="font-medium text-gray-800">{shift.pickups}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => fetchShiftHistory(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchShiftHistory(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftManagementPage;
