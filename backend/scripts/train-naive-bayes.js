const mongoose = require('mongoose');
const dotenv = require('dotenv');
const NaiveBayesClassifier = require('../src/ml/NaiveBayesClassifier');

// Load environment variables
dotenv.config({ path: __dirname + '/../.env' });

// Import models
require('../src/models/User');
const Order = require('../src/models/Order');

// MongoDB connection
const connectDB = require('../src/config/db');

async function trainNaiveBayesModel() {
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
    
    // Initialize and train the Naive Bayes classifier
    const classifier = new NaiveBayesClassifier();
    const success = classifier.train(orders);
    
    if (success) {
      console.log('Naive Bayes model trained successfully!');
      
      // Test with a sample user
      const sampleUserOrders = orders.slice(0, 5);
      const prediction = classifier.predict(sampleUserOrders);
      console.log('Sample prediction:', prediction);
      
      // Show prediction probabilities
      const probabilities = classifier.getPredictionProbabilities(sampleUserOrders);
      console.log('Prediction probabilities:');
      probabilities.forEach(prob => {
        console.log(`  ${prob.service}: ${(prob.probability * 100).toFixed(2)}%`);
      });
    } else {
      console.log('Failed to train Naive Bayes model');
    }
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error training Naive Bayes model:', error);
    // Close database connection even if there's an error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the training
trainNaiveBayesModel();