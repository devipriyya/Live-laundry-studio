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
    // Test fetching notifications for demo user
    console.log('Searching for notifications with recipientEmail: demo@fabrico.com');
    
    // First, let's see all notifications to understand the data
    const allNotifications = await Notification.find({});
    console.log('All notifications in database:');
    console.log(JSON.stringify(allNotifications, null, 2));
    
    // Now test the specific query
    const notifications = await Notification.find({ recipientEmail: 'demo@fabrico.com' })
      .sort({ createdAt: -1 })
      .limit(5);
    
    console.log('Found notifications for demo@fabrico.com:');
    console.log(JSON.stringify(notifications, null, 2));
    
    // Test unread count
    const unreadCount = await Notification.countDocuments({ 
      recipientEmail: 'demo@fabrico.com', 
      read: false 
    });
    
    console.log(`Unread notifications for demo@fabrico.com: ${unreadCount}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error testing notifications API:', error);
    mongoose.connection.close();
  }
});