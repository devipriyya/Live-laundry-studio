# Machine Learning Implementation Guide

This document explains how to use the machine learning features implemented in this laundry service application.

## Overview

The ML system implements a K-Nearest Neighbors (KNN) algorithm to provide service recommendations to users based on their order history and preferences. The system analyzes patterns in user behavior to suggest relevant services.

## Features Implemented

1. **Service Recommendations**: Suggest services based on user order history
2. **User Preference Prediction**: Predict what service a user might prefer next
3. **Model Training API**: Endpoints to train the model with order data

## Technical Architecture

### Backend Components

- **KNNRecommender.js**: Core ML implementation using the `ml-knn` library
- **mlRoutes.js**: API endpoints for ML functionality
- **train-ml-model.js**: Script to train the model with existing data

### Frontend Components

- **ServiceRecommendations.jsx**: React component to display recommendations

## API Endpoints

### Train Model
```
POST /api/ml/train
```
Train the model with order data.

**Request Body:**
```json
{
  "orders": [/* array of order objects */]
}
```

### Get Recommendations
```
POST /api/ml/recommend
```
Get service recommendations for a user based on their order history.

**Request Body:**
```json
{
  "userOrderHistory": [/* array of user's past orders */]
}
```

### Predict Service
```
POST /api/ml/predict
```
Get a single service prediction based on user features.

**Request Body:**
```json
{
  "userFeatures": [/* array of numerical features */]
}
```

### Check Model Status
```
GET /api/ml/status
```
Check if the model is trained and ready for predictions.

## How It Works

### Feature Engineering

The system extracts the following features from user orders:

1. **Order Frequency**: How often the user places orders
2. **Average Order Value**: The typical amount spent per order
3. **Time Preference**: Preferred time of day for orders (morning/afternoon/evening)
4. **Service Preference**: Most commonly ordered service type
5. **Recency**: Days since the last order

### Recommendation Process

1. When a user visits the dashboard, their order history is sent to the ML API
2. The system extracts features from the user's order history
3. The KNN algorithm finds similar users based on these features
4. Services preferred by similar users are recommended to the current user
5. Recommendations are returned with confidence scores

## Training the Model

### Automatic Training

To train the model with existing data, run:
```bash
cd backend
node scripts/train-ml-model.js
```

### Manual Training via API

Send a POST request to `/api/ml/train` with order data:
```json
{
  "orders": [
    {
      "userOrderCount": 5,
      "totalAmount": 1200,
      "createdAt": "2023-05-15T10:30:00Z",
      "items": [
        {
          "serviceType": "washAndPress"
        }
      ]
    }
    // ... more orders
  ]
}
```

## Integration Example

### Frontend Integration

```jsx
import ServiceRecommendations from '../components/ServiceRecommendations';

// In your dashboard component
const Dashboard = () => {
  const [userOrders, setUserOrders] = useState([]);
  
  // Fetch user orders
  useEffect(() => {
    fetchUserOrders();
  }, []);
  
  return (
    <div>
      {/* Other dashboard components */}
      <ServiceRecommendations userOrderHistory={userOrders} />
    </div>
  );
};
```

### Backend Integration

```javascript
// In your routes or controllers
const KNNRecommender = require('../ml/KNNRecommender');
const recommender = new KNNRecommender();

// Train with order data
recommender.train(orders);

// Get recommendations for a user
const recommendations = recommender.getRecommendations(userOrderHistory);
```

## Adding New Features

### Extending Features

To add new features for better recommendations:

1. Modify the `extractFeatures` method in [KNNRecommender.js](file:///c:/Users/User/fabrico/backend/src/ml/KNNRecommender.js)
2. Update the feature array length consistently
3. Retrain the model with updated data

### Adding New Algorithms

To implement additional ML algorithms:

1. Create a new class in the [ml directory](file:///c:/Users/User/fabrico/backend/src/ml)
2. Implement train/predict methods
3. Add new routes in [mlRoutes.js](file:///c:/Users/User/fabrico/backend/src/routes/mlRoutes.js)
4. Update frontend components as needed

## Troubleshooting

### Common Issues

1. **Model not trained**: Ensure you've run the training script or API endpoint
2. **No recommendations**: Check that the user has sufficient order history
3. **API errors**: Verify the request format matches the expected structure

### Debugging

Enable detailed logging by setting:
```bash
DEBUG=ml-recommender
```

## Performance Considerations

- The KNN algorithm has O(n) prediction time complexity
- For large datasets, consider implementing approximate nearest neighbors
- Model training is done offline and doesn't affect real-time performance
- Recommendations are cached per user session for better performance

## Future Improvements

1. **Collaborative Filtering**: Implement user-user or item-item collaborative filtering
2. **Deep Learning**: Use neural networks for more complex pattern recognition
3. **Real-time Updates**: Update model incrementally as new orders come in
4. **A/B Testing**: Compare recommendation effectiveness with different algorithms