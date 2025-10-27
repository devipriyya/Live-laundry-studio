import '@testing-library/jest-dom';

// Fix for TextEncoder issue
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mocks for React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  }),
}));

// Mock for AuthContext
jest.mock('./frontend/src/context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    login: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock for API calls
jest.mock('./frontend/src/api', () => ({
  default: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: {} }),
  },
}));