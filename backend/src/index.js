require('dotenv').config({ path: '../.env' });
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const http = require('http');
const { Server } = require('socket.io');
const ChatMessage = require('./models/ChatMessage');

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const orderRoutes = require('./routes/order');
const profileRoutes = require('./routes/profile');
const invoiceRoutes = require('./routes/invoice');
const reviewRoutes = require('./routes/review');
const inventoryRoutes = require('./routes/inventory');
const notificationRoutes = require('./routes/notification');
const productRoutes = require('./routes/product');
const mlRoutes = require('./routes/mlRoutes');
const chatRoutes = require('./routes/chat');
const incidentRoutes = require('./routes/incident');
const locationRoutes = require('./routes/location');
const deliveryBoyRoutes = require('./routes/deliveryBoy');
const laundryStaffRoutes = require('./routes/laundryStaff');
const staffRoutes = require('./routes/staff');
const insuranceRoutes = require('./routes/insurance');
const assistantRoutes = require('./routes/assistant');
const loyaltyRoutes = require('./routes/loyalty');
const supportTicketRoutes = require('./routes/supportTicket');
const couponRoutes = require('./routes/coupon');
const advertisementRoutes = require('./routes/advertisement');
const lostItemRoutes = require('./routes/lostItem');
const upload = require('./middleware/upload');
const path = require('path');
// Connect to MongoDB
connectDB();
const app = express();
const server = http.createServer(app);

// ✅ Allow CORS for both local and production (Vercel)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://washlab-frontend.vercel.app' // <-- replace with your actual Vercel frontend URL
  ],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Image upload endpoint
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// ✅ Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://washlab-frontend.vercel.app'
    ],
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

// ✅ Store active users and rooms
const activeUsers = new Map(); // userId -> socketId
const chatRooms = new Map(); // roomId -> { participants: Set(userId), messages: [] }

// ✅ Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // ✅ Join chat room
  socket.on('join-room', (data) => {
    const { userId, userName, userType, roomId } = data;
    console.log(`User ${userName} (${userType}) joining room ${roomId}`);
    
    // Join the room
    socket.join(roomId);
    
    // Store user info
    activeUsers.set(userId, { socketId: socket.id, userName, userType });
    
    // Initialize room if not exists
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, { participants: new Set(), messages: [] });
    }
    
    // Add user to room participants
    chatRooms.get(roomId).participants.add(userId);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId, userName, userType });
    
    // Send room history to the user (fetch from database)
    ChatMessage.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean()
      .then(recentMessages => {
        // Convert to the format expected by the frontend
        const formattedMessages = recentMessages.reverse().map(msg => ({
          id: msg._id.toString(),
          roomId: msg.roomId,
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderType: msg.senderType,
          message: msg.message,
          timestamp: msg.timestamp.toISOString()
        }));
        
        socket.emit('room-history', formattedMessages);
      })
      .catch(error => {
        console.error('Error fetching room history:', error);
        socket.emit('room-history', []);
      });
  });
  
  // ✅ Handle new message
  socket.on('send-message', async (data) => {
    const { roomId, senderId, senderName, senderType, message, timestamp } = data;
    console.log(`Message in room ${roomId} from ${senderName}: ${message}`);
    
    try {
      // Save message to database
      const chatMessage = new ChatMessage({
        roomId,
        senderId,
        senderName,
        senderType,
        message,
        timestamp: timestamp || new Date()
      });
      
      const savedMessage = await chatMessage.save();
      
      // Create message object for real-time transmission
      const messageObj = {
        id: savedMessage._id.toString(),
        roomId: savedMessage.roomId,
        senderId: savedMessage.senderId,
        senderName: savedMessage.senderName,
        senderType: savedMessage.senderType,
        message: savedMessage.message,
        timestamp: savedMessage.timestamp.toISOString()
      };
      
      // Store message in memory for quick access
      if (chatRooms.has(roomId)) {
        chatRooms.get(roomId).messages.push(messageObj);
        
        // Keep only last 100 messages
        if (chatRooms.get(roomId).messages.length > 100) {
          chatRooms.get(roomId).messages.shift();
        }
      }
      
      // Broadcast message to room
      io.to(roomId).emit('receive-message', messageObj);
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });
  
  // ✅ Handle typing indicator
  socket.on('typing', (data) => {
    const { roomId, userId, userName, isTyping } = data;
    socket.to(roomId).emit('user-typing', { userId, userName, isTyping });
  });
  
  // ✅ Handle location updates
  socket.on('location-update', async (data) => {
    const { userId, orderId, latitude, longitude, accuracy, altitude, speed, heading, timestamp } = data;
    console.log(`Location update from user ${userId} for order ${orderId}`);
    
    try {
      // Import Location model here to avoid circular dependencies
      const Location = require('./models/Location');
      
      // Save location to database
      const location = new Location({
        deliveryBoyId: userId,
        orderId,
        latitude,
        longitude,
        accuracy,
        altitude,
        speed,
        heading,
        timestamp: timestamp || new Date()
      });
      
      await location.save();
      
      // Broadcast location to admin room for this order
      io.to(`order-${orderId}`).emit('location-updated', {
        userId,
        orderId,
        latitude,
        longitude,
        accuracy,
        altitude,
        speed,
        heading,
        timestamp: location.timestamp
      });
      
      console.log(`Location saved and broadcast for user ${userId}`);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  });
  
  // ✅ Handle delivery boy joining location tracking for an order
  socket.on('join-location-tracking', (data) => {
    const { userId, orderId } = data;
    const roomName = `order-${orderId}`;
    
    // Join the location tracking room
    socket.join(roomName);
    
    console.log(`User ${userId} joined location tracking for order ${orderId}`);
  });
  
  // ✅ Handle delivery boy leaving location tracking
  socket.on('leave-location-tracking', (data) => {
    const { userId, orderId } = data;
    const roomName = `order-${orderId}`;
    
    // Leave the location tracking room
    socket.leave(roomName);
    
    console.log(`User ${userId} left location tracking for order ${orderId}`);
  });
  
  // ✅ Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from active users
    let userIdToRemove = null;
    for (const [userId, userInfo] of activeUsers.entries()) {
      if (userInfo.socketId === socket.id) {
        userIdToRemove = userId;
        activeUsers.delete(userId);
        break;
      }
    }
    
    // Remove user from all rooms
    if (userIdToRemove) {
      for (const [roomId, room] of chatRooms.entries()) {
        if (room.participants.has(userIdToRemove)) {
          room.participants.delete(userIdToRemove);
          
          // Notify others in the room
          socket.to(roomId).emit('user-left', { userId: userIdToRemove });
          
          // Clean up empty rooms
          if (room.participants.size === 0) {
            chatRooms.delete(roomId);
          }
        }
      }
    }
  });
});

// ✅ Test route to check if backend works
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Route to test JWT generation
app.get('/api/test-token', (req, res) => {
  const testToken = jwt.sign({ id: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Test route - Generated test token:', testToken);
  res.json({ token: testToken });
});

// ✅ Route to test JWT verification
app.get('/api/verify-token', async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('Verify token route - Authorization header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  console.log('Verify token route - Token to verify:', token);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Verify token route - Decoded token:', decoded);
    
    // Try to find user
    const user = await User.findById(decoded.id).select('-password');
    console.log('Verify token route - User found:', user);
    
    res.json({ valid: true, user });
  } catch (error) {
    console.log('Verify token route - Verification error:', error);
    res.status(401).json({ valid: false, error: error.message });
  }
});

// ✅ All your routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/delivery-boy', deliveryBoyRoutes);
app.use('/api/laundry-staff', laundryStaffRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/support-tickets', supportTicketRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/advertisements', advertisementRoutes);
app.use('/api/assistants', assistantRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/lost-items', lostItemRoutes);
// ✅ Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ✅ Start the server (Render provides PORT)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
