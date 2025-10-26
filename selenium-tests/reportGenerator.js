class ReportGenerator {
  constructor() {
    this.testResults = [];
  }

  addTestResult(testName, status, errorMessage = null, duration = 0) {
    this.testResults.push({
      name: testName,
      status: status,
      error: errorMessage,
      duration: duration,
      timestamp: new Date().toISOString()
    });
  }

  generateHTMLReport() {
    const passedTests = this.testResults.filter(test => test.status === 'PASSED').length;
    const failedTests = this.testResults.filter(test => test.status === 'FAILED').length;
    const totalTests = this.testResults.length;
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WashLab Selenium Test Report</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f7fa;
                color: #333;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .summary {
                display: flex;
                justify-content: space-around;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 30px;
            }
            .summary-item {
                text-align: center;
                padding: 15px;
            }
            .passed { color: #28a745; }
            .failed { color: #dc3545; }
            .total { color: #007bff; }
            .pass-rate { color: #ffc107; }
            .test-results {
                background: white;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .test-result {
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            .test-result:last-child {
                border-bottom: none;
            }
            .test-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .test-name {
                font-weight: bold;
                font-size: 18px;
            }
            .test-status {
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 12px;
            }
            .status-passed {
                background-color: #d4edda;
                color: #155724;
            }
            .status-failed {
                background-color: #f8d7da;
                color: #721c24;
            }
            .test-details {
                margin-top: 10px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
            }
            .timestamp {
                color: #6c757d;
                font-size: 14px;
            }
            .duration {
                color: #6c757d;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>WashLab Selenium Test Report</h1>
            <p>Automated UI Testing Results</p>
        </div>

        <div class="summary">
            <div class="summary-item">
                <div class="total">${totalTests}</div>
                <div>Total Tests</div>
            </div>
            <div class="summary-item">
                <div class="passed">${passedTests}</div>
                <div>Passed</div>
            </div>
            <div class="summary-item">
                <div class="failed">${failedTests}</div>
                <div>Failed</div>
            </div>
            <div class="summary-item">
                <div class="pass-rate">${passRate}%</div>
                <div>Pass Rate</div>
            </div>
        </div>

        <div class="test-results">
            <h2 style="padding: 20px; margin: 0; background: #f8f9fa; border-bottom: 2px solid #eee;">Test Results</h2>
`;

    this.testResults.forEach(test => {
      html += `
            <div class="test-result">
                <div class="test-header">
                    <div class="test-name">${test.name}</div>
                    <div class="test-status status-${test.status.toLowerCase()}">${test.status}</div>
                </div>
                <div class="timestamp">Executed: ${test.timestamp}</div>
                <div class="duration">Duration: ${test.duration}ms</div>
`;
      if (test.error) {
        html += `
                <div class="test-details">
                    <strong>Error:</strong><br>
                    <pre>${test.error}</pre>
                </div>
`;
      }
      html += `
            </div>
`;
    });

    html += `
        </div>
    </body>
    </html>
    `;

    return html;
  }
}

module.exports = ReportGenerator;