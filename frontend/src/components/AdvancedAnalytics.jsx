import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [chartData, setChartData] = useState([]);

  // Mock analytics data
  const analyticsData = {
    revenue: {
      current: 45680.50,
      previous: 38920.30,
      change: 17.4,
      trend: 'up',
      data: [
        { day: 'Mon', value: 6500 },
        { day: 'Tue', value: 7200 },
        { day: 'Wed', value: 6800 },
        { day: 'Thu', value: 8100 },
        { day: 'Fri', value: 9200 },
        { day: 'Sat', value: 4800 },
        { day: 'Sun', value: 3080 }
      ]
    },
    orders: {
      current: 1247,
      previous: 1098,
      change: 13.6,
      trend: 'up',
      data: [
        { day: 'Mon', value: 180 },
        { day: 'Tue', value: 195 },
        { day: 'Wed', value: 165 },
        { day: 'Thu', value: 210 },
        { day: 'Fri', value: 225 },
        { day: 'Sat', value: 142 },
        { day: 'Sun', value: 130 }
      ]
    },
    customers: {
      current: 456,
      previous: 398,
      change: 14.6,
      trend: 'up',
      data: [
        { day: 'Mon', value: 65 },
        { day: 'Tue', value: 72 },
        { day: 'Wed', value: 58 },
        { day: 'Thu', value: 81 },
        { day: 'Fri', value: 89 },
        { day: 'Sat', value: 45 },
        { day: 'Sun', value: 46 }
      ]
    }
  };

  const topServices = [
    { name: 'Wash & Fold', orders: 524, revenue: 15720, change: 12.5 },
    { name: 'Dry Cleaning', orders: 312, revenue: 18720, change: 8.3 },
    { name: 'Steam Press', orders: 298, revenue: 8940, change: -2.1 },
    { name: 'Express Service', orders: 113, revenue: 6780, change: 25.4 }
  ];

  const customerSegments = [
    { segment: 'Premium', count: 89, percentage: 19.5, color: 'bg-purple-500' },
    { segment: 'Regular', count: 267, percentage: 58.6, color: 'bg-blue-500' },
    { segment: 'New', count: 100, percentage: 21.9, color: 'bg-green-500' }
  ];

  const revenueByHour = [
    { hour: '6AM', value: 120 },
    { hour: '8AM', value: 450 },
    { hour: '10AM', value: 680 },
    { hour: '12PM', value: 890 },
    { hour: '2PM', value: 1200 },
    { hour: '4PM', value: 980 },
    { hour: '6PM', value: 750 },
    { hour: '8PM', value: 320 }
  ];

  useEffect(() => {
    setChartData(analyticsData[selectedMetric]?.data || []);
  }, [selectedMetric]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
            <p className="text-gray-600">Comprehensive business intelligence and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.entries(analyticsData).map(([key, data]) => (
            <div 
              key={key}
              className={`bg-white rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer ${
                selectedMetric === key 
                  ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedMetric(key)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  key === 'revenue' ? 'bg-green-100' :
                  key === 'orders' ? 'bg-blue-100' :
                  'bg-purple-100'
                }`}>
                  {key === 'revenue' && <CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
                  {key === 'orders' && <ShoppingBagIcon className="h-6 w-6 text-blue-600" />}
                  {key === 'customers' && <UsersIcon className="h-6 w-6 text-purple-600" />}
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  data.trend === 'up' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.trend === 'up' ? (
                    <ArrowUpIcon className="h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3" />
                  )}
                  <span>{formatPercentage(data.change)}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 capitalize">{key}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {key === 'revenue' ? formatCurrency(data.current) : data.current.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  vs {key === 'revenue' ? formatCurrency(data.previous) : data.previous.toLocaleString()} last period
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">{selectedMetric} Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4" />
              <span>Last 7 days</span>
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((item, index) => {
              const maxValue = Math.max(...chartData.map(d => d.value));
              const height = (item.value / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex justify-center mb-2">
                    <div 
                      className={`w-8 rounded-t-lg transition-all duration-500 ${
                        selectedMetric === 'revenue' ? 'bg-green-500' :
                        selectedMetric === 'orders' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{item.day}</div>
                  <div className="text-xs text-gray-400">
                    {selectedMetric === 'revenue' ? formatCurrency(item.value) : item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Services */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Services</h3>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                    <p className={`text-sm ${
                      service.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(service.change)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
            <div className="space-y-6">
              {customerSegments.map((segment, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{segment.segment}</span>
                    <span className="text-sm text-gray-500">{segment.count} customers</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${segment.color}`}
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{segment.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by Hour */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Hour (Today)</h3>
          <div className="h-48 flex items-end justify-between space-x-1">
            {revenueByHour.map((item, index) => {
              const maxValue = Math.max(...revenueByHour.map(d => d.value));
              const height = (item.value / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex justify-center mb-2">
                    <div 
                      className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{item.hour}</div>
                  <div className="text-xs text-gray-400">{formatCurrency(item.value)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
