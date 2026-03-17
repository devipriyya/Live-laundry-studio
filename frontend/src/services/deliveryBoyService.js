/**
 * Delivery Boy Service
 * Complete API service for all delivery boy operations
 */
import api from '../api';

const deliveryBoyService = {
  // ============================================
  // DASHBOARD & STATS
  // ============================================
  
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats including pickups, deliveries, earnings, etc.
   */
  getStats: async () => {
    const response = await api.get('/delivery-boy/stats');
    return response.data;
  },

  /**
   * Get earnings history/transactions
   * @param {Object} params - { period, startDate, endDate }
   * @returns {Promise} Earnings history with transactions
   */
  getEarningsHistory: async (params = {}) => {
    const response = await api.get('/delivery-boy/earnings-history', { params });
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
    const response = await api.get('/delivery-boy/assigned-orders', { params });
    return response.data;
  },

  /**
   * Get order details by ID
   * @param {string} orderId - Order ID or order number
   * @returns {Promise} Order details
   */
  getOrderDetails: async (orderId) => {
    const response = await api.get(`/delivery-boy/order/${orderId}`);
    return response.data;
  },

  /**
   * Update order status (pickup/delivery)
   * @param {string} orderId - Order ID or order number
   * @param {string} status - New status
   * @param {string} note - Optional note
   * @returns {Promise} Updated order
   */
  updateOrderStatus: async (orderId, status, note = '', photoUrl = '') => {
    const response = await api.patch(`/orders/${orderId}/delivery-status`, { status, note, photoUrl });
    return response.data;
  },

  // ============================================
  // OTP VERIFICATION
  // ============================================
  
  /**
   * Generate delivery OTP
   * @param {string} orderId - Order ID
   * @returns {Promise} OTP generation result
   */
  generateOTP: async (orderId) => {
    const response = await api.post(`/delivery-boy/order/${orderId}/generate-otp`);
    return response.data;
  },

  /**
   * Verify delivery OTP
   * @param {string} orderId - Order ID
   * @param {string} otp - 6-digit OTP
   * @param {string} deliveryNote - Optional delivery note
   * @param {string} deliveryPhoto - Optional delivery photo URL
   * @returns {Promise} Verification result
   */
  verifyOTP: async (orderId, otp, deliveryNote = '', deliveryPhoto = '') => {
    const response = await api.post(`/delivery-boy/order/${orderId}/verify-otp`, { 
      otp, 
      deliveryNote, 
      deliveryPhoto 
    });
    return response.data;
  },

  /**
   * Resend delivery OTP
   * @param {string} orderId - Order ID
   * @returns {Promise} Resend result
   */
  resendOTP: async (orderId) => {
    const response = await api.post(`/delivery-boy/order/${orderId}/resend-otp`);
    return response.data;
  },

  /**
   * Get OTP status
   * @param {string} orderId - Order ID
   * @returns {Promise} OTP status
   */
  getOTPStatus: async (orderId) => {
    const response = await api.get(`/delivery-boy/order/${orderId}/otp-status`);
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
    const response = await api.get('/delivery-boy/notifications', { params });
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Result
   */
  markNotificationRead: async (notificationId) => {
    const response = await api.patch(`/delivery-boy/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Result
   */
  markAllNotificationsRead: async () => {
    const response = await api.patch('/delivery-boy/notifications/read-all');
    return response.data;
  },

  /**
   * Delete notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise} Result
   */
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/delivery-boy/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Clear all read notifications
   * @returns {Promise} Result
   */
  clearReadNotifications: async () => {
    const response = await api.delete('/delivery-boy/notifications/clear-read');
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
    const response = await api.get('/delivery-boy/profile');
    return response.data;
  },

  /**
   * Update profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/delivery-boy/profile', profileData);
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwordData - { currentPassword, newPassword, confirmPassword }
   * @returns {Promise} Result
   */
  changePassword: async (passwordData) => {
    const response = await api.put('/delivery-boy/profile/change-password', passwordData);
    return response.data;
  },

  /**
   * Update profile photo
   * @param {string} base64Image - Base64 encoded image
   * @returns {Promise} Result
   */
  updateProfilePhoto: async (base64Image) => {
    const response = await api.put('/delivery-boy/profile/photo', { profilePicture: base64Image });
    return response.data;
  },

  /**
   * Delete profile photo
   * @returns {Promise} Result
   */
  deleteProfilePhoto: async () => {
    const response = await api.delete('/delivery-boy/profile/photo');
    return response.data;
  },

  /**
   * Update availability status
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} Result
   */
  updateAvailability: async (isAvailable) => {
    const response = await api.put('/delivery-boy/profile/availability', { isAvailable });
    return response.data;
  },

  /**
   * Update current location
   * @param {Object} location - { latitude, longitude }
   * @returns {Promise} Result
   */
  updateLocation: async (location) => {
    const response = await api.put('/delivery-boy/profile/location', location);
    return response.data;
  },

  // ============================================
  // SHIFT MANAGEMENT
  // ============================================
  
  /**
   * Start a new shift
   * @param {Object} locationData - { latitude, longitude, address }
   * @returns {Promise} New shift
   */
  startShift: async (locationData = {}) => {
    const response = await api.post('/delivery-boy/shift/start', locationData);
    return response.data;
  },

  /**
   * End current shift
   * @param {Object} data - { latitude, longitude, address, notes }
   * @returns {Promise} Completed shift
   */
  endShift: async (data = {}) => {
    const response = await api.post('/delivery-boy/shift/end', data);
    return response.data;
  },

  /**
   * Start a break
   * @returns {Promise} Shift with break started
   */
  startBreak: async () => {
    const response = await api.post('/delivery-boy/shift/break/start');
    return response.data;
  },

  /**
   * End break
   * @returns {Promise} Shift with break ended
   */
  endBreak: async () => {
    const response = await api.post('/delivery-boy/shift/break/end');
    return response.data;
  },

  /**
   * Get current active shift
   * @returns {Promise} Current shift or null
   */
  getCurrentShift: async () => {
    const response = await api.get('/delivery-boy/shift/current');
    return response.data;
  },

  /**
   * Get shift history
   * @param {Object} params - { page, limit, period, dateFrom, dateTo, status }
   * @returns {Promise} Shift history with pagination
   */
  getShiftHistory: async (params = {}) => {
    const response = await api.get('/delivery-boy/shift/history', { params });
    return response.data;
  },

  /**
   * Get shift statistics
   * @param {Object} params - { period, dateFrom, dateTo }
   * @returns {Promise} Shift stats
   */
  getShiftStats: async (params = {}) => {
    const response = await api.get('/delivery-boy/shift/stats', { params });
    return response.data;
  },

  /**
   * Get specific shift by ID
   * @param {string} shiftId - Shift ID
   * @returns {Promise} Shift details
   */
  getShiftById: async (shiftId) => {
    const response = await api.get(`/delivery-boy/shift/${shiftId}`);
    return response.data;
  },

  /**
   * Update shift notes
   * @param {string} shiftId - Shift ID
   * @param {string} notes - Notes to add
   * @returns {Promise} Updated shift
   */
  updateShiftNotes: async (shiftId, notes) => {
    const response = await api.patch(`/delivery-boy/shift/${shiftId}`, { notes });
    return response.data;
  },

  // ============================================
  // SUPPORT TICKETS
  // ============================================
  
  /**
   * Create support ticket
   * @param {Object} ticketData - { category, subject, description, priority, relatedOrderId }
   * @returns {Promise} Created ticket
   */
  createSupportTicket: async (ticketData) => {
    const response = await api.post('/delivery-boy/support/tickets', ticketData);
    return response.data;
  },

  /**
   * Get support tickets
   * @param {Object} params - Query params
   * @returns {Promise} Tickets list
   */
  getSupportTickets: async (params = {}) => {
    const response = await api.get('/delivery-boy/support/tickets', { params });
    return response.data;
  },

  /**
   * Get ticket details
   * @param {string} ticketId - Ticket ID
   * @returns {Promise} Ticket details
   */
  getTicketDetails: async (ticketId) => {
    const response = await api.get(`/delivery-boy/support/tickets/${ticketId}`);
    return response.data;
  },

  /**
   * Add reply to ticket
   * @param {string} ticketId - Ticket ID
   * @param {string} message - Reply message
   * @returns {Promise} Updated ticket
   */
  replyToTicket: async (ticketId, message) => {
    const response = await api.post(`/delivery-boy/support/tickets/${ticketId}/reply`, { message });
    return response.data;
  },

  // ============================================
  // EARNINGS
  // ============================================
  
  /**
   * Get earnings summary
   * @param {Object} params - { period: 'today' | 'week' | 'month' }
   * @returns {Promise} Earnings data
   */
  getEarnings: async (params = { period: 'today' }) => {
    // Stats endpoint returns earnings
    const response = await api.get('/delivery-boy/stats');
    return {
      today: response.data.earningsToday || 0,
      weekly: response.data.weeklyEarnings || 0,
      monthly: response.data.monthlyEarnings || 0
    };
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
      'order-placed': 'Order Placed',
      'order-accepted': 'Order Accepted',
      'out-for-pickup': 'Out for Pickup',
      'pickup-completed': 'Pickup Completed',
      'wash-in-progress': 'Wash in Progress',
      'wash-completed': 'Wash Completed',
      'drying': 'Drying',
      'quality-check': 'Quality Check',
      'out-for-delivery': 'Out for Delivery',
      'delivery-completed': 'Delivered',
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
      'order-accepted': 'out-for-pickup',
      'out-for-pickup': 'pickup-completed',
      'ready-for-delivery': 'out-for-delivery',
      'wash-completed': 'out-for-delivery',
      'drying': 'out-for-delivery',
      'quality-check': 'out-for-delivery',
      'out-for-delivery': 'delivery-completed'
    };
    return workflow[currentStatus] || null;
  },

  /**
   * Check if delivery boy can update to this status
   * @param {string} status - Status to check
   * @returns {boolean} True if delivery boy can update
   */
  canUpdateStatus: (status) => {
    const allowedStatuses = [
      'out-for-pickup',
      'pickup-completed',
      'out-for-delivery',
      'delivery-completed'
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
      'order-accepted': 'Start Pickup',
      'out-for-pickup': 'Mark Picked Up',
      'pickup-completed': 'Processing...',
      'ready-for-delivery': 'Start Delivery',
      'wash-completed': 'Start Delivery',
      'drying': 'Start Delivery',
      'quality-check': 'Start Delivery',
      'out-for-delivery': 'Confirm Delivery'
    };
    return texts[status] || null;
  },

  /**
   * Check if order requires OTP verification
   * @param {string} status - Order status
   * @returns {boolean} True if OTP required
   */
  requiresOTPVerification: (status) => {
    return status === 'out-for-delivery';
  },

  /**
   * Open Google Maps navigation
   * @param {Object|string} address - Address object or string
   */
  openMapsNavigation: (address) => {
    let addressString = '';
    if (typeof address === 'string') {
      addressString = address;
    } else if (address) {
      addressString = [
        address.street,
        address.city,
        address.state,
        address.zipCode
      ].filter(Boolean).join(', ');
    }
    if (addressString) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`, '_blank');
    }
  },

  /**
   * Call customer
   * @param {string} phone - Phone number
   */
  callCustomer: (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  }
};

export default deliveryBoyService;
