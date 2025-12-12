import React from 'react';

const QuickMessages = ({ onMessageSelect }) => {
  const quickMessages = [
    { id: 1, text: 'Arriving soon', category: 'Status' },
    { id: 2, text: 'Reached location', category: 'Status' },
    { id: 3, text: 'Package delivered successfully', category: 'Status' },
    { id: 4, text: 'Having trouble finding the address', category: 'Issue' },
    { id: 5, text: 'Customer not available at location', category: 'Issue' },
    { id: 6, text: 'Need assistance with delivery', category: 'Help' },
    { id: 7, text: 'Delay due to traffic', category: 'Status' },
    { id: 8, text: 'Order picked up', category: 'Status' }
  ];

  return (
    <div className="border-t border-gray-200 p-3 bg-gray-50">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Messages</h4>
      <div className="flex flex-wrap gap-2">
        {quickMessages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => onMessageSelect(msg.text)}
            className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-300 text-gray-700 transition-colors"
          >
            {msg.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickMessages;