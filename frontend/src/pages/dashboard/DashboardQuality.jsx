import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ClockIcon,
  SparklesIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

const DashboardQuality = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rewash

  // Load orders and extract items
  useEffect(() => {
    loadItems();
  }, [user]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const userEmail = user?.email || localStorage.getItem('userEmail');
      if (!userEmail) {
        setItems([]);
        setLoading(false);
        return;
      }

      const response = await api.get(`/orders/my?email=${encodeURIComponent(userEmail)}`);
      // Filter completed orders and extract items
      const completedOrders = response.data.filter(
        order => ['delivery-completed', 'wash-completed'].includes(order.status)
      );
      
      // Transform orders into individual items
      const allItems = [];
      completedOrders.forEach(order => {
        if (order.items && order.items.length > 0) {
          order.items.forEach((item, index) => {
            allItems.push({
              id: `${order._id}-${index}`,
              orderId: order._id,
              orderNumber: order.orderNumber,
              name: item.name,
              quantity: item.quantity,
              serviceType: order.serviceType || 'Regular Wash',
              completedDate: order.deliveryDate || order.updatedAt,
              qualityStatus: item.qualityStatus || 'pending',
              rewashReason: item.rewashReason || ''
            });
          });
        }
      });
      
      setItems(allItems);
    } catch (error) {
      console.error('Error loading items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item) => {
    try {
      await api.patch(`/orders/${item.orderId}/item-quality`, {
        itemId: item.id,
        qualityStatus: 'approved',
        approvedAt: new Date()
      });

      // Update local state
      setItems(items.map(i => 
        i.id === item.id ? { ...i, qualityStatus: 'approved' } : i
      ));
      
      alert('✅ Item approved! Thank you for your confirmation.');
    } catch (error) {
      console.error('Error approving item:', error);
      alert('Failed to approve item. Please try again.');
    }
  };

  const handleRequestRewash = async (item) => {
    const reason = prompt('Please tell us what needs to be improved:');
    if (!reason) return;

    try {
      await api.patch(`/orders/${item.orderId}/item-quality`, {
        itemId: item.id,
        qualityStatus: 'rewash',
        rewashReason: reason,
        requestedAt: new Date()
      });

      // Update local state
      setItems(items.map(i => 
        i.id === item.id ? { ...i, qualityStatus: 'rewash', rewashReason: reason } : i
      ));
      
      alert('🔄 Rewash requested. Our team will contact you shortly.');
    } catch (error) {
      console.error('Error requesting rewash:', error);
      alert('Failed to request rewash. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        label: 'Pending'
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        label: 'Approved'
      },
      rewash: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        label: 'Rewash Requested'
      }
    };
    return badges[status] || badges.pending;
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.qualityStatus === filter;
  });

  const stats = {
    total: items.length,
    pending: items.filter(i => i.qualityStatus === 'pending').length,
    approved: items.filter(i => i.qualityStatus === 'approved').length,
    rewash: items.filter(i => i.qualityStatus === 'rewash').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Quality Approval
                </h1>
                <p className="text-gray-600 text-lg">
                  Review your cleaned items before delivery.
                </p>
              </div>
              <div className="hidden md:block p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Total Items</p>
              <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-600 text-sm font-medium">Pending</p>
              <ClockIcon className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-600 text-sm font-medium">Approved</p>
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-600 text-sm font-medium">Rewash</p>
              <ArrowPathIcon className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">{stats.rewash}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'pending', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rewash', label: 'Rewash' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Items Found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' 
                ? "You don't have any items ready for quality review yet."
                : `No items in the "${filter}" category.`}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                View All Items
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const statusBadge = getStatusBadge(item.qualityStatus);
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Item Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                            {item.name}
                            {item.quantity > 1 && (
                              <span className="ml-2 text-sm font-normal text-gray-500">
                                (x{item.quantity})
                              </span>
                            )}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <SparklesIcon className="h-4 w-4" />
                              <span>{item.serviceType}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center gap-1">
                              <CalendarDaysIcon className="h-4 w-4" />
                              <span>
                                {new Date(item.completedDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">Order #{item.orderNumber}</span>
                          </div>
                        </div>
                        
                        {/* Status Badge - Mobile */}
                        <div className="md:hidden">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      {/* Rewash Reason */}
                      {item.qualityStatus === 'rewash' && item.rewashReason && (
                        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-sm font-medium text-orange-700 mb-1">Rewash Reason:</p>
                          <p className="text-sm text-orange-600">{item.rewashReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge - Desktop */}
                    <div className="hidden md:block">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {item.qualityStatus === 'pending' && (
                      <div className="flex gap-2 md:gap-3">
                        <button
                          onClick={() => handleApprove(item)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 md:px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRequestRewash(item)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 md:px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                          <span className="hidden md:inline">Request Rewash</span>
                          <span className="md:hidden">Rewash</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-blue-600" />
            Quality Standards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Stain Free</h4>
                  <p className="text-sm text-gray-600">All visible stains removed</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <SparklesIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fresh & Clean</h4>
                  <p className="text-sm text-gray-600">Pleasant fragrance guaranteed</p>
                </div>
              </div>
            </div>
            <div className="bg-white/80 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Perfectly Pressed</h4>
                  <p className="text-sm text-gray-600">Crisp, wrinkle-free finish</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuality;
