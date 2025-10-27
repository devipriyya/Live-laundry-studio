const svm = require('svm');

class SVMCustomerSegmenter {
  constructor() {
    this.model = new svm.SVM();
    this.isTrained = false;
    this.labelMapping = {
      0: 'premium',
      1: 'regular',
      2: 'budget',
      3: 'inactive'
    };
    this.reverseLabelMapping = {
      'premium': 0,
      'regular': 1,
      'budget': 2,
      'inactive': 3
    };
  }

  // Extract features from customer data for SVM
  extractFeatures(customerData) {
    // Features for customer segmentation:
    // 1. Order frequency (normalized)
    // 2. Average order value (normalized)
    // 3. Days since last order
    // 4. Service variety (number of different services used)
    // 5. Satisfaction score (average rating)
    // 6. Referral count
    // 7. Discount usage frequency
    // 8. Complaint count
    
    return [
      customerData.orderFrequency / 50,  // Normalize by max expected frequency
      customerData.avgOrderValue / 5000, // Normalize by max expected value
      Math.min(customerData.daysSinceLastOrder / 365, 1), // Normalize to 0-1
      customerData.serviceVariety / 10,  // Normalize by max services
      customerData.satisfactionScore / 5, // Normalize to 0-1 (5-star scale)
      customerData.referralCount / 20,   // Normalize by max expected referrals
      customerData.discountUsage / 10,   // Normalize by max discount usage
      Math.min(customerData.complaintCount / 5, 1) // Normalize to 0-1
    ];
  }

  // Train the SVM model with customer data
  train(customerDataArray) {
    try {
      // Prepare training data
      const trainingData = [];
      const labels = [];
      
      customerDataArray.forEach(customer => {
        const features = this.extractFeatures(customer);
        trainingData.push(features);
        labels.push(this.reverseLabelMapping[customer.segment] || 1); // Default to regular
      });
      
      // Train the SVM model
      this.model.train(trainingData, labels);
      this.isTrained = true;
      
      console.log('SVM Customer Segmenter trained successfully with', customerDataArray.length, 'samples');
      return true;
    } catch (error) {
      console.error('Error training SVM Customer Segmenter:', error);
      return false;
    }
  }

  // Predict customer segment
  predict(customerData) {
    if (!this.isTrained) {
      console.warn('SVM model is not trained yet');
      return {
        segment: 'regular',
        confidence: 0.5,
        features: []
      };
    }
    
    try {
      const features = this.extractFeatures(customerData);
      const prediction = this.model.predict([features]);
      const segmentLabel = this.labelMapping[prediction[0]] || 'regular';
      
      // Calculate confidence based on distance to decision boundary
      const confidence = this.calculateConfidence(features, prediction[0]);
      
      return {
        segment: segmentLabel,
        confidence: confidence,
        features: features
      };
    } catch (error) {
      console.error('Error predicting with SVM Customer Segmenter:', error);
      return {
        segment: 'regular',
        confidence: 0.5,
        features: []
      };
    }
  }

  // Calculate prediction confidence based on distance to decision boundary
  calculateConfidence(features, predictedLabel) {
    try {
      // Get decision values for all classes
      const decisionValues = this.model.margins([features])[0];
      
      // Sort decision values to find the top two
      const sortedValues = Object.values(decisionValues).sort((a, b) => b - a);
      
      // If we only have one class, return high confidence
      if (sortedValues.length < 2) {
        return 0.9;
      }
      
      const topValue = sortedValues[0];
      const secondValue = sortedValues[1];
      
      // Calculate margin between top two predictions
      const margin = topValue - secondValue;
      
      // Convert margin to confidence (0-1 scale)
      // Using a sigmoid-like function to map margin to confidence
      const confidence = 1 / (1 + Math.exp(-margin * 2));
      
      // Ensure confidence is between 0.5 and 1.0
      return Math.max(0.5, Math.min(confidence, 1.0));
    } catch (error) {
      console.error('Error calculating confidence:', error);
      // Return default confidence
      return 0.7;
    }
  }

  // Get decision boundary distances for more detailed analysis
  getDecisionInfo(customerData) {
    if (!this.isTrained) return null;
    
    const features = this.extractFeatures(customerData);
    // This would require access to the SVM internals for detailed analysis
    return {
      features: features,
      segment: this.predict(customerData).segment
    };
  }
}

module.exports = SVMCustomerSegmenter;