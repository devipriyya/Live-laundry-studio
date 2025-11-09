const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const { sendOrderStatusUpdateEmail, testEmailConfiguration } = require('../utils/emailService');
const Notification = require('../models/Notification');

// Test email configuration
router.post('/test-email', protect, isAdmin, async (req, res) => {
  try {
    const result = await testEmailConfiguration();
    if (result) {
      res.json({ message: 'Email configuration test passed!' });
    } else {
      res.status(500).json({ message: 'Email configuration test failed!' });
    }
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({ message: 'Failed to test email configuration', error: error.message });
  }
});

// Send test order status update email
router.post('/test-order-email', protect, isAdmin, async (req, res) => {
  try {
    const { order, status, serviceName } = req.body;
    
    // Validate input
    if (!order || !status || !serviceName) {
      return res.status(400).json({ message: 'Missing required fields: order, status, serviceName' });
    }
    
    // Send test email
    await sendOrderStatusUpdateEmail(order, status, serviceName);
    res.json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Failed to send test email', error: error.message });
  }
});

// Get notifications for a user
router.get('/user/:email', protect, async (req, res) => {
  try {
    const { email } = req.params;
    const { limit = 20, page = 1, read } = req.query;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Build query
    const query = { recipientEmail: email };
    
    // Filter by read status if specified
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Notification.countDocuments(query);
    
    res.json({
      notifications,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});

// Get unread notification count for a user
router.get('/user/:email/unread-count', protect, async (req, res) => {
  try {
    const { email } = req.params;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Get unread count
    const unreadCount = await Notification.countDocuments({
      recipientEmail: email,
      read: false
    });
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Failed to fetch unread count', error: error.message });
  }
});

// Mark a notification as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }
    
    // Update notification
    const notification = await Notification.findByIdAndUpdate(
      id,
      { 
        read: true,
        readAt: new Date()
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
});

// Mark all notifications as read for a user
router.patch('/user/:email/read-all', protect, async (req, res) => {
  try {
    const { email } = req.params;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Update all notifications for user
    const result = await Notification.updateMany(
      { 
        recipientEmail: email,
        read: false
      },
      { 
        read: true,
        readAt: new Date()
      }
    );
    
    res.json({ 
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read', error: error.message });
  }
});

// Delete a notification
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id) {
      return res.status(400).json({ message: 'Notification ID is required' });
    }
    
    // Delete notification
    const notification = await Notification.findByIdAndDelete(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
});

// Delete all notifications for a user
router.delete('/user/:email', protect, async (req, res) => {
  try {
    const { email } = req.params;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Delete all notifications for user
    const result = await Notification.deleteMany({ recipientEmail: email });
    
    res.json({ 
      message: `Deleted ${result.deletedCount} notifications`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting user notifications:', error);
    res.status(500).json({ message: 'Failed to delete notifications', error: error.message });
  }
});

// Create a notification (admin only)
router.post('/', protect, isAdmin, async (req, res) => {
  try {
    const { recipientEmail, type, priority, title, message, data, actionRequired, actionUrl, expiresAt } = req.body;
    
    // Validate required fields
    if (!recipientEmail || !type || !title || !message) {
      return res.status(400).json({ message: 'Recipient email, type, title, and message are required' });
    }
    
    // Create notification
    const notification = new Notification({
      recipientEmail,
      type,
      priority: priority || 'medium',
      title,
      message,
      data,
      actionRequired: actionRequired || false,
      actionUrl,
      expiresAt
    });
    
    await notification.save();
    
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
});

module.exports = router;