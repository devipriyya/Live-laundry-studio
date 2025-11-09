const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DecisionTreeClassifier = require('../src/ml/DecisionTreeClassifier');

// Load environment variables
dotenv.config({ path: __dirname + '/../.env' });

// Import models
require('../src/models/User');
const User = require('../src/models/User');
const Order = require('../src/models/Order');

// MongoDB connection
const connectDB = require('../src/config/db');

async function trainDecisionTree() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');
    
    // Fetch all users with their order history
    console.log('Fetching users and orders from database...');
    
    // Get all users
    const users = await User.find({}).lean();
    console.log(`Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('No users found. Skipping training.');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    // Get all orders
    const orders = await Order.find({}).lean();
    console.log(`Found ${orders.length} orders`);
    
    // Create customer data for training
    const customerDataArray = users.map(user => {
      // Get user's orders
      const userOrders = orders.filter(order => 
        order.userId && order.userId.toString() === user._id.toString()
      );
      
      // Calculate features
      const orderFrequency = userOrders.length;
      const avgOrderValue = orderFrequency > 0 
        ? userOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / orderFrequency 
        : 0;
      
      // Days since last order
      let daysSinceLastOrder = 365; // Default to 1 year
      if (userOrders.length > 0) {
        const lastOrder = userOrders.reduce((latest, order) => {
          const orderDate = new Date(order.createdAt || order.orderDate);
          const latestDate = new Date(latest.createdAt || latest.orderDate);
          return orderDate > latestDate ? order : latest;
        });
        const today = new Date();
        const lastOrderDate = new Date(lastOrder.createdAt || lastOrder.orderDate);
        daysSinceLastOrder = Math.ceil((today - lastOrderDate) / (1000 * 60 * 60 * 24));
      }
      
      // Service variety - count of unique services used
      const servicesUsed = new Set();
      userOrders.forEach(order => {
        if (order.items) {
          order.items.forEach(item => {
            const service = item.service || item.serviceType || 'washAndPress';
            servicesUsed.add(service);
          });
        }
      });
      const serviceVariety = servicesUsed.size;
      
      // Satisfaction score (average of ratings)
      let satisfactionScore = 3; // Default to 3/5
      const ratings = userOrders
        .filter(order => order.rating !== undefined)
        .map(order => order.rating);
      if (ratings.length > 0) {
        satisfactionScore = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      }
      
      // Referral count (simplified - assuming a referral field exists)
      const referralCount = user.referralCount || 0;
      
      // Discount usage (count of orders with discount)
      const discountUsage = userOrders.filter(order => 
        (order.discountAmount && order.discountAmount > 0) || 
        (order.couponCode && order.couponCode.length > 0)
      ).length;
      
      // Complaint count (simplified - assuming a complaints field exists)
      const complaintCount = user.complaintCount || 0;
      
      // Segment (this would typically be determined by business logic or existing data)
      // For training purposes, we'll create synthetic segments based on features
      let segment = 'regular';
      if (orderFrequency > 10 && avgOrderValue > 2000) {
        segment = 'premium';
      } else if (orderFrequency > 5 && avgOrderValue > 1000) {
        segment = 'regular';
      } else if (orderFrequency > 0) {
        segment = 'budget';
      } else {
        segment = 'inactive';
      }
      
      return {
        userId: user._id,
        orderFrequency,
        avgOrderValue,
        daysSinceLastOrder,
        serviceVariety,
        satisfactionScore,
        referralCount,
        discountUsage,
        complaintCount,
        segment
      };
    });
    
    // Initialize and train the Decision Tree classifier
    const classifier = new DecisionTreeClassifier();
    const success = classifier.train(customerDataArray);
    
    if (success) {
      console.log('Decision Tree model trained successfully!');
      
      // Test with a sample user
      const sampleCustomer = customerDataArray[0];
      const prediction = classifier.predict(sampleCustomer);
      console.log('Sample prediction:', prediction);
      
      // Show feature importance
      const importance = classifier.getFeatureImportance();
      console.log('Feature importance:', importance);
    } else {
      console.log('Failed to train Decision Tree model');
    }
    
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error training Decision Tree model:', error);
    // Close database connection even if there's an error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the training
trainDecisionTree();