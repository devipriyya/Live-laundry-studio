import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import {
  BellIcon, CheckCircleIcon, TrashIcon, ClockIcon, CheckIcon,
  ShoppingBagIcon, CreditCardIcon, ChatBubbleLeftRightIcon,
  InformationCircleIcon, ArrowPathIcon, SparklesIcon,
  TruckIcon, StarIcon, MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolid } from '@heroicons/react/24/solid';

/* ── helpers ─────────────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  order:           { icon: ShoppingBagIcon, bg: 'bg-blue-100',   text: 'text-blue-600',   label: 'Order'    },
  payment:         { icon: CreditCardIcon,  bg: 'bg-emerald-100', text: 'text-emerald-600',label: 'Payment'  },
  delivery:        { icon: TruckIcon,       bg: 'bg-violet-100',  text: 'text-violet-600', label: 'Delivery' },
  'support-ticket':{ icon: ChatBubbleLeftRightIcon, bg:'bg-pink-100', text:'text-pink-600', label:'Support'  },
  promotion:       { icon: MegaphoneIcon,   bg: 'bg-orange-100',  text: 'text-orange-600', label: 'Promo'    },
  review:          { icon: StarIcon,        bg: 'bg-amber-100',   text: 'text-amber-600',  label: 'Review'   },
  system:          { icon: SparklesIcon,    bg: 'bg-cyan-100',    text: 'text-cyan-600',   label: 'System'   },
};
const getConfig = (type) => TYPE_CONFIG[type] || { icon: InformationCircleIcon, bg: 'bg-gray-100', text: 'text-gray-500', label: 'Info' };

const PRIORITY_DOT = {
  urgent: 'bg-red-500',
  high:   'bg-orange-400',
  medium: 'bg-yellow-400',
  low:    'bg-green-400',
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400)return `${Math.floor(s/3600)}h ago`;
  if (s < 604800)return `${Math.floor(s/86400)}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day:'numeric', month:'short' });
}

const FILTERS = ['all', 'unread', 'order', 'payment', 'delivery', 'promotion'];

const DashboardNotifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications/my');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (e) {
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(p => p.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(p => Math.max(0, p - 1));
    } catch (e) { console.error(e); }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/my/read-all');
      setNotifications(p => p.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) { console.error(e); }
  };

  const deleteNotification = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/notifications/${id}`);
      const deleted = notifications.find(n => n._id === id);
      setNotifications(p => p.filter(n => n._id !== id));
      if (deleted && !deleted.read) setUnreadCount(p => Math.max(0, p - 1));
    } catch (e) { console.error(e); }
    finally { setDeletingId(null); }
  };

  const clearRead = async () => {
    if (!window.confirm('Clear all read notifications?')) return;
    try {
      await api.delete('/notifications/my/clear-all');
      setNotifications(p => p.filter(n => !n.read));
    } catch (e) { console.error(e); }
  };

  /* filtered list */
  const filtered = notifications.filter(n => {
    if (activeFilter === 'all')    return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  /* ── loading ── */
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-medium text-sm">Loading notifications…</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* ── Hero header ── */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 rounded-2xl p-6 overflow-hidden text-white">
        {/* decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <BellSolid className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
              <p className="text-indigo-200 text-sm mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          {/* Stats pill */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-black">{notifications.length}</p>
              <p className="text-xs text-indigo-200">Total</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-black">{unreadCount}</p>
              <p className="text-xs text-indigo-200">Unread</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Action bar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
              }`}>
              {f === 'all' ? `All (${notifications.length})` : f === 'unread' ? `Unread (${unreadCount})` : f}
            </button>
          ))}
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors">
              <CheckIcon className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
          <button onClick={clearRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl text-xs font-bold transition-colors">
            <TrashIcon className="h-3.5 w-3.5" /> Clear read
          </button>
          <button onClick={fetchNotifications}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition-colors">
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Notification list ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BellIcon className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {activeFilter === 'unread' ? 'No unread notifications' : 'No notifications here'}
          </h3>
          <p className="text-sm text-gray-400">
            {activeFilter === 'all' ? "You're all caught up. Check back later." : `No ${activeFilter} notifications found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n, idx) => {
            const cfg = getConfig(n.type);
            const Icon = cfg.icon;
            const isDeleting = deletingId === n._id;

            return (
              <div key={n._id}
                className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden
                  ${!n.read ? 'border-indigo-200 shadow-sm shadow-indigo-100' : 'border-gray-100 hover:border-gray-200'}
                  ${isDeleting ? 'opacity-40 scale-95' : 'hover:shadow-md'}`}>

                {/* Unread left accent */}
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl" />}

                <div className="flex items-start gap-4 p-4 pl-5">
                  {/* Icon */}
                  <div className={`shrink-0 w-11 h-11 ${cfg.bg} rounded-xl flex items-center justify-center mt-0.5`}>
                    <Icon className={`h-5 w-5 ${cfg.text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm font-bold leading-snug ${!n.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {n.title}
                        </h3>
                        {!n.read && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                            New
                          </span>
                        )}
                        {n.priority && n.priority !== 'low' && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                            <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[n.priority] || 'bg-gray-300'}`} />
                            {n.priority}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 flex items-center gap-1 text-xs text-gray-400 font-medium">
                        <ClockIcon className="h-3 w-3" />
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 leading-relaxed">{n.message}</p>

                    {/* Actions row */}
                    <div className="flex items-center gap-3 mt-3">
                      {!n.read && (
                        <button onClick={() => markAsRead(n._id)}
                          className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                          <CheckCircleIcon className="h-3.5 w-3.5" /> Mark as read
                        </button>
                      )}
                      {n.actionUrl && (
                        <a href={n.actionUrl}
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">
                          View details →
                        </a>
                      )}
                      <button onClick={() => deleteNotification(n._id)}
                        className="flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-red-500 transition-colors ml-auto opacity-0 group-hover:opacity-100">
                        <TrashIcon className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer tip ── */}
      {notifications.length > 0 && (
        <p className="text-center text-xs text-gray-400 pb-2">
          Showing {filtered.length} of {notifications.length} notifications
        </p>
      )}
    </div>
  );
};

export default DashboardNotifications;
