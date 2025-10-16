import React, { useState } from 'react';
import {
  CheckIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  PhoneIcon,
  TagIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const BulkOperations = ({ 
  selectedItems, 
  onClearSelection, 
  onBulkAction, 
  itemType = 'orders',
  totalItems = 0 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [bulkEditModal, setBulkEditModal] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({});

  const bulkActions = {
    orders: [
      {
        id: 'update-status',
        label: 'Update Status',
        icon: TagIcon,
        color: 'blue',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'send-notification',
        label: 'Send Notification',
        icon: EnvelopeIcon,
        color: 'green',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'assign-driver',
        label: 'Assign Driver',
        icon: UserGroupIcon,
        color: 'purple',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'export',
        label: 'Export Selected',
        icon: DocumentArrowDownIcon,
        color: 'indigo',
        requiresConfirm: false,
        requiresData: false
      },
      {
        id: 'delete',
        label: 'Delete Selected',
        icon: TrashIcon,
        color: 'red',
        requiresConfirm: true,
        requiresData: false
      }
    ],
    customers: [
      {
        id: 'send-email',
        label: 'Send Email',
        icon: EnvelopeIcon,
        color: 'blue',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'send-sms',
        label: 'Send SMS',
        icon: PhoneIcon,
        color: 'green',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'add-tag',
        label: 'Add Tags',
        icon: TagIcon,
        color: 'purple',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'export',
        label: 'Export Selected',
        icon: DocumentArrowDownIcon,
        color: 'indigo',
        requiresConfirm: false,
        requiresData: false
      },
      {
        id: 'delete',
        label: 'Delete Selected',
        icon: TrashIcon,
        color: 'red',
        requiresConfirm: true,
        requiresData: false
      }
    ],
    staff: [
      {
        id: 'update-role',
        label: 'Update Role',
        icon: UserGroupIcon,
        color: 'blue',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'send-notification',
        label: 'Send Notification',
        icon: EnvelopeIcon,
        color: 'green',
        requiresConfirm: false,
        requiresData: true
      },
      {
        id: 'export',
        label: 'Export Selected',
        icon: DocumentArrowDownIcon,
        color: 'indigo',
        requiresConfirm: false,
        requiresData: false
      }
    ]
  };

  const currentActions = bulkActions[itemType] || bulkActions.orders;

  const handleActionClick = (action) => {
    if (action.requiresConfirm) {
      setPendingAction(action);
      setShowConfirmModal(true);
    } else if (action.requiresData) {
      setPendingAction(action);
      setBulkEditModal(true);
    } else {
      executeBulkAction(action);
    }
  };

  const executeBulkAction = (action, data = null) => {
    onBulkAction(action.id, selectedItems, data);
    setShowConfirmModal(false);
    setBulkEditModal(false);
    setPendingAction(null);
    setBulkEditData({});
  };

  const renderBulkEditModal = () => {
    if (!bulkEditModal || !pendingAction) return null;

    const renderEditFields = () => {
      switch (pendingAction.id) {
        case 'update-status':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={bulkEditData.status || ''}
                onChange={(e) => setBulkEditData({...bulkEditData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select status...</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="ready">Ready for Pickup</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          );

        case 'send-notification':
        case 'send-email':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={bulkEditData.subject || ''}
                  onChange={(e) => setBulkEditData({...bulkEditData, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={bulkEditData.message || ''}
                  onChange={(e) => setBulkEditData({...bulkEditData, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your message..."
                />
              </div>
            </div>
          );

        case 'send-sms':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Message
              </label>
              <textarea
                value={bulkEditData.message || ''}
                onChange={(e) => setBulkEditData({...bulkEditData, message: e.target.value})}
                rows={3}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SMS message (max 160 characters)..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {(bulkEditData.message || '').length}/160 characters
              </p>
            </div>
          );

        case 'add-tag':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={bulkEditData.tags || ''}
                onChange={(e) => setBulkEditData({...bulkEditData, tags: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. VIP, Regular, Premium"
              />
            </div>
          );

        case 'assign-driver':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Driver
              </label>
              <select
                value={bulkEditData.driverId || ''}
                onChange={(e) => setBulkEditData({...bulkEditData, driverId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select driver...</option>
                <option value="1">John Smith</option>
                <option value="2">Mike Johnson</option>
                <option value="3">Sarah Wilson</option>
                <option value="4">David Brown</option>
              </select>
            </div>
          );

        case 'update-role':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Role
              </label>
              <select
                value={bulkEditData.role || ''}
                onChange={(e) => setBulkEditData({...bulkEditData, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select role...</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
                <option value="technician">Technician</option>
                <option value="driver">Driver</option>
                <option value="customer-service">Customer Service</option>
              </select>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {pendingAction.label}
            </h3>
            <button
              onClick={() => setBulkEditModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              This action will be applied to {selectedItems.length} selected {itemType}.
            </p>
            {renderEditFields()}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setBulkEditModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => executeBulkAction(pendingAction, bulkEditData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmModal = () => {
    if (!showConfirmModal || !pendingAction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm {pendingAction.label}
              </h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to {pendingAction.label.toLowerCase()} {selectedItems.length} selected {itemType}?
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => executeBulkAction(pendingAction)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {pendingAction.label}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (selectedItems.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {selectedItems.length} {itemType} selected
              </p>
              <p className="text-sm text-gray-600">
                {selectedItems.length} of {totalItems} items
              </p>
            </div>
          </div>
          <button
            onClick={onClearSelection}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                action.color === 'red'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : action.color === 'blue'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : action.color === 'green'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : action.color === 'purple'
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : action.color === 'indigo'
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <action.icon className="h-4 w-4" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Select all items to perform bulk operations</span>
            <span>Press Esc to clear selection</span>
          </div>
        </div>
      </div>

      {renderConfirmModal()}
      {renderBulkEditModal()}
    </>
  );
};

export default BulkOperations;
