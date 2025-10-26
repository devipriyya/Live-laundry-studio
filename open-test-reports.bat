@echo off
echo Opening WashLab Selenium Test Reports
echo ======================================

cd selenium-tests\reports

if exist "combined-test-report.html" (
    echo Opening combined test report...
    start "" "combined-test-report.html"
) else (
    echo Combined test report not found. Running tests first...
    cd ..
    node testRunner.js
    cd reports
    if exist "combined-test-report.html" (
        echo Opening combined test report...
        start "" "combined-test-report.html"
    ) else (
        echo Failed to generate test report.
    )
)

echo.
echo Press any key to exit...
pause >nul