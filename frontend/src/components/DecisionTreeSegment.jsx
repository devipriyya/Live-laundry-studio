import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DecisionTreeSegment = ({ customerData }) => {
  const [segment, setSegment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSegment();
  }, [customerData]);

  const fetchSegment = async (customerData) => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://washlab.onrender.com/api';
      const response = await axios.post(`${API_URL}/ml/segment-dt`, {
        customerData
      });
      
      setSegment(response.data.segment);
    } catch (err) {
      console.error('Error fetching Decision Tree segment:', err);
      // Set default segment on error
      setSegment({
        segment: 'regular',
        confidence: 0.8,
        features: []
      });
      setError('Failed to load customer segment from Decision Tree model');
    } finally {
      setLoading(false);
    }
  };

  const getSegmentColor = (segmentType) => {
    const colors = {
      premium: 'bg-gradient-to-r from-purple-500 to-pink-500',
      regular: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      budget: 'bg-gradient-to-r from-green-500 to-emerald-500',
      inactive: 'bg-gradient-to-r from-gray-500 to-gray-600'
    };
    
    return colors[segmentType] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getSegmentIcon = (segmentType) => {
    const icons = {
      premium: '🌳',
      regular: '🌳',
      budget: '🌳',
      inactive: '🌳'
    };
    
    return icons[segmentType] || '🌳';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Segment (Decision Tree)</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Always render the component, even if there's an error
  // Show default segment if no data is available
  const displaySegment = segment || {
    segment: 'regular',
    confidence: 0.8
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate('/customer-segment')}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🌳</span>
        Customer Segment (Decision Tree)
        <span className="ml-auto text-xs text-blue-500 font-normal">Click for details</span>
      </h3>
      
      <div className="text-center">
        <div className={`w-20 h-20 rounded-full ${getSegmentColor(displaySegment.segment)} flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
          {getSegmentIcon(displaySegment.segment)}
        </div>
        
        <h4 className="text-xl font-bold text-gray-900 capitalize mb-2">
          {displaySegment.segment} Customer
        </h4>
        
        <div className="flex items-center justify-center mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getSegmentColor(displaySegment.segment)}`}
              style={{ width: `${displaySegment.confidence * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-bold text-gray-900 ml-2">
            {Math.round(displaySegment.confidence * 100)}%
          </span>
        </div>
        
        <p className="text-gray-600 text-sm">
          Based on Decision Tree classification
        </p>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h5 className="font-bold text-gray-900 mb-2">Segment Benefits</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          {displaySegment.segment === 'premium' && (
            <>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>20% off all services</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Priority scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span>Free pickup & delivery</span>
              </li>
            </>
          )}
          {displaySegment.segment === 'regular' && (
            <>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>10% off subscription plans</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Standard pickup & delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Access to seasonal promotions</span>
              </li>
            </>
          )}
          {displaySegment.segment === 'budget' && (
            <>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Bulk order discounts</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Flexible payment options</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Value packages available</span>
              </li>
            </>
          )}
          {displaySegment.segment === 'inactive' && (
            <>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span>Welcome back discount</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span>Special reactivation offers</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">•</span>
                <span>Free service consultation</span>
              </li>
            </>
          )}
        </ul>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default DecisionTreeSegment;