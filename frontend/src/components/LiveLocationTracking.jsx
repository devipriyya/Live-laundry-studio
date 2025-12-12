import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

const LiveLocationTracking = () => {
  const { user } = useContext(AuthContext);
  const { socket } = useChat();
  const navigate = useNavigate();
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [isTracking, setIsTracking] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setError('Unable to retrieve your location. Please enable location services.');
          console.error('Geolocation error:', err);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Fetch active tracking sessions
  useEffect(() => {
    fetchActiveSessions();
  }, []);

  // Set up Socket.IO listener for location tracking control
  useEffect(() => {
    if (!socket) return;

    const handleJoinLocationTracking = (data) => {
      console.log('Joined location tracking:', data);
    };

    const handleLeaveLocationTracking = (data) => {
      console.log('Left location tracking:', data);
    };

    socket.on('join-location-tracking', handleJoinLocationTracking);
    socket.on('leave-location-tracking', handleLeaveLocationTracking);

    return () => {
      socket.off('join-location-tracking', handleJoinLocationTracking);
      socket.off('leave-location-tracking', handleLeaveLocationTracking);
    };
  }, [socket]);

  // Fetch active tracking sessions from API
  const fetchActiveSessions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.get('/locations/active');
      setActiveOrders(response.data);
    } catch (error) {
      setError('Failed to fetch active tracking sessions');
      console.error('Error fetching active sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start location tracking
  const startTracking = () => {
    if (!selectedOrder) {
      setError('Please select an order to track');
      return;
    }

    if (!location.latitude || !location.longitude) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setIsTracking(true);
    setError('');
    
    // Emit socket event to join location tracking
    if (socket) {
      socket.emit('join-location-tracking', {
        orderId: selectedOrder,
        deliveryBoyId: user._id,
        deliveryBoyName: user.name
      });
    }
    
    // Start sending location updates
    sendLocationUpdate();
  };

  // Stop location tracking
  const stopTracking = () => {
    setIsTracking(false);
    
    // Emit socket event to leave location tracking
    if (socket) {
      socket.emit('leave-location-tracking', {
        orderId: selectedOrder,
        deliveryBoyId: user._id
      });
    }
  };

  // Send location update
  const sendLocationUpdate = () => {
    if (!isTracking || !selectedOrder) return;
    
    // Get fresh location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy || null,
          altitude: position.coords.altitude || null,
          speed: position.coords.speed || null,
          heading: position.coords.heading || null
        };
        
        setLocation(newLocation);
        
        // Save to database
        saveLocationToDatabase(newLocation);
        
        // Emit socket event for real-time update
        if (socket) {
          socket.emit('location-update', {
            orderId: selectedOrder,
            deliveryBoyId: user._id,
            ...newLocation,
            timestamp: new Date().toISOString()
          });
        }
        
        // Continue tracking
        setTimeout(sendLocationUpdate, 10000); // Update every 10 seconds
      },
      (err) => {
        console.error('Error getting location:', err);
        setTimeout(sendLocationUpdate, 10000); // Continue tracking even if location fails
      }
    );
  };

  // Save location to database
  const saveLocationToDatabase = async (locationData) => {
    try {
      await api.post('/locations', {
        orderId: selectedOrder,
        deliveryBoyId: user._id,
        ...locationData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrder(orderId);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Location Tracking</h2>
            <p className="text-gray-600 mt-1">Share your location with customers and admins in real-time</p>
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
        {/* Order Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Order to Track
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.length > 0 ? (
              activeOrders.map((orderId) => (
                <div 
                  key={orderId}
                  className={`bg-gray-50 rounded-lg p-4 border cursor-pointer ${
                    selectedOrder === orderId 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleOrderSelect(orderId)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Order: {orderId.substring(0, 8)}...
                      </h4>
                    </div>
                    {selectedOrder === orderId && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active orders</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any active delivery orders to track.</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {selectedOrder && (
          <div className="mb-6 flex flex-wrap gap-3">
            {!isTracking ? (
              <button
                onClick={startTracking}
                disabled={!location.latitude || !location.longitude}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Start Tracking
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Stop Tracking
              </button>
            )}
            
            <button
              onClick={fetchActiveSessions}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Orders'}
            </button>
          </div>
        )}

        {/* Map Display */}
        {location.latitude && location.longitude && (
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer 
              center={[location.latitude, location.longitude]} 
              zoom={15} 
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>
                  <div className="min-w-48">
                    <h3 className="font-bold text-gray-900">Your Location</h3>
                    <p className="text-sm text-gray-600">
                      Lat: {location.latitude.toFixed(6)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Lng: {location.longitude.toFixed(6)}
                    </p>
                    {isTracking && (
                      <p className="text-sm text-green-600 mt-1">
                        Tracking Active
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Status Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Current Position</h3>
                <p className="text-sm text-gray-500">
                  {location.latitude ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Not available'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Tracking Status</h3>
                <p className="text-sm text-gray-500">
                  {isTracking ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Selected Order</h3>
                <p className="text-sm text-gray-500">
                  {selectedOrder ? selectedOrder.substring(0, 8) + '...' : 'None'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveLocationTracking;