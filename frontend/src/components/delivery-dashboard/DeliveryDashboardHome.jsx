import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  TruckIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  ArrowUpTrayIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  QuestionMarkCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const DeliveryDashboardHome = ({ stats }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get current greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('good_morning', 'Good Morning');
    if (hour < 17) return t('good_afternoon', 'Good Afternoon');
    if (hour < 21) return t('good_evening', 'Good Evening');
    return t('good_night', 'Good Night');
  };

  // Get formatted date
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });

  // Status indicator
  const isOnShift = stats.isAvailable || stats.isOnShift;

  // Calculate completion rate
  const totalTasks = (stats.todayPickups || 0) + (stats.todayDeliveries || 0);
  const completedTasks = stats.completedTasksToday || stats.completedToday || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Stat cards configuration with pastel gradients
  const statCards = [
    {
      key: 'deliveries',
      value: stats.todayDeliveries || 0,
      label: t('todays_deliveries', "Today's Deliveries"),
      icon: TruckIcon,
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      onClick: () => navigate('/delivery-dashboard/my-orders')
    },
    {
      key: 'pending',
      value: stats.pendingTasks || 0,
      label: t('pending', 'Pending'),
      icon: ClockIcon,
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      badge: stats.pendingTasks > 0 ? t('action_needed', 'Action needed') : null,
      onClick: () => navigate('/delivery-dashboard/my-orders')
    },
    {
      key: 'completed',
      value: completedTasks,
      label: t('completed_today', 'Completed Today'),
      icon: CheckCircleIcon,
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      onClick: () => navigate('/delivery-dashboard/my-orders')
    },
    {
      key: 'pickups',
      value: stats.todayPickups || 0,
      label: t('pickups_today', 'Pickups Today'),
      icon: ArrowUpTrayIcon,
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      onClick: () => navigate('/delivery-dashboard/my-orders')
    }
  ];

  // Quick actions configuration
  const quickActions = [
    {
      key: 'orders',
      label: t('my_orders', 'My Orders'),
      icon: ClipboardDocumentListIcon,
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      iconColor: 'text-blue-600',
      badge: stats.pendingTasks > 0 ? stats.pendingTasks : null,
      onClick: () => navigate('/delivery-dashboard/my-orders')
    },
    {
      key: 'performance',
      label: t('performance', 'Performance'),
      icon: ArrowTrendingUpIcon,
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
      iconColor: 'text-green-600',
      onClick: () => navigate('/delivery-dashboard/performance')
    },
    {
      key: 'shifts',
      label: t('shifts', 'Shifts'),
      icon: ClockIcon,
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-200',
      iconColor: 'text-amber-600',
      onClick: () => navigate('/delivery-dashboard/shift-management')
    },
    {
      key: 'history',
      label: t('delivery_history', 'History'),
      icon: ClockIcon,
      bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-200',
      iconColor: 'text-indigo-600',
      onClick: () => navigate('/delivery-dashboard/history')
    },
    {
      key: 'support',
      label: t('support', 'Support'),
      icon: QuestionMarkCircleIcon,
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      iconColor: 'text-purple-600',
      onClick: () => navigate('/delivery-dashboard/help-support')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 space-y-6">
      {/* Greeting Card with Pastel Gradient */}
      <div className="bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">{getGreeting()} 👋</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">
              {stats.deliveryBoyName || t('driver', 'Driver')}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Shift Status Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-300 ${
              isOnShift 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                : 'bg-white text-gray-600'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isOnShift ? 'bg-white animate-pulse' : 'bg-gray-400'}`}></span>
              {isOnShift ? t('online', 'Online') : t('offline', 'Offline')}
            </div>
            {/* Rating Badge */}
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-200 rounded-full shadow-md">
              <StarSolidIcon className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-amber-700">{stats.rating || '5.0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid - Pastel Gradient Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.key}
              onClick={card.onClick}
              className={`${card.bgColor} rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer transition-all duration-500 group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                {card.badge && (
                  <span className="text-xs font-semibold px-2.5 py-1 bg-white/80 text-amber-700 rounded-full shadow-sm">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              <p className="text-sm text-gray-600 mt-1 font-medium">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Progress & Earnings Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{t('todays_progress', "Today's Progress")}</h3>
            </div>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {completedTasks}/{totalTasks || 0} {t('tasks', 'tasks')}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">{completionRate}% {t('complete', 'complete')}</span>
            {completionRate === 100 && totalTasks > 0 && (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                {t('all_done', 'All done!')}
              </span>
            )}
          </div>
        </div>

        {/* Earnings Summary Card */}
        <div 
          className="bg-gradient-to-br from-emerald-100 to-teal-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300"
          onClick={() => navigate('/delivery-dashboard/earnings')}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                <CurrencyRupeeIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">{t('earnings', 'Earnings')}</h3>
            </div>
            <ChevronRightIcon className="w-5 h-5 text-gray-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-800 flex items-center justify-center">
                <CurrencyRupeeIcon className="w-4 h-4" />
                {stats.earningsToday || 0}
              </p>
              <p className="text-xs text-gray-600 font-medium mt-1">{t('today', 'Today')}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-800 flex items-center justify-center">
                <CurrencyRupeeIcon className="w-4 h-4" />
                {stats.weeklyEarnings || 0}
              </p>
              <p className="text-xs text-gray-600 font-medium mt-1">{t('this_week', 'This Week')}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-800 flex items-center justify-center">
                <CurrencyRupeeIcon className="w-4 h-4" />
                {stats.monthlyEarnings || 0}
              </p>
              <p className="text-xs text-gray-600 font-medium mt-1">{t('this_month', 'This Month')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-gray-800 text-lg mb-5">{t('quick_actions', 'Quick Actions')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button 
                key={action.key}
                onClick={action.onClick}
                className={`${action.bgColor} flex flex-col items-center gap-3 p-5 rounded-2xl hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300 group`}
              >
                <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
                {action.badge && (
                  <span className="text-xs px-2.5 py-1 bg-white text-blue-700 rounded-full font-semibold shadow-sm">
                    {action.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg">{t('performance_stats', 'Performance')}</h3>
          </div>
          <button 
            onClick={() => navigate('/delivery-dashboard/performance')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:gap-2 transition-all duration-300"
          >
            {t('view_details', 'View details')}
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-2xl font-bold text-gray-800">{stats.onTimePercentage || 100}%</p>
            <p className="text-xs text-gray-600 font-medium mt-2">{t('on_time', 'On Time')}</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <p className="text-2xl font-bold text-gray-800">{stats.totalDeliveries || 0}</p>
            <p className="text-xs text-gray-600 font-medium mt-2">{t('total_deliveries', 'Total Deliveries')}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-100 to-yellow-200 rounded-2xl p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center gap-1.5">
              <StarSolidIcon className="w-5 h-5 text-amber-500" />
              <p className="text-2xl font-bold text-gray-800">{stats.rating || '5.0'}</p>
            </div>
            <p className="text-xs text-gray-600 font-medium mt-2">{t('rating', 'Rating')}</p>
          </div>
        </div>
      </div>

      {/* Motivational Card */}
      <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{t('keep_going', "You're doing great!")} 🎉</h3>
            <p className="text-gray-600 text-sm mt-1">
              {completedTasks > 0 
                ? t('completed_tasks_message', `You've completed ${completedTasks} tasks today. Keep up the excellent work!`)
                : t('start_day_message', 'Ready to start your day? Check your pending orders!')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboardHome;
