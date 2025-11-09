import React from 'react';
import CustomerSegment from './components/CustomerSegment';

const TestCustomerSegment = () => {
  // Mock customer data for testing
  const mockCustomerData = {
    orderFrequency: 15,
    avgOrderValue: 1250,
    daysSinceLastOrder: 5,
    serviceVariety: 3,
    satisfactionScore: 4.8,
    referralCount: 2,
    discountUsage: 4,
    complaintCount: 0,
    segment: 'premium' // Predefined segment for testing
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Segment Test</h1>
      <div className="max-w-md">
        <CustomerSegment customerData={mockCustomerData} />
      </div>
    </div>
  );
};

export default TestCustomerSegment;