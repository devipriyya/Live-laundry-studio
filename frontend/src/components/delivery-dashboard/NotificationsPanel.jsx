import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  BellIcon,
  BellAlertIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
  ArrowPathIcon,
  InboxIcon,
  ChevronRightIcon,
  ClockIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CurrencyRupeeIcon,
  CheckIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, unread, type
  const [selectedType, setSelectedType] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        unreadOnly: filter === 'unread' ? 'true' : 'false'
      });

      if (selectedType) {
        params.append('type', selectedType);
      }

      const response = await axios.get(`${API_URL}/delivery-boy/notifications?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        if (page === 1) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications(prev => [...prev, ...response.data.notifications]);
        }
        setPagination(response.data.pagination);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.response?.data?.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [API_URL, filter, selectedType]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(1);
    }
  }, [isOpen, fetchNotifications]);

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/delivery-boy/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, read: true, readAt: new Date() } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/delivery-boy/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(prev => prev.map(n => ({ ...n, read: true, readAt: new Date() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/delivery-boy/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }

    if (notification.actionUrl) {
      onClose();
      navigate(notification.actionUrl);
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    const icons = {
      'new-assignment': <TruckIcon className="w-5 h-5 text-blue-500" />,
      'order-status-update': <ArrowPathIcon className="w-5 h-5 text-purple-500" />,
      'admin-message': <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-500" />,
      'pickup-reminder': <ClockIcon className="w-5 h-5 text-amber-500" />,
      'delivery-reminder': <TruckIcon className="w-5 h-5 text-green-500" />,
      'earnings-update': <CurrencyRupeeIcon className="w-5 h-5 text-emerald-500" />,
      'system': <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
    };
    return icons[type] || <BellIcon className="w-5 h-5 text-gray-500" />;
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-blue-100 text-blue-800',
      'low': 'bg-gray-100 text-gray-600'
    };
    return colors[priority] || colors['medium'];
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  // Notification types for filter
  const notificationTypes = [
    { value: null, label: 'All Types' },
    { value: 'new-assignment', label: 'New Assignments' },
    { value: 'order-status-update', label: 'Status Updates' },
    { value: 'admin-message', label: 'Admin Messages' },
    { value: 'pickup-reminder', label: 'Pickup Reminders' },
    { value: 'delivery-reminder', label: 'Delivery Reminders' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/30 rounded-full p-2">
                <BellIconSolid className="w-6 h-6 text-amber-900" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900">{t('notifications', 'Notifications')}</h2>
                {unreadCount > 0 && (
                  <p className="text-amber-800 text-sm">{unreadCount} {t('unread', 'unread')}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/30 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-amber-900" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => fetchNotifications(1)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/30 hover:bg-white/40 rounded-lg text-amber-900 text-sm transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4" />
              {t('refresh', 'Refresh')}
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/30 hover:bg-white/40 rounded-lg text-amber-900 text-sm transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                {t('mark_all_read', 'Mark all read')}
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('all', 'All')}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t('unread', 'Unread')} {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              className="ml-auto px-3 py-1.5 border rounded-lg text-sm bg-white text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {notificationTypes.map((type) => (
                <option key={type.value || 'all'} value={type.value || ''}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 px-4">
              <ExclamationTriangleIcon className="w-12 h-12 text-red-300 mb-2" />
              <p className="text-gray-500 text-center">{error}</p>
              <button
                onClick={() => fetchNotifications(1)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
              >
                {t('try_again', 'Try Again')}
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 px-4">
              <InboxIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">{t('no_notifications', 'No notifications yet')}</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-full ${
                      !notification.read ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {notification.priority && notification.priority !== 'medium' && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        )}
                        {notification.actionRequired && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            Action Required
                          </span>
                        )}
                        {notification.orderId && (
                          <span className="text-xs text-gray-400">
                            #{notification.orderId?.orderNumber || 'Order'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                          title={t('mark_as_read', 'Mark as read')}
                        >
                          <CheckCircleIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification._id);
                        }}
                        className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                        title={t('delete', 'Delete')}
                      >
                        <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                      {notification.actionUrl && (
                        <ChevronRightIcon className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Load More */}
              {pagination.hasMore && (
                <div className="p-4 text-center">
                  <button
                    onClick={() => fetchNotifications(pagination.currentPage + 1)}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors"
                  >
                    {loading ? t('loading', 'Loading...') : t('load_more', 'Load More')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
