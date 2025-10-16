import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  const mockDeliveries = [
    {
      id: 'DEL-001',
      orderId: 'ORD-2024-001',
      customerName: 'John Doe',
      customerPhone: '+1 (555) 123-4567',
      pickupAddress: '123 Main St, Apt 4B, New York, NY 10001',
      deliveryAddress: '456 Oak Ave, Suite 12, Los Angeles, CA 90210',
      status: 'In Transit',
      priority: 'High',
      assignedDriver: 'Mike Johnson',
      driverPhone: '+1 (555) 987-6543',
      estimatedTime: '2024-01-16T16:00:00Z',
      actualPickupTime: '2024-01-16T14:15:00Z',
      trackingUpdates: [
        { time: '14:15', status: 'Picked up from customer', location: 'New York, NY' },
        { time: '15:30', status: 'In transit to processing center', location: 'Highway I-95' },
        { time: '16:45', status: 'Arrived at processing center', location: 'Processing Center' }
      ]
    },
    {
      id: 'DEL-002',
      orderId: 'ORD-2024-002',
      customerName: 'Jane Smith',
      customerPhone: '+1 (555) 987-6543',
      pickupAddress: '789 Pine St, Chicago, IL 60601',
      deliveryAddress: '321 Elm St, Miami, FL 33101',
      status: 'Ready for Pickup',
      priority: 'Normal',
      assignedDriver: 'Sarah Wilson',
      driverPhone: '+1 (555) 456-7890',
      estimatedTime: '2024-01-17T10:00:00Z',
      trackingUpdates: [
        { time: '09:00', status: 'Order ready for pickup', location: 'Processing Center' }
      ]
    }
  ];

  const mockDrivers = [
    {
      id: 'DRV-001',
      name: 'Mike Johnson',
      phone: '+1 (555) 987-6543',
      vehicle: 'Van - ABC123',
      status: 'Active',
      currentLocation: 'Downtown Area',
      deliveriesCount: 3,
      rating: 4.8
    },
    {
      id: 'DRV-002',
      name: 'Sarah Wilson',
      phone: '+1 (555) 456-7890',
      vehicle: 'Truck - XYZ789',
      status: 'Available',
      currentLocation: 'North Side',
      deliveriesCount: 1,
      rating: 4.9
    }
  ];

  useEffect(() => {
    setDeliveries(mockDeliveries);
    setDrivers(mockDrivers);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Ready for Pickup': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const TrackingModal = ({ delivery, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delivery Tracking</h2>
              <p className="text-gray-600">{delivery.id} - {delivery.orderId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{delivery.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Driver</p>
                  <p className="font-medium">{delivery.assignedDriver}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Time</p>
                  <p className="font-medium">{new Date(delivery.estimatedTime).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Tracking Updates</h3>
              <div className="space-y-4">
                {delivery.trackingUpdates.map((update, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{update.status}</span>
                        <span className="text-sm text-gray-500">{update.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{update.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Management</h1>
        <p className="text-gray-600">Track and manage all deliveries and drivers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deliveries List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Active Deliveries</h2>
            </div>
            <div className="divide-y">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{delivery.id}</h3>
                      <p className="text-sm text-gray-600">Order: {delivery.orderId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{delivery.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{delivery.customerPhone}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TruckIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{delivery.assignedDriver}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          ETA: {new Date(delivery.estimatedTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="truncate">{delivery.pickupAddress}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setShowTrackingModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drivers Panel */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Available Drivers</h2>
            </div>
            <div className="divide-y">
              {drivers.map((driver) => (
                <div key={driver.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{driver.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      driver.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {driver.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{driver.vehicle}</p>
                    <p>{driver.currentLocation}</p>
                    <div className="flex justify-between">
                      <span>Deliveries: {driver.deliveriesCount}</span>
                      <span>Rating: ⭐ {driver.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deliveries</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-green-600">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Transit</span>
                <span className="font-medium text-blue-600">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-yellow-600">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && selectedDelivery && (
        <TrackingModal
          delivery={selectedDelivery}
          onClose={() => {
            setShowTrackingModal(false);
            setSelectedDelivery(null);
          }}
        />
      )}
    </div>
  );
};

export default DeliveryManagement;
