import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  WrenchIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  BellIcon,
  SparklesIcon,
  ChevronRightIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const StaffDashboardHome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stats } = useOutletContext();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('good_morning', 'Good Morning');
    if (hour < 17) return t('good_afternoon', 'Good Afternoon');
    if (hour < 21) return t('good_evening', 'Good Evening');
    return t('good_night', 'Good Night');
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  const totalTasks = (stats.pendingOrders || 0) + (stats.processingOrders || 0) + (stats.completedOrders || 0);
  const completionRate = totalTasks > 0 ? Math.round((stats.completedOrders / totalTasks) * 100) : 0;

  const statCards = [
    {
      key: 'assigned',
      value: stats.pendingOrders || 0,
      label: t('assigned_orders', 'Assigned Orders'),
      icon: ClipboardDocumentListIcon,
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      onClick: () => navigate('/laundry-staff-dashboard/orders')
    },
    {
      key: 'processing',
      value: stats.processingOrders || 0,
      label: t('currently_processing', 'Processing'),
      icon: ArrowTrendingUpIcon,
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      badge: stats.processingOrders > 0 ? t('in_progress', 'In Progress') : null,
      onClick: () => navigate('/laundry-staff-dashboard/orders')
    },
    {
      key: 'completed',
      value: stats.completedOrders || 0,
      label: t('completed_today', 'Completed Today'),
      icon: CheckCircleIcon,
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      onClick: () => navigate('/laundry-staff-dashboard/orders')
    },
    {
      key: 'issues',
      value: stats.qualityIssues || 0,
      label: t('quality_issues', 'Quality Issues'),
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-gradient-to-br from-red-100 to-rose-200',
      iconBg: 'bg-gradient-to-br from-red-500 to-rose-500',
      badge: stats.qualityIssues > 0 ? t('urgent', 'Urgent') : null,
      onClick: () => navigate('/laundry-staff-dashboard/performance')
    }
  ];

  const quickActions = [
    {
      key: 'orders',
      label: t('view_orders', 'View Orders'),
      icon: ClipboardDocumentListIcon,
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      iconColor: 'text-blue-600',
      onClick: () => navigate('/laundry-staff-dashboard/orders')
    },
    {
      key: 'performance',
      label: t('performance', 'Performance'),
      icon: ArrowTrendingUpIcon,
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconColor: 'text-green-600',
      onClick: () => navigate('/laundry-staff-dashboard/performance')
    },
    {
      key: 'schedule',
      label: t('my_schedule', 'My Schedule'),
      icon: ClockIcon,
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconColor: 'text-amber-600',
      onClick: () => navigate('/laundry-staff-dashboard/schedule')
    },
    {
      key: 'profile',
      label: t('profile_settings', 'Profile'),
      icon: UserCircleIcon,
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/laundry-staff-dashboard/profile')
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Greeting */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-8 text-white shadow-2xl shadow-blue-200/50">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-100 font-medium">
              <SparklesIcon className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>{getGreeting()}, {t('excellent_work_today', 'You are doing great!')}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {t('staff_dashboard_title', 'The Laundry Master')} 🧼
            </h1>
            <p className="text-blue-100/80 font-medium">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
            <div className="flex flex-col items-end px-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-blue-200 opacity-80">{t('my_rating', 'Performance')}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StarSolidIcon className="w-5 h-5 text-amber-400" />
                <span className="text-xl font-black">{stats.rating || '5.0'}</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/20"></div>
            <div className="flex flex-col items-center px-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-blue-200 opacity-80">{t('status', 'Status')}</p>
              <div className={`mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                stats.isAvailable ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' : 'bg-slate-400/20 text-slate-300 border border-slate-400/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stats.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                {stats.isAvailable ? t('active', 'Active') : t('off', 'Off')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.key}
              onClick={card.onClick}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="group relative h-44 cursor-pointer animate-in slide-in-from-bottom-5 duration-700 fill-mode-both"
            >
              <div className="absolute inset-0 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-blue-100"></div>
              <div className="relative h-full p-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  {card.badge && (
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm bg-slate-50 ${card.key === 'issues' ? 'text-rose-600' : 'text-amber-600'}`}>
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="mt-auto">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{card.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Workload Tracker */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center border border-indigo-100 ring-8 ring-indigo-50/50">
                <ClipboardDocumentListIcon className="w-7 h-7 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t('workload_analytics', "Workload Insights")}</h3>
                <p className="text-xs font-medium text-slate-500">{t('tracking_today_perf', "Tracking your hourly efficiency")}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900">{stats.completedOrders}/{totalTasks}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('completed_today', 'Completed')}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="flex mb-3 items-center justify-between">
                <div>
                  <span className="text-[10px] font-black inline-block py-1 px-3 uppercase rounded-full text-indigo-600 bg-indigo-50 border border-indigo-100">
                    {t('current_velocity', 'Current Velocity')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-indigo-600">
                    {completionRate}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100 p-1 ring-1 ring-slate-200/50">
                <div 
                  style={{ width: `${completionRate}%` }} 
                  className="shadow-inner bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out relative"
                >
                  <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-12 animate-shimmer"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-100 group transition-all hover:bg-blue-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <WrenchIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t('processing', 'Processing')}</span>
                </div>
                <p className="text-3xl font-black text-blue-900">{stats.processingOrders}</p>
              </div>
              <div className="p-5 rounded-3xl bg-amber-50/50 border border-amber-100 group transition-all hover:bg-amber-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <ClockIcon className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{t('waiting', 'Pending')}</span>
                </div>
                <p className="text-3xl font-black text-amber-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Board */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
          
          <h3 className="text-xl font-bold mb-8 relative flex items-center gap-2">
            <span className="w-2 h-4 bg-blue-500 rounded-full"></span>
            {t('quick_ops', 'Quick Operations')}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 relative">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <button 
                  key={action.key}
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/15 transition-all duration-300 group/btn active:scale-95"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-blue-600 transition-all">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover/btn:text-white">{action.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-transparent border-l-2 border-blue-600">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">{t('active_tip', 'Pro Tip')}</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('staff_tip_text', 'Updating expected completion times helps the system optimize delivery routes.')}
            </p>
          </div>
        </div>
      </div>

      {/* Finance Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group cursor-pointer hover:shadow-emerald-200/50 transition-all duration-500">
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-3xl rounded-[1.75rem] flex items-center justify-center border border-white/30 shadow-2xl ring-4 ring-white/10">
              <CurrencyRupeeIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-emerald-100/70 text-xs font-bold uppercase tracking-[0.2em]">{t('total_earnings', 'Earnings Breakdown')}</p>
              <h3 className="text-5xl font-black text-white mt-1 tracking-tight">₹{stats.totalEarnings || 0}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-[10px] font-black text-white border border-emerald-400/20 uppercase">
                  {t('payout_ready', 'Payout Ready')}
                </span>
                <span className="text-emerald-200/80 text-[10px] font-medium tracking-wide italic">
                  +12% {t('increase_than_last_week', 'vs last week')}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/laundry-staff-dashboard/performance')}
            className="group/btn px-10 py-5 bg-white text-emerald-700 rounded-3xl text-sm font-black shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-3 active:scale-95"
          >
            {t('performance_analytics', 'Performance Center')}
            <ChevronRightIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardHome;
