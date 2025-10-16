import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const RefreshButton = ({ onRefresh, isLoading = false, className = '' }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing || isLoading}
      className={`inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title="Refresh data"
    >
      <ArrowPathIcon 
        className={`h-4 w-4 ${(isRefreshing || isLoading) ? 'animate-spin' : ''}`} 
      />
      <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
    </button>
  );
};

export default RefreshButton;
