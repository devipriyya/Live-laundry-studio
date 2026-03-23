@echo off
echo Starting WashLab RL Assistant Microservice...
cd /d "%~dp0rl_service"
"C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe" app.py
pause
