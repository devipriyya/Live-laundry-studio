# SVM Customer Segmentation in Your Project

This guide explains how to use the Support Vector Machine (SVM) implementation for customer segmentation in your project.

## Overview

The SVM implementation is already integrated into your project and can be used to classify customers into different segments:
- **Premium**: High-value customers
- **Regular**: Standard customers
- **Budget**: Price-sensitive customers
- **Inactive**: Dormant customers

## File Structure

The SVM implementation consists of the following files:
- `backend/src/ml/SVMCustomerSegmenter.js` - Main SVM implementation
- `backend/src/routes/mlRoutes.js` - API endpoints for SVM
- `backend/scripts/demo-svm-segmentation.js` - Standalone demo script
- `backend/scripts/train-and-test-svm.js` - API usage example

## How to Use

### 1. Using the API (Recommended)

The SVM is exposed through RESTful API endpoints:

#### Train the Model
```bash
POST /api/ml/train-segmenter
```

Send a JSON payload with customer data:
```json
{
  "customers": [
    {
      "orderFrequency": 25,
      "avgOrderValue": 3500,
      "daysSinceLastOrder": 5,
      "serviceVariety": 4,
      "satisfactionScore": 4.8,
      "referralCount": 8,
      "discountUsage": 2,
      "complaintCount": 0,
      "segment": "premium"
    }
    // ... more customer data
  ]
}
```

#### Predict Customer Segment
```bash
POST /api/ml/segment
```

Send a JSON payload with customer data to classify:
```json
{
  "customerData": {
    "orderFrequency": 15,
    "avgOrderValue": 2200,
    "daysSinceLastOrder": 10,
    "serviceVariety": 3,
    "satisfactionScore": 4.5,
    "referralCount": 5,
    "discountUsage": 3,
    "complaintCount": 0
  }
}
```

### 2. Using the Demo Scripts

#### Run the Standalone Demo
```bash
cd backend
npm run demo-svm
```

#### Run the API Usage Demo
```bash
# First, start the backend server in another terminal:
npm start

# Then, in a new terminal, run:
cd backend
npm run train-and-test-svm
```

## Features Used for Segmentation

The SVM model uses the following customer features:
1. **Order Frequency** - How often the customer places orders
2. **Average Order Value** - The average amount spent per order
3. **Days Since Last Order** - Recency of the last purchase
4. **Service Variety** - Number of different services used
5. **Satisfaction Score** - Average customer rating
6. **Referral Count** - Number of referrals made
7. **Discount Usage** - How often discounts are used
8. **Complaint Count** - Number of complaints filed

## Implementation Details

The SVM implementation:
- Uses the `svm` npm package
- Normalizes all features to ensure consistent scaling
- Provides confidence scores with predictions
- Handles training and prediction errors gracefully
- Maps segment labels to numerical values for training

## Getting Started

1. Make sure the backend server is running:
   ```bash
   cd backend
   npm start
   ```

2. Train the model with your customer data using the `/api/ml/train-segmenter` endpoint

3. Start classifying customers using the `/api/ml/segment` endpoint

## Example Usage in Frontend

You can integrate the SVM segmentation into your frontend application:

```javascript
// Example function to get customer segment
async function getCustomerSegment(customerData) {
  try {
    const response = await fetch('/api/ml/segment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customerData })
    });
    
    const result = await response.json();
    return result.segment;
  } catch (error) {
    console.error('Error getting customer segment:', error);
    return null;
  }
}
```