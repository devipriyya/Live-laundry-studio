import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  TruckIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const DeliveryOrdersMinimal = () => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, activeFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let result = [...orders];
    
    if (activeFilter !== 'all') {
      if (activeFilter === 'pending') {
        result = result.filter(o => ['assigned', 'accepted'].includes(o.status));
      } else if (activeFilter === 'picked') {
        result = result.filter(o => o.status === 'picked_up');
      } else if (activeFilter === 'delivered') {
        result = result.filter(o => o.status === 'delivered');
      }
    }
    
    if (searchTerm) {
      result = result.filter(o => 
        o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(result);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'picked_up': return 'bg-blue-100 text-blue-700';
      case 'assigned':
      case 'accepted': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircleIcon;
      case 'picked_up': return TruckIcon;
      default: return ClockIcon;
    }
  };

  const filters = [
    { id: 'all', label: t('all', 'All') },
    { id: 'pending', label: t('pending', 'Pending') },
    { id: 'picked', label: t('picked_up', 'Picked Up') },
    { id: 'delivered', label: t('delivered', 'Delivered') }
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
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">{t('my_orders', 'My Orders')}</h1>
        <p className="text-sm text-gray-500">{orders.length} {t('orders_assigned', 'orders assigned')}</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('search_orders', 'Search orders...')}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${activeFilter === filter.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <TruckIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('no_orders_found', 'No orders found')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <Link
                key={order._id}
                to={`/delivery-minimal/orders/${order._id}`}
                className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {order.customerInfo?.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {order.customerInfo?.name || 'Customer'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {order.customerInfo?.phone}
                      </p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-1">{order.customerInfo?.address || 'Address not provided'}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryOrdersMinimal;
