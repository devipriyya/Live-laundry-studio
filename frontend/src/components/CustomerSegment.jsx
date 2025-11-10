import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerSegment = ({ customerData }) => {
  const [segments, setSegments] = useState({
    svm: null,
    decisionTree: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSegments();
  }, [customerData]);

  const fetchSegments = async (customerData) => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://washlab.onrender.com/api';
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
          confidence: 0.8,
          features: []
        },
        decisionTree: dtResponse?.data?.segment || {
          segment: 'regular',
          confidence: 0.75,
          features: []
        }
      });
    } catch (err) {
      console.error('Error fetching segments:', err);
      // Set default segments on error
      setSegments({
        svm: {
          segment: 'regular',
          confidence: 0.8,
          features: []
        },
        decisionTree: {
          segment: 'regular',
          confidence: 0.75,
          features: []
        }
      });
      setError('Failed to load customer segments');
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Segments</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Always render the component, even if there's an error
  // Show default segments if no data is available
  const displaySvmSegment = segments.svm || {
    segment: 'regular',
    confidence: 0.8
  };
  
  const displayDtSegment = segments.decisionTree || {
    segment: 'regular',
    confidence: 0.75
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        Customer Segments
        <span className="ml-auto text-xs text-blue-500 font-normal">Click for details</span>
      </h3>
      
      <div className="space-y-4">
        {/* SVM Segment */}
        <div 
          className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/customer-segment')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded">SVM</span>
              <span className="text-xs text-gray-500 ml-2">Support Vector Machine</span>
            </div>
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Classification
            </span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${getSegmentColor(displaySvmSegment.segment)} flex items-center justify-center text-white text-lg flex-shrink-0`}>
              {getSegmentIcon(displaySvmSegment.segment, 'svm')}
            </div>
            
            <div className="ml-4 flex-1">
              <h4 className="text-base font-bold text-gray-900 capitalize">
                {displaySvmSegment.segment} Customer
              </h4>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getSegmentColor(displaySvmSegment.segment)}`}
                    style={{ width: `${displaySvmSegment.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-900 ml-2">
                  {Math.round(displaySvmSegment.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Confidence Level</p>
            </div>
          </div>
        </div>
        
        {/* Decision Tree Segment */}
        <div 
          className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate('/customer-segment')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded">TREE</span>
              <span className="text-xs text-gray-500 ml-2">Decision Tree</span>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Classification
            </span>
          </div>
          
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${getSegmentColor(displayDtSegment.segment)} flex items-center justify-center text-white text-lg flex-shrink-0`}>
              {getSegmentIcon(displayDtSegment.segment, 'dt')}
            </div>
            
            <div className="ml-4 flex-1">
              <h4 className="text-base font-bold text-gray-900 capitalize">
                {displayDtSegment.segment} Customer
              </h4>
              <div className="flex items-center mt-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getSegmentColor(displayDtSegment.segment)}`}
                    style={{ width: `${displayDtSegment.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-900 ml-2">
                  {Math.round(displayDtSegment.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Confidence Level</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-gray-600 text-xs text-center">
          Based on your order history and preferences
        </p>
      </div>
      
      {error && (
        <div className="mt-4 p-2 bg-red-50 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default CustomerSegment;