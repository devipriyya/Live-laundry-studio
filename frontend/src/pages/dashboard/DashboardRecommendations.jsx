import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceRecommendations from '../../components/ServiceRecommendations';
import CustomerSegment from '../../components/CustomerSegment';

const DashboardRecommendations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommendations');
  
  // Mock order history for demonstration
  const mockOrderHistory = [
    {
      userOrderCount: 5,
      totalAmount: 1200,
      orderDate: '2023-05-15T10:30:00Z',
      items: [{ service: 'washAndPress' }]
    },
    {
      userOrderCount: 5,
      totalAmount: 1450,
      orderDate: '2023-05-10T11:15:00Z',
      items: [{ service: 'washAndPress' }]
    },
    {
      userOrderCount: 5,
      totalAmount: 1100,
      orderDate: '2023-05-05T09:45:00Z',
      items: [{ service: 'washAndPress' }]
    }
  ];

  // Mock customer data for segmentation
  const mockCustomerData = {
    orderFrequency: 15,
    avgOrderValue: 1250,
    daysSinceLastOrder: 5,
    serviceVariety: 3,
    satisfactionScore: 4.8,
    referralCount: 2,
    discountUsage: 4,
    complaintCount: 0,
    segment: 'premium'
  };

  const recommendationsData = [
    {
      service: 'washAndPress',
      confidence: 0.95,
      reason: 'Frequently ordered in the past month',
      savings: '15% off with subscription'
    },
    {
      service: 'dryCleaning',
      confidence: 0.82,
      reason: 'Similar customers also ordered',
      savings: 'Free pickup for first order'
    },
    {
      service: 'steamPress',
      confidence: 0.75,
      reason: 'Seasonal recommendation',
      savings: 'Buy 2 get 1 free'
    }
  ];

  const getServiceDisplayName = (serviceKey) => {
    const serviceNames = {
      washAndPress: 'Wash & Press',
      dryCleaning: 'Dry Cleaning',
      steamPress: 'Steam Press',
      stainRemoval: 'Stain Removal',
      shoeCare: 'Shoe Care'
    };
    
    return serviceNames[serviceKey] || serviceKey;
  };

  const getServiceIcon = (serviceKey) => {
    const icons = {
      washAndPress: '👕',
      dryCleaning: '👗',
      steamPress: '熨斗',
      stainRemoval: '🎯',
      shoeCare: '👟'
    };
    
    return icons[serviceKey] || '⭐';
  };

  const handleServiceClick = (service) => {
    // Navigate to the service page based on the service type
    const serviceRoutes = {
      washAndPress: '/dashboard/laundry',
      dryCleaning: '/dashboard/dry-cleaning',
      steamPress: '/dashboard/steam-ironing',
      stainRemoval: '/dashboard/stain-removal',
      shoeCare: '/dashboard/shoe-cleaning'
    };
    
    const route = serviceRoutes[service];
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalized Recommendations</h1>
        <p className="text-gray-600">AI-powered suggestions based on your order history and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Recommendations Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Your Recommendations
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'insights'
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Insights
            </button>
          </div>

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Recommendations</h2>
                <div className="space-y-4">
                  {recommendationsData.map((rec, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => handleServiceClick(rec.service)}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                          {getServiceIcon(rec.service)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">
                            {getServiceDisplayName(rec.service)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {rec.reason}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {Math.round(rec.confidence * 100)}% match
                          </div>
                          <div className="text-xs text-green-600">
                            {rec.savings}
                          </div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">How Recommendations Work</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                      <span className="text-cyan-600 font-bold">1</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Analyze</h4>
                    <p className="text-sm text-gray-600">We analyze your order history and preferences</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                      <span className="text-cyan-600 font-bold">2</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Compare</h4>
                    <p className="text-sm text-gray-600">Compare with similar customers</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                      <span className="text-cyan-600 font-bold">3</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">Recommend</h4>
                    <p className="text-sm text-gray-600">Provide personalized suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Laundry Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                  <div className="text-2xl mb-2">👕</div>
                  <h3 className="font-bold text-gray-900 mb-1">Most Ordered</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">Wash & Press</p>
                  <p className="text-sm text-gray-600">Ordered 15 times this month</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
                  <div className="text-2xl mb-2">📅</div>
                  <h3 className="font-bold text-gray-900 mb-1">Preferred Time</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-2">Weekend Mornings</p>
                  <p className="text-sm text-gray-600">65% of orders placed Sat-Sun</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100">
                  <div className="text-2xl mb-2">💰</div>
                  <h3 className="font-bold text-gray-900 mb-1">Average Spend</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-2">₹1,250</p>
                  <p className="text-sm text-gray-600">Per month on laundry</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
                  <div className="text-2xl mb-2">⭐</div>
                  <h3 className="font-bold text-gray-900 mb-1">Satisfaction</h3>
                  <p className="text-2xl font-bold text-purple-600 mb-2">4.8/5.0</p>
                  <p className="text-sm text-gray-600">Based on 24 reviews</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Segment */}
          <CustomerSegment customerData={mockCustomerData} />
          
          {/* Current Recommendations Preview */}
          <ServiceRecommendations userOrderHistory={mockOrderHistory} />

          {/* Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-bold text-gray-900">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Favorite Service</span>
                <span className="font-bold text-gray-900">Wash & Press</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg. Order Value</span>
                <span className="font-bold text-gray-900">₹1,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Savings This Month</span>
                <span className="font-bold text-green-600">₹320</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Subscribe to Wash & Press for 15% savings</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Try our new Dry Cleaning service this season</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Refer a friend and get ₹200 off your next order</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRecommendations;