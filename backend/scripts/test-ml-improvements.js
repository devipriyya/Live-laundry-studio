const KNNRecommender = require('../src/ml/KNNRecommender');
const SVMCustomerSegmenter = require('../src/ml/SVMCustomerSegmenter');

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

// Sample customer data for segmentation
const sampleCustomers = [
  {
    orderFrequency: 25,
    avgOrderValue: 3500,
    daysSinceLastOrder: 5,
    serviceVariety: 4,
    satisfactionScore: 4.8,
    referralCount: 8,
    discountUsage: 3,
    complaintCount: 0,
    segment: 'premium'
  },
  {
    orderFrequency: 12,
    avgOrderValue: 1800,
    daysSinceLastOrder: 15,
    serviceVariety: 3,
    satisfactionScore: 4.2,
    referralCount: 2,
    discountUsage: 5,
    complaintCount: 1,
    segment: 'regular'
  },
  {
    orderFrequency: 5,
    avgOrderValue: 900,
    daysSinceLastOrder: 45,
    serviceVariety: 2,
    satisfactionScore: 3.5,
    referralCount: 0,
    discountUsage: 8,
    complaintCount: 2,
    segment: 'budget'
  },
  {
    orderFrequency: 1,
    avgOrderValue: 500,
    daysSinceLastOrder: 120,
    serviceVariety: 1,
    satisfactionScore: 2.8,
    referralCount: 0,
    discountUsage: 1,
    complaintCount: 3,
    segment: 'inactive'
  }
];

// Sample customer data for prediction
const sampleCustomerData = {
  orderFrequency: 22,
  avgOrderValue: 3200,
  daysSinceLastOrder: 7,
  serviceVariety: 5,
  satisfactionScore: 4.7,
  referralCount: 6,
  discountUsage: 2,
  complaintCount: 0
};

console.log('=== ML Improvements Test ===\n');

// Test KNN Recommender
console.log('--- Testing KNN Recommender ---');
const recommender = new KNNRecommender();

console.log('Training model with', sampleOrders.length, 'sample orders...');
const trainSuccess = recommender.train(sampleOrders);

if (trainSuccess) {
  console.log('✅ KNN Model trained successfully!\n');
  
  // Test recommendations
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
} else {
  console.log('❌ Failed to train KNN model');
}

console.log('\n' + '='.repeat(40) + '\n');

// Test SVM Customer Segmenter
console.log('--- Testing SVM Customer Segmenter ---');
const segmenter = new SVMCustomerSegmenter();

console.log('Training model with', sampleCustomers.length, 'sample customers...');
const segmentTrainSuccess = segmenter.train(sampleCustomers);

if (segmentTrainSuccess) {
  console.log('✅ SVM Model trained successfully!\n');
  
  // Test segmentation
  console.log('Generating segment prediction for sample customer...');
  const segmentResult = segmenter.predict(sampleCustomerData);
  
  console.log('\n=== Segment Prediction ===');
  console.log('Segment:', segmentResult.segment);
  console.log('Confidence:', Math.round(segmentResult.confidence * 100) + '%');
  console.log('Features:', segmentResult.features.map(f => f.toFixed(3)));
} else {
  console.log('❌ Failed to train SVM model');
}

console.log('\n=== Test Complete ===');