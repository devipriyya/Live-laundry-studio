import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import laundryStaffService from '../../services/laundryStaffService';

const StaffSchedule = () => {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const data = await laundryStaffService.getSchedule();
      setSchedule(data.schedule || {});
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const days = [
    { key: 'monday', label: t('monday', 'Monday') },
    { key: 'tuesday', label: t('tuesday', 'Tuesday') },
    { key: 'wednesday', label: t('wednesday', 'Wednesday') },
    { key: 'thursday', label: t('thursday', 'Thursday') },
    { key: 'friday', label: t('friday', 'Friday') },
    { key: 'saturday', label: t('saturday', 'Saturday') },
    { key: 'sunday', label: t('sunday', 'Sunday') }
  ];

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('my_schedule', 'My Schedule')}</h1>
          <p className="text-gray-500 text-sm">{t('manage_working_hours', 'View and manage your weekly working hours')}</p>
        </div>
        <button 
          onClick={fetchSchedule}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh', 'Refresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Status Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <ClockIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-indigo-100 text-sm font-medium">{t('today_status', "Today's Status")}</p>
                <h3 className="text-xl font-bold capitalize">{currentDay}</h3>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              {schedule?.[currentDay]?.start === 'OFF' ? (
                <div className="text-center py-2">
                  <p className="text-2xl font-bold">{t('off_duty', 'Off Duty')}</p>
                  <p className="text-indigo-100 text-sm mt-1">{t('enjoy_your_day', 'Enjoy your day off!')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-100 text-sm">{t('shift_start', 'Shift Start')}</span>
                    <span className="font-bold text-lg">{schedule?.[currentDay]?.start || '--:--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-100 text-sm">{t('shift_end', 'Shift End')}</span>
                    <span className="font-bold text-lg">{schedule?.[currentDay]?.end || '--:--'}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-indigo-100 text-sm">{t('break_time', 'Break Time')}</span>
                    <span className="font-medium">{schedule?.[currentDay]?.break || t('no_break', 'No break')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-blue-500" />
              {t('work_info', 'Work Information')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <CalendarDaysIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('total_days', 'Working Days')}</p>
                  <p className="font-bold text-gray-800">
                    {schedule ? Object.values(schedule).filter(s => s.start !== 'OFF').length : 0} {t('days_week', 'days / week')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                  <ClockIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{t('total_hours', 'Weekly Hours')}</p>
                  <p className="font-bold text-gray-800">40 {t('hours', 'hours')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-indigo-500" />
              {t('weekly_schedule', 'Weekly Schedule')}
            </h3>
            
            <div className="space-y-3">
              {days.map((day) => {
                const isCurrentDay = day.key === currentDay;
                const shift = schedule?.[day.key] || { start: 'OFF', end: 'OFF', break: '' };
                const isOff = shift.start === 'OFF';

                return (
                  <div 
                    key={day.key}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isCurrentDay 
                        ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100' 
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                        isCurrentDay 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : isOff ? 'bg-gray-100 text-gray-400' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {day.label.substring(0, 3)}
                      </div>
                      <div>
                        <p className={`font-bold ${isCurrentDay ? 'text-blue-900' : 'text-gray-800'}`}>
                          {day.label}
                          {isCurrentDay && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] uppercase font-black rounded-full">
                              {t('today', 'Today')}
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {isOff ? t('holiday_off', 'Holiday / Day Off') : `${shift.start} - ${shift.end}`}
                        </p>
                      </div>
                    </div>

                    {!isOff && (
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('break', 'Break')}</p>
                        <p className="text-sm font-semibold text-gray-700">{shift.break || t('no_break', 'None')}</p>
                      </div>
                    )}

                    {isOff ? (
                      <div className="px-3 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-lg border border-gray-100 uppercase tracking-tight">
                        {t('off', 'OFF')}
                      </div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
              <SparklesIcon className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-amber-900">{t('request_change', 'Need to change your schedule?')}</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {t('schedule_change_info', 'Please contact your manager at least 48 hours in advance to request a shift change or day off.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSchedule;
