const express = require('express');
const router = express.Router();
const KNNRecommender = require('../ml/KNNRecommender');
const SVMCustomerSegmenter = require('../ml/SVMCustomerSegmenter');

// In-memory storage for the recommender instance
let recommender = new KNNRecommender();
let segmenter = new SVMCustomerSegmenter();

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

// Route to get customer segment prediction
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

// Route to check model status
router.get('/status', async (req, res) => {
  try {
    res.json({ 
      isTrained: recommender.isTrained,
      message: recommender.isTrained 
        ? 'Model is ready for predictions' 
        : 'Model needs to be trained first'
    });
  } catch (error) {
    console.error('Error checking model status:', error);
    res.status(500).json({ 
      error: 'Internal server error while checking status' 
    });
  }
});

module.exports = router;