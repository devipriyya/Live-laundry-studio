import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

const useAuth = () => {
  return useContext(AuthContext);
};

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [typingUsers, setTypingUsers] = useState({});
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Initialize socket connection
  useEffect(() => {
    if (!user) return;
    
    const newSocket = io(API_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });
    
    newSocket.on('receive-message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });
    
    newSocket.on('room-history', (history) => {
      console.log('Received room history:', history);
      setMessages(history);
    });
    
    newSocket.on('user-typing', (data) => {
      const { userId, userName, isTyping } = data;
      setTypingUsers(prev => {
        const newTyping = { ...prev };
        if (isTyping) {
          newTyping[userId] = userName;
        } else {
          delete newTyping[userId];
        }
        return newTyping;
      });
    });
    
    newSocket.on('user-joined', (data) => {
      console.log('User joined room:', data);
    });
    
    newSocket.on('user-left', (data) => {
      console.log('User left room:', data);
    });
    
    setSocket(newSocket);
    
    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user, API_URL]);
  
  // Join a chat room
  const joinRoom = (roomId) => {
    if (!socket || !user) return;
    
    setActiveRoom(roomId);
    setMessages([]);
    
    socket.emit('join-room', {
      userId: user.uid || user.id,
      userName: user.name,
      userType: user.role,
      roomId
    });
  };
  
  // Send a message
  const sendMessage = (message, roomId) => {
    if (!socket || !user || !message.trim()) return;
    
    const messageData = {
      roomId: roomId || activeRoom,
      senderId: user.uid || user.id,
      senderName: user.name,
      senderType: user.role,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    socket.emit('send-message', messageData);
  };
  
  // Send typing indicator
  const sendTyping = (roomId, isTyping) => {
    if (!socket || !user) return;
    
    socket.emit('typing', {
      roomId: roomId || activeRoom,
      userId: user.uid || user.id,
      userName: user.name,
      isTyping
    });
  };
  
  // Get typing users except self
  const getTypingUsers = () => {
    if (!user) return [];
    return Object.entries(typingUsers)
      .filter(([userId]) => userId !== (user.uid || user.id))
      .map(([, userName]) => userName);
  };
  
  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  const value = {
    socket,
    messages,
    activeRoom,
    typingUsers,
    connected,
    joinRoom,
    sendMessage,
    sendTyping,
    getTypingUsers,
    clearMessages
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};