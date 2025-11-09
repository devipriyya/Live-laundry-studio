# Decision Tree Implementation

This document describes the implementation of Decision Tree classification in the WashLab project for customer segmentation.

## Overview

The Decision Tree classifier is implemented as part of the machine learning suite alongside KNN recommendations and SVM customer segmentation. It provides an interpretable approach to customer classification based on order history and behavior patterns.

## Implementation Details

### File Structure

```
backend/
├── src/
│   └── ml/
│       └── DecisionTreeClassifier.js
├── scripts/
│   ├── train-decision-tree.js
│   ├── demo-decision-tree.js
│   └── test-decision-tree-api.js
└── routes/
    └── mlRoutes.js (updated)
```

### Key Components

1. **DecisionTreeClassifier.js** - Main implementation class
2. **train-decision-tree.js** - Database training script
3. **demo-decision-tree.js** - Demonstration script
4. **mlRoutes.js** - API endpoints

## Features

### Customer Segmentation

The Decision Tree model classifies customers into four segments:
- **Premium** - High frequency, high value customers
- **Regular** - Moderate frequency and value customers
- **Budget** - Lower frequency/value customers
- **Inactive** - Customers with minimal or no activity

### Input Features

The model uses 8 key features for classification:
1. Order frequency
2. Average order value
3. Days since last order
4. Service variety
5. Satisfaction score
6. Referral count
7. Discount usage frequency
8. Complaint count

## API Endpoints

### Train Model
```
POST /api/ml/train-decision-tree
```

### Get Segment Prediction
```
POST /api/ml/segment-dt
Body: { customerData: { ... } }
```

### Get Feature Importance
```
GET /api/ml/feature-importance
```

### Check Model Status
```
GET /api/ml/status
```

## Usage

### Training the Model

```bash
cd backend
npm run train-decision-tree
```

### Running the Demo

```bash
cd backend
npm run demo-decision-tree
```

### Integration in Frontend

The DecisionTreeSegment component can be used to display predictions:

```jsx
import DecisionTreeSegment from './components/DecisionTreeSegment';

<DecisionTreeSegment customerData={customerData} />
```

## Comparison with Other Models

| Model | Use Case | Strengths | Interpretability |
|-------|----------|-----------|------------------|
| KNN | Recommendations | Similarity-based suggestions | Medium |
| SVM | Classification | Effective with clear margins | Low |
| Decision Tree | Classification | Clear decision paths | High |

## Future Improvements

1. Enhanced feature importance calculation
2. Model pruning for better generalization
3. Cross-validation for hyperparameter tuning
4. Ensemble methods (Random Forest)
5. Real-time model updates

## Conclusion

The Decision Tree implementation provides a transparent and effective approach to customer segmentation. Its interpretability makes it valuable for understanding business decisions and customer behavior patterns.