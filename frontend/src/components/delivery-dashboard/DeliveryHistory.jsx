import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const DeliveryHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });

  // Fetch completed orders
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        status: 'delivery-completed',
        page: pagination.currentPage,
        limit: 12,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${API_URL}/delivery-boy/assigned-orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching delivery history:', err);
      setError(err.response?.data?.message || 'Failed to fetch delivery history');
    } finally {
      setLoading(false);
    }
  }, [API_URL, pagination.currentPage, searchTerm]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-display">{t('delivery_history', 'Delivery History')}</h1>
          <p className="text-gray-600">{t('history_desc', 'Your previously completed deliveries')}</p>
        </div>

        {/* Stats Table/Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search_history', 'Search order ID or customer...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              />
            </div>
            <button
              onClick={fetchHistory}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowPathIcon className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">{t('loading', 'Loading history...')}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckBadgeIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{t('no_history', 'No deliveries yet')}</h3>
                <p className="text-gray-500">{t('no_history_desc', 'Completed deliveries will appear here.')}</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">{t('order_id', 'Order ID')}</th>
                    <th className="px-6 py-4">{t('customer', 'Customer')}</th>
                    <th className="px-6 py-4">{t('delivered_on', 'Delivered On')}</th>
                    <th className="px-6 py-4">{t('amount', 'Amount')}</th>
                    <th className="px-6 py-4">{t('details', 'Details')}</th>
                    <th className="px-6 py-4 text-right">{t('actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-blue-600">#{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customerInfo.name}</p>
                          <p className="text-sm text-gray-500">{order.customerInfo.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <CurrencyRupeeIcon className="w-4 h-4" />
                          {order.totalAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {order.notes && (
                            <div title={order.notes} className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                              <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            </div>
                          )}
                          {order.deliveryPhoto && (
                            <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                              <PhotoIcon className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/delivery-dashboard/order/${order._id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group-hover:translate-x-1"
                        >
                          <ArrowRightIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && pagination.totalPages > 1 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {t('showing', 'Showing')} <span className="font-medium text-gray-900">{orders.length}</span> {t('of', 'of')} <span className="font-medium text-gray-900">{pagination.totalOrders}</span> {t('results', 'results')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center px-4 font-medium text-gray-900">
                  {pagination.currentPage} / {pagination.totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryHistory;
