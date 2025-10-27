const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');
const { sendOrderStatusUpdateEmail, testEmailConfiguration } = require('../utils/emailService');

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

module.exports = router;