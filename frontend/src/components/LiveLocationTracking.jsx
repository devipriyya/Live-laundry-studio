import React, { useState, useEffect, useContext } from 'react';
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

const LiveLocationTracking = ({ order, isActive, onToggle }) => {
  const { user } = useContext(AuthContext);
  const { socket } = useChat();
  const [location, setLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [isTracking, setIsTracking] = useState(isActive);
  const [error, setError] = useState('');
  const [locationHistory, setLocationHistory] = useState([]);

  // Fetch existing location history when component mounts
  useEffect(() => {
    const fetchLocationHistory = async () => {
      try {
        const response = await api.get(`/locations/order/${order._id}`);
        setLocationHistory(response.data);
        if (response.data.length > 0) {
          // Set initial location to the latest one
          const latestLocation = response.data[0];
          setLocation({
            lat: latestLocation.latitude,
            lng: latestLocation.longitude
          });
        }
      } catch (error) {
        console.error('Error fetching location history:', error);
      }
    };

    if (isActive) {
      fetchLocationHistory();
    }
  }, [order._id, isActive]);

  // Handle location updates from geolocation API
  const handleLocationUpdate = (position) => {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      speed: position.coords.speed,
      heading: position.coords.heading,
      timestamp: new Date()
    };

    setLocation(newLocation);

    // Emit location update via Socket.IO
    if (socket) {
      socket.emit('location-update', {
        userId: user.uid || user.id,
        orderId: order._id,
        latitude: newLocation.lat,
        longitude: newLocation.lng,
        accuracy: newLocation.accuracy,
        altitude: newLocation.altitude,
        speed: newLocation.speed,
        heading: newLocation.heading,
        timestamp: newLocation.timestamp
      });
    }

    // Update location history
    setLocationHistory(prev => [newLocation, ...prev.slice(0, 49)]); // Keep last 50 locations
  };

  // Start location tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      handleLocationUpdate,
      (err) => {
        setError(`Unable to retrieve your location: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      }
    );

    setWatchId(id);
    setIsTracking(true);
    onToggle(true);

    // Join location tracking room
    if (socket) {
      socket.emit('join-location-tracking', {
        userId: user.uid || user.id,
        orderId: order._id
      });
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    onToggle(false);

    // Leave location tracking room
    if (socket) {
      socket.emit('leave-location-tracking', {
        userId: user.uid || user.id,
        orderId: order._id
      });
    }
  };

  // Toggle tracking on/off
  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      
      // Leave location tracking room
      if (socket && isTracking) {
        socket.emit('leave-location-tracking', {
          userId: user.uid || user.id,
          orderId: order._id
        });
      }
    };
  }, [watchId, socket, user, order._id, isTracking]);

  // Set initial state based on prop
  useEffect(() => {
    setIsTracking(isActive);
  }, [isActive]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Location Tracking</h3>
        <button
          onClick={toggleTracking}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            isTracking 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {location && (
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium">Lat:</span> {location.lat.toFixed(6)}
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium">Lng:</span> {location.lng.toFixed(6)}
            </div>
            {location.accuracy && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Accuracy:</span> {Math.round(location.accuracy)}m
              </div>
            )}
            {location.speed !== null && (
              <div className="bg-gray-50 p-2 rounded">
                <span className="font-medium">Speed:</span> {location.speed ? location.speed.toFixed(2) : 0} m/s
              </div>
            )}
          </div>
        </div>
      )}

      {location && (
        <div className="h-64 rounded-lg overflow-hidden">
          <MapContainer 
            center={[location.lat, location.lng]} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>
                Your current location<br />
                Order: {order.orderNumber}
              </Popup>
            </Marker>
            
            {/* Show location history as markers */}
            {locationHistory.slice(0, 10).map((loc, index) => (
              <Marker 
                key={index} 
                position={[loc.lat, loc.lng]}
                icon={L.divIcon({
                  className: 'custom-icon',
                  html: `<div class="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow"></div>`,
                  iconSize: [12, 12],
                  iconAnchor: [6, 6]
                })}
              />
            ))}
          </MapContainer>
        </div>
      )}

      {!location && (
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">
            {isTracking 
              ? 'Getting your location...' 
              : 'Click "Start Tracking" to share your location'}
          </p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>
          {isTracking 
            ? '📍 Location sharing is active. Your position updates in real-time.' 
            : '📍 Location sharing is paused. Start tracking to share your position.'}
        </p>
      </div>
    </div>
  );
};

export default LiveLocationTracking;
