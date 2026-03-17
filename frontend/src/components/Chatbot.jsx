import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserIcon,
  ComputerDesktopIcon,
  TruckIcon,
  InformationCircleIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionState, setSessionState] = useState('initial'); // initial, tracking, services, etc.
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      id: 1,
      text: "Hello! I'm your WashLab Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ];

  const quickReplies = [
    { label: "Track Order", value: "track_order" },
    { label: "View Services", value: "view_services" },
    { label: "Pricing", value: "pricing" },
    { label: "Contact Support", value: "support" }
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

  const handleAction = async (value) => {
    addMessage(value, 'user');
    setIsTyping(true);

    setTimeout(async () => {
      switch (value) {
        case 'track_order':
          addMessage("Please enter your Order ID (e.g., ORD-123456) to track your status.", 'bot');
          setSessionState('tracking');
          break;
        case 'view_services':
          addMessage("We offer Wash & Fold, Dry Cleaning, Steam Ironing, Stain Removal, Shoe Polishing, and Blanket Cleaning.", 'bot');
          addActionButtons([
            { label: "Book Now", action: () => window.location.href = '/dashboard/schedule' },
            { label: "Back to menu", action: () => handleAction('menu') }
          ]);
          break;
        case 'pricing':
          addMessage("Our pricing is transparent: Wash & Fold from ₹50, Dry Cleaning from ₹150, and Ironing from ₹10 per item. Check our Rate Card for details.", 'bot');
          addMessage("Would you like to see the full rate card?", 'bot');
          addActionButtons([
            { label: "View Rate Card", action: () => window.location.href = '/dashboard/rate' },
            { label: "Main Menu", action: () => handleAction('menu') }
          ]);
          break;
        case 'support':
          addMessage("You can reach us at support@washlab.com or call +91 98765 43210. Our team is available 24/7.", 'bot');
          break;
        case 'menu':
          addMessage("How else can I assist you?", 'bot');
          setSessionState('initial');
          break;
        default:
          addMessage("I'm sorry, I didn't quite get that. Could you please select an option or try again?", 'bot');
      }
      setIsTyping(false);
    }, 800);
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    }]);
  };

  const addActionButtons = (buttons) => {
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      type: 'actions',
      buttons,
      sender: 'bot'
    }]);
  };

  const handleTrackOrder = async (orderId) => {
    setIsTyping(true);
    try {
      const response = await axios.get(`http://localhost:5006/api/orders/track/${orderId}`);
      const order = response.data;
      
      const statusMsg = `Order #${order.orderNumber} Status: ${order.status.toUpperCase()}. \nEstimated Delivery: ${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Updating soon'}.`;
      addMessage(statusMsg, 'bot');
      
      if (order.statusHistory && order.statusHistory.length > 0) {
        const lastUpdate = order.statusHistory[order.statusHistory.length - 1];
        addMessage(`Latest update: ${lastUpdate.note || lastUpdate.status} at ${new Date(lastUpdate.timestamp).toLocaleString()}`, 'bot');
      }
    } catch (err) {
      addMessage("I couldn't find an order with that ID. Please check and try again.", 'bot');
    } finally {
      setIsTyping(false);
      setSessionState('initial');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    addMessage(userText, 'user');
    setInput('');

    if (sessionState === 'tracking') {
      await handleTrackOrder(userText);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        addMessage("Thank you for your message. Currently, I can help you best if you select one of our quick options below.", 'bot');
        setIsTyping(false);
      }, 800);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:shadow-cyan-500/50'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="w-7 h-7 text-white" />
        ) : (
          <div className="relative">
            <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9998] w-[380px] h-[550px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <ComputerDesktopIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">WashLab Helper</h3>
                <div className="flex items-center space-x-1.5 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-cyan-100 font-medium tracking-wide uppercase">AI Assistant Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'actions' ? (
                  <div className="flex flex-col space-y-2 mt-2">
                    {msg.buttons.map((btn, i) => (
                      <button
                        key={i}
                        onClick={btn.action}
                        className="px-4 py-2 bg-white border border-cyan-200 text-cyan-700 rounded-xl text-sm font-semibold hover:bg-cyan-50 transition-colors shadow-sm flex items-center justify-between group"
                      >
                        {btn.label}
                        <ChevronRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <div className={`text-[10px] mt-1.5 opacity-60 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {sessionState === 'initial' && messages.length <= 2 && (
            <div className="px-5 py-3 border-t border-gray-50 bg-white">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((qr) => (
                  <button
                    key={qr.value}
                    onClick={() => handleAction(qr.value)}
                    className="px-3 py-1.5 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-full border border-cyan-100 hover:bg-cyan-100 transition-colors"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-5 bg-white border-t border-gray-100">
            <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={sessionState === 'tracking' ? "Enter Order ID..." : "Type a message..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="ml-2 p-1.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-30 transition-all"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
