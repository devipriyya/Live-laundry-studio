import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import api from '../api';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveLocationMap = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useChat();
  const [liveLocations, setLiveLocations] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch latest locations on component mount
  useEffect(() => {
    fetchLatestLocations();
  }, []);

  // Set up Socket.IO listener for location updates
  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdated = (data) => {
      setLiveLocations(prev => ({
        ...prev,
        [data.orderId]: {
          ...data,
          deliveryBoyInfo: prev[data.orderId]?.deliveryBoyInfo || {},
          orderInfo: prev[data.orderId]?.orderInfo || {}
        }
      }));
    };

    const handleLocationTrackingStarted = (data) => {
      console.log('Location tracking started:', data);
      // Could show a notification or update UI to indicate new tracking session
    };

    const handleLocationTrackingEnded = (data) => {
      console.log('Location tracking ended:', data);
      // Remove the location from live locations when tracking ends
      setLiveLocations(prev => {
        const newLocations = { ...prev };
        delete newLocations[data.orderId];
        return newLocations;
      });
    };

    socket.on('location-updated', handleLocationUpdated);
    socket.on('location-tracking-started', handleLocationTrackingStarted);
    socket.on('location-tracking-ended', handleLocationTrackingEnded);

    return () => {
      socket.off('location-updated', handleLocationUpdated);
      socket.off('location-tracking-started', handleLocationTrackingStarted);
      socket.off('location-tracking-ended', handleLocationTrackingEnded);
    };
  }, [socket]);

  // Fetch latest locations from API
  const fetchLatestLocations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/locations/latest');
      const locationsObject = {};
      
      response.data.forEach(location => {
        locationsObject[location.orderId] = {
          ...location,
          deliveryBoyInfo: location.deliveryBoyInfo?.[0] || {},
          orderInfo: location.orderInfo?.[0] || {}
        };
      });
      
      setLiveLocations(locationsObject);
    } catch (error) {
      setError('Failed to fetch location data');
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get location history for a specific order
  const getOrderLocationHistory = async (orderId) => {
    try {
      const response = await api.get(`/locations/order/${orderId}/admin`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location history:', error);
      return [];
    }
  };

  // Refresh locations
  const handleRefresh = () => {
    fetchLatestLocations();
  };

  // Calculate bounds for the map to fit all markers
  const getMapBounds = () => {
    const locations = Object.values(liveLocations);
    if (locations.length === 0) return null;

    const bounds = locations.map(loc => [loc.latitude, loc.longitude]);
    return bounds;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Location Tracking</h2>
            <p className="text-gray-600 mt-1">Monitor delivery boy locations in real-time</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6">
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="p-6">
        {Object.keys(liveLocations).length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No active deliveries</h3>
            <p className="mt-1 text-sm text-gray-500">No delivery boys are currently sharing their locations.</p>
          </div>
        ) : (
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {Object.values(liveLocations).map((location) => (
                <Marker 
                  key={location.orderId}
                  position={[location.latitude, location.longitude]}
                  eventHandlers={{
                    click: () => setSelectedOrder(location.orderId)
                  }}
                >
                  <Popup>
                    <div className="min-w-48">
                      <h3 className="font-bold text-gray-900">
                        Order: {location.orderInfo?.orderNumber || 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Delivery Boy: {location.deliveryBoyInfo?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last Updated: {new Date(location.timestamp).toLocaleTimeString()}
                      </p>
                      {location.speed !== null && (
                        <p className="text-sm text-gray-600">
                          Speed: {location.speed ? location.speed.toFixed(2) : 0} m/s
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {Object.keys(liveLocations).length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Deliveries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(liveLocations).map((location) => (
                <div 
                  key={location.orderId}
                  className={`bg-gray-50 rounded-lg p-4 border ${
                    selectedOrder === location.orderId 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedOrder(location.orderId)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Order: {location.orderInfo?.orderNumber || 'N/A'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Delivery Boy: {location.deliveryBoyInfo?.name || 'Unknown'}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Live
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Lat: {location.latitude.toFixed(6)}</p>
                    <p>Lng: {location.longitude.toFixed(6)}</p>
                    <p>Last updated: {new Date(location.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLocationMap;