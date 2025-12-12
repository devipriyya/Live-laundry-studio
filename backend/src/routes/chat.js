const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/auth');

// Get chat history for a specific room
router.get('/rooms/:roomId/messages', protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, before } = req.query;
    
    // Build query
    const query = { roomId };
    
    // If before timestamp is provided, get messages before that time
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }
    
    // Fetch messages
    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();
    
    // Reverse to show oldest first
    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.post('/messages/:messageId/read', protect, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if already marked as read by this user
    const alreadyRead = message.readBy.some(read => read.userId === userId);
    if (!alreadyRead) {
      message.readBy.push({
        userId,
        readAt: new Date()
      });
      await message.save();
    }
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread message count for a user
router.get('/unread-count', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // This would typically be implemented with a more efficient query
    // For now, we'll return a placeholder
    res.json({ unreadCount: 0 });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;