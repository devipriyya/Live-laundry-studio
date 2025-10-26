// Test if the component can be rendered without errors
const React = require('react');

// Mock required modules
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  AuthContext: {
    Consumer: ({ children }) => children({ user: null }),
  }
}));

// Mock the Heroicons
jest.mock('@heroicons/react/24/outline', () => ({
  BeakerIcon: () => React.createElement('div'),
  CalendarDaysIcon: () => React.createElement('div'),
  ClockIcon: () => React.createElement('div'),
  CurrencyRupeeIcon: () => React.createElement('div'),
  CheckCircleIcon: () => React.createElement('div'),
  MinusIcon: () => React.createElement('div'),
  PlusIcon: () => React.createElement('div'),
  ArrowLeftIcon: () => React.createElement('div'),
  ShoppingBagIcon: () => React.createElement('div'),
}));

// Mock the api
jest.mock('../api', () => ({
  default: {
    post: jest.fn(),
  }
}));

try {
  // Try to import and render the component
  const { default: DashboardStainRemoval } = require('./frontend/src/pages/dashboard/DashboardStainRemoval.jsx');
  
  console.log('✅ Component imported successfully');
  
  // Try to create a React element
  const element = React.createElement(DashboardStainRemoval);
  console.log('✅ Component element created successfully');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack trace:', error.stack);
}