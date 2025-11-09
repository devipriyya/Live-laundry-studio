const { MultinomialNB } = require('ml-naivebayes');

class NaiveBayesClassifier {
  constructor() {
    this.model = null;
    this.isTrained = false;
    this.serviceTypes = [
      'washAndPress',
      'dryCleaning',
      'steamPress',
      'stainRemoval',
      'shoeCare'
    ];
  }

  // Prepare training data for Naive Bayes
  prepareTrainingData(orders) {
    const trainingData = [];
    const labels = [];
    
    orders.forEach(order => {
      // Extract features from order
      const features = this.extractFeatures(order);
      trainingData.push(features);
      
      // Use service type as label for classification
      if (order.items && order.items.length > 0) {
        const serviceType = order.items[0].service || order.items[0].serviceType || 'washAndPress';
        const labelIndex = this.serviceTypes.indexOf(serviceType);
        labels.push(labelIndex === -1 ? 0 : labelIndex); // Default to washAndPress if not found
      } else {
        labels.push(0); // Default to washAndPress
      }
    });
    
    return { trainingData, labels };
  }

  // Extract features from an order
  extractFeatures(order) {
    // Features for Naive Bayes classification:
    // 1. Order frequency (normalized)
    // 2. Order value (normalized)
    // 3. Time of day preference (0=morning, 1=afternoon, 2=evening)
    // 4. Service category (encoded)
    // 5. Days since last order (normalized)
    
    const features = [
      (order.userOrderCount || 1) / 50, // Frequency (normalized)
      (order.totalAmount || 0) / 5000,  // Order value (normalized)
      this.getTimeOfDayFeature(order.orderDate || order.createdAt), // Time preference (0-2)
      this.getServiceCategoryFeature(order), // Service preference (0-4)
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
    if (!order.items || order.items.length === 0) return 0; // Default to washAndPress
    
    // Extract service type from the first item
    const item = order.items[0];
    const serviceType = item.service || item.serviceType || 'washAndPress';
    
    const index = this.serviceTypes.indexOf(serviceType);
    return index === -1 ? 0 : index; // Default to washAndPress if not found
  }

  getDaysSinceLastOrder(order) {
    if (!order.createdAt) return 30; // Default to 30 days
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    const diffTime = Math.abs(today - orderDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Train the Naive Bayes model
  train(orders) {
    try {
      const { trainingData, labels } = this.prepareTrainingData(orders);
      
      if (trainingData.length === 0 || labels.length === 0) {
        console.warn('No training data available for Naive Bayes classifier');
        return false;
      }
      
      // Initialize and train Naive Bayes classifier
      this.model = new MultinomialNB();
      this.model.train(trainingData, labels);
      this.isTrained = true;
      
      console.log('Naive Bayes Classifier trained successfully with', trainingData.length, 'samples');
      return true;
    } catch (error) {
      console.error('Error training Naive Bayes Classifier:', error);
      return false;
    }
  }

  // Predict service type for a user
  predict(userOrderHistory) {
    if (!this.isTrained || !this.model) {
      console.warn('Naive Bayes model is not trained yet');
      return 'washAndPress'; // Default service
    }
    
    try {
      // Extract features from user's order history
      const userFeatures = this.extractUserFeatures(userOrderHistory);
      
      // Make prediction
      const prediction = this.model.predict([userFeatures]);
      
      // Check if we got a valid prediction
      if (prediction && prediction.length > 0 && prediction[0] !== undefined) {
        const serviceIndex = prediction[0];
        return this.serviceTypes[serviceIndex] || 'washAndPress';
      }
      
      // If no prediction, return a default service
      console.log('No prediction made, returning default service');
      return 'washAndPress'; // Default service
    } catch (error) {
      console.error('Error predicting with Naive Bayes Classifier:', error);
      // Return a default service in case of error
      return 'washAndPress';
    }
  }

  // Get prediction probabilities for all classes
  getPredictionProbabilities(userOrderHistory) {
    if (!this.isTrained || !this.model) {
      console.warn('Naive Bayes model is not trained yet');
      // Return default probabilities
      return this.serviceTypes.map((service, index) => ({
        service,
        probability: index === 0 ? 0.8 : 0.2 / (this.serviceTypes.length - 1)
      }));
    }
    
    try {
      // Extract features from user's order history
      const userFeatures = this.extractUserFeatures(userOrderHistory);
      
      // Since MultinomialNB doesn't have predictProbability, we'll return a simple prediction
      const prediction = this.model.predict([userFeatures]);
      
      // Return the prediction with high confidence and default probabilities for others
      if (prediction && prediction.length > 0) {
        const predictedService = this.serviceTypes[prediction[0]] || 'washAndPress';
        return this.serviceTypes.map((service, index) => ({
          service,
          probability: service === predictedService ? 0.8 : 0.2 / (this.serviceTypes.length - 1)
        }));
      } else {
        // Return default probabilities
        return this.serviceTypes.map((service, index) => ({
          service,
          probability: index === 0 ? 0.8 : 0.2 / (this.serviceTypes.length - 1)
        }));
      }
    } catch (error) {
      console.error('Error getting prediction probabilities:', error);
      // Return default probabilities
      return this.serviceTypes.map((service, index) => ({
        service,
        probability: index === 0 ? 0.8 : 0.2 / (this.serviceTypes.length - 1)
      }));
    }
  }

  // Extract features from user's order history
  extractUserFeatures(orderHistory) {
    if (!orderHistory || orderHistory.length === 0) {
      // Return default features for new users
      return [1/50, 0, 0, 0, 30/365]; // Low frequency, no spending, morning preference, washAndPress, 30 days
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
      avgTimeOfDay,          // Time preference (0-2)
      serviceFeature,        // Service preference (0-4)
      Math.min(daysSinceLast / 365, 1) // Recency (normalized)
    ];
  }
}

module.exports = NaiveBayesClassifier;