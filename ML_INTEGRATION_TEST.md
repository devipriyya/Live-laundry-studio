# ML Integration Test Plan

This document outlines a test plan to verify that the ML system can be successfully integrated into the existing dashboard.

## Test Objectives

1. Verify that the ML system can be trained with real order data
2. Confirm that the API endpoints are working correctly
3. Validate that the frontend components can display recommendations
4. Ensure that the integration doesn't break existing functionality

## Test Steps

### 1. Backend Integration Test

#### 1.1. Start the Backend Server
```bash
cd backend
npm start
```

#### 1.2. Check ML Status Endpoint
```bash
curl http://localhost:5000/api/ml/status
```
Expected response:
```json
{
  "isTrained": false,
  "message": "Model needs to be trained first"
}
```

#### 1.3. Train the Model with Sample Data
```bash
curl -X POST http://localhost:5000/api/ml/train \
  -H "Content-Type: application/json" \
  -d '{
    "orders": [
      {
        "userOrderCount": 5,
        "totalAmount": 1200,
        "orderDate": "2023-05-15T10:30:00Z",
        "items": [{"service": "washAndPress"}]
      },
      {
        "userOrderCount": 3,
        "totalAmount": 2100,
        "orderDate": "2023-05-10T14:15:00Z",
        "items": [{"service": "dryCleaning"}]
      }
    ]
  }'
```
Expected response:
```json
{
  "message": "Model trained successfully",
  "sampleCount": 2
}
```

#### 1.4. Check ML Status After Training
```bash
curl http://localhost:5000/api/ml/status
```
Expected response:
```json
{
  "isTrained": true,
  "message": "Model is ready for predictions"
}
```

#### 1.5. Test Prediction Endpoint
```bash
curl -X POST http://localhost:5000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "userFeatures": [4, 1500, 1, 1, 7]
  }'
```
Expected response:
```json
{
  "prediction": "dryCleaning"
}
```

#### 1.6. Test Recommendation Endpoint
```bash
curl -X POST http://localhost:5000/api/ml/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "userOrderHistory": [
      {
        "userOrderCount": 4,
        "totalAmount": 1300,
        "orderDate": "2023-05-10T10:30:00Z",
        "items": [{"service": "washAndPress"}]
      }
    ]
  }'
```
Expected response:
```json
{
  "recommendations": [
    {
      "service": "dryCleaning",
      "confidence": 0.8
    }
  ]
}
```

### 2. Frontend Integration Test

#### 2.1. Verify Component Import
Check that the ServiceRecommendations component can be imported without errors:
```jsx
import ServiceRecommendations from '../components/ServiceRecommendations';
```

#### 2.2. Test Component Rendering
Create a simple test page that includes the ServiceRecommendations component:
```jsx
// TestMLIntegration.jsx
import React from 'react';
import ServiceRecommendations from '../components/ServiceRecommendations';

const TestMLIntegration = () => {
  const sampleOrderHistory = [
    {
      userOrderCount: 4,
      totalAmount: 1300,
      orderDate: '2023-05-10T10:30:00Z',
      items: [{ service: 'washAndPress' }]
    }
  ];

  return (
    <div>
      <h1>ML Integration Test</h1>
      <ServiceRecommendations userOrderHistory={sampleOrderHistory} />
    </div>
  );
};

export default TestMLIntegration;
```

#### 2.3. Test Loading States
Verify that the component properly displays loading states when fetching recommendations.

#### 2.4. Test Error Handling
Verify that the component properly displays error messages when the API is unavailable.

### 3. End-to-End Integration Test

#### 3.1. Dashboard Integration
Add the ServiceRecommendations component to an existing dashboard page:
```jsx
// In an existing dashboard component
import ServiceRecommendations from '../components/ServiceRecommendations';

// Inside the component render method
<div className="dashboard-layout">
  <div className="main-content">
    {/* Existing dashboard content */}
  </div>
  <div className="sidebar">
    <ServiceRecommendations userOrderHistory={userOrders} />
  </div>
</div>
```

#### 3.2. Verify Data Flow
Ensure that user order data is properly passed to the recommendations component.

#### 3.3. Test User Experience
Verify that recommendations are displayed correctly and update when order data changes.

### 4. Performance Test

#### 4.1. Response Time
Measure the response time for ML API endpoints:
- Training endpoint: < 5 seconds for 1000 orders
- Prediction endpoint: < 100ms
- Recommendation endpoint: < 150ms

#### 4.2. Concurrent Requests
Test the system's ability to handle multiple concurrent requests.

#### 4.3. Memory Usage
Monitor memory usage during training and prediction operations.

### 5. Error Handling Test

#### 5.1. Invalid Data
Test API endpoints with invalid or missing data:
```bash
# Missing orders data
curl -X POST http://localhost:5000/api/ml/train \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### 5.2. Model Not Trained
Test recommendation endpoint when model is not trained:
```bash
# Reset model state if possible, then test
curl -X POST http://localhost:5000/api/ml/recommend \
  -H "Content-Type: application/json" \
  -d '{"userOrderHistory": []}'
```

#### 5.3. Network Errors
Test frontend component behavior when API is unreachable.

### 6. Security Test

#### 6.1. CORS Headers
Verify that CORS headers are properly configured for ML endpoints.

#### 6.2. Rate Limiting
Test that the API can handle rate limiting if implemented.

#### 6.3. Input Validation
Verify that the API properly validates input data to prevent injection attacks.

## Expected Results

### Successful Integration
- ✅ ML API endpoints return correct responses
- ✅ Frontend components display recommendations properly
- ✅ Existing dashboard functionality remains intact
- ✅ Performance meets requirements
- ✅ Error handling works correctly
- ✅ Security measures are in place

### Failure Scenarios
- ❌ API endpoints return errors
- ❌ Frontend components fail to load
- ❌ Existing functionality is broken
- ❌ Performance is unacceptable
- ❌ Error handling is inadequate
- ❌ Security vulnerabilities are present

## Test Data

### Sample Orders for Training
```json
[
  {
    "userOrderCount": 15,
    "totalAmount": 1250,
    "orderDate": "2023-05-15T10:30:00Z",
    "items": [{"service": "washAndPress"}]
  },
  {
    "userOrderCount": 8,
    "totalAmount": 2100,
    "orderDate": "2023-05-10T14:15:00Z",
    "items": [{"service": "dryCleaning"}]
  },
  {
    "userOrderCount": 12,
    "totalAmount": 800,
    "orderDate": "2023-05-12T16:45:00Z",
    "items": [{"service": "steamPress"}]
  }
]
```

### Sample User History for Recommendations
```json
[
  {
    "userOrderCount": 6,
    "totalAmount": 1300,
    "orderDate": "2023-05-10T10:30:00Z",
    "items": [{"service": "washAndPress"}]
  },
  {
    "userOrderCount": 6,
    "totalAmount": 1450,
    "orderDate": "2023-05-05T11:15:00Z",
    "items": [{"service": "washAndPress"}]
  }
]
```

### Sample User Features for Prediction
```json
[6, 1300, 1, 1, 5]
```

## Test Tools

### API Testing
- curl or Postman for API endpoint testing
- Jest for unit testing
- Supertest for integration testing

### Frontend Testing
- React Testing Library for component testing
- Cypress for end-to-end testing
- Storybook for component development

### Performance Testing
- Apache Bench (ab) for load testing
- Chrome DevTools for performance monitoring
- Lighthouse for performance auditing

### Security Testing
- OWASP ZAP for security scanning
- npm audit for dependency security
- Manual penetration testing

## Test Schedule

### Phase 1: Backend API Testing (1 day)
- Set up test environment
- Test all API endpoints
- Document results

### Phase 2: Frontend Component Testing (1 day)
- Test component rendering
- Test loading and error states
- Document results

### Phase 3: Integration Testing (2 days)
- Integrate ML components with dashboard
- Test end-to-end functionality
- Document results

### Phase 4: Performance and Security Testing (1 day)
- Performance testing
- Security testing
- Document results

### Phase 5: Final Validation (0.5 days)
- Review all test results
- Fix any issues found
- Final validation

## Success Criteria

### Functional Requirements
- All ML API endpoints work correctly
- Frontend components display recommendations
- Integration doesn't break existing functionality

### Performance Requirements
- API response times meet targets
- Memory usage is acceptable
- System can handle expected load

### Security Requirements
- CORS is properly configured
- Input validation prevents attacks
- No known security vulnerabilities

### User Experience Requirements
- Recommendations are relevant and useful
- Loading states provide good feedback
- Error messages are helpful

## Rollback Plan

If integration fails:
1. Revert changes to backend routes
2. Remove ML components from frontend
3. Restore previous dashboard implementation
4. Document issues and fix before re-attempting integration

## Conclusion

This test plan ensures that the ML system is properly integrated into the existing laundry service application. By following these steps, we can verify that the implementation is working correctly and providing value to users through personalized service recommendations.