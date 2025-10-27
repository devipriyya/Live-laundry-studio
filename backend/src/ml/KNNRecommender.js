const KNN = require('ml-knn');
const path = require('path');

class KNNRecommender {
  constructor() {
    this.knn = null;
    this.isTrained = false;
    this.serviceFeatures = {};
    this.serviceTypes = [
      'washAndPress',
      'dryCleaning',
      'steamPress',
      'stainRemoval',
      'shoeCare'
    ];
  }

  // Prepare training data based on user order history
  prepareTrainingData(orders) {
    // Feature engineering: Convert orders to feature vectors
    const trainingData = [];
    const labels = []; // Service types
    
    orders.forEach(order => {
      // Extract features from order
      const features = this.extractFeatures(order);
      trainingData.push(features);
      
      // Use service type as label for recommendation
      if (order.items && order.items.length > 0) {
        const serviceType = order.items[0].service || order.items[0].serviceType || 'washAndPress';
        const labelIndex = this.serviceTypes.indexOf(serviceType);
        labels.push(labelIndex === -1 ? 1 : labelIndex); // Default to washAndPress if not found
      }
    });
    
    return { trainingData, labels };
  }

  // Extract features from an order
  extractFeatures(order) {
    // Features could include:
    // 1. Order frequency (normalized)
    // 2. Average order value (normalized)
    // 3. Preferred time of day (morning/afternoon/evening)
    // 4. Preferred service category
    // 5. Days since last order
    
    const features = [
      (order.userOrderCount || 1) / 50, // Frequency (normalized)
      (order.totalAmount || 0) / 5000,  // Order value (normalized)
      this.getTimeOfDayFeature(order.orderDate || order.createdAt) / 2, // Time preference (normalized)
      this.getServiceCategoryFeature(order) / 5, // Service preference (normalized)
      Math.min(this.getDaysSinceLastOrder(order.orderDate || order.createdAt) / 365, 1) // Recency (normalized)
    ];
    
    return features;
  }

  getTimeOfDayFeature(date) {
    if (!date) return 0;
    const hour = new Date(date).getHours();
    if (hour < 12) return 0; // Morning
    if (hour < 18) return 1; // Afternoon
    return 2; // Evening
  }

  getServiceCategoryFeature(order) {
    if (!order.items || order.items.length === 0) return 1; // Default to washAndPress
    
    // Extract service type from the first item
    const item = order.items[0];
    const serviceType = item.service || item.serviceType || 'washAndPress';
    
    const index = this.serviceTypes.indexOf(serviceType);
    return index === -1 ? 1 : index; // Default to washAndPress if not found
  }

  getDaysSinceLastOrder(order) {
    if (!order.createdAt) return 30; // Default to 30 days
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    const diffTime = Math.abs(today - orderDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Train the KNN model
  train(orders) {
    try {
      const { trainingData, labels } = this.prepareTrainingData(orders);
      
      if (trainingData.length === 0 || labels.length === 0) {
        console.warn('No training data available for KNN recommender');
        return false;
      }
      
      // Initialize KNN with k=3
      this.knn = new KNN(trainingData, labels, { k: 3 });
      this.isTrained = true;
      
      console.log('KNN Recommender trained successfully with', trainingData.length, 'samples');
      return true;
    } catch (error) {
      console.error('Error training KNN Recommender:', error);
      return false;
    }
  }

  // Get recommendations for a specific user
  getRecommendations(userOrderHistory, k = 3) {
    if (!this.isTrained) {
      console.warn('Model not trained yet');
      // Return default recommendations for new users
      return [
        { service: 'washAndPress', confidence: 0.8 },
        { service: 'dryCleaning', confidence: 0.6 },
        { service: 'shoeCare', confidence: 0.4 }
      ];
    }
    
    try {
      // Extract features from user's order history
      const userFeatures = this.extractUserFeatures(userOrderHistory);
      
      // Get neighbors and distances for better recommendations
      const neighbors = this.getNeighbors(userFeatures, k);
      
      // Calculate weighted recommendations based on distances
      const recommendations = this.calculateWeightedRecommendations(neighbors);
      
      return recommendations.slice(0, k);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Return default recommendations in case of error
      return [
        { service: 'washAndPress', confidence: 0.8 },
        { service: 'dryCleaning', confidence: 0.6 },
        { service: 'shoeCare', confidence: 0.4 }
      ];
    }
  }

  // Get neighbors and distances for a user
  getNeighbors(userFeatures, k = 3) {
    if (!this.isTrained || !this.knn) {
      return [];
    }
    
    try {
      // Get k nearest neighbors with distances
      const neighbors = this.knn.knn([userFeatures], k);
      return neighbors[0] || []; // Return the first (and only) result
    } catch (error) {
      console.error('Error getting neighbors:', error);
      return [];
    }
  }

  // Calculate weighted recommendations based on neighbor distances
  calculateWeightedRecommendations(neighbors) {
    if (!neighbors || neighbors.length === 0) {
      return [];
    }
    
    // Count service occurrences with distance weighting
    const serviceScores = {};
    
    neighbors.forEach(neighbor => {
      const { label, distance } = neighbor;
      const serviceType = this.serviceTypes[label] || 'washAndPress';
      const weight = 1 / (1 + distance); // Weight inversely proportional to distance
      
      if (!serviceScores[serviceType]) {
        serviceScores[serviceType] = 0;
      }
      serviceScores[serviceType] += weight;
    });
    
    // Convert to array and sort by score
    const recommendations = Object.entries(serviceScores)
      .map(([service, score]) => ({
        service,
        confidence: Math.min(score, 1.0) // Cap confidence at 1.0
      }))
      .sort((a, b) => b.confidence - a.confidence);
    
    return recommendations;
  }

  // Predict recommended service for a user
  predict(userFeatures) {
    if (!this.isTrained || !this.knn) {
      console.warn('KNN model is not trained yet');
      return 'washAndPress'; // Default service
    }
    
    try {
      // Make sure userFeatures is an array
      if (!Array.isArray(userFeatures)) {
        throw new Error('User features must be an array');
      }
      
      console.log('Making prediction with features:', userFeatures);
      
      // The ml-knn predict method expects an array of feature arrays
      const prediction = this.knn.predict([userFeatures]);
      console.log('Prediction result:', prediction);
      
      // Check if we got a valid prediction
      if (prediction && prediction.length > 0 && prediction[0] !== undefined) {
        const serviceIndex = prediction[0];
        return this.serviceTypes[serviceIndex] || 'washAndPress';
      }
      
      // If no prediction, return a default service
      console.log('No neighbors found, returning default service');
      return 'washAndPress'; // Default service
    } catch (error) {
      console.error('Error predicting with KNN Recommender:', error);
      // Return a default service in case of error
      return 'washAndPress';
    }
  }

  // Extract features from user's order history
  extractUserFeatures(orderHistory) {
    if (!orderHistory || orderHistory.length === 0) {
      // Return default features for new users
      return [1/50, 0, 1/2, 1/5, 30/365]; // Low frequency, no spending, midday preference, washAndPress, 30 days
    }
    
    // Calculate average features from user history
    const totalOrders = orderHistory.length;
    const totalAmount = orderHistory.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgAmount = totalAmount / totalOrders;
    
    // Get most common service type
    const serviceCounts = {};
    orderHistory.forEach(order => {
      if (order.items && order.items.length > 0) {
        const item = order.items[0];
        const serviceType = item.service || item.serviceType || 'washAndPress';
        serviceCounts[serviceType] = (serviceCounts[serviceType] || 0) + 1;
      }
    });
    
    const preferredService = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'washAndPress';
    
    const serviceFeature = this.serviceTypes.indexOf(preferredService);
    
    // Calculate average time of day preference
    const timeOfDaySum = orderHistory.reduce((sum, order) => {
      return sum + this.getTimeOfDayFeature(order.orderDate || order.createdAt);
    }, 0);
    
    const avgTimeOfDay = Math.round(timeOfDaySum / totalOrders);
    
    // Days since last order
    const lastOrder = orderHistory[orderHistory.length - 1];
    const daysSinceLast = this.getDaysSinceLastOrder(lastOrder.orderDate || lastOrder.createdAt);
    
    return [
      totalOrders / 50,      // Frequency (normalized)
      avgAmount / 5000,      // Average order value (normalized)
      avgTimeOfDay / 2,      // Time preference (normalized)
      serviceFeature / 5,    // Service preference (normalized)
      Math.min(daysSinceLast / 365, 1) // Recency (normalized)
    ];
  }
}

module.exports = KNNRecommender;