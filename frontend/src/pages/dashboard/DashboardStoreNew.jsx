import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const DashboardStoreNew = () => {
  // Real store information provided by the user
  const store = {
    name: 'WashLab',
    address: 'Machiplavu P O , Chattupara, Adimaly, Idukki 685561',
    phone: '917907425691',
    email: 'washlab041@gmail.com',
    hours: 'Mon-Sat: 8:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM'
  };

  // Services available at the store
  const services = [
    { id: 1, name: 'Dry Cleaning', icon: '👔' },
    { id: 2, name: 'Shoe Polishing', icon: '👟' },
    { id: 3, name: 'Stain Removal', icon: '🧽' },
    { id: 4, name: 'Steam Ironing', icon: '熨' },
    { id: 5, name: 'Washing', icon: '🧺' }
  ];

  // Google Maps embed URL for the specific location in Idukki, Kerala
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3938.980630387153!2d77.133794!3d9.847465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07978d51a3e8d9%3A0x8b3a0a0a0a0a0a0a!2sMachiplavu%2C%20Chattupara%2C%20Adimaly%2C%20Idukki%2C%20Kerala%20685561!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin";

  const [mapError, setMapError] = useState(false);

  // Handle map loading errors
  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Locator</h1>
        <p className="text-gray-600 mt-2">Visit our premium store location</p>
      </div>

      {/* Single Store Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Store Information */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{store.name}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{store.address}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <p className="text-gray-700">{store.phone}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <p className="text-gray-700">{store.email}</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <p className="text-gray-700">{store.hours}</p>
              </div>
            </div>
            
            {/* Services Available at Store */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Services Available</h3>
              <div className="grid grid-cols-2 gap-3">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2 bg-blue-50 rounded-lg p-2">
                    <span className="text-lg">{service.icon}</span>
                    <span className="text-gray-700 font-medium">{service.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => window.open(`tel:${store.phone}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors mr-3"
              >
                Call Store
              </button>
              <button 
                onClick={() => window.open(`mailto:${store.email}`)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Email Store
              </button>
            </div>
          </div>
          
          {/* Embedded Google Map */}
          <div className="lg:w-1/2">
            {mapError ? (
              <div className="w-full h-80 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">Map failed to load</p>
                  <p className="text-sm text-gray-500">Please check your internet connection</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-80 rounded-xl overflow-hidden shadow-md">
                <iframe
                  src={googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{border:0}}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Store Location"
                  className="rounded-xl"
                  onError={handleMapError}
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Overview Section */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">All Services Available at Our Store</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg p-4 text-center shadow-sm border border-blue-100">
              <div className="text-2xl mb-2">{service.icon}</div>
              <p className="text-sm font-medium text-blue-800">{service.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStoreNew;