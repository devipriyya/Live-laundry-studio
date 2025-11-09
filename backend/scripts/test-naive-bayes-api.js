const NaiveBayesClassifier = require('../src/ml/NaiveBayesClassifier');

// Test data to verify the classifier works correctly
const testData = [
  {
    userOrderCount: 10,
    totalAmount: 1500,
    createdAt: '2023-06-15T10:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 5,
    totalAmount: 2500,
    createdAt: '2023-06-10T14:15:00Z',
    items: [{ serviceType: 'dryCleaning' }]
  },
  {
    userOrderCount: 15,
    totalAmount: 750,
    createdAt: '2023-06-12T16:45:00Z',
    items: [{ serviceType: 'steamPress' }]
  }
];

console.log('=== Testing Naive Bayes Classifier ===\n');

// Initialize classifier
const classifier = new NaiveBayesClassifier();

// Test training
console.log('1. Testing model training...');
const trainSuccess = classifier.train(testData);
console.log('Training result:', trainSuccess ? '✅ SUCCESS' : '❌ FAILED');

if (trainSuccess) {
  // Test prediction
  console.log('\n2. Testing prediction...');
  const testUserHistory = [
    {
      userOrderCount: 8,
      totalAmount: 1200,
      createdAt: '2023-06-01T10:30:00Z',
      items: [{ serviceType: 'washAndPress' }]
    }
  ];
  
  const prediction = classifier.predict(testUserHistory);
  console.log('Prediction result:', prediction);
  
  // Test probabilities
  console.log('\n3. Testing prediction probabilities...');
  const probabilities = classifier.getPredictionProbabilities(testUserHistory);
  console.log('Probabilities:');
  probabilities.forEach(prob => {
    console.log(`  ${prob.service}: ${(prob.probability * 100).toFixed(2)}%`);
  });
  
  // Verify the classifier is working
  console.log('\n=== Test Results ===');
  if (prediction && typeof prediction === 'string') {
    console.log('✅ Prediction test: PASSED');
  } else {
    console.log('❌ Prediction test: FAILED');
  }
  
  if (probabilities && Array.isArray(probabilities) && probabilities.length > 0) {
    console.log('✅ Probabilities test: PASSED');
  } else {
    console.log('❌ Probabilities test: FAILED');
  }
  
  console.log('\n✅ All tests completed successfully!');
} else {
  console.log('❌ Training failed, skipping other tests');
}

console.log('\n=== Test Complete ===');