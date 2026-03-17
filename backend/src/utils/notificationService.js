/**
 * Notification Service - Handles creation and management of notifications
 * Specifically designed for delivery boy notifications
 */

const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a notification for a delivery boy
 * @param {Object} options - Notification options
 * @returns {Promise<Object>} - Created notification
 */
const createDeliveryBoyNotification = async ({
  deliveryBoyId,
  type,
  title,
  message,
  orderId = null,
  priority = 'medium',
  actionRequired = false,
  actionUrl = null,
  data = {}
}) => {
  try {
    // Get delivery boy details
    const deliveryBoy = await User.findById(deliveryBoyId).select('email name');
    
    if (!deliveryBoy) {
      throw new Error('Delivery boy not found');
    }

    const notification = new Notification({
      userId: deliveryBoyId,
      recipientEmail: deliveryBoy.email,
      recipientRole: 'deliveryBoy',
      type,
      title,
      message,
      orderId,
      priority,
      actionRequired,
      actionUrl,
      data: {
        ...data,
        deliveryBoyName: deliveryBoy.name
      },
      // Notifications expire after 30 days
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating delivery boy notification:', error);
    throw error;
  }
};

/**
 * Create notification for new order assignment
 * @param {Object} order - Order object
 * @param {String} deliveryBoyId - Delivery boy ID
 */
const notifyNewAssignment = async (order, deliveryBoyId) => {
  try {
    return await createDeliveryBoyNotification({
      deliveryBoyId,
      type: 'new-assignment',
      title: '🆕 New Order Assigned',
      message: `Order #${order.orderNumber} has been assigned to you. Customer: ${order.customerInfo?.name}`,
      orderId: order._id,
      priority: order.priority === 'high' ? 'urgent' : 'high',
      actionRequired: true,
      actionUrl: `/delivery-dashboard/order/${order._id}`,
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerInfo?.name,
        customerPhone: order.customerInfo?.phone,
        totalAmount: order.totalAmount,
        serviceType: order.items?.map(i => i.service).join(', '),
        address: order.customerInfo?.address
      }
    });
  } catch (error) {
    console.error('Error notifying new assignment:', error);
  }
};

/**
 * Create notification for order status update
 * @param {Object} order - Order object
 * @param {String} oldStatus - Previous status
 * @param {String} newStatus - New status
 */
const notifyStatusUpdate = async (order, oldStatus, newStatus) => {
  try {
    if (!order.deliveryBoyId) return;

    const statusLabels = {
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

    return await createDeliveryBoyNotification({
      deliveryBoyId: order.deliveryBoyId,
      type: 'order-status-update',
      title: '📦 Order Status Updated',
      message: `Order #${order.orderNumber} status changed to "${statusLabels[newStatus] || newStatus}"`,
      orderId: order._id,
      priority: newStatus === 'cancelled' ? 'high' : 'medium',
      actionUrl: `/delivery-dashboard/order/${order._id}`,
      data: {
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus,
        customerName: order.customerInfo?.name
      }
    });
  } catch (error) {
    console.error('Error notifying status update:', error);
  }
};

/**
 * Create notification for pickup reminder
 * @param {Object} order - Order object
 */
const notifyPickupReminder = async (order) => {
  try {
    if (!order.deliveryBoyId) return;

    return await createDeliveryBoyNotification({
      deliveryBoyId: order.deliveryBoyId,
      type: 'pickup-reminder',
      title: '⏰ Pickup Reminder',
      message: `Reminder: Order #${order.orderNumber} is scheduled for pickup today`,
      orderId: order._id,
      priority: 'high',
      actionRequired: true,
      actionUrl: `/delivery-dashboard/order/${order._id}`,
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerInfo?.name,
        customerPhone: order.customerInfo?.phone,
        pickupDate: order.pickupDate,
        address: order.customerInfo?.address
      }
    });
  } catch (error) {
    console.error('Error notifying pickup reminder:', error);
  }
};

/**
 * Create notification for delivery reminder
 * @param {Object} order - Order object
 */
const notifyDeliveryReminder = async (order) => {
  try {
    if (!order.deliveryBoyId) return;

    return await createDeliveryBoyNotification({
      deliveryBoyId: order.deliveryBoyId,
      type: 'delivery-reminder',
      title: '🚚 Delivery Reminder',
      message: `Reminder: Order #${order.orderNumber} is scheduled for delivery today`,
      orderId: order._id,
      priority: 'high',
      actionRequired: true,
      actionUrl: `/delivery-dashboard/order/${order._id}`,
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customerInfo?.name,
        customerPhone: order.customerInfo?.phone,
        deliveryDate: order.deliveryDate,
        address: order.customerInfo?.address
      }
    });
  } catch (error) {
    console.error('Error notifying delivery reminder:', error);
  }
};

/**
 * Create admin message notification for delivery boy
 * @param {String} deliveryBoyId - Delivery boy ID
 * @param {String} title - Message title
 * @param {String} message - Message content
 * @param {String} priority - Message priority
 */
const sendAdminMessage = async (deliveryBoyId, title, message, priority = 'medium') => {
  try {
    return await createDeliveryBoyNotification({
      deliveryBoyId,
      type: 'admin-message',
      title: `📢 ${title}`,
      message,
      priority,
      actionRequired: priority === 'urgent',
      data: {
        fromAdmin: true
      }
    });
  } catch (error) {
    console.error('Error sending admin message:', error);
  }
};

/**
 * Create broadcast notification for all delivery boys
 * @param {String} title - Message title
 * @param {String} message - Message content
 * @param {String} priority - Message priority
 */
const broadcastToDeliveryBoys = async (title, message, priority = 'medium') => {
  try {
    const deliveryBoys = await User.find({ role: 'deliveryBoy' }).select('_id');
    
    const notifications = await Promise.all(
      deliveryBoys.map(db => sendAdminMessage(db._id, title, message, priority))
    );
    
    return notifications.filter(n => n != null);
  } catch (error) {
    console.error('Error broadcasting to delivery boys:', error);
    throw error;
  }
};

/**
 * Get notifications for a delivery boy
 * @param {String} deliveryBoyId - Delivery boy ID
 * @param {Object} options - Query options
 */
const getDeliveryBoyNotifications = async (deliveryBoyId, options = {}) => {
  const { 
    page = 1, 
    limit = 20, 
    unreadOnly = false,
    type = null 
  } = options;

  try {
    let query = { userId: deliveryBoyId };
    
    if (unreadOnly) {
      query.read = false;
    }
    
    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('orderId', 'orderNumber status customerInfo.name')
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId: deliveryBoyId, read: false })
    ]);

    return {
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasMore: skip + notifications.length < total
      },
      unreadCount
    };
  } catch (error) {
    console.error('Error fetching delivery boy notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for verification)
 */
const markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {String} userId - User ID
 */
const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    );
    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for verification)
 */
const deleteNotification = async (notificationId, userId) => {
  try {
    const result = await Notification.findOneAndDelete({ _id: notificationId, userId });
    return result;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Delete all read notifications for a user
 * @param {String} userId - User ID
 */
const clearReadNotifications = async (userId) => {
  try {
    const result = await Notification.deleteMany({ userId, read: true });
    return result;
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    throw error;
  }
};

/**
 * Create a generic notification
 * @param {Object} options - Notification options
 * @returns {Promise<Object>} - Created notification
 */
const createNotification = async ({
  userId,
  recipientEmail,
  recipientRole = 'customer',
  type,
  title,
  message,
  orderId = null,
  priority = 'medium',
  actionRequired = false,
  actionUrl = null,
  data = {}
}) => {
  try {
    const notification = new Notification({
      userId,
      recipientEmail,
      recipientRole,
      type,
      title,
      message,
      orderId,
      priority,
      actionRequired,
      actionUrl,
      data,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Notify customer about order status update
 * @param {Object} order - Order object
 * @param {String} newStatus - New status
 */
const notifyCustomerOrderUpdate = async (order, newStatus) => {
  try {
    const statusLabels = {
      'order-placed': 'Order Placed',
      'order-accepted': 'Order Accepted',
      'out-for-pickup': 'Out for Pickup',
      'pickup-completed': 'Pickup Completed',
      'wash-in-progress': 'Washing Started',
      'wash-completed': 'Washing Completed',
      'drying': 'Drying',
      'ironing': 'Ironing',
      'quality-check': 'Quality Check',
      'ready-for-delivery': 'Ready for Delivery',
      'out-for-delivery': 'Out for Delivery',
      'delivery-completed': 'Delivered',
      'cancelled': 'Cancelled'
    };

    const statusIcons = {
      'order-placed': '📦',
      'pickup-completed': '🧺',
      'wash-in-progress': '🫧',
      'ready-for-delivery': '✨',
      'delivery-completed': '✅',
      'cancelled': '❌'
    };

    const icon = statusIcons[newStatus] || '📋';
    const label = statusLabels[newStatus] || newStatus;

    return await createNotification({
      userId: order.userId,
      recipientEmail: order.customerInfo?.email,
      recipientRole: 'customer',
      type: 'order',
      title: `${icon} Order Update`,
      message: `Your order #${order.orderNumber} status changed to "${label}"`,
      orderId: order._id,
      priority: newStatus === 'cancelled' || newStatus === 'delivery-completed' ? 'high' : 'medium',
      actionUrl: `/dashboard/track-order`,
      data: {
        orderNumber: order.orderNumber,
        newStatus
      }
    });
  } catch (error) {
    console.error('Error notifying customer order update:', error);
  }
};

/**
 * Notify customer about support ticket update
 * @param {Object} ticket - Support ticket object
 * @param {String} updateType - 'response' or 'resolution'
 */
const notifyCustomerTicketUpdate = async (ticket, updateType) => {
  try {
    const title = updateType === 'resolution' ? '✅ Ticket Resolved' : '💬 Support Response';
    const message = updateType === 'resolution' 
      ? `Your ticket "${ticket.subject}" has been resolved.` 
      : `You have a new response on your ticket "${ticket.subject}".`;

    return await createNotification({
      userId: ticket.userId,
      recipientEmail: ticket.userEmail,
      recipientRole: 'customer',
      type: 'support-ticket',
      title,
      message,
      priority: 'high',
      actionUrl: `/dashboard/feedback`,
      data: {
        ticketId: ticket.ticketId,
        updateType
      }
    });
  } catch (error) {
    console.error('Error notifying customer ticket update:', error);
  }
};

module.exports = {
  createNotification,
  createDeliveryBoyNotification,
  notifyNewAssignment,
  notifyCustomerOrderUpdate,
  notifyCustomerTicketUpdate,
  notifyStatusUpdate,
  notifyPickupReminder,
  notifyDeliveryReminder,
  sendAdminMessage,
  broadcastToDeliveryBoys,
  getDeliveryBoyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
};
