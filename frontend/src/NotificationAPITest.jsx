import React, { useState, useEffect } from 'react';

const NotificationAPITest = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://washlab.onrender.com/api';
      const response = await fetch(`${API_URL}/notifications/user/demo@fabrico.com`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Notification API Test</h1>
        
        {loading && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <p>Loading notifications...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Notifications:</h2>
          
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications found</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {notifications.map((notification) => (
                <div key={notification._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          onClick={fetchNotifications}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Notifications'}
        </button>
      </div>
    </div>
  );
};

export default NotificationAPITest;