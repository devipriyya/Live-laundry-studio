# WashLab Selenium Testing Documentation

## Overview

This document provides comprehensive information about the Selenium WebDriver tests implemented for the WashLab application. The tests are designed to automate browser-based testing of the web application to ensure functionality, usability, and reliability.

## Test Structure

The Selenium tests are organized in the `selenium-tests` directory with the following structure:

```
selenium-tests/
├── loginTest.js          # Login page tests
├── registerTest.js       # Registration page tests
├── dashboardTest.js      # Dashboard functionality tests
├── testRunner.js         # Combined test runner
├── config.js             # Test configuration
├── reportGenerator.js    # HTML report generation
├── package.json          # Dependencies and scripts
├── README.md             # Basic setup instructions
├── TESTING_GUIDE.md      # Detailed testing guide
├── reports/              # Generated HTML test reports
│   ├── login-test-report.html
│   ├── register-test-report.html
│   ├── dashboard-test-report.html
│   └── combined-test-report.html
└── run-selenium-tests.bat # Windows batch script to run tests
```

## Prerequisites

Before running the Selenium tests, ensure you have:

1. **Node.js** (version 12 or higher) installed
2. **Google Chrome** browser installed
3. **WashLab application** running locally (typically on http://localhost:5173)
4. **Internet connection** for downloading ChromeDriver

## Installation

1. Navigate to the selenium-tests directory:
   ```bash
   cd selenium-tests
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

This will install:
- `selenium-webdriver`: The core Selenium WebDriver library
- `chromedriver`: ChromeDriver for controlling Chrome browser

## Running Tests

### Run All Tests
```bash
npm test
```
This command executes all test suites (login, registration, and dashboard) sequentially and generates a combined HTML report.

### Run Individual Test Suites
```bash
npm run test:login      # Run login tests only
npm run test:register   # Run registration tests only
npm run test:dashboard  # Run dashboard tests only
```

### Run Tests with Node Directly
```bash
node testRunner.js      # Run all tests
node loginTest.js       # Run login tests
node registerTest.js    # Run registration tests
node dashboardTest.js   # Run dashboard tests
```

## Test Configuration

The `config.js` file contains configuration settings:

```javascript
module.exports = {
  baseUrl: 'http://localhost:5173', // Application URL
  timeouts: {
    implicit: 10000,    // Implicit wait time (ms)
    pageLoad: 30000,    // Page load timeout (ms)
    script: 30000       // Script execution timeout (ms)
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
```

## Test Suites

### 1. Login Tests (`loginTest.js`)

Tests the user authentication functionality:

#### Test Cases:
1. **Successful Login**
   - Navigates to login page
   - Enters valid credentials
   - Submits form
   - Verifies successful navigation to dashboard

2. **Invalid Credentials**
   - Navigates to login page
   - Enters invalid credentials
   - Submits form
   - Verifies error message display

3. **Empty Form Submission**
   - Navigates to login page
   - Submits empty form
   - Verifies validation error messages

4. **Navigation to Registration Page**
   - Navigates to login page
   - Clicks registration link
   - Verifies navigation to registration page

### 2. Registration Tests (`registerTest.js`)

Tests the user registration functionality:

#### Test Cases:
1. **Successful Registration**
   - Navigates to registration page
   - Enters valid registration data
   - Submits form
   - Verifies successful account creation

2. **Password Mismatch**
   - Navigates to registration page
   - Enters mismatched passwords
   - Submits form
   - Verifies error message display

3. **Weak Password**
   - Navigates to registration page
   - Enters weak password
   - Submits form
   - Verifies validation error

4. **Empty Form Submission**
   - Navigates to registration page
   - Submits empty form
   - Verifies validation errors

5. **Navigation to Login Page**
   - Navigates to registration page
   - Clicks login link
   - Verifies navigation to login page

### 3. Dashboard Tests (`dashboardTest.js`)

Tests the authenticated user dashboard functionality:

#### Test Cases:
1. **Dashboard Page Load**
   - Logs in with valid credentials
   - Verifies dashboard content loads correctly

2. **Navigation to My Orders Page**
   - From dashboard, navigates to orders page
   - Verifies navigation success

3. **Profile Navigation**
   - From dashboard, navigates to profile page
   - Verifies navigation success

4. **Logout Functionality**
   - From dashboard, performs logout
   - Verifies redirection to login page

## Test Implementation Details

### WebDriver Setup
All tests use Chrome in headless mode for consistent execution:
```javascript
const options = new chrome.Options();
options.addArguments('--headless'); // Run in headless mode
options.addArguments('--no-sandbox');
options.addArguments('--disable-dev-shm-usage');

const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();
```

### Error Handling
Each test includes comprehensive error handling:
```javascript
try {
  // Test implementation
  report.addTestResult('Test Name', 'PASSED', null, duration);
} catch (error) {
  report.addTestResult('Test Name', 'FAILED', error.message, duration);
}
```

### Reporting
The test framework generates detailed HTML reports with:
- Pass/fail status for each test
- Execution time
- Error messages for failed tests
- Overall pass rate statistics

## Test Reports

After running tests, HTML reports are automatically generated in the `reports` directory:

- `login-test-report.html` - Detailed results for login tests
- `register-test-report.html` - Detailed results for registration tests
- `dashboard-test-report.html` - Detailed results for dashboard tests
- `combined-test-report.html` - Combined results for all test suites

Reports include:
- Test execution summary
- Individual test results with timestamps
- Error details for failed tests
- Execution time statistics
- Visual pass/fail indicators

## Customizing Tests

### Modifying Configuration
Update `config.js` to:
- Change the base URL if your application runs on a different port
- Update test credentials
- Adjust timeout values

### Adding New Tests
To add new test cases:
1. Open the appropriate test file (e.g., `loginTest.js`)
2. Add a new test block following the existing pattern
3. Include proper error handling and reporting
4. Run tests to verify implementation

### Extending Test Coverage
To add new test suites:
1. Create a new test file (e.g., `orderTest.js`)
2. Implement test cases using the Selenium WebDriver API
3. Integrate with the test runner in `testRunner.js`
4. Add npm script in `package.json`

## Best Practices

### Test Design
- Use explicit waits instead of fixed delays
- Implement proper error handling
- Follow the page object model pattern for complex pages
- Keep tests independent and isolated

### Maintenance
- Update selectors when UI changes
- Regularly review and update test data
- Monitor test execution times
- Clean up test reports periodically

### Troubleshooting
Common issues and solutions:
- **Timeout errors**: Increase timeout values in `config.js`
- **Element not found**: Update CSS selectors to match current UI
- **ChromeDriver issues**: Ensure Chrome and ChromeDriver versions match
- **Headless mode issues**: Run tests in non-headless mode for debugging

## Continuous Integration

The Selenium tests can be integrated into CI/CD pipelines:
```bash
# Example CI script
cd selenium-tests
npm install
npm test
```

The exit codes and reports can be used to determine build success/failure.

## Performance Considerations

- Tests run in headless mode for faster execution
- Implicit waits are used to handle dynamic content
- Test data is isolated to prevent interference between runs
- Reports are generated automatically for easy analysis

## Limitations

- Tests currently only support Chrome browser
- Headless mode may miss some visual issues
- Tests require the application to be running locally
- Test data must be managed separately from production data

## Future Enhancements

Planned improvements:
- Cross-browser testing support
- Parallel test execution
- Integration with cloud testing services
- Enhanced reporting with screenshots
- Data-driven testing capabilities