const KNNRecommender = require('../src/ml/KNNRecommender');

// Sample order data for demonstration
const sampleOrders = [
  {
    userOrderCount: 15,
    totalAmount: 1250,
    createdAt: '2023-05-15T10:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 8,
    totalAmount: 2100,
    createdAt: '2023-05-10T14:15:00Z',
    items: [{ serviceType: 'dryCleaning' }]
  },
  {
    userOrderCount: 12,
    totalAmount: 800,
    createdAt: '2023-05-12T16:45:00Z',
    items: [{ serviceType: 'steamPress' }]
  },
  {
    userOrderCount: 5,
    totalAmount: 950,
    createdAt: '2023-05-18T11:20:00Z',
    items: [{ serviceType: 'stainRemoval' }]
  },
  {
    userOrderCount: 20,
    totalAmount: 1800,
    createdAt: '2023-05-20T09:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 3,
    totalAmount: 2500,
    createdAt: '2023-05-14T13:45:00Z',
    items: [{ serviceType: 'dryCleaning' }]
  },
  {
    userOrderCount: 7,
    totalAmount: 600,
    createdAt: '2023-05-16T17:30:00Z',
    items: [{ serviceType: 'shoeCare' }]
  },
  {
    userOrderCount: 18,
    totalAmount: 1100,
    createdAt: '2023-05-19T12:15:00Z',
    items: [{ serviceType: 'washAndPress' }]
  }
];

// Sample user order history for recommendations
const sampleUserHistory = [
  {
    userOrderCount: 6,
    totalAmount: 1300,
    createdAt: '2023-05-10T10:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 6,
    totalAmount: 1450,
    createdAt: '2023-05-05T11:15:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 6,
    totalAmount: 1200,
    createdAt: '2023-04-30T09:45:00Z',
    items: [{ serviceType: 'washAndPress' }]
  }
];

console.log('=== ML Recommendation System Demo ===\n');

// Initialize recommender
const recommender = new KNNRecommender();

console.log('Training model with', sampleOrders.length, 'sample orders...');
const success = recommender.train(sampleOrders);

if (success) {
  console.log('✅ Model trained successfully!\n');
  
  // Get recommendations for sample user
  console.log('Generating recommendations for sample user...');
  const recommendations = recommender.getRecommendations(sampleUserHistory, 3);
  
  console.log('\n=== Recommendations ===');
  if (recommendations.length > 0) {
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.service} (confidence: ${Math.round(rec.confidence * 100)}%)`);
    });
  } else {
    console.log('No recommendations available');
  }
  
  // Test prediction with features
  console.log('\n=== Prediction Test ===');
  const userFeatures = [6/50, 1300/5000, 1/2, 1/5, 5/365]; // Normalized sample features
  const prediction = recommender.predict(userFeatures);
  console.log('Predicted service preference:', prediction || 'N/A');
  
  console.log('\n=== Model Status ===');
  console.log('Model is trained and ready for predictions');
  
} else {
  console.log('❌ Failed to train model');
}

console.log('\n=== Demo Complete ===');