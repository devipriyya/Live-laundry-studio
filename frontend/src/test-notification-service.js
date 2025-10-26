// Test script for notification service
import notificationService from './services/notificationService';

const testNotificationService = async () => {
  console.log('Testing notification service...');
  
  try {
    // Test getUnreadCount
    console.log('Testing getUnreadCount...');
    const unreadCount = await notificationService.getUnreadCount('demo@fabrico.com');
    console.log('Unread count:', unreadCount);
    
    // Test getUserNotifications
    console.log('Testing getUserNotifications...');
    const notifications = await notificationService.getUserNotifications('demo@fabrico.com', {
      limit: 5
    });
    console.log('Notifications:', notifications);
    
    console.log('Notification service test completed successfully!');
  } catch (error) {
    console.error('Error testing notification service:', error);
  }
};

// Run the test
testNotificationService();

export default testNotificationService;