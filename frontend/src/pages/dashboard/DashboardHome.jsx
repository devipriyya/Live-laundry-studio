import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../../hooks/useDashboardData';
import LoadingSpinner, { CardSkeleton, OrderCardSkeleton, ActivitySkeleton } from '../../components/LoadingSpinner';
import { CardError } from '../../components/ErrorMessage';
import RefreshButton from '../../components/RefreshButton';
import {
  ClockIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  GiftIcon,
  ShoppingBagIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  MapPinIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Fetch real dashboard data
  const {
    data: { stats, recentOrders, recentActivities, services, userProfile, rewardInfo },
    loading,
    errors,
    refreshData
  } = useDashboardData(user?.uid);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'schedule':
        navigate('/dashboard/schedule');
        break;
      case 'laundry':
        navigate('/dashboard/laundry');
        break;
      case 'orders':
        navigate('/dashboard/orders');
        break;
      case 'payment':
        navigate('/dashboard/payment');
        break;
      case 'rate':
        navigate('/dashboard/rate');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {/* Hero Welcome Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Floating decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 px-6 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="h-6 w-6 text-yellow-300" />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text font-semibold">
                  Premium Member
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartIcon className="h-5 w-5 text-pink-300" />
                <span className="text-pink-300 text-sm font-medium">Loyal Customer</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Ready to make your clothes sparkle? Let's get started with your laundry journey.
            </p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-medium">
                  {loading.rewards ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    `${rewardInfo?.currentPoints || stats?.rewardPoints || 0} Reward Points`
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <GiftIcon className="h-5 w-5 text-green-300" />
                <span className="text-white font-medium">
                  {loading.rewards ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    `Next reward at ${rewardInfo?.tierInfo?.pointsToNext ? rewardInfo.currentPoints + rewardInfo.tierInfo.pointsToNext : stats?.nextRewardAt || 1500} points`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-8">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <RefreshButton 
            onRefresh={refreshData} 
            isLoading={loading.stats || loading.orders || loading.activities} 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading.stats ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : errors.stats ? (
            // Error state
            <div className="col-span-full">
              <CardError message={errors.stats} onRetry={refreshData} />
            </div>
          ) : (
            // Real data
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                    <div className="w-full bg-blue-100 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" 
                        style={{width: `${Math.min((stats?.totalOrders || 0) * 3, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.activeOrders || 0}</p>
                    <div className="w-full bg-green-100 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" 
                        style={{width: `${Math.min((stats?.activeOrders || 0) * 20, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <ClockIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.completedOrders || 0}</p>
                    <div className="w-full bg-purple-100 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" 
                        style={{width: `${Math.min((stats?.completedOrders || 0) * 4, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CheckCircleIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900">₹{(stats?.totalSpent || 0).toLocaleString()}</p>
                    <div className="w-full bg-orange-100 rounded-full h-2 mt-3">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" 
                        style={{width: `${Math.min((stats?.totalSpent || 0) / 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <CurrencyDollarIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => handleQuickAction('schedule')}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50"
            >
              <div className="text-center">
                <div className="bg-blue-100 group-hover:bg-blue-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors">
                  <CalendarDaysIcon className="h-8 w-8 text-blue-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Schedule Pickup</h3>
                <p className="text-sm text-gray-600">Book a new laundry pickup</p>
              </div>
            </button>

            <button 
              onClick={() => handleQuickAction('laundry')}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50"
            >
              <div className="text-center">
                <div className="bg-green-100 group-hover:bg-green-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors">
                  <CubeIcon className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Laundry Services</h3>
                <p className="text-sm text-gray-600">Browse our service catalog</p>
              </div>
            </button>

            <button 
              onClick={() => handleQuickAction('orders')}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50"
            >
              <div className="text-center">
                <div className="bg-purple-100 group-hover:bg-purple-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors">
                  <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Track Orders</h3>
                <p className="text-sm text-gray-600">Monitor your order status</p>
              </div>
            </button>

            <button 
              onClick={() => handleQuickAction('payment')}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50"
            >
              <div className="text-center">
                <div className="bg-orange-100 group-hover:bg-orange-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 transition-colors">
                  <CreditCardIcon className="h-8 w-8 text-orange-600 mx-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Make Payment</h3>
                <p className="text-sm text-gray-600">Pay for your orders online</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Orders & Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                <button 
                  onClick={() => handleQuickAction('orders')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronDownIcon className="h-4 w-4 rotate-[-90deg]" />
                </button>
              </div>
              
              <div className="space-y-4">
                {loading.orders ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, index) => (
                    <OrderCardSkeleton key={index} />
                  ))
                ) : errors.orders ? (
                  // Error state
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">{errors.orders}</p>
                    <button 
                      onClick={refreshData}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                ) : recentOrders.length === 0 ? (
                  // Empty state
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No recent orders found</p>
                    <button 
                      onClick={() => handleQuickAction('schedule')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Schedule Your First Order
                    </button>
                  </div>
                ) : (
                  // Real data
                  recentOrders.slice(0, 3).map((order) => {
                    // Determine status color based on status
                    const getStatusColor = (status) => {
                      switch (status.toLowerCase()) {
                        case 'completed': return 'bg-gray-500';
                        case 'in progress': return 'bg-blue-500';
                        case 'ready for pickup': return 'bg-green-500';
                        case 'picked up': return 'bg-purple-500';
                        default: return 'bg-gray-500';
                      }
                    };

                    return (
                      <div key={order.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">#{order.id}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${order.statusColor || getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{order.service} • {order.serviceType}</p>
                            <p className="text-xs text-gray-500">
                              <MapPinIcon className="h-3 w-3 inline mr-1" />
                              {order.location} • {order.pickupDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{order.amount}</p>
                            <button 
                              onClick={() => navigate(`/dashboard/orders?orderId=${order.id}`)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Services Overview */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Our Services</h2>
              
              <div className="space-y-4">
                {loading.services ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-4 animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Real data
                  services.slice(0, 3).map((service) => (
                    <div key={service.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => handleQuickAction('laundry')}>                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">{service.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600">Starting from {service.currency}{service.startingPrice}</p>
                        </div>
                        {service.popular && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <button 
                onClick={() => handleQuickAction('rate')}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                View Full Rate Card
              </button>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                {loading.activities ? (
                  // Loading skeletons
                  Array.from({ length: 3 }).map((_, index) => (
                    <ActivitySkeleton key={index} />
                  ))
                ) : errors.activities ? (
                  // Error state
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">{errors.activities}</p>
                  </div>
                ) : recentActivities.length === 0 ? (
                  // Empty state
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  </div>
                ) : (
                  // Real data
                  recentActivities.slice(0, 3).map((activity) => {
                    const formatTimeAgo = (timestamp) => {
                      const now = new Date();
                      const activityTime = new Date(timestamp);
                      const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
                      
                      if (diffInHours < 1) return 'Just now';
                      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                      const diffInDays = Math.floor(diffInHours / 24);
                      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                    };

                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`${activity.iconBg} p-1 rounded-full`}>
                          {activity.icon === 'CheckCircleIcon' && <CheckCircleIcon className={`h-4 w-4 ${activity.iconColor}`} />}
                          {activity.icon === 'TruckIcon' && <TruckIcon className={`h-4 w-4 ${activity.iconColor}`} />}
                          {activity.icon === 'GiftIcon' && <GiftIcon className={`h-4 w-4 ${activity.iconColor}`} />}
                          {activity.icon === 'StarIcon' && <StarIcon className={`h-4 w-4 ${activity.iconColor}`} />}
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{activity.title}</p>
                          <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
