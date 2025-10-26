# Selenium Testing Setup for WashLab

This document explains how to set up and run Selenium tests for the WashLab application.

## Overview

This project now includes a complete Selenium testing suite with:
- Login functionality tests
- Registration functionality tests
- Dashboard and navigation tests
- HTML report generation
- Batch scripts for easy execution

## Directory Structure

```
selenium-tests/
├── config.js              # Test configuration
├── reportGenerator.js     # HTML report generator
├── loginTest.js           # Login functionality tests
├── registerTest.js        # Registration functionality tests
├── dashboardTest.js       # Dashboard and navigation tests
├── testRunner.js          # Combined test runner
├── sampleTest.js          # Sample test for verification
├── package.json           # Selenium test dependencies
├── README.md              # Selenium tests documentation
├── TESTING_GUIDE.md       # Detailed testing guide
├── reports/               # Generated HTML reports
│   ├── login-test-report.html
│   ├── register-test-report.html
│   ├── dashboard-test-report.html
│   └── combined-test-report.html
```

## Quick Start

1. **Start the WashLab application:**
   ```
   start-for-testing.bat
   ```
   This will start both the backend (port 5000) and frontend (port 5173) servers.

2. **Run Selenium tests:**
   ```
   run-selenium-tests.bat
   ```
   Or alternatively:
   ```
   npm run test:selenium
   ```

## Running Tests Individually

### Using npm scripts (from root directory):
```
npm run test:selenium:login
npm run test:selenium:register
npm run test:selenium:dashboard
```

### Using node directly (from selenium-tests directory):
```
cd selenium-tests
node loginTest.js
node registerTest.js
node dashboardTest.js
```

## Test Reports

After running tests, HTML reports are automatically generated in `selenium-tests/reports/`:
- `combined-test-report.html` - Overall test results (recommended)
- `login-test-report.html` - Login test results
- `register-test-report.html` - Registration test results
- `dashboard-test-report.html` - Dashboard test results

## Configuration

The test configuration can be found in `selenium-tests/config.js`:
- Base URL for the application
- Timeout settings
- Test credentials

## Adding New Tests

To add new test cases:
1. Create a new test function in the appropriate test file
2. Follow the existing pattern for error handling and reporting
3. Add the new test to the test runner if creating a new test file

## Troubleshooting

Common issues and solutions:
1. **Chrome not found**: Ensure Google Chrome is installed
2. **Connection refused**: Verify WashLab servers are running
3. **Element not found**: Check CSS selectors match current UI
4. **Timing issues**: Increase timeout values in config.js

## Continuous Integration

These tests can be integrated into CI/CD pipelines by:
1. Starting the WashLab application servers
2. Running `npm run test:selenium`
3. Archiving the HTML reports as artifacts