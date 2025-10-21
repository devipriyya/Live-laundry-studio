import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 78450.75,
      revenueGrowth: 15.2,
      totalOrders: 1847,
      ordersGrowth: 12.8,
      totalCustomers: 892,
      customersGrowth: 8.5,
      avgOrderValue: 42.50,
      avgOrderGrowth: 3.2
    },
    revenueByMonth: [
      { month: 'Jan', revenue: 65000, orders: 1520 },
      { month: 'Feb', revenue: 72000, orders: 1680 },
      { month: 'Mar', revenue: 68000, orders: 1590 },
      { month: 'Apr', revenue: 75000, orders: 1750 },
      { month: 'May', revenue: 78450, orders: 1847 }
    ],
    serviceBreakdown: [
      { service: 'Wash & Fold', orders: 645, revenue: 22575, percentage: 35 },
      { service: 'Dry Cleaning', orders: 423, revenue: 29610, percentage: 23 },
      { service: 'Steam Press', orders: 387, revenue: 13545, percentage: 21 },
      { service: 'Premium Service', orders: 234, revenue: 16380, percentage: 13 },
      { service: 'Express Service', orders: 158, revenue: 9480, percentage: 8 }
    ],
    topCustomers: [
      { name: 'Sarah Johnson', orders: 23, spent: 1245.67, growth: 15 },
      { name: 'Michael Chen', orders: 18, spent: 987.50, growth: 8 },
      { name: 'Emma Wilson', orders: 15, spent: 856.25, growth: 22 },
      { name: 'David Brown', orders: 12, spent: 678.90, growth: -5 },
      { name: 'Lisa Garcia', orders: 11, spent: 589.75, growth: 12 }
    ],
    dailyStats: [
      { day: 'Mon', orders: 45, revenue: 1890 },
      { day: 'Tue', orders: 52, revenue: 2180 },
      { day: 'Wed', orders: 38, revenue: 1620 },
      { day: 'Thu', orders: 61, revenue: 2540 },
      { day: 'Fri', orders: 73, revenue: 3050 },
      { day: 'Sat', orders: 89, revenue: 3720 },
      { day: 'Sun', orders: 34, revenue: 1420 }
    ]
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const StatCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(growth)}% {growth >= 0 ? 'increase' : 'decrease'}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );

  const ServiceChart = ({ data }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Service Performance</h3>
        <ChartPieIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {data.map((service, index) => (
          <div key={service.service} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">{service.service}</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">${service.revenue.toLocaleString()}</span>
                <span className="text-xs text-gray-500 ml-2">({service.orders} orders)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-green-500' :
                  index === 2 ? 'bg-purple-500' :
                  index === 3 ? 'bg-orange-500' : 'bg-pink-500'
                }`}
                style={{ width: `${service.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{service.percentage}% of total</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RevenueChart = ({ data }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <ChartBarIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {data.map((month, index) => {
          const maxRevenue = Math.max(...data.map(m => m.revenue));
          const percentage = (month.revenue / maxRevenue) * 100;
          
          return (
            <div key={month.month} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{month.month}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">${month.revenue.toLocaleString()}</span>
                  <span className="text-xs text-gray-500 ml-2">({month.orders} orders)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const TopCustomersTable = ({ customers }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
        <UsersIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-sm font-medium text-gray-500">Customer</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Orders</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Total Spent</th>
              <th className="text-left py-3 text-sm font-medium text-gray-500">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.map((customer, index) => (
              <tr key={customer.name} className="hover:bg-gray-50">
                <td className="py-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-semibold">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-900">{customer.orders}</td>
                <td className="py-3 text-sm font-medium text-gray-900">${customer.spent.toFixed(2)}</td>
                <td className="py-3">
                  <div className="flex items-center">
                    {customer.growth >= 0 ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${customer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(customer.growth)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const DailyPerformance = ({ data }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Daily Performance</h3>
        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {data.map((day) => {
          const maxOrders = Math.max(...data.map(d => d.orders));
          const height = (day.orders / maxOrders) * 100;
          
          return (
            <div key={day.day} className="text-center">
              <div className="mb-2 flex justify-center items-end h-20">
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t w-8 transition-all duration-500"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
              <div className="text-xs font-medium text-gray-900">{day.day}</div>
              <div className="text-xs text-gray-500">{day.orders}</div>
              <div className="text-xs text-green-600">${day.revenue}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Business insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
              <button
                onClick={handleRefresh}
                className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'animate-pulse' : ''}`}
              >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${analyticsData.overview.totalRevenue.toLocaleString()}`}
            growth={analyticsData.overview.revenueGrowth}
            icon={CurrencyDollarIcon}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Total Orders"
            value={analyticsData.overview.totalOrders.toLocaleString()}
            growth={analyticsData.overview.ordersGrowth}
            icon={ShoppingBagIcon}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Customers"
            value={analyticsData.overview.totalCustomers.toLocaleString()}
            growth={analyticsData.overview.customersGrowth}
            icon={UsersIcon}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Avg Order Value"
            value={`$${analyticsData.overview.avgOrderValue}`}
            growth={analyticsData.overview.avgOrderGrowth}
            icon={ArrowTrendingUpIcon}
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart data={analyticsData.revenueByMonth} />
          <ServiceChart data={analyticsData.serviceBreakdown} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <TopCustomersTable customers={analyticsData.topCustomers} />
          <DailyPerformance data={analyticsData.dailyStats} />
        </div>

        {/* Key Insights */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Revenue Growth</span>
              </div>
              <p className="text-sm text-blue-700">
                Revenue increased by 15.2% this month, driven by premium services and customer retention.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <UsersIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">Customer Base</span>
              </div>
              <p className="text-sm text-green-700">
                New customer acquisition up 8.5% with strong retention rates in premium segments.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
                <span className="font-medium text-purple-900">Service Performance</span>
              </div>
              <p className="text-sm text-purple-700">
                Wash & Fold remains top service (35%), while Premium services show highest margins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
