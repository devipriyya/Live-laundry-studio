import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import ReviewForm from '../components/ReviewForm';
import {
  TruckIcon, ClockIcon, CheckCircleIcon, MapPinIcon, PhoneIcon,
  CalendarDaysIcon, CurrencyDollarIcon, XMarkIcon, DocumentTextIcon,
  SparklesIcon, ArrowLeftIcon, MagnifyingGlassIcon, ShoppingBagIcon,
  InformationCircleIcon, ShieldCheckIcon, ExclamationTriangleIcon,
  CheckBadgeIcon, FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

/* ─── status helpers ─────────────────────────────────────────────────── */
const STATUS_META = {
  'order-placed':       { label: 'Order Placed',       color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400',   progress: 10  },
  'order-accepted':     { label: 'Order Accepted',     color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400',    progress: 25  },
  'out-for-pickup':     { label: 'Out for Pickup',     color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400',  progress: 40  },
  'pickup-completed':   { label: 'Pickup Completed',   color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400',  progress: 55  },
  'wash-in-progress':   { label: 'Washing',            color: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-400',    progress: 70  },
  'wash-completed':     { label: 'Wash Done',          color: 'bg-teal-100 text-teal-700',     dot: 'bg-teal-400',    progress: 80  },
  'out-for-delivery':   { label: 'Out for Delivery',   color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400',  progress: 90  },
  'delivery-completed': { label: 'Delivered',          color: 'bg-emerald-100 text-emerald-700',dot:'bg-emerald-400', progress: 100 },
  'delivered':          { label: 'Delivered',          color: 'bg-emerald-100 text-emerald-700',dot:'bg-emerald-400', progress: 100 },
  'cancelled':          { label: 'Cancelled',          color: 'bg-red-100 text-red-600',       dot: 'bg-red-400',     progress: 0   },
  'Pending':            { label: 'Pending',            color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400',   progress: 10  },
  'Delivered':          { label: 'Delivered',          color: 'bg-emerald-100 text-emerald-700',dot:'bg-emerald-400', progress: 100 },
};
const getMeta = (s) => STATUS_META[s] || { label: s, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400', progress: 0 };

const SERVICE_TABS = [
  { id: 'all',           name: 'All' },
  { id: 'schedule-wash', name: 'Wash' },
  { id: 'steam-ironing', name: 'Ironing' },
  { id: 'stain-removal', name: 'Stain' },
  { id: 'shoe-polish',   name: 'Shoe' },
  { id: 'dry-cleaning',  name: 'Dry Clean' },
];

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [reschedulingOrder, setReschedulingOrder] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimOrder, setClaimOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [claimItems, setClaimItems] = useState([{ itemName: '', description: '', estimatedValue: 0, damageType: 'stained' }]);
  const [claimSubmitting, setClaimSubmitting] = useState(false);

  const loadOrders = async (email) => {
    try {
      if (!email) return [];
      const response = await api.get(`/orders/my?email=${encodeURIComponent(email)}`);
      return response.data.filter(o => o.customerInfo?.email === email);
    } catch { return []; }
  };

  useEffect(() => {
    let email = user?.email;
    if (!email) email = JSON.parse(localStorage.getItem('user') || '{}').email;
    if (!email) email = localStorage.getItem('userEmail');
    if (!email) {
      const stored = JSON.parse(localStorage.getItem('orders') || '[]');
      email = stored.find(o => o.customerInfo?.email)?.customerInfo?.email;
    }
    setUserEmail(email || '');
    const fetch = async () => {
      setLoading(true);
      const data = email ? await loadOrders(email) : [];
      setOrders(data); setFilteredOrders(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  useEffect(() => {
    const handler = () => {
      if (userEmail) loadOrders(userEmail).then(d => { setOrders(d); setFilteredOrders(d); });
    };
    window.addEventListener('orderPlaced', handler);
    return () => window.removeEventListener('orderPlaced', handler);
  }, [userEmail]);

  useEffect(() => {
    const handler = async () => {
      if (!document.hidden && userEmail) {
        const d = await loadOrders(userEmail);
        setOrders(d); setFilteredOrders(d);
        localStorage.setItem('orders', JSON.stringify(d));
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [userEmail, user]);

  useEffect(() => {
    let f = orders;
    if (searchTerm) f = f.filter(o =>
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter !== 'all') f = f.filter(o => o.status === statusFilter);
    if (activeTab !== 'all') f = f.filter(o => o.items?.some(item => {
      const s = (item.service || item.name || '').toLowerCase();
      if (activeTab === 'schedule-wash') return s.includes('wash') || s.includes('fold') || s.includes('schedule') || !item.service;
      if (activeTab === 'steam-ironing') return s.includes('iron') || s.includes('steam');
      if (activeTab === 'stain-removal') return s.includes('stain') || s.includes('remove');
      if (activeTab === 'shoe-polish')   return s.includes('shoe') || s.includes('polish') || s.includes('care');
      if (activeTab === 'dry-cleaning')  return s.includes('dry') && s.includes('clean');
      return true;
    }));
    setFilteredOrders(f);
  }, [searchTerm, statusFilter, activeTab, orders]);

  const refreshOrders = async () => {
    const d = await loadOrders(userEmail);
    setOrders(d); setFilteredOrders(d);
  };

  /* ─── loading ─────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading your orders…</p>
      </div>
    </div>
  );

  /* ─── main render ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800">
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Order History</h1>
          </div>
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Service tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SERVICE_TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}>
              {tab.name}
            </button>
          ))}
        </div>

        {/* ── Search + filter ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by order ID, name or status…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
            <option value="all">All Statuses</option>
            <option value="order-placed">Order Placed</option>
            <option value="order-accepted">Order Accepted</option>
            <option value="out-for-pickup">Out for Pickup</option>
            <option value="pickup-completed">Pickup Completed</option>
            <option value="wash-in-progress">Wash in Progress</option>
            <option value="wash-completed">Wash Completed</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivery-completed">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* ── Empty states ── */}
        {!userEmail ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <InformationCircleIcon className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Please log in</h3>
            <p className="text-gray-500 text-sm mb-5">You need to be logged in to view your orders.</p>
            <button onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
              Go to Login
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 text-sm mb-5">
              {searchTerm || statusFilter !== 'all' || activeTab !== 'all'
                ? 'Try adjusting your filters.'
                : "You haven't placed any orders yet."}
            </p>
            {!searchTerm && statusFilter === 'all' && activeTab === 'all' && (
              <button onClick={() => navigate('/schedule-pickup')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                Place Your First Order
              </button>
            )}
          </div>
        ) : (
          /* ── Order cards ── */
          <div className="space-y-4">
            {filteredOrders.map(order => {
              if (!order._id || !order.orderNumber) return null;
              const meta = getMeta(order.status);
              const isActive = !['delivery-completed', 'delivered', 'cancelled'].includes(order.status);
              const canModify = ['order-placed', 'order-accepted'].includes(order.status);
              const isDelivered = ['delivery-completed', 'delivered'].includes(order.status);

              return (
                <div key={order._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">

                  {/* Card top accent bar */}
                  <div className={`h-1 w-full ${meta.dot}`} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-gray-900 text-base">{order.orderNumber}</h3>
                          {order.insurance?.enabled && (
                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <ShieldCheckIcon className="h-3 w-3" /> Insured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {order.orderDate || order.createdAt
                            ? new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Date unavailable'}
                        </p>
                        {order.isReviewed && order.rating && (
                          <div className="flex items-center gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => (
                              <StarIconSolid key={s} className={`h-3.5 w-3.5 ${s <= order.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        )}
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </div>

                    {/* Progress bar */}
                    {order.status !== 'cancelled' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{meta.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                            style={{ width: `${meta.progress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Items', value: order.totalItems || order.items?.length || 0 },
                        { label: 'Total', value: `₹${order.totalAmount || 0}` },
                        { label: 'Delivery', value: order.deliveryDate
                            ? new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                            : 'TBD' },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                          <p className="text-sm font-bold text-gray-800">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Est. delivery chip */}
                    {order.estimatedDelivery && isActive && (
                      <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 mb-4">
                        <ClockIcon className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="text-xs font-semibold text-indigo-600">Est. Delivery:</span>
                        <span className="text-xs text-indigo-800 truncate">{order.estimatedDelivery}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => { setSelectedOrder(order); setShowOrderDetails(true); }}
                        className="flex-1 min-w-[100px] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">
                        View Details
                      </button>

                      {order.paymentStatus === 'paid' && (
                        <button onClick={async (e) => {
                          const btn = e.currentTarget;
                          btn.textContent = 'Downloading…'; btn.disabled = true;
                          const link = document.createElement('a');
                          link.href = `${api.defaults.baseURL.replace('/api','')}/api/invoices/${order._id}/download`;
                          link.download = `invoice-${order.orderNumber}.pdf`;
                          link.target = '_blank';
                          document.body.appendChild(link); link.click(); document.body.removeChild(link);
                          setTimeout(() => { btn.textContent = 'Invoice'; btn.disabled = false; }, 1200);
                        }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                          Invoice
                        </button>
                      )}

                      {canModify && (
                        <>
                          <button onClick={() => { setReschedulingOrder(order); setRescheduleDate(order.pickupDate ? new Date(order.pickupDate).toISOString().split('T')[0] : ''); setRescheduleTimeSlot(order.timeSlot || ''); setRescheduleReason(''); setShowRescheduleModal(true); }}
                            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                            <CalendarDaysIcon className="h-4 w-4" /> Reschedule
                          </button>
                          <button onClick={() => { setCancellingOrder(order); setShowCancelModal(true); }}
                            className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors">
                            Cancel
                          </button>
                        </>
                      )}

                      {isDelivered && !order.isReviewed && (
                        <button onClick={() => { setReviewingOrder(order); setShowReviewModal(true); }}
                          className="flex-1 min-w-[100px] py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5">
                          <StarIconSolid className="h-4 w-4 text-amber-500" /> Rate Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          ORDER DETAIL MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showOrderDetails && selectedOrder && (() => {
        const meta = getMeta(selectedOrder.status);
        const canModify = ['order-placed', 'order-accepted'].includes(selectedOrder.status);
        const isDelivered = ['delivery-completed', 'delivered'].includes(selectedOrder.status);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

              {/* Modal header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${meta.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>
                <button onClick={() => setShowOrderDetails(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">

                {/* Progress */}
                {selectedOrder.status !== 'cancelled' && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span className="font-medium">Order Progress</span>
                      <span>{meta.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${meta.progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>Order Placed</span><span>Pickup</span><span>Washing</span><span>Delivered</span>
                    </div>
                  </div>
                )}

                {/* Est. delivery */}
                {selectedOrder.estimatedDelivery && (
                  <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                    <ClockIcon className="h-5 w-5 text-indigo-500 shrink-0" />
                    <div>
                      <p className="text-xs text-indigo-500 font-medium">Estimated Delivery</p>
                      <p className="text-sm font-bold text-indigo-800">{selectedOrder.estimatedDelivery}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Order info */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Order Info</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-sm">
                      {[
                        ['Order ID', selectedOrder.orderNumber],
                        ['Order Date', selectedOrder.orderDate || selectedOrder.createdAt
                          ? new Date(selectedOrder.orderDate || selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'N/A'],
                        ['Pickup Date', selectedOrder.pickupDate
                          ? new Date(selectedOrder.pickupDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'TBD'],
                        ['Time Slot', selectedOrder.timeSlot || '—'],
                        ['Delivery Date', selectedOrder.deliveryDate
                          ? new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'TBD'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-start gap-2">
                          <span className="text-gray-500 shrink-0">{k}</span>
                          <span className="font-semibold text-gray-800 text-right">{v}</span>
                        </div>
                      ))}
                      {selectedOrder.statusHistory?.some(h => h.note?.includes('rescheduled')) && (
                        <div className="pt-2 border-t border-gray-200">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            <CalendarDaysIcon className="h-3 w-3" /> Rescheduled
                          </span>
                        </div>
                      )}
                      {selectedOrder.assignedLaundryStaff && (
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-500">Staff</span>
                          <span className="font-semibold text-indigo-600">{selectedOrder.assignedLaundryStaff.name}</span>
                        </div>
                      )}
                      {selectedOrder.deliveryBoyId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delivery</span>
                          <span className="font-semibold text-indigo-600">{selectedOrder.deliveryBoyId.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Customer info */}
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide pt-1">Customer</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <p className="font-semibold text-gray-800">{selectedOrder.customerInfo?.name}</p>
                      <p className="text-gray-500">{selectedOrder.customerInfo?.phone}</p>
                      <p className="text-gray-500 text-xs">{selectedOrder.customerInfo?.email}</p>
                      {selectedOrder.customerInfo?.address && (
                        <p className="text-gray-500 text-xs leading-relaxed">
                          {[selectedOrder.customerInfo.address.street, selectedOrder.customerInfo.address.city,
                            selectedOrder.customerInfo.address.state, selectedOrder.customerInfo.address.zipCode]
                            .filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items + pricing */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Items</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      {selectedOrder.items?.length > 0 ? selectedOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 text-sm">
                          <div>
                            <p className="font-semibold text-gray-800">{item.name || 'Item'}</p>
                            <p className="text-xs text-gray-400">{item.service || 'N/A'} · Qty {item.quantity || 0}</p>
                          </div>
                          <span className="font-bold text-gray-800">₹{item.price?.toFixed(2) || '0.00'}</span>
                        </div>
                      )) : <p className="text-gray-400 text-sm text-center py-3">No items</p>}
                    </div>

                    {/* Total */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                      <div className="text-sm text-indigo-600">
                        <p>{selectedOrder.totalItems || selectedOrder.items?.length || 0} items · {selectedOrder.weight || 'N/A'}</p>
                        <p className="text-xs mt-0.5 capitalize">{selectedOrder.paymentStatus || 'pending'} payment</p>
                      </div>
                      <p className="text-2xl font-black text-indigo-700">₹{selectedOrder.totalAmount || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Modal actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  {selectedOrder.paymentStatus === 'paid' && (
                    <button onClick={async () => {
                      const link = document.createElement('a');
                      link.href = `${api.defaults.baseURL.replace('/api','')}/api/invoices/${selectedOrder._id}/download`;
                      link.download = `invoice-${selectedOrder.orderNumber}.pdf`; link.target = '_blank';
                      document.body.appendChild(link); link.click(); document.body.removeChild(link);
                    }}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                      Download Invoice
                    </button>
                  )}
                  {canModify && (
                    <>
                      <button onClick={() => { setReschedulingOrder(selectedOrder); setRescheduleDate(selectedOrder.pickupDate ? new Date(selectedOrder.pickupDate).toISOString().split('T')[0] : ''); setRescheduleTimeSlot(selectedOrder.timeSlot || ''); setRescheduleReason(''); setShowOrderDetails(false); setShowRescheduleModal(true); }}
                        className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                        <CalendarDaysIcon className="h-4 w-4" /> Reschedule
                      </button>
                      <button onClick={() => { setCancellingOrder(selectedOrder); setShowCancelModal(true); }}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors">
                        Cancel Order
                      </button>
                    </>
                  )}
                  {selectedOrder.insurance?.enabled && !['order-placed','order-accepted','cancelled'].includes(selectedOrder.status) && (
                    <button onClick={() => { setClaimOrder(selectedOrder); setClaimItems([{ itemName:'', description:'', estimatedValue:0, damageType:'stained' }]); setShowClaimModal(true); }}
                      className="px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                      <ShieldCheckIcon className="h-4 w-4" /> File Claim
                    </button>
                  )}
                  {isDelivered && !selectedOrder.isReviewed && (
                    <button onClick={() => { setReviewingOrder(selectedOrder); setShowOrderDetails(false); setShowReviewModal(true); }}
                      className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5">
                      <StarIconSolid className="h-4 w-4 text-amber-500" /> Rate Order
                    </button>
                  )}
                  <button onClick={() => setShowOrderDetails(false)}
                    className="ml-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════════════════════════════════════════
          CANCEL MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showCancelModal && cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Cancel Order</h3>
              <button onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to cancel <span className="font-bold text-gray-900">{cancellingOrder.orderNumber}</span>?
            </p>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason (optional)</label>
            <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)}
              placeholder="Tell us why you're cancelling…" rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-5" />
            <div className="flex gap-3">
              <button onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                Keep Order
              </button>
              <button onClick={async () => {
                try {
                  await api.patch(`/orders/${cancellingOrder._id}/cancel`, { reason: cancelReason || 'Customer request', email: userEmail });
                  alert('Order cancelled. Refund will be processed.');
                  setShowCancelModal(false); setCancelReason('');
                  await refreshOrders(); setShowOrderDetails(false);
                } catch (err) { alert(err.response?.data?.message || 'Failed to cancel order'); }
              }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          RESCHEDULE MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showRescheduleModal && reschedulingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Reschedule Pickup</h3>
              </div>
              <button onClick={() => { setShowRescheduleModal(false); setRescheduleDate(''); setRescheduleTimeSlot(''); setRescheduleReason(''); }}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              Rescheduling <span className="font-bold text-gray-800">{reschedulingOrder.orderNumber}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Pickup Date</label>
                <input type="date" value={rescheduleDate} min={new Date().toISOString().split('T')[0]}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time Slot</label>
                <select value={rescheduleTimeSlot} onChange={e => setRescheduleTimeSlot(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select a time slot</option>
                  {['08:00 AM - 10:00 AM','10:00 AM - 12:00 PM','12:00 PM - 02:00 PM',
                    '02:00 PM - 04:00 PM','04:00 PM - 06:00 PM','06:00 PM - 08:00 PM'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason (optional)</label>
                <textarea value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)}
                  placeholder="Why are you rescheduling?" rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowRescheduleModal(false); setRescheduleDate(''); setRescheduleTimeSlot(''); setRescheduleReason(''); }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={async () => {
                if (!rescheduleDate) { alert('Please select a pickup date.'); return; }
                if (!rescheduleTimeSlot) { alert('Please select a time slot.'); return; }
                try {
                  await api.patch(`/orders/${reschedulingOrder._id}/reschedule`, { pickupDate: rescheduleDate, timeSlot: rescheduleTimeSlot, reason: rescheduleReason, email: userEmail });
                  alert('Order rescheduled successfully.');
                  setShowRescheduleModal(false); setRescheduleDate(''); setRescheduleTimeSlot(''); setRescheduleReason('');
                  await refreshOrders();
                } catch (err) { alert(err.response?.data?.message || 'Failed to reschedule order'); }
              }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors">
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          INSURANCE CLAIM MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showClaimModal && claimOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">File Insurance Claim</h3>
                  <p className="text-xs text-gray-400">{claimOrder.orderNumber} · {claimOrder.insurance?.policyType} · up to ₹{claimOrder.insurance?.coverageAmount?.toFixed(2)}</p>
                </div>
              </div>
              <button onClick={() => setShowClaimModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-800">Describe each damaged item in detail. We'll review your claim within 48 hours.</p>
              </div>
              {claimItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700">Item {idx + 1}</span>
                    {claimItems.length > 1 && (
                      <button onClick={() => setClaimItems(p => p.filter((_,i) => i !== idx))}
                        className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Item Name</label>
                      <input type="text" value={item.itemName} placeholder="e.g. Silk Shirt"
                        onChange={e => { const u=[...claimItems]; u[idx].itemName=e.target.value; setClaimItems(u); }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Damage Type</label>
                      <select value={item.damageType}
                        onChange={e => { const u=[...claimItems]; u[idx].damageType=e.target.value; setClaimItems(u); }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                        {['stained','torn','discolored','shrunk','lost','burned','other'].map(d => (
                          <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                      <textarea value={item.description} placeholder="Describe the damage…" rows={2}
                        onChange={e => { const u=[...claimItems]; u[idx].description=e.target.value; setClaimItems(u); }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Estimated Value (₹)</label>
                      <input type="number" min="0" value={item.estimatedValue}
                        onChange={e => { const u=[...claimItems]; u[idx].estimatedValue=parseFloat(e.target.value)||0; setClaimItems(u); }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setClaimItems(p => [...p, { itemName:'', description:'', estimatedValue:0, damageType:'stained' }])}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600 font-semibold transition-colors">
                + Add Another Item
              </button>
              <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total Claim Amount</span>
                <span className="text-xl font-black text-gray-900">₹{claimItems.reduce((s,i) => s+(i.estimatedValue||0), 0).toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={async () => {
                  if (claimItems.some(i => !i.itemName.trim() || !i.description.trim() || !i.estimatedValue)) {
                    alert('Please fill in all fields for each item.'); return;
                  }
                  setClaimSubmitting(true);
                  try {
                    await api.post('/insurance/claims', { orderId: claimOrder._id, damagedItems: claimItems });
                    alert('Claim submitted! We\'ll review it within 48 hours.');
                    setShowClaimModal(false); setClaimOrder(null);
                    setClaimItems([{ itemName:'', description:'', estimatedValue:0, damageType:'stained' }]);
                  } catch (err) { alert(err.response?.data?.message || 'Failed to submit claim.'); }
                  finally { setClaimSubmitting(false); }
                }} disabled={claimSubmitting}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-50">
                  {claimSubmitting ? 'Submitting…' : 'Submit Claim'}
                </button>
                <button onClick={() => setShowClaimModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          REVIEW MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showReviewModal && reviewingOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl relative">
            <button onClick={() => { setShowReviewModal(false); setReviewingOrder(null); }}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-xl shadow hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
            <ReviewForm
              orderId={reviewingOrder._id}
              orderNumber={reviewingOrder.orderNumber}
              customerInfo={reviewingOrder.customerInfo}
              onSubmitSuccess={async () => {
                alert('Thank you for your review!');
                setShowReviewModal(false); setReviewingOrder(null);
                await refreshOrders(); setShowOrderDetails(false);
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrders;
