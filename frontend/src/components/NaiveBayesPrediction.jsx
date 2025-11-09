import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NaiveBayesPrediction = ({ userOrderHistory }) => {
  const [prediction, setPrediction] = useState(null);
  const [probabilities, setProbabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrediction();
  }, [userOrderHistory]);

  const fetchPrediction = async () => {
    // If we have mock data with a predefined prediction, use it directly
    if (userOrderHistory && userOrderHistory.prediction) {
      setPrediction(userOrderHistory.prediction);
      setProbabilities(userOrderHistory.probabilities || []);
      return;
    }
    
    // Only fetch from API if we have userOrderHistory
    if (!userOrderHistory || userOrderHistory.length === 0) {
      // Set default prediction if no data provided
      setPrediction('washAndPress');
      setProbabilities([
        { service: 'washAndPress', probability: 0.8 },
        { service: 'dryCleaning', probability: 0.1 },
        { service: 'steamPress', probability: 0.05 },
        { service: 'stainRemoval', probability: 0.03 },
        { service: 'shoeCare', probability: 0.02 }
      ]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First, we need to train the model with the provided data
      await api.post('/ml/train-naive-bayes', {
        orders: userOrderHistory
      }).catch(err => {
        console.error('Error training Naive Bayes model:', err);
        // Continue even if training fails, as the model might already be trained
      });
      
      // Then get the prediction
      const predictionResponse = await api.post('/ml/predict-naive-bayes', {
        userOrderHistory
      });
      
      setPrediction(predictionResponse.data.prediction);
      
      // Get probabilities
      const probabilitiesResponse = await api.post('/ml/predict-probabilities', {
        userOrderHistory
      });
      
      setProbabilities(probabilitiesResponse.data.probabilities);
    } catch (err) {
      console.error('Error fetching Naive Bayes prediction:', err);
      // Set default prediction on error
      setPrediction('washAndPress');
      setProbabilities([
        { service: 'washAndPress', probability: 0.8 },
        { service: 'dryCleaning', probability: 0.1 },
        { service: 'steamPress', probability: 0.05 },
        { service: 'stainRemoval', probability: 0.03 },
        { service: 'shoeCare', probability: 0.02 }
      ]);
      setError('Failed to load Naive Bayes prediction');
    } finally {
      setLoading(false);
    }
  };

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

  const getServiceRoute = (serviceName) => {
    // Map service names to the correct dashboard routes
    const serviceRoutes = {
      'washAndPress': '/dashboard/laundry',
      'dryCleaning': '/dashboard/dry-cleaning',
      'steamPress': '/dashboard/steam-ironing',
      'stainRemoval': '/dashboard/stain-removal',
      'shoeCare': '/dashboard/shoe-cleaning'
    };
    return serviceRoutes[serviceName] || '/schedule-pickup';
  };

  const handleServiceClick = (serviceName) => {
    // Navigate to the correct service page based on the recommendation
    const route = getServiceRoute(serviceName);
    navigate(route);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔮</span>
          Naive Bayes Prediction
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Always render the component, even if there's an error
  const displayPrediction = prediction || 'washAndPress';
  
  // Get the probability for the predicted service
  const predictionProbability = probabilities.find(p => p.service === displayPrediction)?.probability || 0.8;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">🔮</span>
        Naive Bayes Prediction
        <span className="ml-auto text-xs text-blue-500 font-normal">Click for details</span>
      </h3>
      
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded">NB</span>
            <span className="text-xs text-gray-500 ml-2">Naive Bayes</span>
          </div>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            Classification
          </span>
        </div>
        
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg flex-shrink-0">
            {getServiceIcon(displayPrediction)}
          </div>
          
          <div className="ml-4 flex-1">
            <h4 className="text-base font-bold text-gray-900">
              {getServiceDisplayName(displayPrediction)}
            </h4>
            <div className="flex items-center mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${predictionProbability * 100}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-900 ml-2">
                {Math.round(predictionProbability * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Confidence Level</p>
          </div>
        </div>
      </div>
      
      {/* Top 3 probabilities */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-gray-900">Top Predictions</h4>
        {probabilities
          .sort((a, b) => b.probability - a.probability)
          .slice(0, 3)
          .map((prob, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
              onClick={() => handleServiceClick(prob.service)}
            >
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">#{index + 1}</span>
                <span className="text-sm">{getServiceDisplayName(prob.service)}</span>
              </div>
              <span className="text-xs font-bold text-gray-900">
                {Math.round(prob.probability * 100)}%
              </span>
            </div>
          ))
        }
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

export default NaiveBayesPrediction;