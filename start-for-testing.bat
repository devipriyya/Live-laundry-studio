@echo off
echo Starting WashLab Application for Selenium Testing
echo ================================================

echo Starting backend server...
cd backend
start "Backend Server" cmd /k "node src/index.js"
cd ..

timeout /t 5 /nobreak >nul

echo Starting frontend development server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo WashLab application servers started!
echo.
echo Frontend URL: http://localhost:5173
echo Backend URL: http://localhost:5000
echo.
echo Now you can run Selenium tests from the selenium-tests directory:
echo   cd selenium-tests
echo   npm test
echo.
echo Press any key to exit...
pause >nul