import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServiceRecommendations = ({ userOrderHistory }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Use the correct POST endpoint instead of the non-existent GET endpoint
        const response = await axios.post('http://localhost:5000/api/ml/recommend', {
          userOrderHistory: userOrderHistory || [] // Use passed order history or empty array
        });
        // Transform the response to match the expected format
        const transformedRecommendations = response.data.recommendations.map(rec => ({
          name: rec.service,
          confidence: rec.confidence
        }));
        setRecommendations(transformedRecommendations);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userOrderHistory]);

  const getServiceRoute = (serviceName) => {
    // Map service names to the correct dashboard menu items
    const serviceRoutes = {
      'washAndPress': 'schedule',
      'dryCleaning': 'schedule',
      'steamPress': 'schedule',
      'stainRemoval': 'schedule',
      'shoeCare': 'schedule'
    };
    return serviceRoutes[serviceName] || 'schedule';
  };

  const handleRecommendationClick = (serviceName) => {
    // Navigate to the correct dashboard section
    const menuItemId = getServiceRoute(serviceName);
    // Since we're in a component, we need to navigate to the correct route
    // Based on the Dashboard.jsx, schedule wash is at /schedule-pickup
    if (menuItemId === 'schedule') {
      navigate('/schedule-pickup');
    } else {
      // For other services, navigate to schedule pickup as default
      navigate('/schedule-pickup');
    }
  };

  if (loading) return <div className="text-center py-4">Loading recommendations...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Recommended Services</h3>
      {recommendations.length === 0 ? (
        <p className="text-gray-500">No recommendations available at the moment.</p>
      ) : (
        <div className="space-y-3">
          {recommendations.map((service, index) => (
            <div 
              key={index} 
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition duration-150 ease-in-out"
              onClick={() => handleRecommendationClick(service.name)}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
                <p className="text-xs text-gray-500">Confidence: {Math.round(service.confidence * 100)}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRecommendations;