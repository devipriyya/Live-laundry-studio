import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  CreditCardIcon,
  TruckIcon,
  ShoppingBagIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      type: 'order',
      priority: 'high',
      title: 'New Order Received',
      message: 'Order #ORD-1249 from John Smith requires immediate attention',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionRequired: true,
      metadata: { orderId: 'ORD-1249', customer: 'John Smith' }
    },
    {
      id: 2,
      type: 'payment',
      priority: 'medium',
      title: 'Payment Received',
      message: 'Payment of $45.99 received for Order #ORD-1245',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actionRequired: false,
      metadata: { amount: 45.99, orderId: 'ORD-1245' }
    },
    {
      id: 3,
      type: 'system',
      priority: 'low',
      title: 'System Backup Completed',
      message: 'Daily system backup completed successfully at 2:00 AM',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      actionRequired: false,
      metadata: { backupSize: '2.3 GB' }
    },
    {
      id: 4,
      type: 'delivery',
      priority: 'high',
      title: 'Delivery Delayed',
      message: 'Order #ORD-1243 delivery delayed due to traffic. New ETA: 3:30 PM',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      actionRequired: true,
      metadata: { orderId: 'ORD-1243', newEta: '3:30 PM' }
    },
    {
      id: 5,
      type: 'customer',
      priority: 'medium',
      title: 'New Customer Registration',
      message: 'Sarah Wilson has registered as a new customer',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: true,
      actionRequired: false,
      metadata: { customerName: 'Sarah Wilson', email: 'sarah@example.com' }
    },
    {
      id: 6,
      type: 'inventory',
      priority: 'high',
      title: 'Low Inventory Alert',
      message: 'Detergent powder stock is running low (5 units remaining)',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: false,
      actionRequired: true,
      metadata: { item: 'Detergent powder', remaining: 5 }
    },
    {
      id: 7,
      type: 'staff',
      priority: 'medium',
      title: 'Staff Schedule Update',
      message: 'Mike Johnson has requested a schedule change for tomorrow',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      read: true,
      actionRequired: true,
      metadata: { staff: 'Mike Johnson', date: 'tomorrow' }
    },
    {
      id: 8,
      type: 'quality',
      priority: 'high',
      title: 'Quality Issue Reported',
      message: 'Customer complaint about Order #ORD-1240 - stain not removed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionRequired: true,
      metadata: { orderId: 'ORD-1240', issue: 'stain not removed' }
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'order':
        return <ShoppingBagIcon className={iconClass} />;
      case 'payment':
        return <CreditCardIcon className={iconClass} />;
      case 'delivery':
        return <TruckIcon className={iconClass} />;
      case 'customer':
        return <UserIcon className={iconClass} />;
      case 'system':
        return <InformationCircleIcon className={iconClass} />;
      case 'inventory':
        return <ExclamationTriangleIcon className={iconClass} />;
      case 'staff':
        return <UserIcon className={iconClass} />;
      case 'quality':
        return <ExclamationTriangleIcon className={iconClass} />;
      default:
        return <BellIcon className={iconClass} />;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-100';
    if (priority === 'medium') return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getPriorityBadge = (priority) => {
    const baseClass = "px-2 py-1 text-xs font-medium rounded-full";
    switch (priority) {
      case 'high':
        return `${baseClass} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClass} bg-green-100 text-green-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notif.read) ||
                         (filter === 'action' && notif.actionRequired) ||
                         notif.type === filter;
    
    const matchesSearch = searchTerm === '' || 
                         notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mt-3 space-y-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {showFilters && (
                  <div className="flex flex-wrap gap-1">
                    {['all', 'unread', 'action', 'order', 'payment', 'delivery', 'system'].map((filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => setFilter(filterOption)}
                        className={`px-2 py-1 text-xs rounded-full transition-colors capitalize ${
                          filter === filterOption
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {filterOption === 'action' ? 'Action Required' : filterOption}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {notifications.length > 0 && (
                <div className="flex justify-between mt-3">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {notifications.length === 0 ? 'No notifications yet' : 'No notifications match your filters'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span className={getPriorityBadge(notification.priority)}>
                                {notification.priority}
                              </span>
                              {notification.actionRequired && (
                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                  Action
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <ClockIcon className="h-3 w-3" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-blue-600 hover:text-blue-800 rounded"
                                  title="Mark as read"
                                >
                                  <CheckIcon className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                title="View details"
                              >
                                <EyeIcon className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 text-red-400 hover:text-red-600 rounded"
                                title="Delete"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter;
