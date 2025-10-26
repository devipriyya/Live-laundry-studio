import React, { useState, useEffect } from 'react';

const NotificationTest = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  
  // Sample notifications for testing
  const sampleNotifications = [
    {
      id: 1,
      title: 'Order Confirmation',
      message: 'Your order #ORD-001 has been confirmed and is being processed.',
      read: false,
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Out for Delivery',
      message: 'Your order #ORD-001 is out for delivery and will arrive today between 2-4 PM.',
      read: false,
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'Special Offer',
      message: 'Get 20% off on your next order! Use code: SAVE20 at checkout.',
      read: false,
      createdAt: new Date()
    }
  ];

  const toggleDropdown = () => {
    console.log('Toggle dropdown called, current state:', showDropdown);
    setShowDropdown(!showDropdown);
    console.log('New state:', !showDropdown);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Notification System Test</h1>
        
        <div className="mb-6">
          <p className="mb-4">This is a simple test to verify that the notification dropdown works correctly.</p>
          <p>Click the bell icon below to test the dropdown functionality:</p>
        </div>
        
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      Mark all as read
                    </button>
                  )}
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {sampleNotifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  sampleNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {notification.createdAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-3 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            If clicking the bell icon shows the dropdown, then the UI is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;