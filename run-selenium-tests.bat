@echo off
echo Running WashLab Selenium Tests
echo =============================

echo Installing dependencies...
cd selenium-tests
npm install

echo.
echo Running all Selenium tests...
echo.

node testRunner.js

echo.
echo Test execution completed!
echo Check the reports directory for HTML reports.
echo.
echo Press any key to exit...
pause >nul