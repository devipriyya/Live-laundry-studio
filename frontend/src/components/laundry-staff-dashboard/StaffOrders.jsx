import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ClipboardDocumentListIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  WrenchIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline';
import laundryStaffService from '../../services/laundryStaffService';

const StaffOrders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [processingNote, setProcessingNote] = useState('');
  const [estDelivery, setEstDelivery] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await laundryStaffService.getAssignedOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, targetStatus) => {
    const statusToUpdate = targetStatus || newStatus;
    if (!statusToUpdate) return;

    try {
      setUpdatingId(orderId);
      await laundryStaffService.updateOrderStatus(orderId, { 
        status: statusToUpdate,
        note: processingNote,
        estimatedDelivery: estDelivery
      });
      
      setProcessingNote('');
      setEstDelivery('');
      setNewStatus('');
      await fetchOrders(); // Refresh list
      
      // Update selected order if modal is open
      if (selectedOrder && selectedOrder._id === orderId) {
        handleViewDetails(orderId);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  /**
   * Fetch full order details for the modal
   */
  const handleViewDetails = async (orderId) => {
    try {
      setIsModalLoading(true);
      const data = await laundryStaffService.getOrderDetails(orderId);
      setSelectedOrder(data.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
    } finally {
      setIsModalLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'order-accepted': 'bg-blue-100 text-blue-700 border-blue-200',
      'received-at-facility': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'washing': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'drying': 'bg-sky-100 text-sky-700 border-sky-200',
      'cleaning': 'bg-teal-100 text-teal-700 border-teal-200',
      'pressing': 'bg-purple-100 text-purple-700 border-purple-200',
      'quality-check': 'bg-amber-100 text-amber-700 border-amber-200',
      'ready-for-pickup': 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('my_orders', 'My Orders')}</h1>
          <p className="text-gray-500 text-sm">{t('manage_assigned_tasks', 'Manage your assigned laundry tasks')}</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('refresh', 'Refresh')}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_orders_hint', 'Search by order number or customer...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all"
          >
            <option value="all">{t('all_statuses', 'All Statuses')}</option>
            <option value="order-accepted">Order Accepted</option>
            <option value="washing">Washing</option>
            <option value="drying">Drying</option>
            <option value="pressing">Pressing</option>
            <option value="quality-check">Quality Check</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">{t('loading_orders', 'Loading orders...')}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardDocumentListIcon className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{t('no_orders_found', 'No orders found')}</h3>
            <p className="text-gray-500">{t('no_orders_description', "You don't have any assigned orders matching your criteria.")}</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order._id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getStatusColor(order.status)} border shadow-sm`}>
                    <WrenchIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-gray-900">#{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                        {laundryStaffService.getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{order.customer?.name || 'Customer'}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
                        {order.items?.length || 0} {t('items', 'items')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:self-center">
                  {laundryStaffService.getNextStatus(order.status) && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, order.status)}
                      disabled={updatingId === order._id}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingId === order._id ? (
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5" />
                          <span>{laundryStaffService.getActionButtonText(order.status)}</span>
                        </>
                      )}
                    </button>
                  )}
                  <button 
                    onClick={() => handleViewDetails(order._id)}
                    className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-all"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                {order.items?.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-[10px] font-medium border border-gray-100">
                    {item.name} x {item.quantity}
                  </span>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-medium">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2 opacity-80">{t('order_details', 'Order Details')}</p>
                  <h2 className="text-3xl font-black">#{selectedOrder.orderNumber}</h2>
                  <div className="flex items-center gap-3 mt-4">
                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase border shadow-sm ${getStatusColor(selectedOrder.status)}`}>
                      {laundryStaffService.getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-90"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tight">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                  {t('customer_info', 'Customer Info')}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-black text-slate-900">{selectedOrder.userId?.name || 'Customer'}</p>
                      <p className="text-sm text-slate-500 font-medium">{selectedOrder.userId?.email || ''}</p>
                    </div>
                    {selectedOrder.userId?.phone && (
                      <a href={`tel:${selectedOrder.userId.phone}`} className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-100 transition-all border border-green-100 active:scale-95">
                        <PhoneIcon className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
                    <MapPinIcon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {selectedOrder.customerInfo?.address?.street}, {selectedOrder.customerInfo?.address?.city}, {selectedOrder.customerInfo?.address?.state} {selectedOrder.customerInfo?.address?.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-600" />
                  {t('order_items', 'Order Items')}
                </h3>
                <div className="grid gap-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 font-black group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                          {item.quantity}
                        </div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-400">
                        ₹{(item.price || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedOrder.totalAmount && (
                  <div className="flex justify-between items-center bg-indigo-600 p-5 rounded-2xl text-white shadow-lg shadow-indigo-100">
                    <span className="font-bold text-indigo-100 uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="text-2xl font-black">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Processing Controls */}
              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 space-y-4">
                <h3 className="text-sm font-black text-blue-900 flex items-center gap-2 uppercase tracking-tight">
                  <WrenchIcon className="w-5 h-5" />
                  {t('processing_actions', 'Processing Actions')}
                </h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-700 uppercase mb-2 ml-1">{t('processing_note', 'Processing Note')}</label>
                    <textarea 
                      value={processingNote}
                      onChange={(e) => setProcessingNote(e.target.value)}
                      placeholder={t('add_a_note_hint', 'Add a note about current progress...')}
                      className="w-full p-4 bg-white border border-blue-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none h-24"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-blue-700 uppercase mb-2 ml-1">{t('est_completion', 'Est. Completion Time')}</label>
                    <input 
                      type="datetime-local"
                      value={estDelivery}
                      onChange={(e) => setEstDelivery(e.target.value)}
                      className="w-full p-4 bg-white border border-blue-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                    <ClockIcon className="w-5 h-5 text-slate-500" />
                    {t('status_history', 'Status History')}
                  </h3>
                  <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                    {selectedOrder.statusHistory.slice().reverse().map((history, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-bold text-slate-800">{laundryStaffService.getStatusLabel(history.status)}</span>
                            <span className="text-[10px] font-medium text-slate-400">{new Date(history.timestamp).toLocaleString()}</span>
                          </div>
                          {history.note && <p className="text-xs text-slate-500 italic">"{history.note}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {selectedOrder.notes && (
                <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                  <h3 className="text-sm font-black text-amber-900 mb-3 flex items-center gap-2 uppercase tracking-tight">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    {t('special_notes', 'Special Notes')}
                  </h3>
                  <p className="text-sm text-amber-800 font-medium italic leading-relaxed">"{selectedOrder.notes}"</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <select
                    value={newStatus || selectedOrder.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full h-14 pl-5 pr-10 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="" disabled>{t('select_status', 'Select processing status...')}</option>
                    {laundryStaffService.getAllStatuses().map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronRightIcon className="w-5 h-5 text-slate-400 rotate-90" />
                  </div>
                </div>

                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id)}
                  disabled={updatingId === selectedOrder._id || (!newStatus && selectedOrder.status === newStatus)}
                  className="w-full h-16 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-100 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {updatingId === selectedOrder._id ? (
                    <ArrowPathIcon className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <CheckCircleIcon className="w-6 h-6" />
                      <span>{t('update_order_status', 'Update Order Status')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffOrders;
