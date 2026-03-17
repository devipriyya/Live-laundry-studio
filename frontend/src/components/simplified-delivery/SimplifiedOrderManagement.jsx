import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const SimplifiedOrderManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({
    pendingTasks: 0,
    todayPickups: 0,
    todayDeliveries: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsData = await deliveryBoyService.getStats();
      setStats({
        pendingTasks: statsData.pendingTasks || 0,
        todayPickups: statsData.todayPickups || 0,
        todayDeliveries: statsData.todayDeliveries || 0
      });

      // Fetch orders based on active tab
      let statusFilter;
      if (activeTab === 'pending') statusFilter = 'pending';
      else if (activeTab === 'pickup') statusFilter = 'out-for-pickup';
      else if (activeTab === 'delivery') statusFilter = 'out-for-delivery';
      else if (activeTab === 'completed') statusFilter = 'delivery-completed';

      const ordersData = await deliveryBoyService.getAssignedOrders({
        status: statusFilter,
        limit: 20
      });
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, note = '') => {
    try {
      await deliveryBoyService.updateOrderStatus(orderId, newStatus, note);
      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'out-for-pickup':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pickup-completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivery-completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'order-placed': 'Order Placed',
      'order-accepted': 'Order Accepted',
      'out-for-pickup': 'Out for Pickup',
      'pickup-completed': 'Pickup Completed',
      'wash-in-progress': 'Wash in Progress',
      'wash-completed': 'Wash Completed',
      'out-for-delivery': 'Out for Delivery',
      'delivery-completed': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  };

  const getActionButtons = (order) => {
    const buttons = [];
    
    if (order.status === 'out-for-pickup') {
      buttons.push(
        <button
          key="pickup-complete"
          onClick={() => updateOrderStatus(order._id, 'pickup-completed', 'Pickup completed')}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mark Picked Up
        </button>
      );
    } else if (order.status === 'out-for-delivery') {
      buttons.push(
        <button
          key="delivery-complete"
          onClick={() => updateOrderStatus(order._id, 'delivery-completed', 'Delivery completed')}
          className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
        >
          Mark Delivered
        </button>
      );
    }
    
    return buttons;
  };

  const callCustomer = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const messageCustomer = (phone) => {
    window.open(`sms:${phone}`, '_blank');
  };

  const openMaps = (address) => {
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const tabs = [
    { key: 'pending', label: t('pending', 'Pending'), count: stats.pendingTasks },
    { key: 'pickup', label: t('pickup', 'Pickup'), count: stats.todayPickups },
    { key: 'delivery', label: t('delivery', 'Delivery'), count: stats.todayDeliveries },
    { key: 'completed', label: t('completed', 'Completed'), count: 0 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">{t('my_orders', 'My Orders')}</h1>
        <p className="text-sm text-gray-500">{t('manage_your_orders', 'Manage your assigned orders')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold rounded-full px-2 py-0.5">
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
            <TruckIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-1">{t('no_orders_found', 'No orders found')}</h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'pending' 
                ? t('no_pending_orders', 'You have no pending orders at the moment')
                : t('no_orders_in_category', 'No orders in this category')
              }
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">#{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">{order.customerInfo?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t('total_amount', 'Total Amount')}</p>
                    <p className="font-medium">₹{order.totalAmount}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t('items', 'Items')}</p>
                    <p className="font-medium">{order.totalItems || order.items?.length || 0}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t('date', 'Date')}</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{t('customer_address', 'Address')}</p>
                    <p className="text-sm text-gray-700 truncate">
                      {order.fullAddress || 
                        `${order.customerInfo?.address?.street}, ${order.customerInfo?.address?.city}`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => callCustomer(order.customerInfo?.phone)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    {t('call', 'Call')}
                  </button>
                  
                  <button
                    onClick={() => messageCustomer(order.customerInfo?.phone)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    {t('message', 'Message')}
                  </button>
                  
                  <button
                    onClick={() => openMaps(order.customerInfo?.address)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    {t('navigate', 'Navigate')}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {getActionButtons(order)}
                  </div>
                  <Link 
                    to={`/simplified-delivery/order/${order._id}`}
                    className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700"
                  >
                    {t('view_details', 'View Details')}
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimplifiedOrderManagement;
