import React, { useState, useEffect } from 'react';
import notificationService from './services/notificationService';

const TestNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching notifications for demo@fabrico.com');
      
      // Get unread count
      const count = await notificationService.getUnreadCount('demo@fabrico.com');
      console.log('Unread count:', count);
      setUnreadCount(count);
      
      // Get notifications
      const notificationData = await notificationService.getUserNotifications('demo@fabrico.com', {
        limit: 5
      });
      console.log('Notifications data:', notificationData);
      setNotifications(notificationData.notifications || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testNotifications();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notification Service Test</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <p><strong>Unread Count:</strong> {unreadCount}</p>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Notifications:</h2>
        {notifications.length === 0 ? (
          <p>No notifications found</p>
        ) : (
          <ul className="border rounded p-4">
            {notifications.map((notification) => (
              <li key={notification._id} className="mb-2 p-2 border-b">
                <p><strong>Title:</strong> {notification.title}</p>
                <p><strong>Message:</strong> {notification.message}</p>
                <p><strong>Read:</strong> {notification.read ? 'Yes' : 'No'}</p>
                <p><strong>Created:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <button 
        onClick={testNotifications}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refresh Notifications
      </button>
    </div>
  );
};

export default TestNotifications;