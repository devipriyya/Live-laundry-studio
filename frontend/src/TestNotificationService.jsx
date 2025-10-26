import React, { useState, useEffect } from 'react';
import notificationService from './services/notificationService';

const TestNotificationService = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testService = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('Testing notification service...');
      
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
      
      setResult({
        unreadCount,
        notifications: notifications.notifications,
        total: notifications.total,
        unreadCountFromResponse: notifications.unreadCount
      });
      
      console.log('Notification service test completed successfully!');
    } catch (err) {
      console.error('Error testing notification service:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testService();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notification Service Test</h1>
      
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          <p>Loading...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
          <p><strong>Unread Count:</strong> {result.unreadCount}</p>
          <p><strong>Total Notifications:</strong> {result.total}</p>
          <p><strong>Unread Count (from response):</strong> {result.unreadCountFromResponse}</p>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Notifications:</h3>
          {result.notifications && result.notifications.length > 0 ? (
            <ul className="border rounded p-4 bg-white">
              {result.notifications.map((notification) => (
                <li key={notification._id} className="mb-2 p-2 border-b">
                  <p><strong>Title:</strong> {notification.title}</p>
                  <p><strong>Message:</strong> {notification.message}</p>
                  <p><strong>Read:</strong> {notification.read ? 'Yes' : 'No'}</p>
                  <p><strong>Created:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications found</p>
          )}
        </div>
      )}
      
      <button 
        onClick={testService}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Notification Service'}
      </button>
    </div>
  );
};

export default TestNotificationService;