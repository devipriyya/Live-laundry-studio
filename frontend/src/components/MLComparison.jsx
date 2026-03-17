import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const MLComparison = ({ customerData }) => {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState({
    knn: null,
    svm: null,
    decisionTree: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllPredictions();
  }, [customerData]);

  const fetchAllPredictions = async () => {
    if (!customerData) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch predictions from all three models
      const [knnResponse, svmResponse, dtResponse] = await Promise.all([
        axios.post('http://localhost:5000/api/ml/recommend', {
          userOrderHistory: []
        }).catch(() => null),
        axios.post('http://localhost:5000/api/ml/segment', {
          customerData
        }).catch(() => null),
        axios.post('http://localhost:5000/api/ml/segment-dt', {
          customerData
        }).catch(() => null)
      ]);
      
      setPredictions({
        knn: knnResponse?.data?.recommendations || null,
        svm: svmResponse?.data?.segment || null,
        decisionTree: dtResponse?.data?.segment || null
      });
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError('Failed to load predictions from one or more models');
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
    } else if (modelType === 'dt') {
      const icons = {
        premium: '🌳',
        regular: '🌱',
        budget: '🌿',
        inactive: '🍂'
      };
      return icons[segmentType] || '🌱';
    } else {
      const icons = {
        premium: '💎',
        regular: '⭐',
        budget: '💰',
        inactive: '💤'
      };
      return icons[segmentType] || '⭐';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('ml_models.title')}</h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{t('ml_models.title')}</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        {/* KNN Recommendations */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <span className="text-lg mr-2">🔍</span>
              <div>
                <h4 className="font-bold text-gray-900">{t('ml_models.knn.name')}</h4>
                <p className="text-xs text-gray-500">{t('ml_models.knn.desc')}</p>
              </div>
            </div>
            <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {t('ml_models.knn.type')}
            </span>
          </div>
          
          {predictions.knn ? (
            <div className="space-y-3">
              {predictions.knn.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{rec.service || 'N/A'}</span>
                    <p className="text-xs text-gray-500 mt-1">{rec.reason || t('ml_models.knn.desc')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {Math.round(rec.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-2">{t('ml_models.no_recommendations')}</p>
          )}
        </div>
        
        {/* SVM Segment */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <span className="text-lg mr-2">🤖</span>
              <div>
                <h4 className="font-bold text-gray-900">{t('ml_models.svm.name')}</h4>
                <p className="text-xs text-gray-500">{t('ml_models.svm.desc')}</p>
              </div>
            </div>
            <span className="ml-auto bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              {t('ml_models.svm.type')}
            </span>
          </div>
          
          {predictions.svm ? (
            <div className="text-center py-2">
              <div className={`w-16 h-16 rounded-full ${getSegmentColor(predictions.svm.segment)} flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                {getSegmentIcon(predictions.svm.segment, 'svm')}
              </div>
              <h5 className="text-lg font-bold text-gray-900 capitalize">
                {t('ml_models.segments.customer', { type: t(`ml_models.segments.${predictions.svm.segment}`) })}
              </h5>
              <div className="flex items-center justify-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[120px]">
                  <div 
                    className={`h-2 rounded-full ${getSegmentColor(predictions.svm.segment)}`}
                    style={{ width: `${predictions.svm.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-900 ml-2">
                  {Math.round(predictions.svm.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{t('ml_models.confidence_level')}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-2 text-center">{t('ml_models.no_segment')}</p>
          )}
        </div>
        
        {/* Decision Tree Segment */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <span className="text-lg mr-2">🌳</span>
              <div>
                <h4 className="font-bold text-gray-900">{t('ml_models.dt.name')}</h4>
                <p className="text-xs text-gray-500">{t('ml_models.dt.desc')}</p>
              </div>
            </div>
            <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {t('ml_models.dt.type')}
            </span>
          </div>
          
          {predictions.decisionTree ? (
            <div className="text-center py-2">
              <div className={`w-16 h-16 rounded-full ${getSegmentColor(predictions.decisionTree.segment)} flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                {getSegmentIcon(predictions.decisionTree.segment, 'dt')}
              </div>
              <h5 className="text-lg font-bold text-gray-900 capitalize">
                {t('ml_models.segments.customer', { type: t(`ml_models.segments.${predictions.decisionTree.segment}`) })}
              </h5>
              <div className="flex items-center justify-center mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-[120px]">
                  <div 
                    className={`h-2 rounded-full ${getSegmentColor(predictions.decisionTree.segment)}`}
                    style={{ width: `${predictions.decisionTree.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-900 ml-2">
                  {Math.round(predictions.decisionTree.confidence * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{t('ml_models.confidence_level')}</p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm py-2 text-center">{t('ml_models.no_segment')}</p>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="font-bold text-gray-900 mb-3">{t('ml_models.comparison')}</h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-50 p-2 rounded">
            <div className="text-blue-500 font-bold text-sm">KNN</div>
            <div className="text-xs text-gray-600">{t('ml_models.knn.type')}</div>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <div className="text-purple-500 font-bold text-sm">SVM</div>
            <div className="text-xs text-gray-600">{t('ml_models.svm.type')}</div>
          </div>
          <div className="bg-green-50 p-2 rounded">
            <div className="text-green-500 font-bold text-sm">Tree</div>
            <div className="text-xs text-gray-600">{t('ml_models.dt.type')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLComparison;