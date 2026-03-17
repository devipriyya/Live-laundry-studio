import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  ClockIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BellIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ArrowsPointingOutIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  PresentationChartLineIcon,
  QueueListIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  GiftIcon,
  CalendarDaysIcon,
  ClockIcon as ClockOutlineIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StaffPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [expandedMetrics, setExpandedMetrics] = useState({
    efficiency: true,
    productivity: true,
    quality: true,
    attendance: true
  });

  const toggleMetric = (metric) => {
    setExpandedMetrics(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  // Mock data for charts
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Efficiency Rate',
        data: [85, 87, 90, 88, 92, 94, 91, 93, 95, 96, 94, 97],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Quality Score',
        data: [88, 90, 89, 91, 93, 92, 94, 95, 94, 96, 95, 97],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const productivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [25, 30, 28, 35, 32, 20, 15],
        backgroundColor: '#3B82F6',
        borderRadius: 4
      }
    ]
  };

  const metrics = [
    {
      id: 'efficiency',
      title: 'Efficiency Rate',
      value: '96%',
      trend: '+2.5%',
      trendUp: true,
      description: 'Overall work efficiency based on task completion and time management',
      chartData: performanceData.datasets[0].data.slice(-7),
      icon: ArrowTrendingUpIcon,
      color: 'blue'
    },
    {
      id: 'productivity',
      title: 'Productivity Index',
      value: '94%',
      trend: '+1.8%',
      trendUp: true,
      description: 'Daily productivity measured by tasks completed per hour',
      chartData: productivityData.datasets[0].data,
      icon: BoltIcon,
      color: 'green'
    },
    {
      id: 'quality',
      title: 'Quality Score',
      value: '97%',
      trend: '+3.2%',
      trendUp: true,
      description: 'Quality of work based on customer feedback and internal reviews',
      chartData: performanceData.datasets[1].data.slice(-7),
      icon: ShieldCheckIcon,
      color: 'amber'
    },
    {
      id: 'attendance',
      title: 'Attendance Rate',
      value: '98%',
      trend: '+0.5%',
      trendUp: true,
      description: 'Percentage of scheduled shifts worked without absences',
      chartData: [95, 96, 97, 98, 97, 98, 98],
      icon: CheckCircleIcon,
      color: 'purple'
    }
  ];

  const staffPerformance = [
    {
      id: 'STF-001',
      name: 'Sarah Johnson',
      role: 'Manager',
      efficiency: 96,
      productivity: 94,
      quality: 97,
      attendance: 98,
      rating: 4.8,
      completedOrders: 1250
    },
    {
      id: 'STF-002',
      name: 'Mike Wilson',
      role: 'Technician',
      efficiency: 92,
      productivity: 90,
      quality: 95,
      attendance: 96,
      rating: 4.6,
      completedOrders: 890
    },
    {
      id: 'STF-003',
      name: 'Emma Davis',
      role: 'Supervisor',
      efficiency: 94,
      productivity: 93,
      quality: 96,
      attendance: 97,
      rating: 4.7,
      completedOrders: 1100
    }
  ];

  const recentAchievements = [
    { id: 1, staff: 'Sarah Johnson', achievement: 'Completed 100 orders this week', date: '2 hours ago' },
    { id: 2, staff: 'Mike Wilson', achievement: 'Perfect quality score for 30 days', date: '1 day ago' },
    { id: 3, staff: 'Emma Davis', achievement: 'Achieved 100% efficiency rate', date: '2 days ago' }
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weekly Productivity',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value;
          }
        }
      }
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      amber: 'bg-amber-100 text-amber-600 border-amber-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      red: 'bg-red-100 text-red-600 border-red-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Performance Analytics</h1>
            <p className="text-gray-600">Track and analyze staff performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Staff</option>
              <option value="managers">Managers Only</option>
              <option value="technicians">Technicians Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overall Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">94%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-green-600">+2.5%</span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Quality</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">96%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-green-600">+3.2%</span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Productivity</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">93%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-green-600">+1.8%</span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <BoltIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">97%</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-green-600">+0.5%</span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Performance Trends</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Export Data
            </button>
          </div>
          <div className="h-80">
            <Line data={performanceData} options={options} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Weekly Productivity</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
          </div>
          <div className="h-80">
            <Bar data={productivityData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleMetric(metric.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${getColorClasses(metric.color)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{metric.title}</h4>
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center gap-1">
                      {metric.trendUp ? (
                        <ArrowUpIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs font-semibold ${metric.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                  {expandedMetrics[metric.id] ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {expandedMetrics[metric.id] && (
                <div className="px-6 pb-6">
                  <div className="h-48 mt-4">
                    <Line 
                      data={{
                        labels: Array.from({length: metric.chartData.length}, (_, i) => `Day ${i + 1}`),
                        datasets: [{
                          label: metric.title,
                          data: metric.chartData,
                          borderColor: metric.color === 'blue' ? '#3B82F6' : 
                                     metric.color === 'green' ? '#10B981' :
                                     metric.color === 'amber' ? '#F59E0B' : '#8B5CF6',
                          backgroundColor: metric.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' :
                                         metric.color === 'green' ? 'rgba(16, 185, 129, 0.1)' :
                                         metric.color === 'amber' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                          tension: 0.4,
                          fill: true
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              callback: function(value) {
                                return value + '%';
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Staff Performance Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Individual Staff Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Productivity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Quality</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffPerformance.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">
                          {staff.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${staff.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{staff.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${staff.productivity}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{staff.productivity}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-amber-600 h-2 rounded-full" 
                          style={{ width: `${staff.quality}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{staff.quality}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${staff.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{staff.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-amber-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{staff.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {staff.completedOrders}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Recent Achievements</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrophyIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    <span className="text-blue-600">{achievement.staff}</span> {achievement.achievement}
                  </p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <GiftIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffPerformance;
