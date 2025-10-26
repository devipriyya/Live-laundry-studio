const mongoose = require('mongoose');
const Notification = require('./src/models/Notification');

// Use the same MongoDB connection as the backend
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB Atlas');

  try {
    // Sample notifications
    const sampleNotifications = [
      {
        recipientEmail: 'demo@fabrico.com',
        type: 'order',
        priority: 'high',
        title: 'Order Confirmation',
        message: 'Your order #ORD-001 has been confirmed and is being processed.',
        read: false
      },
      {
        recipientEmail: 'demo@fabrico.com',
        type: 'delivery',
        priority: 'medium',
        title: 'Out for Delivery',
        message: 'Your order #ORD-001 is out for delivery and will arrive today between 2-4 PM.',
        read: false
      },
      {
        recipientEmail: 'demo@fabrico.com',
        type: 'payment',
        priority: 'low',
        title: 'Payment Successful',
        message: 'Your payment of ₹24.99 for order #ORD-001 has been processed successfully.',
        read: true
      },
      {
        recipientEmail: 'demo@fabrico.com',
        type: 'promotion',
        priority: 'medium',
        title: 'Special Offer',
        message: 'Get 20% off on your next order! Use code: SAVE20 at checkout.',
        read: false
      }
    ];

    // Clear existing notifications for demo user
    await Notification.deleteMany({ recipientEmail: 'demo@fabrico.com' });
    console.log('Cleared existing notifications for demo user');

    // Create new notifications
    for (const notificationData of sampleNotifications) {
      const notification = new Notification(notificationData);
      await notification.save();
    }

    console.log('Sample notifications created successfully');

    // Get unread count
    const unreadCount = await Notification.countDocuments({ 
      recipientEmail: 'demo@fabrico.com', 
      read: false 
    });
    console.log(`Unread notifications: ${unreadCount}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating sample notifications:', error);
    mongoose.connection.close();
  }
});