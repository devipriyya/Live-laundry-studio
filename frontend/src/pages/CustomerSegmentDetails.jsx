import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  ChartBarIcon,
  GiftIcon,
  StarIcon,
  SparklesIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const CustomerSegmentDetails = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [segments, setSegments] = useState({
    svm: null,
    decisionTree: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock customer data - in a real app, this would come from an API
  const customerData = {
    orderFrequency: 15,
    avgOrderValue: 1250,
    daysSinceLastOrder: 5,
    serviceVariety: 3,
    satisfactionScore: 4.8,
    referralCount: 2,
    discountUsage: 4,
    complaintCount: 0
  };

  useEffect(() => {
    fetchSegments(customerData);
  }, []);

  const fetchSegments = async (customerData) => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      // Fetch both SVM and Decision Tree predictions
      const [svmResponse, dtResponse] = await Promise.all([
        axios.post(`${API_URL}/ml/segment`, {
          customerData
        }).catch(err => {
          console.error('Error fetching SVM segment:', err);
          return null;
        }),
        axios.post(`${API_URL}/ml/segment-dt`, {
          customerData
        }).catch(err => {
          console.error('Error fetching Decision Tree segment:', err);
          return null;
        })
      ]);
      
      setSegments({
        svm: svmResponse?.data?.segment || {
          segment: 'regular',
          confidence: 0.8
        },
        decisionTree: dtResponse?.data?.segment || {
          segment: 'regular',
          confidence: 0.75
        }
      });
    } catch (err) {
      console.error('Error fetching segments:', err);
      // Set default segments on error
      setSegments({
        svm: {
          segment: 'regular',
          confidence: 0.8
        },
        decisionTree: {
          segment: 'regular',
          confidence: 0.75
        }
      });
      setError('Failed to load customer segments');
    } finally {
      setLoading(false);
    }
  };

  const getSegmentColor = (segmentType) => {
    const colors = {
      premium: 'from-purple-500 to-pink-500',
      regular: 'from-blue-500 to-cyan-500',
      budget: 'from-green-500 to-emerald-500',
      inactive: 'from-gray-500 to-gray-600'
    };
    
    return colors[segmentType] || 'from-gray-500 to-gray-600';
  };

  const getSegmentIcon = (segmentType, modelType) => {
    // Different icons for different models
    if (modelType === 'svm') {
      const icons = {
        premium: '🤖',
        regular: '⭐',
        budget: '💰',
        inactive: '💤'
      };
      return icons[segmentType] || '👤';
    } else {
      const icons = {
        premium: '🌳',
        regular: '🌱',
        budget: '🌿',
        inactive: '🍂'
      };
      return icons[segmentType] || '🌱';
    }
  };

  const segmentBenefits = {
    premium: [
      { icon: GiftIcon, text: '20% off all services', color: 'text-purple-500' },
      { icon: StarIcon, text: 'Priority scheduling', color: 'text-purple-500' },
      { icon: TruckIcon, text: 'Free pickup & delivery', color: 'text-purple-500' },
      { icon: SparklesIcon, text: 'Exclusive premium items', color: 'text-purple-500' },
      { icon: UserCircleIcon, text: 'Dedicated customer support', color: 'text-purple-500' }
    ],
    regular: [
      { icon: GiftIcon, text: '10% off subscription plans', color: 'text-blue-500' },
      { icon: TruckIcon, text: 'Standard pickup & delivery', color: 'text-blue-500' },
      { icon: SparklesIcon, text: 'Access to seasonal promotions', color: 'text-blue-500' },
      { icon: ShoppingBagIcon, text: 'Early access to new services', color: 'text-blue-500' },
      { icon: CreditCardIcon, text: 'Flexible payment options', color: 'text-blue-500' }
    ],
    budget: [
      { icon: GiftIcon, text: 'Bulk order discounts', color: 'text-green-500' },
      { icon: CreditCardIcon, text: 'Flexible payment options', color: 'text-green-500' },
      { icon: SparklesIcon, text: 'Value packages available', color: 'text-green-500' },
      { icon: ShoppingBagIcon, text: 'Special budget-friendly offers', color: 'text-green-500' },
      { icon: StarIcon, text: 'Loyalty points bonus', color: 'text-green-500' }
    ],
    inactive: [
      { icon: GiftIcon, text: 'Welcome back discount', color: 'text-gray-500' },
      { icon: SparklesIcon, text: 'Special reactivation offers', color: 'text-gray-500' },
      { icon: UserCircleIcon, text: 'Free service consultation', color: 'text-gray-500' },
      { icon: ShoppingBagIcon, text: 'Referral bonus for friends', color: 'text-gray-500' },
      { icon: ChartBarIcon, text: 'Personalized re-engagement plan', color: 'text-gray-500' }
    ]
  };

  const segmentStats = [
    { label: 'Order Frequency', value: customerData.orderFrequency, description: 'orders per month' },
    { label: 'Avg Order Value', value: `₹${customerData.avgOrderValue}`, description: 'per order' },
    { label: 'Days Since Last Order', value: customerData.daysSinceLastOrder, description: 'days ago' },
    { label: 'Service Variety', value: customerData.serviceVariety, description: 'different services used' },
    { label: 'Satisfaction Score', value: customerData.satisfactionScore, description: 'out of 5' },
    { label: 'Referral Count', value: customerData.referralCount, description: 'successful referrals' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Customer Segment Details</h1>
            <div></div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use SVM segment as the primary segment for display
  const primarySegment = segments.svm || {
    segment: 'regular',
    confidence: 0.8
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Customer Segment Details</h1>
          <div></div> {/* Spacer for alignment */}
        </div>

        {/* Main Segment Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Model Predictions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* SVM Segment */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded">SVM</span>
                    <span className="text-sm text-gray-500 ml-2">Support Vector Machine</span>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    Classification
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getSegmentColor(primarySegment.segment)} flex items-center justify-center text-white text-2xl mb-4`}>
                    {getSegmentIcon(primarySegment.segment, 'svm')}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">
                    {primarySegment.segment} Customer
                  </h3>
                  
                  <div className="w-full max-w-[200px] mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round(primarySegment.confidence * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full bg-gradient-to-r ${getSegmentColor(primarySegment.segment)}`}
                        style={{ width: `${primarySegment.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-3 text-center">
                    Support Vector Machine classification model
                  </p>
                </div>
              </div>
              
              {/* Decision Tree Segment */}
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded">TREE</span>
                    <span className="text-sm text-gray-500 ml-2">Decision Tree</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Classification
                  </span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getSegmentColor(segments.decisionTree?.segment || 'regular')} flex items-center justify-center text-white text-2xl mb-4`}>
                    {getSegmentIcon(segments.decisionTree?.segment || 'regular', 'dt')}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">
                    {segments.decisionTree?.segment || 'regular'} Customer
                  </h3>
                  
                  <div className="w-full max-w-[200px] mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-sm font-bold text-gray-900">
                        {Math.round((segments.decisionTree?.confidence || 0.75) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full bg-gradient-to-r ${getSegmentColor(segments.decisionTree?.segment || 'regular')}`}
                        style={{ width: `${(segments.decisionTree?.confidence || 0.75) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-3 text-center">
                    Tree-based classification model
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 mt-6">
              <h3 className="font-bold text-blue-800 mb-2">Model Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-bold text-blue-600">KNN</div>
                  <div className="text-gray-600">Recommendations</div>
                  <div className="text-xs text-gray-500 mt-1">Similarity-based</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-bold text-purple-600">SVM</div>
                  <div className="text-gray-600">Classification</div>
                  <div className="text-xs text-gray-500 mt-1">Margin-based</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-bold text-green-600">Decision Tree</div>
                  <div className="text-gray-600">Classification</div>
                  <div className="text-xs text-gray-500 mt-1">Rule-based</div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              Based on your order history and preferences, our AI models have classified you as a {primarySegment.segment} customer. 
              This segment is determined by factors like order frequency, spending patterns, and service engagement.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Your Exclusive Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {segmentBenefits[primarySegment.segment].map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 flex items-start">
                  <benefit.icon className={`h-5 w-5 ${benefit.color} mr-3 mt-0.5`} />
                  <span className="text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Stats */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Your Customer Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {segmentStats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Improve Section */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How to Maintain or Improve Your Segment</h3>
            <ul className="space-y-2 text-gray-700">
              {primarySegment.segment === 'premium' && (
                <>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Continue placing regular orders to maintain your premium status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Refer friends to earn additional rewards</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Try new services to increase your service variety score</span>
                  </li>
                </>
              )}
              {primarySegment.segment === 'regular' && (
                <>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Increase your order frequency to move to premium segment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Try higher-value services to increase average order value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Refer friends to earn bonus points</span>
                  </li>
                </>
              )}
              {primarySegment.segment === 'budget' && (
                <>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Place more frequent orders to improve your segment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Try our premium services for special occasions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Take advantage of bulk order discounts</span>
                  </li>
                </>
              )}
              {primarySegment.segment === 'inactive' && (
                <>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Place an order to reactivate your account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Take advantage of our welcome back offer</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Contact support for a personalized service consultation</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={() => navigate('/schedule-pickup')}
            className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-full border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Schedule a Pickup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSegmentDetails;