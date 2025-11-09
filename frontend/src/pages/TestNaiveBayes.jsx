import React from 'react';
import NaiveBayesPrediction from '../components/NaiveBayesPrediction';

const TestNaiveBayes = () => {
  // Mock order history for testing
  const mockOrderHistory = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Naive Bayes Classifier Test</h1>
          <p className="text-gray-600">Testing the Naive Bayes implementation with mock data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Data */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Test Data</h2>
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Order History</h3>
              {mockOrderHistory.map((order, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Order #{index + 1}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Orders: {order.userOrderCount}</p>
                    <p>Amount: ₹{order.totalAmount}</p>
                    <p>Service: {order.items[0].serviceType}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Naive Bayes Prediction */}
          <div>
            <NaiveBayesPrediction userOrderHistory={mockOrderHistory} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="prose max-w-none">
            <p>
              The Naive Bayes classifier predicts which service a customer is most likely to choose 
              based on their order history. It analyzes patterns in:
            </p>
            <ul>
              <li>Order frequency</li>
              <li>Average order value</li>
              <li>Preferred time of day</li>
              <li>Service category preferences</li>
              <li>Recency of orders</li>
            </ul>
            <p>
              The algorithm uses the Multinomial Naive Bayes implementation from the ml-naivebayes 
              library to make predictions with probability estimates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNaiveBayes;