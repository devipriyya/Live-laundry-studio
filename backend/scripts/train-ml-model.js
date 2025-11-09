const mongoose = require('mongoose');
const dotenv = require('dotenv');
const KNNRecommender = require('../src/ml/KNNRecommender');

// Load environment variables
dotenv.config({ path: __dirname + '/../.env' });

// Import models (ensure both User and Order models are imported)
require('../src/models/User');
const Order = require('../src/models/Order');

// MongoDB connection
const connectDB = require('../src/config/db');

async function trainModel() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');
    
    // Fetch all orders
    console.log('Fetching orders from database...');
    const orders = await Order.find({})
      .populate('userId', 'email name')
      .lean();
    
    console.log(`Found ${orders.length} orders`);
    
    if (orders.length === 0) {
      console.log('No orders found. Skipping training.');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    // Enhance orders with user order count
    const userOrderCounts = {};
    orders.forEach(order => {
      const userId = order.userId?._id?.toString() || 'anonymous';
      userOrderCounts[userId] = (userOrderCounts[userId] || 0) + 1;
      order.userOrderCount = userOrderCounts[userId];
    });
    
    // Initialize and train the recommender
    const recommender = new KNNRecommender();
    const success = recommender.train(orders);
    
    if (success) {
      console.log('Model trained successfully!');
      
      // Test with a sample user
      const sampleUserOrders = orders.slice(0, 5);
      const recommendations = recommender.getRecommendations(sampleUserOrders, 3);
      console.log('Sample recommendations:', recommendations);
    } else {
      console.log('Failed to train model');
    }
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error training model:', error);
    // Close database connection even if there's an error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the training
trainModel();