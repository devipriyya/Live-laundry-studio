const { DecisionTreeClassifier } = require('ml-cart');
const fs = require('fs');
const path = require('path');

class DecisionTreeClassifierWrapper {
  constructor() {
    this.model = null;
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
    // Try to load a previously trained model
    this.loadModel();
  }

  // Extract features from customer data for Decision Tree
  extractFeatures(customerData) {
    // Features for customer classification:
    // 1. Order frequency (normalized)
    // 2. Average order value (normalized)
    // 3. Days since last order
    // 4. Service variety (number of different services used)
    // 5. Satisfaction score (average rating)
    // 6. Referral count
    // 7. Discount usage frequency
    // 8. Complaint count
    
    return [
      customerData.orderFrequency || 0,           // Order frequency
      customerData.avgOrderValue || 0,            // Average order value
      customerData.daysSinceLastOrder || 365,     // Days since last order
      customerData.serviceVariety || 0,           // Service variety
      customerData.satisfactionScore || 3,        // Satisfaction score (default 3/5)
      customerData.referralCount || 0,            // Referral count
      customerData.discountUsage || 0,            // Discount usage frequency
      customerData.complaintCount || 0            // Complaint count
    ];
  }

  // Train the Decision Tree model with customer data
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
      
      // Train the Decision Tree model
      this.model = new DecisionTreeClassifier({
        gainFunction: 'gini',
        maxDepth: 10,
        minSamplesSplit: 5
      });
      
      this.model.train(trainingData, labels);
      this.isTrained = true;
      
      // Save the trained model
      this.saveModel();
      
      console.log('Decision Tree Classifier trained successfully with', customerDataArray.length, 'samples');
      return true;
    } catch (error) {
      console.error('Error training Decision Tree Classifier:', error);
      return false;
    }
  }

  // Save the trained model to disk
  saveModel() {
    if (!this.isTrained || !this.model) {
      return false;
    }
    
    try {
      const modelPath = path.join(__dirname, '..', '..', 'models', 'decision-tree-model.json');
      const modelData = {
        model: this.model.toJSON(),
        isTrained: this.isTrained,
        timestamp: new Date().toISOString()
      };
      
      // Ensure the models directory exists
      const modelsDir = path.dirname(modelPath);
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }
      
      fs.writeFileSync(modelPath, JSON.stringify(modelData, null, 2));
      console.log('Decision Tree model saved to', modelPath);
      return true;
    } catch (error) {
      console.error('Error saving Decision Tree model:', error);
      return false;
    }
  }

  // Load a previously trained model from disk
  loadModel() {
    try {
      const modelPath = path.join(__dirname, '..', '..', 'models', 'decision-tree-model.json');
      
      if (!fs.existsSync(modelPath)) {
        console.log('No saved Decision Tree model found');
        return false;
      }
      
      const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
      
      if (modelData.isTrained && modelData.model) {
        this.model = DecisionTreeClassifier.load(modelData.model);
        this.isTrained = modelData.isTrained;
        console.log('Decision Tree model loaded from', modelPath);
        return true;
      }
      
      console.log('Saved Decision Tree model is not trained');
      return false;
    } catch (error) {
      console.error('Error loading Decision Tree model:', error);
      return false;
    }
  }

  // Predict customer segment using Decision Tree
  predict(customerData) {
    if (!this.isTrained || !this.model) {
      console.warn('Decision Tree model is not trained yet');
      return {
        segment: 'regular',
        confidence: 0.5,
        features: []
      };
    }
    
    try {
      const features = this.extractFeatures(customerData);
      const prediction = this.model.predict([features])[0];
      const segmentLabel = this.labelMapping[prediction] || 'regular';
      
      // Calculate confidence based on leaf purity or other metrics
      const confidence = this.calculateConfidence(features);
      
      return {
        segment: segmentLabel,
        confidence: confidence,
        features: features
      };
    } catch (error) {
      console.error('Error predicting with Decision Tree Classifier:', error);
      return {
        segment: 'regular',
        confidence: 0.5,
        features: []
      };
    }
  }

  // Calculate prediction confidence (simplified approach)
  calculateConfidence(features) {
    try {
      // For Decision Trees, confidence can be estimated based on the proportion 
      // of samples of the predicted class in the leaf node
      // Since the CART library doesn't expose this directly, we'll use a simplified approach
      
      // We'll return a default confidence for now
      // In a production environment, you might want to implement a more sophisticated approach
      return 0.85; // Default confidence
    } catch (error) {
      console.error('Error calculating confidence:', error);
      // Return default confidence
      return 0.7;
    }
  }

  // Get feature importance from the trained model
  getFeatureImportance() {
    if (!this.isTrained || !this.model) {
      return null;
    }
    
    try {
      // Get feature importance from the model
      const featureNames = [
        'orderFrequency',
        'avgOrderValue', 
        'daysSinceLastOrder',
        'serviceVariety',
        'satisfactionScore',
        'referralCount',
        'discountUsage',
        'complaintCount'
      ];
      
      // Note: The CART library doesn't directly expose feature importance
      // This would require implementing a custom importance calculation
      return {
        featureNames: featureNames,
        importance: Array(featureNames.length).fill(0.125) // Equal importance for now
      };
    } catch (error) {
      console.error('Error getting feature importance:', error);
      return null;
    }
  }
}

module.exports = DecisionTreeClassifierWrapper;