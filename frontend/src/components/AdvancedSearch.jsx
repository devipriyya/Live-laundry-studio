import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const AdvancedSearch = ({ 
  onSearch, 
  onFilter, 
  searchType = 'orders',
  placeholder = 'Search...',
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const filterConfigs = {
    orders: {
      status: {
        label: 'Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'ready', label: 'Ready for Pickup' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
        ]
      },
      service: {
        label: 'Service Type',
        type: 'select',
        options: [
          { value: 'wash-fold', label: 'Wash & Fold' },
          { value: 'dry-clean', label: 'Dry Cleaning' },
          { value: 'steam-press', label: 'Steam Press' },
          { value: 'express', label: 'Express Service' }
        ]
      },
      dateRange: {
        label: 'Date Range',
        type: 'daterange'
      },
      amountRange: {
        label: 'Amount Range',
        type: 'range',
        min: 0,
        max: 500,
        step: 10
      },
      priority: {
        label: 'Priority',
        type: 'select',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'normal', label: 'Normal' },
          { value: 'high', label: 'High' },
          { value: 'urgent', label: 'Urgent' }
        ]
      }
    },
    customers: {
      status: {
        label: 'Customer Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'vip', label: 'VIP' },
          { value: 'new', label: 'New Customer' }
        ]
      },
      registrationDate: {
        label: 'Registration Date',
        type: 'daterange'
      },
      totalSpent: {
        label: 'Total Spent',
        type: 'range',
        min: 0,
        max: 5000,
        step: 50
      },
      orderCount: {
        label: 'Order Count',
        type: 'range',
        min: 0,
        max: 100,
        step: 1
      }
    },
    staff: {
      role: {
        label: 'Role',
        type: 'select',
        options: [
          { value: 'manager', label: 'Manager' },
          { value: 'supervisor', label: 'Supervisor' },
          { value: 'technician', label: 'Technician' },
          { value: 'driver', label: 'Driver' },
          { value: 'customer-service', label: 'Customer Service' }
        ]
      },
      department: {
        label: 'Department',
        type: 'select',
        options: [
          { value: 'operations', label: 'Operations' },
          { value: 'delivery', label: 'Delivery' },
          { value: 'customer-care', label: 'Customer Care' },
          { value: 'management', label: 'Management' }
        ]
      },
      status: {
        label: 'Employment Status',
        type: 'select',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'on-leave', label: 'On Leave' },
          { value: 'terminated', label: 'Terminated' }
        ]
      }
    }
  };

  const currentFilters = filterConfigs[searchType] || filterConfigs.orders;

  useEffect(() => {
    const count = Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchTerm, filters);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filters, onSearch]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
  };

  const renderFilterField = (key, config) => {
    switch (config.type) {
      case 'select':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
            </label>
            <select
              value={filters[key] || ''}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All {config.label}</option>
              {config.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'daterange':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters[`${key}_start`] || ''}
                onChange={(e) => handleFilterChange(`${key}_start`, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="date"
                value={filters[`${key}_end`] || ''}
                onChange={(e) => handleFilterChange(`${key}_end`, e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        );

      case 'range':
        return (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {config.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={`Min ${config.label}`}
                value={filters[`${key}_min`] || ''}
                onChange={(e) => handleFilterChange(`${key}_min`, e.target.value)}
                min={config.min}
                max={config.max}
                step={config.step}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="number"
                placeholder={`Max ${config.label}`}
                value={filters[`${key}_max`] || ''}
                onChange={(e) => handleFilterChange(`${key}_max`, e.target.value)}
                min={config.min}
                max={config.max}
                step={config.step}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FunnelIcon className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            const config = currentFilters[key.replace('_start', '').replace('_end', '').replace('_min', '').replace('_max', '')];
            if (!config) return null;
            
            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                <span>{config.label}: {value}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="hover:text-blue-900"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <button
            onClick={clearFilters}
            className="text-xs text-red-600 hover:text-red-800 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Advanced Filters</span>
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(currentFilters).map(([key, config]) =>
              renderFilterField(key, config)
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
