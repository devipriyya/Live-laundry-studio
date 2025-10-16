import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null, 
  className = '',
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-red-50 border-red-200 text-red-800',
    minimal: 'bg-gray-50 border-gray-200 text-gray-600',
    card: 'bg-white border-red-200 text-red-700 shadow-sm'
  };

  return (
    <div className={`border rounded-lg p-4 ${variants[variant]} ${className}`}>
      <div className="flex items-center space-x-3">
        <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center space-x-1 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Inline error for form fields or small components
export const InlineError = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`flex items-center space-x-1 text-red-600 text-sm ${className}`}>
      <ExclamationTriangleIcon className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};

// Card-specific error component
export const CardError = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-red-200 p-6 ${className}`}>
      <div className="text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load data</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
