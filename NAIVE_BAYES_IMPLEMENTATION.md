# Naive Bayes Classifier Implementation

## Overview

This document describes the implementation of a Naive Bayes classifier for the Fabrico project. The classifier is designed to predict customer service preferences based on their order history.

## Implementation Details

### File Structure

- `backend/src/ml/NaiveBayesClassifier.js` - Main Naive Bayes classifier implementation
- `backend/scripts/train-naive-bayes.js` - Script to train the classifier with real data
- `backend/scripts/demo-naive-bayes.js` - Demonstration script
- `backend/scripts/test-naive-bayes-api.js` - API testing script
- `backend/scripts/test-naive-bayes-endpoint.js` - HTTP endpoint testing script
- `backend/src/routes/mlRoutes.js` - Updated to include Naive Bayes endpoints

### Features

1. **Service Prediction**: Predicts the most likely service a customer will choose based on their order history
2. **Probability Estimation**: Provides probability estimates for all service types
3. **API Integration**: Exposes RESTful endpoints for training and prediction
4. **CLI Scripts**: Command-line tools for training and testing

### Algorithm

The implementation uses the Multinomial Naive Bayes algorithm from the `ml-naivebayes` library. The features used for classification include:

1. Order frequency (normalized)
2. Average order value (normalized)
3. Preferred time of day (morning/afternoon/evening)
4. Preferred service category
5. Days since last order (normalized)

### API Endpoints

1. `POST /api/ml/train-naive-bayes` - Train the Naive Bayes classifier
2. `POST /api/ml/predict-naive-bayes` - Get service prediction for a user
3. `POST /api/ml/predict-probabilities` - Get probability estimates for all services

### Usage

#### Training the Model

```bash
# Train with real data from the database
npm run train-naive-bayes

# Or run the script directly
node scripts/train-naive-bayes.js
```

#### Demo

```bash
# Run the demonstration script
npm run demo-naive-bayes

# Or run the script directly
node scripts/demo-naive-bayes.js
```

#### API Usage

```javascript
// Train the model
fetch('/api/ml/train-naive-bayes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orders: trainingData })
});

// Get a prediction
fetch('/api/ml/predict-naive-bayes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userOrderHistory: userData })
});

// Get prediction probabilities
fetch('/api/ml/predict-probabilities', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userOrderHistory: userData })
});
```

## Integration with Existing ML System

The Naive Bayes classifier follows the same pattern as the existing KNN Recommender, SVM Customer Segmenter, and Decision Tree Classifier, making it easy to integrate and maintain within the existing ML framework.

## Testing

The implementation includes comprehensive tests:
- Unit tests for the classifier logic
- API endpoint tests
- Integration tests with sample data

## Future Improvements

1. Add support for more feature types
2. Implement cross-validation for better model evaluation
3. Add model persistence to save trained models to disk
4. Implement A/B testing capabilities