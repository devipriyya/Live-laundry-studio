module.exports = {
  baseUrl: 'http://localhost:5173', // Default Vite development server URL
  timeouts: {
    implicit: 10000,
    pageLoad: 30000,
    script: 30000
  },
  credentials: {
    validUser: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!'
    },
    invalidUser: {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    }
  }
};