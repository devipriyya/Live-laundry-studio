@echo off
setlocal

REM Fabrico Azure Deployment Script for Windows

REM Variables - Update these with your own values
set RESOURCE_GROUP=fabrico-rg
set LOCATION=eastus
set DOCKER_HUB_USERNAME=your-dockerhub-username
set BACKEND_IMAGE_NAME=fabrico-backend
set FRONTEND_IMAGE_NAME=fabrico-frontend
set BACKEND_CONTAINER_NAME=fabrico-backend
set FRONTEND_CONTAINER_NAME=fabrico-frontend
set BACKEND_DNS_LABEL=fabrico-backend
set FRONTEND_DNS_LABEL=fabrico-frontend

echo Starting Fabrico deployment to Azure...

REM Login to Azure (if not already logged in)
echo Please ensure you are logged into Azure CLI...
az account show >nul 2>&1
if %errorlevel% neq 0 (
    az login
)

REM Create resource group
echo Creating resource group: %RESOURCE_GROUP%
az group create --name %RESOURCE_GROUP% --location %LOCATION%

REM Build and push backend image
echo Building and pushing backend Docker image...
cd backend
docker build -t %DOCKER_HUB_USERNAME%/%BACKEND_IMAGE_NAME%:latest .
docker push %DOCKER_HUB_USERNAME%/%BACKEND_IMAGE_NAME%:latest
cd ..

REM Build and push frontend image
echo Building and pushing frontend Docker image...
cd frontend
docker build -t %DOCKER_HUB_USERNAME%/%FRONTEND_IMAGE_NAME%:latest .
docker push %DOCKER_HUB_USERNAME%/%FRONTEND_IMAGE_NAME%:latest
cd ..

REM Deploy backend container
echo Deploying backend container...
az container create ^
  --resource-group %RESOURCE_GROUP% ^
  --name %BACKEND_CONTAINER_NAME% ^
  --image %DOCKER_HUB_USERNAME%/%BACKEND_IMAGE_NAME%:latest ^
  --dns-name-label %BACKEND_DNS_LABEL% ^
  --ports 5000 ^
  --environment-variables PORT=5000 NODE_ENV=production

REM Deploy frontend container
echo Deploying frontend container...
az container create ^
  --resource-group %RESOURCE_GROUP% ^
  --name %FRONTEND_CONTAINER_NAME% ^
  --image %DOCKER_HUB_USERNAME%/%FRONTEND_IMAGE_NAME%:latest ^
  --dns-name-label %FRONTEND_DNS_LABEL% ^
  --ports 80

REM Show deployment information
echo Deployment completed!
echo Backend URL:
az container show --resource-group %RESOURCE_GROUP% --name %BACKEND_CONTAINER_NAME% --query ipAddress.fqdn
echo Frontend URL:
az container show --resource-group %RESOURCE_GROUP% --name %FRONTEND_CONTAINER_NAME% --query ipAddress.fqdn

echo Deployment finished successfully!
pause