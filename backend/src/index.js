require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const orderRoutes = require('./routes/order');
const profileRoutes = require('./routes/profile');
const invoiceRoutes = require('./routes/invoice');
const reviewRoutes = require('./routes/review');
const inventoryRoutes = require('./routes/inventory');
const notificationRoutes = require('./routes/notification');

connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
