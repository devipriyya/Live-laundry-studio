import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const ReportsAnalytics = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState({});

  const mockAnalyticsData = {
    overview: {
      totalRevenue: 45680.50,
      revenueGrowth: 12.5,
      totalOrders: 1247,
      ordersGrowth: 8.3,
      totalCustomers: 456,
      customersGrowth: 15.2,
      avgOrderValue: 36.65,
      avgOrderGrowth: 4.1
    },
    revenueChart: [
      { date: '2024-01-01', revenue: 1250, orders: 34 },
      { date: '2024-01-02', revenue: 1450, orders: 42 },
      { date: '2024-01-03', revenue: 1320, orders: 38 },
      { date: '2024-01-04', revenue: 1680, orders: 45 },
      { date: '2024-01-05', revenue: 1890, orders: 52 },
      { date: '2024-01-06', revenue: 1560, orders: 41 },
      { date: '2024-01-07', revenue: 1720, orders: 47 }
    ],
    serviceBreakdown: [
      { service: 'Wash & Fold', revenue: 18500, orders: 620, percentage: 40.5 },
      { service: 'Dry Cleaning', revenue: 15200, orders: 380, percentage: 33.3 },
      { service: 'Steam Press', revenue: 8900, orders: 290, percentage: 19.5 },
      { service: 'Premium Service', revenue: 3080, orders: 77, percentage: 6.7 }
    ],
    topCustomers: [
      { name: 'John Doe', email: 'john@example.com', orders: 24, revenue: 890.50 },
      { name: 'Jane Smith', email: 'jane@example.com', orders: 18, revenue: 675.25 },
      { name: 'Mike Johnson', email: 'mike@example.com', orders: 15, revenue: 542.75 },
      { name: 'Sarah Wilson', email: 'sarah@example.com', orders: 12, revenue: 445.80 }
    ],
    monthlyTrends: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      revenue: [35000, 38500, 42000, 39500, 45000, 48500],
      orders: [950, 1050, 1150, 1080, 1200, 1300],
      customers: [320, 345, 380, 365, 410, 456]
    }
  };

  useEffect(() => {
    setAnalyticsData(mockAnalyticsData);
  }, []);

  const MetricCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            {growth >= 0 ? (
              <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(growth)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const SimpleChart = ({ data, type = 'bar' }) => {
    const maxValue = Math.max(...data.map(d => d.revenue));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">
              {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : item.service}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(item.revenue / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-20 text-sm font-medium text-gray-900 text-right">
              ${item.revenue.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ServiceBreakdownChart = ({ data }) => (
    <div className="space-y-4">
      {data.map((service, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{service.service}</h4>
              <span className="text-sm text-gray-600">{service.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${service.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{service.orders} orders</span>
              <span>${service.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
              <PrinterIcon className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Revenue"
          value={`$${analyticsData.overview?.totalRevenue.toLocaleString()}`}
          growth={analyticsData.overview?.revenueGrowth}
          icon={CurrencyDollarIcon}
          color="bg-green-500"
        />
        <MetricCard
          title="Total Orders"
          value={analyticsData.overview?.totalOrders.toLocaleString()}
          growth={analyticsData.overview?.ordersGrowth}
          icon={ChartBarIcon}
          color="bg-blue-500"
        />
        <MetricCard
          title="Total Customers"
          value={analyticsData.overview?.totalCustomers.toLocaleString()}
          growth={analyticsData.overview?.customersGrowth}
          icon={UsersIcon}
          color="bg-purple-500"
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${analyticsData.overview?.avgOrderValue}`}
          growth={analyticsData.overview?.avgOrderGrowth}
          icon={ClockIcon}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Revenue</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
            </select>
          </div>
          {analyticsData.revenueChart && (
            <SimpleChart data={analyticsData.revenueChart} />
          )}
        </div>

        {/* Service Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Breakdown</h3>
          {analyticsData.serviceBreakdown && (
            <ServiceBreakdownChart data={analyticsData.serviceBreakdown} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Customers</h3>
          <div className="space-y-4">
            {analyticsData.topCustomers?.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${customer.revenue}</p>
                  <p className="text-sm text-gray-600">{customer.orders} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Revenue Growth</span>
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Order Volume</span>
                <span className="text-sm text-blue-600">+8.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Customer Acquisition</span>
                <span className="text-sm text-purple-600">+15.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4">Key Insights</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p>Revenue increased by 12.5% compared to last month</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p>Premium services showing highest growth rate</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p>Customer retention rate improved to 85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
