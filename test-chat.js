const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:5000');

// Test data
const testUser1 = {
  userId: 'user1',
  userName: 'Delivery Boy',
  userType: 'deliveryBoy'
};

const testUser2 = {
  userId: 'user2',
  userName: 'Admin',
  userType: 'admin'
};

const testRoomId = 'test-room-123';

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to server');
  
  // Join room
  socket.emit('join-room', {
    ...testUser1,
    roomId: testRoomId
  });
  
  // Send a test message after joining
  setTimeout(() => {
    socket.emit('send-message', {
      roomId: testRoomId,
      senderId: testUser1.userId,
      senderName: testUser1.userName,
      senderType: testUser1.userType,
      message: 'Hello from delivery boy!',
      timestamp: new Date().toISOString()
    });
  }, 1000);
});

// Listen for messages
socket.on('receive-message', (message) => {
  console.log('Received message:', message);
});

// Listen for room history
socket.on('room-history', (history) => {
  console.log('Room history:', history);
});

// Listen for user joined
socket.on('user-joined', (data) => {
  console.log('User joined:', data);
});

// Listen for user typing
socket.on('user-typing', (data) => {
  console.log('User typing:', data);
});

// Simulate another user joining and sending a message
setTimeout(() => {
  const socket2 = io('http://localhost:5000');
  
  socket2.on('connect', () => {
    console.log('Second user connected');
    
    // Join room
    socket2.emit('join-room', {
      ...testUser2,
      roomId: testRoomId
    });
    
    // Send a message
    setTimeout(() => {
      socket2.emit('send-message', {
        roomId: testRoomId,
        senderId: testUser2.userId,
        senderName: testUser2.userName,
        senderType: testUser2.userType,
        message: 'Hello from admin!',
        timestamp: new Date().toISOString()
      });
    }, 1000);
  });
  
  socket2.on('receive-message', (message) => {
    console.log('Second user received message:', message);
  });
}, 3000);