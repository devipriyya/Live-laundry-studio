import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import {
  BellIcon,
  CheckCircleIcon,
  TrashIcon,
  ClockIcon,
  CheckIcon,
  InboxIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DashboardNotifications = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications/my');
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/my/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all read notifications?')) return;
    try {
      await api.delete('/notifications/my/clear-all');
      setNotifications(notifications.filter(n => !n.read));
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      const deleted = notifications.find(n => n._id === id);
      setNotifications(notifications.filter(n => n._id !== id));
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBagIcon className="w-6 h-6 text-blue-500" />;
      case 'payment': return <CreditCardIcon className="w-6 h-6 text-green-500" />;
      case 'support-ticket': return <ChatBubbleLeftRightIcon className="w-6 h-6 text-purple-500" />;
      case 'promotion': return <InboxIcon className="w-6 h-6 text-orange-500" />;
      default: return <InformationCircleIcon className="w-6 h-6 text-cyan-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-100 p-3 rounded-2xl">
            <BellIcon className="w-8 h-8 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('notifications.title')}</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount === 1 
                ? t('notifications.unread_msg', { count: unreadCount }) 
                : t('notifications.unread_msg_plural', { count: unreadCount })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <CheckIcon className="w-4 h-4" />
            {t('notifications.mark_all_read')}
          </button>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all"
          >
            <TrashIcon className="w-4 h-4" />
            {t('notifications.clear_read')}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 space-y-4">
            <ArrowPathIcon className="w-12 h-12 animate-spin" />
            <p className="font-medium">{t('notifications.loading')}</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <div 
                key={notification._id}
                className={`p-6 flex gap-4 transition-all hover:bg-gray-50/80 group relative ${!notification.read ? 'bg-cyan-50/30' : ''}`}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                )}
                
                <div className="shrink-0">
                  <div className={`p-3 rounded-2xl bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform`}>
                    {getIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1 shrink-0">
                      <ClockIcon className="w-3 h-3" />
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center gap-4 pt-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        {t('notifications.mark_as_read')}
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification._id)}
                      className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                      {t('notifications.delete')}
                    </button>
                    {notification.actionUrl && (
                      <a 
                        href={notification.actionUrl}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 ml-auto"
                      >
                        {t('notifications.view_details')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-gray-50 p-6 rounded-full">
              <BellIcon className="w-16 h-16 text-gray-200" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-gray-900">{t('notifications.all_caught_up')}</h3>
              <p className="text-gray-500 max-w-xs">
                {t('notifications.no_new')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 space-y-4 flex-1">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/10">
            <InformationCircleIcon className="w-4 h-4" />
            {t('notifications.settings.title')}
          </div>
          <h2 className="text-2xl font-bold">{t('notifications.settings.subtitle')}</h2>
          <p className="text-gray-400 leading-relaxed">
            {t('notifications.settings.desc')}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <ExclamationCircleIcon className="w-24 h-24 text-cyan-500 opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default DashboardNotifications;
