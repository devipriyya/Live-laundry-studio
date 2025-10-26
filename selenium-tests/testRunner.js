const runLoginTests = require('./loginTest');
const runRegisterTests = require('./registerTest');
const runDashboardTests = require('./dashboardTest');
const ReportGenerator = require('./reportGenerator');
const fs = require('fs');
const path = require('path');

async function runAllTests() {
  console.log('Starting all Selenium tests...\n');
  
  const combinedReport = new ReportGenerator();
  
  // Run Login Tests
  console.log('=== Running Login Tests ===');
  try {
    const loginReport = await runLoginTests();
    if (loginReport && loginReport.testResults) {
      loginReport.testResults.forEach(test => {
        combinedReport.addTestResult(`[Login] ${test.name}`, test.status, test.error, test.duration);
      });
    }
  } catch (error) {
    console.error('Error running login tests:', error);
  }
  
  // Run Registration Tests
  console.log('\n=== Running Registration Tests ===');
  try {
    const registerReport = await runRegisterTests();
    if (registerReport && registerReport.testResults) {
      registerReport.testResults.forEach(test => {
        combinedReport.addTestResult(`[Register] ${test.name}`, test.status, test.error, test.duration);
      });
    }
  } catch (error) {
    console.error('Error running registration tests:', error);
  }
  
  // Run Dashboard Tests
  console.log('\n=== Running Dashboard Tests ===');
  try {
    const dashboardReport = await runDashboardTests();
    if (dashboardReport && dashboardReport.testResults) {
      dashboardReport.testResults.forEach(test => {
        combinedReport.addTestResult(`[Dashboard] ${test.name}`, test.status, test.error, test.duration);
      });
    }
  } catch (error) {
    console.error('Error running dashboard tests:', error);
  }
  
  // Generate combined HTML report
  const htmlReport = combinedReport.generateHTMLReport();
  const reportPath = path.join(__dirname, 'reports', 'combined-test-report.html');
  fs.writeFileSync(reportPath, htmlReport);
  console.log(`\nCombined HTML report generated at: ${reportPath}`);
  
  // Print summary to console
  const passedTests = combinedReport.testResults.filter(test => test.status === 'PASSED').length;
  const failedTests = combinedReport.testResults.filter(test => test.status === 'FAILED').length;
  const totalTests = combinedReport.testResults.length;
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;
  
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Pass Rate: ${passRate}%`);
  console.log('====================\n');
  
  return combinedReport;
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllTests().then(() => {
    console.log('All tests completed successfully!');
  }).catch((error) => {
    console.error('Error running all tests:', error);
  });
}

module.exports = runAllTests;