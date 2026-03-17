import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  ClockIcon,
  CalendarDaysIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChartBarIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  SunIcon,
  MoonIcon,
  BoltIcon,
  PencilIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

const ShiftManagementNew = ({ shiftStatus, setShiftStatus }) => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Current shift data
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftDuration, setShiftDuration] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  
  // Today's stats
  const [todayStats, setTodayStats] = useState({
    completedDeliveries: 0,
    pendingDeliveries: 0,
    totalEarnings: 0,
    avgRating: 5.0,
    hoursWorked: 0
  });
  
  // Schedule
  const [scheduleData, setScheduleData] = useState({
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });
  
  // Shift history
  const [shiftHistory, setShiftHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('7days');
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [shiftStats, setShiftStats] = useState(null);
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const weekDays = [
    { id: 'monday', label: 'Mon', fullLabel: 'Monday' },
    { id: 'tuesday', label: 'Tue', fullLabel: 'Tuesday' },
    { id: 'wednesday', label: 'Wed', fullLabel: 'Wednesday' },
    { id: 'thursday', label: 'Thu', fullLabel: 'Thursday' },
    { id: 'friday', label: 'Fri', fullLabel: 'Friday' },
    { id: 'saturday', label: 'Sat', fullLabel: 'Saturday' },
    { id: 'sunday', label: 'Sun', fullLabel: 'Sunday' }
  ];

  // Get auth token
  const getToken = () => localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${getToken()}` }};

  // Load data on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Timer for shift duration
  useEffect(() => {
    let interval;
    if (currentShift && currentShift.status === 'active' && !isOnBreak) {
      interval = setInterval(() => {
        const now = new Date();
        const start = new Date(currentShift.startTime);
        const diff = Math.floor((now - start) / 1000) - totalBreakTime;
        setShiftDuration(Math.max(0, diff));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentShift, isOnBreak, totalBreakTime]);

  // Fetch shift history when filter changes
  useEffect(() => {
    if (!loading) {
      fetchShiftHistory();
    }
  }, [historyFilter, pagination.page]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [profileRes, statsRes, currentShiftRes] = await Promise.all([
        axios.get(`${API_URL}/delivery-boy/profile`, authHeaders),
        axios.get(`${API_URL}/delivery-boy/stats`, authHeaders),
        axios.get(`${API_URL}/delivery-boy/shift/current`, authHeaders).catch(() => ({ data: { success: true, shift: null }}))
      ]);
      
      // Set profile/schedule data
      if (profileRes.data.success) {
        const profile = profileRes.data.profile;
        setScheduleData({
          workingHoursStart: profile.deliveryBoyInfo?.workingHours?.start || '09:00',
          workingHoursEnd: profile.deliveryBoyInfo?.workingHours?.end || '18:00',
          availableDays: profile.deliveryBoyInfo?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        });
      }
      
      // Set today's stats
      if (statsRes.data) {
        setTodayStats({
          completedDeliveries: statsRes.data.completedTasksToday || 0,
          pendingDeliveries: statsRes.data.pendingTasks || 0,
          totalEarnings: statsRes.data.earningsToday || 0,
          avgRating: statsRes.data.rating || 5.0,
          hoursWorked: statsRes.data.hoursWorkedToday || 0
        });
      }
      
      // Set current shift if exists
      if (currentShiftRes.data.success && currentShiftRes.data.shift) {
        const shift = currentShiftRes.data.shift;
        setCurrentShift(shift);
        setIsOnBreak(shift.status === 'on-break');
        setShiftStatus(shift.status === 'on-break' || shift.status === 'active' ? 'online' : 'offline');
        
        // Calculate total break time from shift breaks
        if (shift.breaks && shift.breaks.length > 0) {
          const breakTime = shift.breaks.reduce((total, br) => total + (br.duration || 0), 0);
          setTotalBreakTime(breakTime);
        }
      }
      
      // Fetch shift history
      await fetchShiftHistory();
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load shift data');
    } finally {
      setLoading(false);
    }
  };

  const fetchShiftHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      
      let params = {
        page: pagination.page,
        limit: pagination.limit,
        period: historyFilter
      };
      
      // Add custom date range if selected
      if (historyFilter === 'custom' && customDateRange.from && customDateRange.to) {
        params = {
          ...params,
          dateFrom: customDateRange.from,
          dateTo: customDateRange.to
        };
      }
      
      const [historyRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/delivery-boy/shift/history`, { ...authHeaders, params }).catch(() => ({ data: { success: true, shifts: [], pagination: {} }})),
        axios.get(`${API_URL}/delivery-boy/shift/stats`, { ...authHeaders, params: { period: historyFilter } }).catch(() => ({ data: { success: true, stats: null }}))
      ]);
      
      if (historyRes.data.success) {
        setShiftHistory(historyRes.data.shifts || []);
        if (historyRes.data.pagination) {
          setPagination(prev => ({
            ...prev,
            ...historyRes.data.pagination
          }));
        }
      }
      
      if (statsRes.data.success && statsRes.data.stats) {
        setShiftStats(statsRes.data.stats);
      }
      
    } catch (err) {
      console.error('Error fetching shift history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }, [historyFilter, pagination.page, customDateRange, API_URL]);

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleStartShift = async () => {
    try {
      setSaving(true);
      
      // Get current location
      let locationData = {};
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (e) {
          console.log('Could not get location:', e);
        }
      }
      
      const response = await axios.post(`${API_URL}/delivery-boy/shift/start`, locationData, authHeaders);
      
      if (response.data.success) {
        setCurrentShift(response.data.shift);
        setShiftStatus('online');
        setShiftDuration(0);
        setTotalBreakTime(0);
        setIsOnBreak(false);
        setSuccess('Shift started! You are now online.');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start shift');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleEndShift = async () => {
    try {
      setSaving(true);
      
      // Get current location
      let locationData = {};
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
        } catch (e) {
          console.log('Could not get location:', e);
        }
      }
      
      const response = await axios.post(`${API_URL}/delivery-boy/shift/end`, locationData, authHeaders);
      
      if (response.data.success) {
        setCurrentShift(null);
        setShiftStatus('offline');
        setShiftDuration(0);
        setTotalBreakTime(0);
        setIsOnBreak(false);
        setShowEndShiftModal(false);
        setSuccess('Shift ended! Great work today.');
        setTimeout(() => setSuccess(null), 3000);
        
        // Refresh history to include the new completed shift
        fetchShiftHistory();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to end shift');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBreak = async () => {
    try {
      setSaving(true);
      
      if (isOnBreak) {
        // End break
        const response = await axios.post(`${API_URL}/delivery-boy/shift/break/end`, {}, authHeaders);
        if (response.data.success) {
          setCurrentShift(response.data.shift);
          setIsOnBreak(false);
          
          // Update total break time from response
          if (response.data.shift.breaks) {
            const breakTime = response.data.shift.breaks.reduce((total, br) => total + (br.duration || 0), 0);
            setTotalBreakTime(breakTime);
          }
          
          setSuccess('Break ended. Back to work!');
        }
      } else {
        // Start break
        const response = await axios.post(`${API_URL}/delivery-boy/shift/break/start`, {}, authHeaders);
        if (response.data.success) {
          setCurrentShift(response.data.shift);
          setIsOnBreak(true);
          setSuccess('Break started. Take your time!');
        }
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle break');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      
      await axios.put(`${API_URL}/delivery-boy/profile`, {
        workingHours: {
          start: scheduleData.workingHoursStart,
          end: scheduleData.workingHoursEnd
        },
        availableDays: scheduleData.availableDays
      }, authHeaders);
      
      setShowScheduleModal(false);
      setSuccess('Schedule updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save schedule');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (dayId) => {
    setScheduleData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(dayId)
        ? prev.availableDays.filter(d => d !== dayId)
        : [...prev.availableDays, dayId]
    }));
  };

  const handleFilterChange = (filter) => {
    setHistoryFilter(filter);
    setPagination(prev => ({ ...prev, page: 1 }));
    if (filter !== 'custom') {
      setShowFilterModal(false);
    }
  };

  const handleCustomDateApply = () => {
    if (customDateRange.from && customDateRange.to) {
      setHistoryFilter('custom');
      setPagination(prev => ({ ...prev, page: 1 }));
      setShowFilterModal(false);
      fetchShiftHistory();
    }
  };

  const getFilterLabel = () => {
    switch (historyFilter) {
      case 'today': return 'Today';
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case 'custom': return `${customDateRange.from} - ${customDateRange.to}`;
      default: return 'Last 7 Days';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-yellow-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading shift data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Alerts */}
        {(error || success) && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 shadow-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-sm flex-1">{error}</p>
                <button onClick={() => setError(null)} className="text-red-500">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 shadow-lg">
                <CheckCircleSolid className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Current Shift Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Status Indicator */}
              <div className="flex items-center gap-4">
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                  currentShift 
                    ? isOnBreak ? 'bg-amber-100' : 'bg-green-100' 
                    : 'bg-gray-100'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentShift
                      ? isOnBreak ? 'bg-amber-500' : 'bg-green-500'
                      : 'bg-gray-400'
                  }`}>
                    {currentShift ? (
                      isOnBreak ? (
                        <PauseIcon className="w-6 h-6 text-white" />
                      ) : (
                        <BoltIcon className="w-6 h-6 text-white" />
                      )
                    ) : (
                      <MoonIcon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  {currentShift && !isOnBreak && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full animate-pulse border-2 border-white"></span>
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentShift 
                      ? isOnBreak ? 'On Break' : 'Online' 
                      : 'Offline'}
                  </h2>
                  <p className="text-gray-500">
                    {currentShift 
                      ? isOnBreak 
                        ? 'Taking a break' 
                        : 'Ready to accept orders'
                      : 'Start your shift to go online'}
                  </p>
                  {currentShift && (
                    <div className="flex items-center gap-2 mt-2">
                      <ClockIcon className="w-4 h-4 text-yellow-600" />
                      <span className="text-lg font-mono font-bold text-yellow-600">
                        {formatDuration(shiftDuration)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!currentShift ? (
                  <button
                    onClick={handleStartShift}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
                  >
                    {saving ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <PlayIcon className="w-5 h-5" />
                    )}
                    Start Shift
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleToggleBreak}
                      disabled={saving}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 ${
                        isOnBreak
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {saving ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      ) : isOnBreak ? (
                        <>
                          <PlayIcon className="w-5 h-5" />
                          Resume Work
                        </>
                      ) : (
                        <>
                          <PauseIcon className="w-5 h-5" />
                          Take Break
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowEndShiftModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-all"
                    >
                      <StopIcon className="w-5 h-5" />
                      End Shift
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Shift Info Bar */}
          {currentShift && (
            <div className="px-6 py-3 bg-yellow-50 border-t border-yellow-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <SunIcon className="w-4 h-4" />
                  Started: {formatTime(currentShift.startTime)}
                </span>
                {totalBreakTime > 0 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <PauseIcon className="w-4 h-4" />
                    Break: {Math.floor(totalBreakTime / 60)}m
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">
                Scheduled: {scheduleData.workingHoursStart} - {scheduleData.workingHoursEnd}
              </span>
            </div>
          )}
        </div>

        {/* Today's Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={TruckIcon}
            label="Deliveries"
            value={todayStats.completedDeliveries}
            subtext={`${todayStats.pendingDeliveries} pending`}
            color="blue"
          />
          <StatCard
            icon={CurrencyRupeeIcon}
            label="Earnings"
            value={`₹${todayStats.totalEarnings}`}
            subtext="Today"
            color="green"
          />
          <StatCard
            icon={ClockIcon}
            label="Hours"
            value={shiftStats?.totalHoursWorked || '0.00'}
            subtext={getFilterLabel()}
            color="yellow"
          />
          <StatCard
            icon={StarSolid}
            label="Rating"
            value={shiftStats?.avgRating || '5.0'}
            subtext="Average"
            color="purple"
          />
        </div>

        {/* Work Schedule Card */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Work Schedule</h3>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Working Hours */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <ClockIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Working Hours</p>
                  <p className="text-sm text-gray-500">Your daily schedule</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-amber-600">
                  {scheduleData.workingHoursStart} - {scheduleData.workingHoursEnd}
                </p>
                <p className="text-xs text-gray-500">
                  {calculateHours(scheduleData.workingHoursStart, scheduleData.workingHoursEnd)} hours
                </p>
              </div>
            </div>
            
            {/* Available Days */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Available Days</p>
              <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                  <span
                    key={day.id}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      scheduleData.availableDays.includes(day.id)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shift History */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
                Shift History
              </h3>
              
              {/* Filter Controls */}
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['today', '7days', '30days'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        historyFilter === filter
                          ? 'bg-yellow-500 text-white'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter === 'today' ? 'Today' : filter === '7days' ? '7 Days' : '30 Days'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowFilterModal(true)}
                  className={`p-2 rounded-lg transition-colors ${
                    historyFilter === 'custom' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FunnelIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Period Stats Summary */}
            {shiftStats && (
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Shifts</p>
                  <p className="font-bold text-gray-900">{shiftStats.totalShifts}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Hours Worked</p>
                  <p className="font-bold text-gray-900">{shiftStats.totalHoursWorked}h</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Deliveries</p>
                  <p className="font-bold text-gray-900">{shiftStats.totalDeliveries}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Earnings</p>
                  <p className="font-bold text-green-600">₹{shiftStats.totalEarnings}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* History List */}
          {historyLoading ? (
            <div className="p-8 text-center">
              <ArrowPathIcon className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
              <p className="mt-2 text-gray-500">Loading history...</p>
            </div>
          ) : shiftHistory.length === 0 ? (
            <div className="p-8 text-center">
              <InformationCircleIcon className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="mt-2 text-gray-500">No shift records found for this period</p>
              <p className="text-sm text-gray-400">Start a shift to begin tracking your work history</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {shiftHistory.map((shift) => (
                  <div key={shift.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          shift.status === 'completed' ? 'bg-green-100' : 
                          shift.status === 'active' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <CalendarDaysIcon className={`w-5 h-5 ${
                            shift.status === 'completed' ? 'text-green-600' : 
                            shift.status === 'active' ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{formatDate(shift.date)}</p>
                          <p className="text-sm text-gray-500">
                            {formatTime(shift.startTime)} - {shift.endTime ? formatTime(shift.endTime) : 'In Progress'} 
                            {shift.hoursWorked > 0 && ` • ${shift.hoursWorked}h`}
                            {shift.breakTime > 0 && (
                              <span className="text-amber-600"> ({shift.breakTime}m break)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹{shift.earnings || 0}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <TruckIcon className="w-4 h-4" />
                            {shift.deliveries || 0}
                          </span>
                          {shift.rating && (
                            <span className="flex items-center gap-1">
                              <StarSolid className="w-4 h-4 text-yellow-500" />
                              {shift.rating}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            shift.status === 'completed' ? 'bg-green-100 text-green-700' :
                            shift.status === 'active' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {shift.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.pages} ({pagination.total} records)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* End Shift Confirmation Modal */}
        {showEndShiftModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <StopIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">End Shift?</h3>
                    <p className="text-sm text-gray-500">You will go offline</p>
                  </div>
                </div>
                
                {/* Shift Summary */}
                <div className="p-4 bg-gray-50 rounded-lg mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium">{formatDuration(shiftDuration)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Break Time</span>
                    <span className="font-medium">{Math.floor(totalBreakTime / 60)}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Deliveries</span>
                    <span className="font-medium">{todayStats.completedDeliveries}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">Earnings</span>
                    <span className="font-bold text-green-600">₹{todayStats.totalEarnings}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEndShiftModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEndShift}
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {saving ? 'Ending...' : 'End Shift'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Edit Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Schedule</h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                {/* Working Hours */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Hours
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={scheduleData.workingHoursStart}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, workingHoursStart: e.target.value }))}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={scheduleData.workingHoursEnd}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, workingHoursEnd: e.target.value }))}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                    />
                  </div>
                </div>
                
                {/* Available Days */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Days
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day.id}
                        onClick={() => toggleDay(day.id)}
                        className={`p-2 rounded-lg text-xs font-medium transition-all ${
                          scheduleData.availableDays.includes(day.id)
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSchedule}
                    disabled={saving}
                    className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Schedule'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Date Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-sm w-full shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Custom Date Range</h3>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={customDateRange.from}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={customDateRange.to}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomDateApply}
                    disabled={!customDateRange.from || !customDateRange.to}
                    className="flex-1 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, subtext, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };
  
  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
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

// Helper function to calculate hours between two times
const calculateHours = (start, end) => {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;
  const diff = endMins - startMins;
  return (diff / 60).toFixed(1);
};

export default ShiftManagementNew;
