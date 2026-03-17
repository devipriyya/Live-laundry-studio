/**
 * Laundry Staff Service
 * Complete API service for all laundry staff operations
 */
import api from '../api';

const laundryStaffService = {
  // ============================================
  // DASHBOARD & STATS
  // ============================================
  
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats including orders, earnings, etc.
   */
  getStats: async () => {
    const response = await api.get('/laundry-staff/stats');
    return response.data;
  },

  // ============================================
  // ORDERS MANAGEMENT
  // ============================================
  
  /**
   * Get all assigned orders with filters
   * @param {Object} params - Filter parameters
   * @returns {Promise} List of orders with pagination
   */
  getAssignedOrders: async (params = {}) => {
    const response = await api.get('/laundry-staff/assigned-orders', { params });
    return response.data;
  },

  /**
   * Get order details by ID
   * @param {string} orderId - Order ID or order number
   * @returns {Promise} Order details
   */
  getOrderDetails: async (orderId) => {
    const response = await api.get(`/laundry-staff/order/${orderId}`);
    return response.data;
  },

  /**
   * Update order status (washing/processing)
   * @param {string} orderId - Order ID or order number
   * @param {Object} updateData - Data to update (status, note, estimatedDelivery)
   * @returns {Promise} Updated order
   */
  updateOrderStatus: async (orderId, updateData) => {
    const response = await api.patch(`/laundry-staff/orders/${orderId}/status`, updateData);
    return response.data;
  },

  /**
   * Update order progress
   * @param {string} orderId - Order ID or order number
   * @param {Object} progressData - Progress information
   * @returns {Promise} Updated order
   */
  updateOrderProgress: async (orderId, progressData) => {
    const response = await api.patch(`/orders/${orderId}/progress`, progressData);
    return response.data;
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  
  /**
   * Get notifications
   * @param {Object} params - Query params (page, limit, unreadOnly, type)
   * @returns {Promise} Notifications list
   */
  getNotifications: async (params = {}) => {
    const response = await api.get('/laundry-staff/notifications', { params });
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Result
   */
  markNotificationRead: async (notificationId) => {
    const response = await api.patch(`/laundry-staff/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Result
   */
  markAllNotificationsRead: async () => {
    const response = await api.patch('/laundry-staff/notifications/read-all');
    return response.data;
  },

  // ============================================
  // PROFILE MANAGEMENT
  // ============================================
  
  /**
   * Get profile
   * @returns {Promise} Profile data
   */
  getProfile: async () => {
    const response = await api.get('/laundry-staff/profile');
    return response.data;
  },

  /**
   * Update profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/laundry-staff/profile', profileData);
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
   * @returns {Promise} Result
   */
  changePassword: async (passwordData) => {
    const response = await api.put('/laundry-staff/profile/change-password', passwordData);
    return response.data;
  },

  /**
   * Update availability status
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} Result
   */
  updateAvailability: async (isAvailable) => {
    const response = await api.patch('/laundry-staff/availability', { isAvailable });
    return response.data;
  },

  // ============================================
  // QUALITY CONTROL
  // ============================================
  
  /**
   * Report quality issues
   * @param {string} orderId - Order ID
   * @param {Object} issueData - Issue details
   * @returns {Promise} Result
   */
  reportQualityIssue: async (orderId, issueData) => {
    const response = await api.post(`/laundry-staff/orders/${orderId}/quality-issue`, issueData);
    return response.data;
  },

  /**
   * Get quality reports
   * @param {Object} params - Query parameters
   * @returns {Promise} Quality reports
   */
  getQualityReports: async (params = {}) => {
    const response = await api.get('/laundry-staff/quality-reports', { params });
    return response.data;
  },

  // ============================================
  // PERFORMANCE TRACKING
  // ============================================
  
  /**
   * Get performance metrics
   * @param {Object} params - Query parameters
   * @returns {Promise} Performance data
   */
  getPerformanceMetrics: async (params = {}) => {
    const response = await api.get('/laundry-staff/performance', { params });
    return response.data;
  },

  /**
   * Get schedule information
   * @returns {Promise} Schedule data
   */
  getSchedule: async () => {
    const response = await api.get('/laundry-staff/schedule');
    return response.data;
  },

  /**
   * Update schedule
   * @param {Object} scheduleData - Schedule information
   * @returns {Promise} Updated schedule
   */
  updateSchedule: async (scheduleData) => {
    const response = await api.put('/laundry-staff/schedule', scheduleData);
    return response.data;
  },

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Get status label for display
   * @param {string} status - Order status
   * @returns {string} Human-readable status label
   */
  getStatusLabel: (status) => {
    const labels = {
      'wash-in-progress': 'Washing in Progress',
      'drying': 'Drying in Progress',
      'pressing': 'Ironing in Progress',
      'ready-for-delivery': 'Completed',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return labels[status] || status;
  },

  /**
   * Get next status for workflow
   * @param {string} currentStatus - Current order status
   * @returns {string|null} Next status or null if no next status
   */
  getNextStatus: (currentStatus) => {
    const workflow = {
      'received-at-facility': 'washing',
      'washing': 'drying',
      'drying': 'pressing',
      'pressing': 'ready-for-delivery'
    };
    return workflow[currentStatus] || null;
  },

  /**
   * Check if laundry staff can update to this status
   * @param {string} status - Status to check
   * @returns {boolean} True if laundry staff can update
   */
  canUpdateStatus: (status) => {
    const allowedStatuses = [
      'received-at-facility',
      'washing',
      'drying',
      'cleaning',
      'pressing',
      'quality-check',
      'ready-for-pickup'
    ];
    return allowedStatuses.includes(status);
  },

  /**
   * Get action button text for status
   * @param {string} status - Current status
   * @returns {string} Button text
   */
  getActionButtonText: (status) => {
    const texts = {
      'received-at-facility': 'Start Washing',
      'washing': 'Move to Drying',
      'drying': 'Move to Ironing',
      'pressing': 'Mark Ready for Delivery'
    };
    return texts[status] || null;
  },

  /**
   * Get all selectable statuses for laundry staff
   * @returns {Array} List of status objects
   */
  getAllStatuses: () => {
    return [
      { value: 'wash-in-progress', label: 'Washing in Progress' },
      { value: 'drying', label: 'Drying in Progress' },
      { value: 'pressing', label: 'Ironing in Progress' },
      { value: 'ready-for-delivery', label: 'Completed' }
    ];
  }
};

export default laundryStaffService;
