const SVMCustomerSegmenter = require('../src/ml/SVMCustomerSegmenter');

// Sample customer data for demonstration
const sampleCustomers = [
  {
    orderFrequency: 25,
    avgOrderValue: 3500,
    daysSinceLastOrder: 5,
    serviceVariety: 4,
    satisfactionScore: 4.8,
    referralCount: 8,
    discountUsage: 2,
    complaintCount: 0,
    segment: 'premium'
  },
  {
    orderFrequency: 12,
    avgOrderValue: 1800,
    daysSinceLastOrder: 15,
    serviceVariety: 3,
    satisfactionScore: 4.2,
    referralCount: 3,
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

// Sample customer for prediction
const newCustomer = {
  orderFrequency: 15,
  avgOrderValue: 2200,
  daysSinceLastOrder: 10,
  serviceVariety: 3,
  satisfactionScore: 4.5,
  referralCount: 5,
  discountUsage: 3,
  complaintCount: 0
};

console.log('=== SVM Customer Segmentation Demo ===\n');

// Initialize segmenter
const segmenter = new SVMCustomerSegmenter();

console.log('Training model with', sampleCustomers.length, 'sample customers...');
const success = segmenter.train(sampleCustomers);

if (success) {
  console.log('✅ SVM Customer Segmenter trained successfully!\n');
  
  // Predict segment for new customer
  console.log('Predicting segment for new customer...');
  const prediction = segmenter.predict(newCustomer);
  
  console.log('\n=== Prediction Result ===');
  console.log('Segment:', prediction.segment);
  console.log('Confidence:', Math.round(prediction.confidence * 100) + '%');
  console.log('Features:', prediction.features);
  
  console.log('\n=== Model Status ===');
  console.log('Model is trained and ready for predictions');
  
} else {
  console.log('❌ Failed to train model');
}

console.log('\n=== Demo Complete ===');