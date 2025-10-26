# WashLab Selenium Tests

This directory contains Selenium WebDriver tests for the WashLab application.

## Prerequisites

1. Node.js installed
2. Chrome browser installed
3. WashLab application running locally

## Installation

1. Navigate to the selenium-tests directory:
   ```
   cd selenium-tests
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Running Tests

### Run All Tests
```
npm test
```

### Run Individual Test Suites
```
npm run test:login
npm run test:register
npm run test:dashboard
```

### Run Tests with Node Directly
```
node testRunner.js
node loginTest.js
node registerTest.js
node dashboardTest.js
```

## Test Reports

After running tests, HTML reports are generated in the `reports` directory:
- `login-test-report.html` - Login test results
- `register-test-report.html` - Registration test results
- `dashboard-test-report.html` - Dashboard test results
- `combined-test-report.html` - All test results combined

## Test Structure

### Login Tests (`loginTest.js`)
- Successful login
- Invalid credentials
- Empty form submission
- Navigation to registration page

### Registration Tests (`registerTest.js`)
- Successful registration
- Password mismatch
- Weak password
- Empty form submission
- Navigation to login page

### Dashboard Tests (`dashboardTest.js`)
- Dashboard page load
- Navigation to My Orders page
- Profile navigation
- Logout functionality

## Configuration

The `config.js` file contains:
- Base URL for the application
- Timeouts for WebDriver operations
- Test credentials

## Customizing Tests

You can modify the `config.js` file to:
- Change the base URL if your application runs on a different port
- Update test credentials
- Adjust timeout values

## Viewing Reports

Open any of the HTML report files in a web browser to view detailed test results with:
- Pass/fail status
- Execution time
- Error messages for failed tests
- Overall pass rate statistics