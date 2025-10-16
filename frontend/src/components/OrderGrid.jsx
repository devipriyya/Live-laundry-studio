import React from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  UserIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const OrderGrid = ({ 
  orders, 
  onViewOrder,
  getStatusColor,
  getPriorityColor,
  getStatusIcon
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div 
          key={order.id}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 group"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{order.id}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            {/* Tags */}
            {order.tags && order.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {order.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-4">
            {/* Customer Info */}
            <div className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <UserIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{order.customerName}</p>
                <p className="text-sm text-gray-500 truncate">{order.customerEmail}</p>
                <p className="text-sm text-gray-500">{order.customerPhone}</p>
                {order.customerRating && (
                  <div className="flex items-center space-x-1 mt-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{order.customerRating}/5</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{order.service}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                <p>Staff: {order.assignedStaff}</p>
              </div>
            </div>

            {/* Amount and Payment */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">${order.amount.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>
                  {order.paymentStatus}
                </div>
                <div className="text-xs text-gray-500">{order.paymentMethod}</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Est: {new Date(order.estimatedCompletion).toLocaleDateString()}</span>
            </div>

            {order.actualCompletion && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <ClockIcon className="h-4 w-4" />
                <span>Completed: {new Date(order.actualCompletion).toLocaleDateString()}</span>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <p className="text-sm text-gray-700 line-clamp-2">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Last updated: {new Date(order.history[order.history.length - 1]?.timestamp).toLocaleDateString()}
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onViewOrder(order)}
                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded-lg transition-colors"
                  title="View Details"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-green-600 hover:text-green-900 hover:bg-green-100 rounded-lg transition-colors"
                  title="Edit Order"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete Order"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {orders.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-500 text-lg">No orders found</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default OrderGrid;
