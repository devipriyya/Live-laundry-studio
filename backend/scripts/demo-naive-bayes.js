const NaiveBayesClassifier = require('../src/ml/NaiveBayesClassifier');

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

// Sample user order history for predictions
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

console.log('=== Naive Bayes Classifier Demo ===\n');

// Initialize classifier
const classifier = new NaiveBayesClassifier();

console.log('Training model with', sampleOrders.length, 'sample orders...');
const success = classifier.train(sampleOrders);

if (success) {
  console.log('✅ Naive Bayes model trained successfully!\n');
  
  // Make prediction for sample user
  console.log('Making prediction for sample user...');
  const prediction = classifier.predict(sampleUserHistory);
  console.log('Predicted service:', prediction);
  
  // Show prediction probabilities
  console.log('\n=== Prediction Probabilities ===');
  const probabilities = classifier.getPredictionProbabilities(sampleUserHistory);
  probabilities.forEach(prob => {
    console.log(`${prob.service}: ${(prob.probability * 100).toFixed(2)}%`);
  });
  
  console.log('\n=== Model Status ===');
  console.log('Naive Bayes model is trained and ready for predictions');
  
} else {
  console.log('❌ Failed to train Naive Bayes model');
}

console.log('\n=== Demo Complete ===');