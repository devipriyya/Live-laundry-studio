// Simple test to check if the Stain Removal component can be imported without errors
try {
  const React = require('react');
  const ReactDOM = require('react-dom/client');
  
  // Mock the required modules
  jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
  }));
  
  jest.mock('../../context/AuthContext', () => ({
    AuthContext: {
      Consumer: ({ children }) => children({ user: null }),
    }
  }));
  
  // Try to import the component
  const DashboardStainRemoval = require('./frontend/src/pages/dashboard/DashboardStainRemoval.jsx');
  
  console.log('✅ Stain Removal component imported successfully');
  console.log('Component type:', typeof DashboardStainRemoval);
  
} catch (error) {
  console.error('❌ Error importing Stain Removal component:', error.message);
  console.error('Stack trace:', error.stack);
}