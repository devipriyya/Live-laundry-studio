# ML Integration Example

This document shows how to integrate the machine learning recommendations into the existing dashboard.

## Backend Integration

### 1. Update the Dashboard Route

In your dashboard route controller, add ML recommendations:

```javascript
// backend/src/routes/dashboard.js (example)
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const KNNRecommender = require('../ml/KNNRecommender');

// This would be a singleton instance in a real application
let recommender = null;

// Initialize the recommender (in a real app, this would be done at startup)
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have authentication
    
    // Fetch user's orders
    const userOrders = await Order.find({ userId }).sort({ orderDate: -1 }).limit(10);
    
    // Get ML recommendations if model is trained
    let recommendations = [];
    if (recommender && recommender.isTrained) {
      recommendations = recommender.getRecommendations(userOrders, 3);
    }
    
    // Send dashboard data including recommendations
    res.json({
      user: req.user,
      orders: userOrders,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
```

### 2. Periodic Model Training

Set up a scheduled task to retrain the model with new data:

```javascript
// backend/scripts/scheduled-ml-training.js
const cron = require('cron');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const KNNRecommender = require('../src/ml/KNNRecommender');
const Order = require('../src/models/Order');
const connectDB = require('../src/config/db');

dotenv.config({ path: __dirname + '/../.env' });

// Create a global recommender instance
global.recommender = new KNNRecommender();

async function trainModel() {
  try {
    console.log('Starting scheduled ML model training...');
    
    // Connect to database
    await connectDB();
    
    // Fetch recent orders (last 30 days for efficiency)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const orders = await Order.find({
      orderDate: { $gte: thirtyDaysAgo }
    }).populate('userId', 'email name').lean();
    
    console.log(`Found ${orders.length} orders for training`);
    
    if (orders.length > 0) {
      // Enhance orders with user order count
      const userOrderCounts = {};
      orders.forEach(order => {
        const userId = order.userId?._id?.toString() || 'anonymous';
        userOrderCounts[userId] = (userOrderCounts[userId] || 0) + 1;
        order.userOrderCount = userOrderCounts[userId];
      });
      
      // Train the recommender
      const success = global.recommender.train(orders);
      
      if (success) {
        console.log('ML Model retrained successfully!');
      } else {
        console.log('Failed to retrain ML model');
      }
    } else {
      console.log('No orders found for training');
    }
    
    // Close database connection
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error in scheduled ML training:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
}

// Run training immediately when script starts
trainModel();

// Schedule training to run daily at 2 AM
const job = new cron.CronJob('0 2 * * *', trainModel);
job.start();

console.log('Scheduled ML training job started. Will run daily at 2 AM.');
```

## Frontend Integration

### 1. Update the Dashboard Component

```jsx
// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceRecommendations from '../components/ServiceRecommendations';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard');
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {dashboardData.user?.name}</span>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {dashboardData.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Recent Orders</h2>
              {dashboardData.orders?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Order #{order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ₹{order.totalAmount}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items[0]?.service || order.items[0]?.serviceType || 'Service'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No orders yet</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors">
                  New Order
                </button>
                <button className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors">
                  Schedule Pickup
                </button>
                <button className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors">
                  View Invoices
                </button>
                <button className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 transition-colors">
                  Track Order
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar with ML Recommendations */}
          <div className="space-y-8">
            <ServiceRecommendations 
              userOrderHistory={dashboardData.orders || []} 
            />
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">{dashboardData.orders?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-medium">
                    ₹{dashboardData.orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Favorite Service</span>
                  <span className="font-medium">
                    {getFavoriteService(dashboardData.orders || [])}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper function to get favorite service
const getFavoriteService = (orders) => {
  if (orders.length === 0) return 'None';
  
  const serviceCounts = {};
  orders.forEach(order => {
    if (order.items && order.items.length > 0) {
      const service = order.items[0].service || order.items[0].serviceType || 'Unknown';
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    }
  });
  
  return Object.entries(serviceCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
};

export default Dashboard;
```

## API Integration Example

### 1. Add ML Recommendations to Order Creation

```javascript
// backend/src/routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const KNNRecommender = require('../ml/KNNRecommender');

// Assuming you have access to the global recommender instance
router.post('/orders', async (req, res) => {
  try {
    // Create the order (existing logic)
    const order = new Order(req.body);
    await order.save();
    
    // Get recommendations for the user after order creation
    let recommendations = [];
    if (global.recommender && global.recommender.isTrained) {
      // Fetch user's recent orders
      const userOrders = await Order.find({ 
        userId: order.userId 
      }).sort({ orderDate: -1 }).limit(10);
      
      recommendations = global.recommender.getRecommendations(userOrders, 3);
    }
    
    res.status(201).json({
      order,
      recommendations,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});
```

## Testing the Integration

### 1. Manual Testing

You can test the integration by:

1. Starting the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Training the model with real data:
   ```bash
   cd backend
   npm run train-ml
   ```

3. Checking the model status:
   ```bash
   curl http://localhost:5000/api/ml/status
   ```

4. Making a prediction:
   ```bash
   curl -X POST http://localhost:5000/api/ml/predict \
     -H "Content-Type: application/json" \
     -d '{"userFeatures": [5, 1500, 1, 1, 3]}'
   ```

### 2. Automated Testing

Create a test file to verify the integration:

```javascript
// backend/tests/ml-integration.test.js
const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const Order = require('../src/models/Order');

describe('ML Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_MONGODB_URI);
  });

  afterAll(async () => {
    // Clean up and close database connection
    await Order.deleteMany({});
    await mongoose.connection.close();
  });

  test('should get ML model status', async () => {
    const response = await request(app)
      .get('/api/ml/status')
      .expect(200);
    
    expect(response.body).toHaveProperty('isTrained');
    expect(response.body).toHaveProperty('message');
  });

  test('should train ML model with sample data', async () => {
    const sampleOrders = [
      {
        userOrderCount: 5,
        totalAmount: 1200,
        orderDate: new Date(),
        items: [{ service: 'washAndPress' }]
      }
    ];

    const response = await request(app)
      .post('/api/ml/train')
      .send({ orders: sampleOrders })
      .expect(200);
    
    expect(response.body).toHaveProperty('message', 'Model trained successfully');
  });

  test('should get recommendations after training', async () => {
    const userHistory = [
      {
        userOrderCount: 3,
        totalAmount: 1300,
        orderDate: new Date(),
        items: [{ service: 'washAndPress' }]
      }
    ];

    const response = await request(app)
      .post('/api/ml/recommend')
      .send({ userOrderHistory: userHistory })
      .expect(200);
    
    expect(response.body).toHaveProperty('recommendations');
  });
});
```

## Deployment Considerations

### 1. Environment Variables

Add ML-related environment variables to your [.env](file:///c:/Users/User/fabrico/backend/.env) file:

```env
# ML Configuration
ML_TRAINING_SCHEDULE=0 2 * * *  # Daily at 2 AM
ML_TRAINING_DAYS=30             # Train with last 30 days of data
ML_KNN_K=3                      # K value for KNN algorithm
```

### 2. Performance Optimization

For better performance in production:

1. Cache recommendations for users
2. Use a more efficient algorithm for large datasets
3. Implement incremental learning
4. Add monitoring for model performance

### 3. Monitoring

Add logging to monitor ML performance:

```javascript
// backend/src/ml/KNNRecommender.js
const winston = require('winston');

class KNNRecommender {
  
  train(orders) {
    try {
      const startTime = Date.now();
      const { trainingData, labels } = this.prepareTrainingData(orders);
      
      if (trainingData.length === 0 || labels.length === 0) {
        winston.warn('No training data available for KNN recommender');
        return false;
      }
      
      this.knn = new KNN(trainingData, labels, { k: 3 });
      this.isTrained = true;
      
      const trainingTime = Date.now() - startTime;
      winston.info(`KNN Recommender trained successfully with ${trainingData.length} samples in ${trainingTime}ms`);
      
      return true;
    } catch (error) {
      winston.error('Error training KNN Recommender:', error);
      return false;
    }
  }
}
```

This integration example shows how to incorporate ML recommendations into your existing laundry service application, providing personalized service suggestions to users based on their order history.