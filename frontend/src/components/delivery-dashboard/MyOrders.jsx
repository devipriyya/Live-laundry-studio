import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowsUpDownIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  ChatBubbleLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import '../styles/delivery-dashboard.css';

const MyOrders = ({ orders, loading, filteredOrders, searchTerm, setSearchTerm, showFilters, setShowFilters, filters, setFilters, activeTab, setActiveTab, setSelectedOrder, setShowDetailModal }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    const colors = {
      'out-for-pickup': 'delivery-status-badge pickup',
      'pickup-completed': 'delivery-status-badge in-progress',
      'out-for-delivery': 'delivery-status-badge out-delivery',
      'delivery-completed': 'delivery-status-badge completed'
    };
    return colors[status] || 'delivery-status-badge';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'out-for-pickup': t('out_for_pickup', 'Out for Pickup'),
      'pickup-completed': t('pickup_completed', 'Pickup Completed'),
      'out-for-delivery': t('out_for_delivery', 'Out for Delivery'),
      'delivery-completed': t('delivered', 'Delivered')
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'out-for-pickup':
        return <ClockIcon className="w-3 h-3" />;
      case 'pickup-completed':
        return <CheckCircleIcon className="w-3 h-3" />;
      case 'out-for-delivery':
        return <TruckIcon className="w-3 h-3" />;
      case 'delivery-completed':
        return <CheckCircleIcon className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleCallCustomer = (phone, e) => {
    e.stopPropagation();
    window.open(`tel:${phone}`, '_self');
  };

  const handleNavigate = (address, e) => {
    e.stopPropagation();
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const tabCounts = {
    pending: filteredOrders?.filter(o => ['out-for-pickup', 'pickup-completed', 'out-for-delivery'].includes(o.status)).length || 0,
    completed: filteredOrders?.filter(o => o.status === 'delivery-completed').length || 0,
    all: filteredOrders?.length || 0
  };

  return (
    <div className="delivery-card animate-fade-in-up">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              {t('my_orders', 'My Orders')}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t('manage_deliveries', 'Manage your assigned deliveries')}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="delivery-search-wrapper">
              <MagnifyingGlassIcon className="delivery-search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_orders', 'Search orders...')}
                className="delivery-search-input"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`delivery-filter-btn ${showFilters ? 'active' : ''}`}
              >
                <FunnelIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{t('filters', 'Filters')}</span>
                {showFilters && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
              </button>
              <button className="delivery-filter-btn">
                <ArrowsUpDownIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{t('sort', 'Sort')}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in-down">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700">{t('filter_options', 'Filter Options')}</h3>
              <button 
                onClick={() => setFilters({ minAmount: '', maxAmount: '', dateFrom: '', dateTo: '', status: '' })}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('clear_all', 'Clear All')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t('min_amount', 'Min Amount')}</label>
                <input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                  placeholder="₹0"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t('max_amount', 'Max Amount')}</label>
                <input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                  placeholder="₹10000"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t('from_date', 'From Date')}</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t('to_date', 'To Date')}</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{t('status', 'Status')}</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm bg-white"
                >
                  <option value="">{t('all_statuses', 'All Statuses')}</option>
                  <option value="out-for-pickup">{t('out_for_pickup', 'Out for Pickup')}</option>
                  <option value="pickup-completed">{t('pickup_completed', 'Pickup Completed')}</option>
                  <option value="out-for-delivery">{t('out_for_delivery', 'Out for Delivery')}</option>
                  <option value="delivery-completed">{t('delivered', 'Delivered')}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="delivery-tabs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`delivery-tab ${activeTab === 'pending' ? 'active' : ''}`}
        >
          {t('pending_orders', 'Pending Orders')}
          <span className="delivery-tab-count">{tabCounts.pending}</span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`delivery-tab ${activeTab === 'completed' ? 'active' : ''}`}
        >
          {t('completed', 'Completed')}
          <span className="delivery-tab-count">{tabCounts.completed}</span>
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`delivery-tab ${activeTab === 'all' ? 'active' : ''}`}
        >
          {t('all_orders', 'All Orders')}
          <span className="delivery-tab-count">{tabCounts.all}</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="delivery-spinner mb-4"></div>
            <p className="text-gray-500 font-medium">{t('loading_orders', 'Loading orders...')}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="delivery-empty-state">
            <div className="delivery-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="delivery-empty-title">{t('no_orders_found', 'No orders found')}</h3>
            <p className="delivery-empty-description">{t('no_orders_description', 'There are no orders matching your current filters. Try adjusting your search or check back later.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredOrders.map((order, index) => (
              <div 
                key={order._id} 
                className="delivery-order-card cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => {
                  setSelectedOrder(order);
                  setShowDetailModal(true);
                }}
              >
                {/* Card Header */}
                <div className="delivery-order-header">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="delivery-order-number text-lg">#{order.orderNumber}</span>
                      {order.priority === 'high' && (
                        <span className="delivery-priority-badge high">
                          {t('urgent', 'Urgent')}
                        </span>
                      )}
                    </div>
                    <p className="delivery-order-customer">{order.customerInfo.name}</p>
                  </div>
                  <span className={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
                
                {/* Card Body */}
                <div className="delivery-order-body">
                  <div className="space-y-3">
                    <div className="delivery-order-info-row group">
                      <MapPinIcon className="delivery-order-info-icon group-hover:text-blue-500 transition-colors" />
                      <span className="truncate">{order.customerInfo.address.street}, {order.customerInfo.address.city}</span>
                    </div>
                    <div className="delivery-order-info-row group">
                      <PhoneIcon className="delivery-order-info-icon group-hover:text-green-500 transition-colors" />
                      <span>{order.customerInfo.phone}</span>
                    </div>
                    <div className="delivery-order-info-row group">
                      <CalendarIcon className="delivery-order-info-icon group-hover:text-purple-500 transition-colors" />
                      <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="delivery-order-footer">
                  <div className="delivery-order-amount">
                    <CurrencyRupeeIcon className="w-5 h-5" />
                    <span>{order.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="delivery-quick-actions">
                    <button 
                      className="delivery-quick-action map"
                      onClick={(e) => handleNavigate(order.customerInfo.address, e)}
                      title={t('navigate', 'Navigate')}
                    >
                      <MapPinIcon className="w-4 h-4" />
                    </button>
                    <button 
                      className="delivery-quick-action call"
                      onClick={(e) => handleCallCustomer(order.customerInfo.phone, e)}
                      title={t('call', 'Call')}
                    >
                      <PhoneIcon className="w-4 h-4" />
                    </button>
                    <button 
                      className="delivery-quick-action message"
                      onClick={(e) => e.stopPropagation()}
                      title={t('message', 'Message')}
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
