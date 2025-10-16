import React from 'react';
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

const DashboardStore = () => {
  const stores = [
    {
      id: 1,
      name: 'FabricSpa Bangalore Central',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      phone: '+91 98765 43210',
      hours: 'Mon-Sat: 8AM-8PM, Sun: 10AM-6PM',
      distance: '2.3 km'
    },
    {
      id: 2,
      name: 'FabricSpa Mumbai Bandra',
      address: '456 Linking Road, Bandra West, Mumbai 400050',
      phone: '+91 98765 43211',
      hours: 'Mon-Sat: 9AM-9PM, Sun: 10AM-7PM',
      distance: '5.1 km'
    },
    {
      id: 3,
      name: 'FabricSpa Delhi CP',
      address: '789 Connaught Place, New Delhi 110001',
      phone: '+91 98765 43212',
      hours: 'Mon-Sun: 8AM-10PM',
      distance: '8.7 km'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Store Locator</h1>
        <p className="text-gray-600 mt-2">Find FabricSpa locations near you</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Find Nearby Stores</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Enter your location or pincode"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Stores List */}
      <div className="space-y-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{store.address}</p>
                      <p className="text-sm text-blue-600 font-medium">{store.distance} away</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700">{store.phone}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700">{store.hours}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Get Directions
                </button>
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition-colors">
                  Call Store
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services Available */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Services Available at All Locations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">👔</div>
            <p className="text-sm text-blue-800">Dry Cleaning</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💧</div>
            <p className="text-sm text-blue-800">Wash & Press</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🚚</div>
            <p className="text-sm text-blue-800">Pickup & Delivery</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm text-blue-800">Express Service</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStore;
