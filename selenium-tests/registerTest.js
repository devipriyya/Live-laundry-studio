const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('./config');
const ReportGenerator = require('./reportGenerator');

async function runRegisterTests() {
  const report = new ReportGenerator();
  let driver;

  try {
    // Setup Chrome options
    const options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    // Initialize the driver
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // Set timeouts
    await driver.manage().setTimeouts({ implicit: config.timeouts.implicit });

    console.log('Starting Registration Tests...');

    // Test 1: Successful Registration
    try {
      const startTime = Date.now();
      console.log('Test 1: Successful Registration');
      
      // Navigate to registration page
      await driver.get(`${config.baseUrl}/register`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="name"]')), 10000);
      
      // Fill in registration form
      const testName = `TestUser${Date.now()}`; // Unique name for each test run
      await driver.findElement(By.css('input[name="name"]')).sendKeys(testName);
      await driver.findElement(By.css('input[name="email"]')).sendKeys(`test${Date.now()}@example.com`);
      await driver.findElement(By.css('input[name="password"]')).sendKeys(config.credentials.validUser.password);
      await driver.findElement(By.css('input[name="confirmPassword"]')).sendKeys(config.credentials.validUser.password);
      
      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for success message or navigation
      try {
        await driver.wait(until.elementLocated(By.css('.text-emerald-200')), 10000);
        const successMessage = await driver.findElement(By.css('.text-emerald-200')).getText();
        if (successMessage.includes('successful')) {
          const endTime = Date.now();
          report.addTestResult('Successful Registration', 'PASSED', null, endTime - startTime);
          console.log('✓ Test 1 PASSED: Successful Registration');
        } else {
          throw new Error('Success message not displayed correctly');
        }
      } catch (e) {
        // Alternative check for navigation to login
        await driver.wait(until.urlContains('/login'), 5000);
        const endTime = Date.now();
        report.addTestResult('Successful Registration', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 1 PASSED: Successful Registration');
      }
    } catch (error) {
      // Define startTime here as well to avoid reference error
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Successful Registration', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 1 FAILED: Successful Registration -', error.message);
    }

    // Test 2: Password Mismatch
    try {
      const startTime = Date.now();
      console.log('Test 2: Password Mismatch');
      
      // Navigate to registration page
      await driver.get(`${config.baseUrl}/register`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="name"]')), 10000);
      
      // Fill in registration form with mismatched passwords
      await driver.findElement(By.css('input[name="name"]')).sendKeys('Test User');
      await driver.findElement(By.css('input[name="email"]')).sendKeys('test@example.com');
      await driver.findElement(By.css('input[name="password"]')).sendKeys(config.credentials.validUser.password);
      await driver.findElement(By.css('input[name="confirmPassword"]')).sendKeys('differentPassword123!');
      
      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for error message
      await driver.wait(until.elementLocated(By.css('.text-red-200')), 10000);
      
      const errorMessage = await driver.findElement(By.css('.text-red-200')).getText();
      if (errorMessage && errorMessage.includes('match')) {
        const endTime = Date.now();
        report.addTestResult('Password Mismatch', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 2 PASSED: Password Mismatch');
      } else {
        throw new Error('Password mismatch error not displayed correctly');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Password Mismatch', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 2 FAILED: Password Mismatch -', error.message);
    }

    // Test 3: Weak Password
    try {
      const startTime = Date.now();
      console.log('Test 3: Weak Password');
      
      // Navigate to registration page
      await driver.get(`${config.baseUrl}/register`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="name"]')), 10000);
      
      // Fill in registration form with weak password
      await driver.findElement(By.css('input[name="name"]')).sendKeys('Test User');
      await driver.findElement(By.css('input[name="email"]')).sendKeys('test@example.com');
      await driver.findElement(By.css('input[name="password"]')).sendKeys('123');
      await driver.findElement(By.css('input[name="confirmPassword"]')).sendKeys('123');
      
      // Submit form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for error message
      await driver.wait(until.elementLocated(By.css('.text-red-200')), 10000);
      
      const errorMessage = await driver.findElement(By.css('.text-red-200')).getText();
      if (errorMessage && (errorMessage.includes('Password') || errorMessage.includes('weak'))) {
        const endTime = Date.now();
        report.addTestResult('Weak Password', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 3 PASSED: Weak Password');
      } else {
        throw new Error('Weak password error not displayed correctly');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Weak Password', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 3 FAILED: Weak Password -', error.message);
    }

    // Test 4: Empty Form Submission
    try {
      const startTime = Date.now();
      console.log('Test 4: Empty Form Submission');
      
      // Navigate to registration page
      await driver.get(`${config.baseUrl}/register`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="name"]')), 10000);
      
      // Submit empty form
      await driver.findElement(By.css('button[type="submit"]')).click();
      
      // Wait for error messages
      await driver.wait(until.elementLocated(By.css('.text-red-200')), 10000);
      
      const errorMessages = await driver.findElements(By.css('.text-red-200'));
      if (errorMessages.length > 0) {
        const endTime = Date.now();
        report.addTestResult('Empty Form Submission', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 4 PASSED: Empty Form Submission');
      } else {
        throw new Error('Error messages not displayed');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Empty Form Submission', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 4 FAILED: Empty Form Submission -', error.message);
    }

    // Test 5: Navigation to Login Page
    try {
      const startTime = Date.now();
      console.log('Test 5: Navigation to Login Page');
      
      // Navigate to registration page
      await driver.get(`${config.baseUrl}/register`);
      
      // Wait for page to load
      await driver.wait(until.elementLocated(By.css('input[name="name"]')), 10000);
      
      // Click on login link
      await driver.findElement(By.css('a[href="/login"]')).click();
      
      // Wait for navigation
      await driver.wait(until.urlContains('/login'), 10000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('/login')) {
        const endTime = Date.now();
        report.addTestResult('Navigation to Login Page', 'PASSED', null, endTime - startTime);
        console.log('✓ Test 5 PASSED: Navigation to Login Page');
      } else {
        throw new Error('Navigation to login page failed');
      }
    } catch (error) {
      const startTime = Date.now();
      const endTime = Date.now();
      report.addTestResult('Navigation to Login Page', 'FAILED', error.message, endTime - startTime);
      console.log('✗ Test 5 FAILED: Navigation to Login Page -', error.message);
    }

  } catch (error) {
    console.error('Error during test execution:', error);
  } finally {
    if (driver) {
      await driver.quit();
    }
    
    // Generate HTML report
    const htmlReport = report.generateHTMLReport();
    const fs = require('fs');
    const path = require('path');
    const reportPath = path.join(__dirname, 'reports', 'register-test-report.html');
    fs.writeFileSync(reportPath, htmlReport);
    console.log(`\nHTML report generated at: ${reportPath}`);
    
    return report;
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runRegisterTests().then(() => {
    console.log('Registration tests completed');
  }).catch((error) => {
    console.error('Error running registration tests:', error);
  });
}

module.exports = runRegisterTests;