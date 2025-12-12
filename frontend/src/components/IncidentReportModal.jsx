import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon, 
  PhotoIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const IncidentReportModal = ({ order, onClose, onSubmit }) => {
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null, address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const incidentTypes = [
    { id: 'customer-not-available', label: 'Customer Not Available', icon: '👤' },
    { id: 'address-incorrect', label: 'Address Incorrect', icon: '📍' },
    { id: 'clothes-not-ready', label: 'Clothes Not Ready for Pickup', icon: '👕' },
    { id: 'unable-to-deliver', label: 'Unable to Deliver', icon: '🚚' },
    { id: 'vehicle-issue', label: 'Vehicle Issue', icon: '🚗' },
    { id: 'weather-issue', label: 'Weather Issue', icon: '🌧️' },
    { id: 'other', label: 'Other Issue', icon: '❓' }
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: ''
          });
        },
        (error) => {
          setError('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Prepare form data
      const formData = new FormData();
      formData.append('orderId', order._id);
      formData.append('type', incidentType);
      formData.append('description', description);
      
      if (photo) {
        formData.append('photo', photo);
      }
      
      if (location.latitude && location.longitude) {
        formData.append('location', JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address
        }));
      }

      const response = await axios.post(`${API_URL}/incidents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      onSubmit(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit incident report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Report Incident</h2>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Incident Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incidentTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setIncidentType(type.id)}
                    className={`p-3 rounded-lg border text-left ${
                      incidentType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide detailed information about the incident..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <MapPinIcon className="w-5 h-5" />
                  Use Current Location
                </button>
                
                {(location.latitude || location.longitude) && (
                  <div className="text-sm text-gray-600">
                    Lat: {location.latitude?.toFixed(6)}, Lon: {location.longitude?.toFixed(6)}
                  </div>
                )}
                
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => setLocation({...location, address: e.target.value})}
                  placeholder="Enter address manually (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo Evidence (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <PhotoIcon className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPreviewUrl('');
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={loading || !incidentType || !description}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportModal;