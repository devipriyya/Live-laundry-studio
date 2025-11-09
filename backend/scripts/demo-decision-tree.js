const DecisionTreeClassifier = require('../src/ml/DecisionTreeClassifier');

// Sample customer data for demonstration
const sampleCustomers = [
  {
    userId: 'user1',
    orderFrequency: 15,
    avgOrderValue: 2500,
    daysSinceLastOrder: 5,
    serviceVariety: 4,
    satisfactionScore: 4.5,
    referralCount: 3,
    discountUsage: 2,
    complaintCount: 0,
    segment: 'premium'
  },
  {
    userId: 'user2',
    orderFrequency: 8,
    avgOrderValue: 1200,
    daysSinceLastOrder: 15,
    serviceVariety: 3,
    satisfactionScore: 4.0,
    referralCount: 1,
    discountUsage: 1,
    complaintCount: 0,
    segment: 'regular'
  },
  {
    userId: 'user3',
    orderFrequency: 3,
    avgOrderValue: 500,
    daysSinceLastOrder: 45,
    serviceVariety: 2,
    satisfactionScore: 3.5,
    referralCount: 0,
    discountUsage: 3,
    complaintCount: 1,
    segment: 'budget'
  },
  {
    userId: 'user4',
    orderFrequency: 0,
    avgOrderValue: 0,
    daysSinceLastOrder: 365,
    serviceVariety: 0,
    satisfactionScore: 3.0,
    referralCount: 0,
    discountUsage: 0,
    complaintCount: 0,
    segment: 'inactive'
  },
  {
    userId: 'user5',
    orderFrequency: 12,
    avgOrderValue: 1800,
    daysSinceLastOrder: 10,
    serviceVariety: 5,
    satisfactionScore: 4.8,
    referralCount: 5,
    discountUsage: 1,
    complaintCount: 0,
    segment: 'premium'
  },
  {
    userId: 'user6',
    orderFrequency: 5,
    avgOrderValue: 800,
    daysSinceLastOrder: 30,
    serviceVariety: 2,
    satisfactionScore: 3.2,
    referralCount: 0,
    discountUsage: 2,
    complaintCount: 0,
    segment: 'budget'
  },
  {
    userId: 'user7',
    orderFrequency: 20,
    avgOrderValue: 3000,
    daysSinceLastOrder: 2,
    serviceVariety: 5,
    satisfactionScore: 4.9,
    referralCount: 8,
    discountUsage: 0,
    complaintCount: 0,
    segment: 'premium'
  },
  {
    userId: 'user8',
    orderFrequency: 1,
    avgOrderValue: 300,
    daysSinceLastOrder: 120,
    serviceVariety: 1,
    satisfactionScore: 2.5,
    referralCount: 0,
    discountUsage: 1,
    complaintCount: 2,
    segment: 'budget'
  }
];

console.log('=== Decision Tree Customer Segmentation Demo ===\n');

// Initialize and train the Decision Tree classifier
const classifier = new DecisionTreeClassifier();
console.log('Training Decision Tree classifier...');

const success = classifier.train(sampleCustomers);

if (success) {
  console.log('✓ Decision Tree classifier trained successfully!\n');
  
  // Test predictions on new customer data
  const testCustomers = [
    {
      userId: 'newUser1',
      orderFrequency: 10,
      avgOrderValue: 2000,
      daysSinceLastOrder: 7,
      serviceVariety: 3,
      satisfactionScore: 4.2,
      referralCount: 2,
      discountUsage: 1,
      complaintCount: 0
    },
    {
      userId: 'newUser2',
      orderFrequency: 2,
      avgOrderValue: 400,
      daysSinceLastOrder: 60,
      serviceVariety: 1,
      satisfactionScore: 3.0,
      referralCount: 0,
      discountUsage: 2,
      complaintCount: 1
    }
  ];
  
  console.log('Making predictions for new customers:\n');
  
  testCustomers.forEach((customer, index) => {
    const prediction = classifier.predict(customer);
    console.log(`Customer ${index + 1}:`);
    console.log(`  Predicted Segment: ${prediction.segment}`);
    console.log(`  Confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
    console.log(`  Features: [${customer.orderFrequency}, ${customer.avgOrderValue}, ${customer.daysSinceLastOrder}, ${customer.serviceVariety}, ${customer.satisfactionScore}, ${customer.referralCount}, ${customer.discountUsage}, ${customer.complaintCount}]`);
    console.log('');
  });
  
  // Show feature importance
  const importance = classifier.getFeatureImportance();
  if (importance) {
    console.log('Feature Importance:');
    importance.featureNames.forEach((name, index) => {
      console.log(`  ${name}: ${(importance.importance[index] * 100).toFixed(1)}%`);
    });
  }
} else {
  console.log('✗ Failed to train Decision Tree classifier');
}

console.log('\n=== Demo Complete ===');