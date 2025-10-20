// Order Status Utility Functions
// Provides consistent status handling across the application

export const ORDER_STATUSES = {
  'order-placed': {
    label: 'Order Placed',
    description: 'Your order has been received and is being processed',
    color: 'text-yellow-700 bg-yellow-100 border-yellow-200',
    progress: 10
  },
  'order-accepted': {
    label: 'Order Accepted',
    description: 'Your order has been accepted and scheduled for pickup',
    color: 'text-blue-700 bg-blue-100 border-blue-200',
    progress: 25
  },
  'out-for-pickup': {
    label: 'Out for Pickup',
    description: 'Our team is on the way to collect your items',
    color: 'text-purple-700 bg-purple-100 border-purple-200',
    progress: 40
  },
  'pickup-completed': {
    label: 'Pickup Completed',
    description: 'Your items have been collected and are at our facility',
    color: 'text-indigo-700 bg-indigo-100 border-indigo-200',
    progress: 55
  },
  'wash-in-progress': {
    label: 'Wash in Progress',
    description: 'Your items are currently being washed and cleaned',
    color: 'text-cyan-700 bg-cyan-100 border-cyan-200',
    progress: 70
  },
  'wash-completed': {
    label: 'Wash Completed',
    description: 'Washing is complete, items are being prepared for delivery',
    color: 'text-teal-700 bg-teal-100 border-teal-200',
    progress: 80
  },
  'out-for-delivery': {
    label: 'Out for Delivery',
    description: 'Your clean items are on the way back to you',
    color: 'text-orange-700 bg-orange-100 border-orange-200',
    progress: 90
  },
  'delivery-completed': {
    label: 'Delivery Completed',
    description: 'Your order has been successfully delivered',
    color: 'text-green-700 bg-green-100 border-green-200',
    progress: 100
  }
};

// Legacy status mapping for backward compatibility
export const LEGACY_STATUS_MAP = {
  'Pending': 'order-placed',
  'Confirmed': 'order-accepted',
  'Approved': 'order-accepted',
  'Pick Up In Progress': 'out-for-pickup',
  'Pick Up Completed': 'pickup-completed',
  'Wash Done': 'wash-completed',
  'Out For Delivery': 'out-for-delivery',
  'Delivered': 'delivery-completed'
};

/**
 * Get status information for a given status code
 * @param {string} status - The status code
 * @returns {object} Status information object
 */
export const getStatusInfo = (status) => {
  // Check if it's a new status
  if (ORDER_STATUSES[status]) {
    return ORDER_STATUSES[status];
  }
  
  // Check if it's a legacy status and map it
  const mappedStatus = LEGACY_STATUS_MAP[status];
  if (mappedStatus && ORDER_STATUSES[mappedStatus]) {
    return ORDER_STATUSES[mappedStatus];
  }
  
  // Default fallback
  return {
    label: status || 'Unknown',
    description: 'Status information not available',
    color: 'text-gray-700 bg-gray-100 border-gray-200',
    progress: 0
  };
};

/**
 * Get the display label for a status
 * @param {string} status - The status code
 * @returns {string} Human-readable status label
 */
export const getStatusLabel = (status) => {
  return getStatusInfo(status).label;
};

/**
 * Get the color classes for a status
 * @param {string} status - The status code
 * @returns {string} CSS color classes
 */
export const getStatusColor = (status) => {
  return getStatusInfo(status).color;
};

/**
 * Get the progress percentage for a status
 * @param {string} status - The status code
 * @returns {number} Progress percentage (0-100)
 */
export const getStatusProgress = (status) => {
  return getStatusInfo(status).progress;
};

/**
 * Get the description for a status
 * @param {string} status - The status code
 * @returns {string} Status description
 */
export const getStatusDescription = (status) => {
  return getStatusInfo(status).description;
};

/**
 * Check if a status is considered active (not completed)
 * @param {string} status - The status code
 * @returns {boolean} True if status is active
 */
export const isActiveStatus = (status) => {
  const activeStatuses = [
    'order-placed',
    'order-accepted',
    'out-for-pickup',
    'pickup-completed',
    'wash-in-progress',
    'wash-completed',
    'out-for-delivery'
  ];
  
  // Check legacy statuses too
  const legacyActiveStatuses = [
    'Pending',
    'Confirmed',
    'Approved',
    'Pick Up In Progress',
    'Pick Up Completed',
    'Wash Done',
    'Out For Delivery'
  ];
  
  return activeStatuses.includes(status) || legacyActiveStatuses.includes(status);
};

/**
 * Check if a status is completed
 * @param {string} status - The status code
 * @returns {boolean} True if status is completed
 */
export const isCompletedStatus = (status) => {
  return status === 'delivery-completed' || status === 'Delivered';
};

/**
 * Get all available statuses for admin dropdown
 * @returns {Array} Array of status objects
 */
export const getAllStatuses = () => {
  return Object.entries(ORDER_STATUSES).map(([value, info]) => ({
    value,
    label: info.label,
    description: info.description
  }));
};

/**
 * Get the next logical status in the workflow
 * @param {string} currentStatus - Current status code
 * @returns {string|null} Next status code or null if at end
 */
export const getNextStatus = (currentStatus) => {
  const statusFlow = [
    'order-placed',
    'order-accepted',
    'out-for-pickup',
    'pickup-completed',
    'wash-in-progress',
    'wash-completed',
    'out-for-delivery',
    'delivery-completed'
  ];
  
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex !== -1 && currentIndex < statusFlow.length - 1) {
    return statusFlow[currentIndex + 1];
  }
  
  return null;
};

/**
 * Format status history for display
 * @param {Array} statusHistory - Array of status history objects
 * @returns {Array} Formatted status history
 */
export const formatStatusHistory = (statusHistory) => {
  if (!Array.isArray(statusHistory)) return [];
  
  return statusHistory.map(entry => ({
    ...entry,
    statusInfo: getStatusInfo(entry.status),
    formattedTimestamp: new Date(entry.timestamp).toLocaleString()
  }));
};
