import React, { useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  StarIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const OrderDetailModal = ({ order, onClose, onUpdateStatus, getStatusColor, getPriorityColor }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');

  if (!order) return null;

  const addNote = () => {
    if (newNote.trim()) {
      // In a real app, this would update the order in the backend
      console.log('Adding note:', newNote);
      setNewNote('');
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'items', name: 'Items', icon: CurrencyDollarIcon },
    { id: 'history', name: 'History', icon: ClockIcon },
    { id: 'notes', name: 'Notes', icon: ChatBubbleLeftRightIcon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Order Details</h2>
              <p className="text-blue-100 mt-1">Order ID: {order.id}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <PrinterIcon className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="flex items-center space-x-4 mt-4">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border bg-white ${getStatusColor(order.status).replace('bg-', 'text-').replace('text-', 'bg-')}`}>
              {order.status}
            </span>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-white ${getPriorityColor(order.priority).replace('bg-', 'text-')}`}>
              {order.priority} Priority
            </span>
            {order.tags && order.tags.map((tag, index) => (
              <span key={index} className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-white bg-opacity-20 text-white">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span>{order.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mt-1" />
                      <span className="text-sm">{order.customerAddress}</span>
                    </div>
                    {order.customerRating && (
                      <div className="flex items-center space-x-3">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>Customer Rating: {order.customerRating}/5</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Service Information */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-medium">{order.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned Staff:</span>
                      <span className="font-medium">{order.assignedStaff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-green-600" />
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600">${order.amount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-green-200 pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>${(order.amount * 0.9).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (10%):</span>
                        <span>${(order.amount * 0.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Timeline
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{new Date(order.orderDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. Completion:</span>
                      <span className="font-medium">{new Date(order.estimatedCompletion).toLocaleString()}</span>
                    </div>
                    {order.actualCompletion && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual Completion:</span>
                        <span className="font-medium text-green-600">
                          {new Date(order.actualCompletion).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {order.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-600" />
                      Special Notes
                    </h3>
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Order Items</h3>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 text-gray-600">{item.category || 'General'}</td>
                        <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-gray-600">${(item.price / item.quantity).toFixed(2)}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td colSpan="4" className="px-6 py-4 font-bold text-gray-900">Total:</td>
                      <td className="px-6 py-4 font-bold text-gray-900">${order.amount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Order History</h3>
              <div className="space-y-4">
                {order.history.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{event.status}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                      {event.user && (
                        <p className="text-xs text-gray-500 mt-1">By: {event.user}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Order Notes</h3>
              
              {/* Add New Note */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Add New Note</h4>
                <div className="space-y-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                  <button
                    onClick={addNote}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Existing Notes */}
              <div className="space-y-3">
                {order.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Original Order Note</span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onUpdateStatus(order.id, 'In Progress')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mark In Progress
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, 'Ready for Pickup')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Ready for Pickup
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, 'Completed')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark Completed
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Send Notification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
