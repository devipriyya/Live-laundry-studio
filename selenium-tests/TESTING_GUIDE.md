# WashLab Selenium Testing Guide

## Prerequisites

1. Node.js (version 14 or higher)
2. Google Chrome browser
3. WashLab application running locally

## Setting Up the WashLab Application

Before running Selenium tests, you need to have the WashLab application running locally.

### Starting the Backend Server

1. Navigate to the backend directory:
   ```
   cd ../backend
   ```

2. Install backend dependencies (if not already done):
   ```
   npm install
   ```

3. Start the backend server:
   ```
   node src/index.js
   ```
   
   The backend server should start on port 5000.

### Starting the Frontend Development Server

1. Navigate to the frontend directory:
   ```
   cd ../frontend
   ```

2. Install frontend dependencies (if not already done):
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```
   
   The frontend server should start on port 5173 (or the next available port).

## Running Selenium Tests

### 1. Install Selenium Test Dependencies

Make sure you're in the selenium-tests directory:
```
cd selenium-tests
```

Install dependencies:
```
npm install
```

### 2. Configure Test Settings

Check the `config.js` file and update the baseUrl if your frontend server is running on a different port:
```javascript
module.exports = {
  baseUrl: 'http://localhost:5173', // Update if needed
  // ... other settings
};
```

### 3. Run Tests

#### Run All Tests
```
npm test
```

#### Run Individual Test Suites
```
npm run test:login
npm run test:register
npm run test:dashboard
```

#### Run Tests with Node Directly
```
node testRunner.js
node loginTest.js
node registerTest.js
node dashboardTest.js
```

## Understanding Test Results

### Console Output
When you run the tests, you'll see console output showing:
- Which tests are being executed
- Whether each test passes or fails
- Summary statistics at the end

### HTML Reports
After running tests, detailed HTML reports are generated in the `reports` directory:
- `login-test-report.html` - Login test results
- `register-test-report.html` - Registration test results
- `dashboard-test-report.html` - Dashboard test results
- `combined-test-report.html` - All test results combined

To view these reports:
1. Navigate to the `reports` directory
2. Open any HTML file in a web browser

The HTML reports include:
- Summary statistics (total tests, passed, failed, pass rate)
- Detailed results for each test
- Execution time for each test
- Error messages for failed tests

## Test Cases Overview

### Login Tests (`loginTest.js`)
1. **Successful Login** - Tests logging in with valid credentials
2. **Invalid Credentials** - Tests error handling for incorrect login
3. **Empty Form Submission** - Tests validation for empty login form
4. **Navigation to Registration Page** - Tests navigation link from login to registration

### Registration Tests (`registerTest.js`)
1. **Successful Registration** - Tests creating a new account
2. **Password Mismatch** - Tests error handling for non-matching passwords
3. **Weak Password** - Tests validation for password strength
4. **Empty Form Submission** - Tests validation for empty registration form
5. **Navigation to Login Page** - Tests navigation link from registration to login

### Dashboard Tests (`dashboardTest.js`)
1. **Dashboard Page Load** - Tests that the dashboard loads correctly after login
2. **Navigation to My Orders Page** - Tests navigation to the orders section
3. **Profile Navigation** - Tests navigation to the user profile
4. **Logout Functionality** - Tests the logout process

## Customizing Tests

### Updating Test Credentials
Modify the `config.js` file to change test credentials:
```javascript
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
```

### Changing Test URLs
Update the baseUrl in `config.js` if your application runs on a different port:
```javascript
baseUrl: 'http://localhost:5173' // Change port as needed
```

### Adjusting Timeouts
Modify timeout values in `config.js`:
```javascript
timeouts: {
  implicit: 10000,
  pageLoad: 30000,
  script: 30000
}
```

## Troubleshooting

### Common Issues

1. **"Chrome not found" error**
   - Make sure Google Chrome is installed on your system
   - Check that ChromeDriver version matches your Chrome browser version

2. **"Connection refused" error**
   - Ensure the WashLab frontend and backend servers are running
   - Check that the baseUrl in config.js matches your frontend server URL

3. **Tests failing due to timing issues**
   - Increase timeout values in config.js
   - Add explicit waits in test code where needed

4. **Element not found errors**
   - Check that CSS selectors in tests match the current UI
   - Add waits for elements to load before interacting with them

### Debugging Tips

1. **Run tests in non-headless mode** - Remove the `--headless` argument from Chrome options to see the browser automation in action

2. **Add console.log statements** - Insert logging in test code to debug execution flow

3. **Check browser console** - When running in non-headless mode, open browser developer tools to check for JavaScript errors

4. **Increase timeout values** - If tests are failing due to timing issues, increase the timeout values in config.js

## Extending Tests

To add new test cases:

1. Create a new test function in the appropriate test file
2. Follow the existing pattern of:
   - Using try/catch blocks for error handling
   - Adding results to the report generator
   - Including timing information
3. Add the new test to the test runner if creating a new test file

## Continuous Integration

These tests can be integrated into a CI/CD pipeline by:
1. Ensuring all prerequisites are installed in the CI environment
2. Starting the WashLab application servers
3. Running `npm test` in the selenium-tests directory
4. Archiving the HTML reports as artifacts