require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

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

connectDB();
const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Test route to verify token generation
app.get('/api/test-token', (req, res) => {
  const testToken = jwt.sign({ id: 'test-user-id' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('Test route - Generated test token:', testToken);
  res.json({ token: testToken });
});

// Test route to verify token verification
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

// Root endpoint
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));