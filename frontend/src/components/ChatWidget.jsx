import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import QuickMessages from './QuickMessages';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ChatWidget = ({ orderId, customerName, onClose }) => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  const { 
    messages, 
    connected, 
    joinRoom, 
    sendMessage, 
    sendTyping,
    getTypingUsers 
  } = useChat();
  
  // Join the chat room when component mounts
  useEffect(() => {
    if (orderId) {
      joinRoom(orderId);
    }
  }, [orderId, joinRoom]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && orderId) {
      sendMessage(message, orderId);
      setMessage('');
      sendTyping(orderId, false);
    }
  };
  
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (orderId) {
      sendTyping(orderId, true);
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const typingUsers = getTypingUsers();
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Widget Header */}
      <div className="bg-white rounded-t-lg shadow-lg border border-gray-200">
        <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span className="font-medium">Order Chat</span>
            <span className="text-xs bg-blue-800 px-2 py-1 rounded-full">
              #{orderId?.substring(0, 8)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="h-80 flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.senderType === 'deliveryBoy' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        msg.senderType === 'deliveryBoy' 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : msg.senderType === 'admin'
                            ? 'bg-purple-500 text-white rounded-bl-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {msg.senderType === 'deliveryBoy' 
                            ? 'You' 
                            : msg.senderType === 'admin'
                              ? 'Admin'
                              : customerName || 'Customer'}
                        </span>
                        <span className="text-xs opacity-75">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="px-3 py-1 bg-gray-100 text-xs text-gray-500">
              {typingUsers.join(', ')} is typing...
            </div>
          )}
          
          {/* Quick Messages */}
          <QuickMessages onMessageSelect={(msg) => setMessage(msg)} />
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleTyping}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
              <button
                type="submit"
                disabled={!message.trim() || !connected}
                className={`self-end h-10 w-10 flex items-center justify-center rounded-lg ${
                  message.trim() && connected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;