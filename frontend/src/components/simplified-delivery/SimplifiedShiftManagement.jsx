import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  ClockIcon,
  PlayIcon,
  StopIcon,
  PauseIcon,
  PlayPauseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SimplifiedShiftManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [shift, setShift] = useState(null);
  const [shiftStatus, setShiftStatus] = useState('offline'); // offline, online, on-break
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [shiftHistory, setShiftHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    fetchShiftData();
  }, []);

  const fetchShiftData = async () => {
    try {
      setLoading(true);
      
      // Get current shift
      const shiftData = await deliveryBoyService.getCurrentShift();
      if (shiftData.shift) {
        setShift(shiftData.shift);
        setShiftStatus(shiftData.shift.status === 'on-break' ? 'on-break' : 'online');
      } else {
        setShift(null);
        setShiftStatus('offline');
      }

      // Get shift history
      const historyData = await deliveryBoyService.getShiftHistory({ limit: 10 });
      setShiftHistory(historyData.shifts || []);
    } catch (error) {
      console.error('Error fetching shift data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startShift = async () => {
    try {
      // Get current location
      let locationData = {};
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      }

      const result = await deliveryBoyService.startShift(locationData);
      setShift(result.shift);
      setShiftStatus('online');
    } catch (error) {
      console.error('Error starting shift:', error);
      alert('Failed to start shift. Please try again.');
    }
  };

  const endShift = async () => {
    if (!window.confirm('Are you sure you want to end your shift?')) return;

    try {
      // Get current location
      let locationData = {};
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      }

      await deliveryBoyService.endShift(locationData);
      setShift(null);
      setShiftStatus('offline');
    } catch (error) {
      console.error('Error ending shift:', error);
      alert('Failed to end shift. Please try again.');
    }
  };

  const startBreak = async () => {
    try {
      const result = await deliveryBoyService.startBreak();
      setShift(result.shift);
      setShiftStatus('on-break');
    } catch (error) {
      console.error('Error starting break:', error);
      alert('Failed to start break. Please try again.');
    }
  };

  const endBreak = async () => {
    try {
      const result = await deliveryBoyService.endBreak();
      setShift(result.shift);
      setShiftStatus('online');
    } catch (error) {
      console.error('Error ending break:', error);
      alert('Failed to end break. Please try again.');
    }
  };

  const getShiftStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on-break':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getShiftStatusLabel = (status) => {
    switch (status) {
      case 'online':
        return t('online', 'Online');
      case 'offline':
        return t('offline', 'Offline');
      case 'on-break':
        return t('on_break', 'On Break');
      default:
        return status;
    }
  };

  const getShiftDuration = (startTime, endTime = null) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const diffMs = end - start;
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
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
        <h1 className="text-xl font-semibold text-gray-900">{t('shift_management', 'Shift Management')}</h1>
        <p className="text-sm text-gray-500">{t('manage_your_shifts', 'Manage your shifts and breaks')}</p>
      </div>

      {/* Current Shift Status */}
      <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-gray-900">{t('current_shift_status', 'Current Shift Status')}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getShiftStatusColor(shiftStatus)}`}>
            {getShiftStatusLabel(shiftStatus)}
          </span>
        </div>

        {shiftStatus !== 'offline' && shift && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">{t('shift_started_at', 'Shift Started At')}</p>
            <p className="font-medium">
              {new Date(shift.startTime).toLocaleDateString()} •{' '}
              {new Date(shift.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {t('duration', 'Duration')}: {getShiftDuration(shift.startTime)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {shiftStatus === 'offline' ? (
            <button
              onClick={startShift}
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              <PlayIcon className="w-5 h-5" />
              {t('start_shift', 'Start Shift')}
            </button>
          ) : (
            <>
              <button
                onClick={shiftStatus === 'online' ? startBreak : endBreak}
                className="flex items-center justify-center gap-2 bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
              >
                <PauseIcon className="w-5 h-5" />
                {shiftStatus === 'online' 
                  ? t('start_break', 'Start Break') 
                  : t('end_break', 'End Break')}
              </button>
              <button
                onClick={endShift}
                className="flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <StopIcon className="w-5 h-5" />
                {t('end_shift', 'End Shift')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Shift History */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-900">{t('shift_history', 'Shift History')}</h2>
        </div>
        
        {shiftHistory.length === 0 ? (
          <div className="p-8 text-center">
            <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">{t('no_shifts_found', 'No shifts found')}</h3>
            <p className="text-sm text-gray-500">{t('shift_history_empty', 'Your shift history will appear here')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {shiftHistory.map((shiftItem, index) => (
              <div key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900">
                    {new Date(shiftItem.startTime).toLocaleDateString()}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getShiftStatusColor(shiftItem.status)}`}>
                    {getShiftStatusLabel(shiftItem.status)}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <p className="text-gray-500">
                    <span className="font-medium">{t('start_time', 'Start Time')}:</span>{' '}
                    {new Date(shiftItem.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {shiftItem.endTime && (
                    <p className="text-gray-500">
                      <span className="font-medium">{t('end_time', 'End Time')}:</span>{' '}
                      {new Date(shiftItem.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                  
                  <p className="text-gray-500">
                    <span className="font-medium">{t('duration', 'Duration')}:</span>{' '}
                    {shiftItem.endTime 
                      ? getShiftDuration(shiftItem.startTime, shiftItem.endTime)
                      : getShiftDuration(shiftItem.startTime)
                    }
                  </p>
                  
                  {shiftItem.notes && (
                    <p className="text-gray-500">
                      <span className="font-medium">{t('notes', 'Notes')}:</span> {shiftItem.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplifiedShiftManagement;
