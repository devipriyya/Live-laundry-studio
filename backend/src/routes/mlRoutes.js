const express = require('express');
const router = express.Router();
const KNNRecommender = require('../ml/KNNRecommender');
const SVMCustomerSegmenter = require('../ml/SVMCustomerSegmenter');
const DecisionTreeClassifier = require('../ml/DecisionTreeClassifier');
const NaiveBayesClassifier = require('../ml/NaiveBayesClassifier');

// In-memory storage for the recommender instance
let recommender = new KNNRecommender();
let segmenter = new SVMCustomerSegmenter();
let decisionTreeClassifier = new DecisionTreeClassifier();
let naiveBayesClassifier = new NaiveBayesClassifier();

// Route to train the model with order data
router.post('/train', async (req, res) => {
  try {
    const { orders } = req.body;
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ 
        error: 'Invalid data format. Expected an array of orders.' 
      });
    }
    
    // Train the recommender
    const success = recommender.train(orders);
    
    if (success) {
      res.json({ 
        message: 'Model trained successfully',
        sampleCount: orders.length
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to train model' 
      });
    }
  } catch (error) {
    console.error('Error training model:', error);
    res.status(500).json({ 
      error: 'Internal server error during training' 
    });
  }
});

// Route to train the SVM customer segmenter
router.post('/train-segmenter', async (req, res) => {
  try {
    const { customers } = req.body;
    
    if (!customers || !Array.isArray(customers)) {
      return res.status(400).json({ 
        error: 'Invalid data format. Expected an array of customers.' 
      });
    }
    
    // Train the segmenter
    const success = segmenter.train(customers);
    
    if (success) {
      res.json({ 
        message: 'SVM Customer Segmenter trained successfully',
        sampleCount: customers.length
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to train SVM Customer Segmenter' 
      });
    }
  } catch (error) {
    console.error('Error training SVM Customer Segmenter:', error);
    res.status(500).json({ 
      error: 'Internal server error during SVM training' 
    });
  }
});

// Route to train the Decision Tree classifier
router.post('/train-decision-tree', async (req, res) => {
  try {
    const { customers } = req.body;
    
    if (!customers || !Array.isArray(customers)) {
      return res.status(400).json({ 
        error: 'Invalid data format. Expected an array of customers.' 
      });
    }
    
    // Train the Decision Tree classifier
    const success = decisionTreeClassifier.train(customers);
    
    if (success) {
      res.json({ 
        message: 'Decision Tree Classifier trained successfully',
        sampleCount: customers.length
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to train Decision Tree Classifier' 
      });
    }
  } catch (error) {
    console.error('Error training Decision Tree Classifier:', error);
    res.status(500).json({ 
      error: 'Internal server error during Decision Tree training' 
    });
  }
});

// Route to train the Naive Bayes classifier
router.post('/train-naive-bayes', async (req, res) => {
  try {
    const { orders } = req.body;
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ 
        error: 'Invalid data format. Expected an array of orders.' 
      });
    }
    
    // Train the Naive Bayes classifier
    const success = naiveBayesClassifier.train(orders);
    
    if (success) {
      res.json({ 
        message: 'Naive Bayes Classifier trained successfully',
        sampleCount: orders.length
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to train Naive Bayes Classifier' 
      });
    }
  } catch (error) {
    console.error('Error training Naive Bayes Classifier:', error);
    res.status(500).json({ 
      error: 'Internal server error during Naive Bayes training' 
    });
  }
});

// Route to get recommendations for a user
router.post('/recommend', async (req, res) => {
  try {
    const { userOrderHistory } = req.body;
    
    if (!userOrderHistory) {
      return res.status(400).json({ 
        error: 'User order history is required' 
      });
    }
    
    // Get recommendations
    const recommendations = recommender.getRecommendations(userOrderHistory);
    
    res.json({ 
      recommendations 
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ 
      error: 'Internal server error while generating recommendations' 
    });
  }
});

// Route to get a single prediction
router.post('/predict', async (req, res) => {
  try {
    const { userFeatures } = req.body;
    
    if (!userFeatures || !Array.isArray(userFeatures)) {
      return res.status(400).json({ 
        error: 'User features are required as an array' 
      });
    }
    
    console.log('Received userFeatures for prediction:', userFeatures);
    
    // Get prediction
    const prediction = recommender.predict(userFeatures);
    
    console.log('Prediction result:', prediction);
    
    if (prediction) {
      res.json({ 
        prediction 
      });
    } else {
      res.status(400).json({ 
        error: 'Unable to generate prediction' 
      });
    }
  } catch (error) {
    console.error('Error making prediction:', error);
    res.status(500).json({ 
      error: 'Internal server error while making prediction' 
    });
  }
});

// Route to get customer segment prediction using SVM
router.post('/segment', async (req, res) => {
  try {
    const { customerData } = req.body;
    
    if (!customerData) {
      return res.status(400).json({ 
        error: 'Customer data is required' 
      });
    }
    
    // Get segment prediction
    const segment = segmenter.predict(customerData);
    
    res.json({ 
      segment 
    });
  } catch (error) {
    console.error('Error getting segment prediction:', error);
    res.status(500).json({ 
      error: 'Internal server error while generating segment prediction' 
    });
  }
});

// Route to get customer segment prediction using Decision Tree
router.post('/segment-dt', async (req, res) => {
  try {
    const { customerData } = req.body;
    
    if (!customerData) {
      return res.status(400).json({ 
        error: 'Customer data is required' 
      });
    }
    
    // Get segment prediction from Decision Tree
    const segment = decisionTreeClassifier.predict(customerData);
    
    res.json({ 
      segment 
    });
  } catch (error) {
    console.error('Error getting Decision Tree segment prediction:', error);
    res.status(500).json({ 
      error: 'Internal server error while generating Decision Tree segment prediction' 
    });
  }
});

// Route to get predictions using Naive Bayes
router.post('/predict-naive-bayes', async (req, res) => {
  try {
    const { userOrderHistory } = req.body;
    
    if (!userOrderHistory) {
      return res.status(400).json({ 
        error: 'User order history is required' 
      });
    }
    
    // Get prediction from Naive Bayes classifier
    const prediction = naiveBayesClassifier.predict(userOrderHistory);
    
    res.json({ 
      prediction 
    });
  } catch (error) {
    console.error('Error making Naive Bayes prediction:', error);
    res.status(500).json({ 
      error: 'Internal server error while making Naive Bayes prediction' 
    });
  }
});

// Route to get prediction probabilities using Naive Bayes
router.post('/predict-probabilities', async (req, res) => {
  try {
    const { userOrderHistory } = req.body;
    
    if (!userOrderHistory) {
      return res.status(400).json({ 
        error: 'User order history is required' 
      });
    }
    
    // Get prediction probabilities from Naive Bayes classifier
    const probabilities = naiveBayesClassifier.getPredictionProbabilities(userOrderHistory);
    
    res.json({ 
      probabilities 
    });
  } catch (error) {
    console.error('Error getting Naive Bayes prediction probabilities:', error);
    res.status(500).json({ 
      error: 'Internal server error while getting Naive Bayes prediction probabilities' 
    });
  }
});

// Route to check model status
router.get('/status', async (req, res) => {
  try {
    res.json({ 
      isTrained: recommender.isTrained,
      svmTrained: segmenter.isTrained,
      decisionTreeTrained: decisionTreeClassifier.isTrained,
      naiveBayesTrained: naiveBayesClassifier.isTrained,
      message: recommender.isTrained || segmenter.isTrained || decisionTreeClassifier.isTrained || naiveBayesClassifier.isTrained
        ? 'Models are ready for predictions' 
        : 'Models need to be trained first'
    });
  } catch (error) {
    console.error('Error checking model status:', error);
    res.status(500).json({ 
      error: 'Internal server error while checking status' 
    });
  }
});

// Route to get feature importance from Decision Tree
router.get('/feature-importance', async (req, res) => {
  try {
    const importance = decisionTreeClassifier.getFeatureImportance();
    
    if (importance) {
      res.json({ 
        importance 
      });
    } else {
      res.status(400).json({ 
        error: 'Decision Tree model not trained yet' 
      });
    }
  } catch (error) {
    console.error('Error getting feature importance:', error);
    res.status(500).json({ 
      error: 'Internal server error while getting feature importance' 
    });
  }
});

module.exports = router;