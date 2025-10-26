import React, { useState, useEffect, useRef } from 'react';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  ComputerDesktopIcon,
  PhoneIcon,
  VideoCameraIcon,
  PaperClipIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineAgents, setOnlineAgents] = useState(3);
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 1,
      text: "Hello! Welcome to WashLab support. How can I help you today?",
      sender: 'agent',
      timestamp: new Date(Date.now() - 300000),
      agentName: 'Sarah Johnson'
    }
  ];

  const quickReplies = [
    "Track my order",
    "Pricing information",
    "Schedule pickup",
    "Payment issues",
    "Service quality",
    "Delivery time"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (messageText = newMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses = {
        "Track my order": "I can help you track your order. Please provide your order ID and I'll get the latest status for you.",
        "Pricing information": "Our pricing varies by service type. Wash & Fold starts at $2.50/lb, Dry Cleaning at $8.99/item, and Steam Press at $3.99/item. Would you like detailed pricing for specific items?",
        "Schedule pickup": "I'd be happy to help you schedule a pickup. What's your preferred date and time? We offer same-day pickup for orders placed before 2 PM.",
        "Payment issues": "I understand you're having payment issues. Let me connect you with our billing specialist who can resolve this immediately.",
        "Service quality": "We take service quality very seriously. Could you please describe the issue you experienced? I'll make sure it's addressed promptly.",
        "Delivery time": "Our standard delivery time is 24-48 hours for regular service, 12-24 hours for express, and 4-6 hours for premium service. Which service are you interested in?"
      };

      const agentResponse = {
        id: Date.now() + 1,
        text: responses[messageText] || "Thank you for your message. Let me look into that for you. Is there anything specific you'd like to know about our laundry services?",
        sender: 'agent',
        timestamp: new Date(),
        agentName: 'Sarah Johnson'
      };

      setIsTyping(false);
      setMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ChatMessage = ({ message }) => (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-xs lg:max-w-md ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            message.sender === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {message.sender === 'user' ? (
              <UserIcon className="w-4 h-4" />
            ) : (
              <ComputerDesktopIcon className="w-4 h-4" />
            )}
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}>
          {message.sender === 'agent' && message.agentName && (
            <div className="text-xs font-medium text-gray-500 mb-1">{message.agentName}</div>
          )}
          <div className="text-sm">{message.text}</div>
          <div className={`text-xs mt-1 ${
            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );

  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="flex mr-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <ComputerDesktopIcon className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <div className="bg-gray-100 px-4 py-2 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        )}
        {!isOpen && onlineAgents > 0 && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {onlineAgents}
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">WashLab Support</h3>
                  <div className="flex items-center space-x-1 text-blue-100 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{onlineAgents} agents online</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 hover:bg-blue-500 rounded">
                  <PhoneIcon className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-blue-500 rounded">
                  <VideoCameraIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-blue-500 rounded"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 mb-2">Quick replies:</div>
              <div className="flex flex-wrap gap-1">
                {quickReplies.slice(0, 3).map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(reply)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <PaperClipIcon className="w-4 h-4" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                  <FaceSmileIcon className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Powered by WashLab Support • Average response time: 2 minutes
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSupport;
