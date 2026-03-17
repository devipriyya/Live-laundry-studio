module.exports = {
  baseUrl: 'http://localhost:5173', // Adjust if necessary
  timeouts: {
    implicit: 10000,
    pageLoad: 30000,
    element: 10000
  },
  credentials: {
    customer: {
      email: 'test@example.com',
      password: 'TestPassword123!'
    },
    admin: {
      email: 'admin@gmail.com',
      password: 'password123'
    }
  }
};
