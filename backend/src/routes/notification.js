const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get notifications for a user (by email)
router.get('/user/:email', async (req, res) => {
  try {
    const { 
      read, 
      type, 
      priority,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = { recipientEmail: req.params.email };
    
    if (read !== undefined) {
      query.read = read === 'true';
    }
    if (type) {
      query.type = type;
    }
    if (priority) {
      query.priority = priority;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipientEmail: req.params.email, 
      read: false 
    });

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a notification
router.post('/', async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark all notifications as read for a user
router.patch('/user/:email/read-all', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { recipientEmail: req.params.email, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ 
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all notifications for a user
router.delete('/user/:email', async (req, res) => {
  try {
    const result = await Notification.deleteMany({ recipientEmail: req.params.email });
    
    res.json({ 
      message: 'All notifications deleted',
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread count
router.get('/user/:email/unread-count', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipientEmail: req.params.email, 
      read: false 
    });

    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
