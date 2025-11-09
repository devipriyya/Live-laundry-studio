# Azure Container Deployment Guide

This guide explains how to deploy the Fabrico application to Azure Container Instances using Docker images pushed to Docker Hub.

## Prerequisites

1. Docker installed locally
2. Docker Hub account
3. Azure subscription
4. Azure CLI installed and configured

## Step 1: Build and Push Docker Images to Docker Hub

### Backend Service

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the backend Docker image:
   ```bash
   docker build -t your-dockerhub-username/fabrico-backend:latest .
   ```

3. Log in to Docker Hub:
   ```bash
   docker login
   ```

4. Push the backend image to Docker Hub:
   ```bash
   docker push your-dockerhub-username/fabrico-backend:latest
   ```

### Frontend Service

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Build the frontend Docker image:
   ```bash
   docker build -t your-dockerhub-username/fabrico-frontend:latest .
   ```

3. Push the frontend image to Docker Hub:
   ```bash
   docker push your-dockerhub-username/fabrico-frontend:latest
   ```

## Step 2: Create Azure Resource Group

1. Open Azure CLI or Cloud Shell in Azure Portal

2. Create a resource group:
   ```bash
   az group create --name fabrico-rg --location eastus
   ```

## Step 3: Deploy Backend to Azure Container Instances

1. Create the backend container instance:
   ```bash
   az container create \
     --resource-group fabrico-rg \
     --name fabrico-backend \
     --image your-dockerhub-username/fabrico-backend:latest \
     --dns-name-label fabrico-backend \
     --ports 5000 \
     --environment-variables PORT=5000 NODE_ENV=production \
     --secure-environment-variables JWT_SECRET=your-jwt-secret MONGODB_URI=your-mongodb-uri
   ```

2. Check the deployment status:
   ```bash
   az container show --resource-group fabrico-rg --name fabrico-backend
   ```

## Step 4: Deploy Frontend to Azure Container Instances

1. Create the frontend container instance:
   ```bash
   az container create \
     --resource-group fabrico-rg \
     --name fabrico-frontend \
     --image your-dockerhub-username/fabrico-frontend:latest \
     --dns-name-label fabrico-frontend \
     --ports 80
   ```

2. Check the deployment status:
   ```bash
   az container show --resource-group fabrico-rg --name fabrico-frontend
   ```

## Step 5: Configure Environment Variables

For the backend to work properly, you'll need to set the appropriate environment variables:

1. Update the backend container with environment variables:
   ```bash
   az container create \
     --resource-group fabrico-rg \
     --name fabrico-backend \
     --image your-dockerhub-username/fabrico-backend:latest \
     --dns-name-label fabrico-backend \
     --ports 5000 \
     --environment-variables PORT=5000 NODE_ENV=production \
     --secure-environment-variables \
       JWT_SECRET=your-super-secret-jwt-key \
       MONGODB_URI=mongodb://username:password@your-mongodb-host:27017/fabrico
   ```

## Step 6: Access Your Application

1. Get the frontend URL:
   ```bash
   az container show --resource-group fabrico-rg --name fabrico-frontend --query ipAddress.fqdn
   ```

2. Get the backend URL:
   ```bash
   az container show --resource-group fabrico-rg --name fabrico-backend --query ipAddress.fqdn
   ```

Your application should now be accessible at the frontend URL.

## Health Checks

Both containers include health check endpoints:

- Backend: `http://fabrico-backend.eastus.azurecontainer.io/health`
- Frontend: Nginx will return a 200 status for the root path

## Monitoring and Logging

To monitor your containers:

1. View container logs:
   ```bash
   az container logs --resource-group fabrico-rg --name fabrico-backend
   az container logs --resource-group fabrico-rg --name fabrico-frontend
   ```

2. Monitor container events:
   ```bash
   az container attach --resource-group fabrico-rg --name fabrico-backend
   ```

## Alternative: Deploy Using Azure Container Apps (Recommended for Production)

For a more scalable and production-ready deployment, consider using Azure Container Apps:

1. Create a Container Apps environment:
   ```bash
   az containerapp env create \
     --name fabrico-env \
     --resource-group fabrico-rg \
     --location eastus
   ```

2. Deploy the backend:
   ```bash
   az containerapp create \
     --name fabrico-backend-app \
     --resource-group fabrico-rg \
     --environment fabrico-env \
     --image your-dockerhub-username/fabrico-backend:latest \
     --target-port 5000 \
     --ingress external \
     --query properties.configuration.ingress.fqdn
   ```

3. Deploy the frontend:
   ```bash
   az containerapp create \
     --name fabrico-frontend-app \
     --resource-group fabrico-rg \
     --environment fabrico-env \
     --image your-dockerhub-username/fabrico-frontend:latest \
     --target-port 80 \
     --ingress external \
     --query properties.configuration.ingress.fqdn
   ```

## Troubleshooting

### Common Issues

1. **Connection refused errors**: Ensure the backend service is running and accessible
2. **CORS errors**: Check that the frontend URL is added to the backend CORS configuration
3. **Environment variables not set**: Verify all required environment variables are configured

### Checking Logs

To check container logs:
```bash
az container logs --resource-group fabrico-rg --name fabrico-backend
az container logs --resource-group fabrico-rg --name fabrico-frontend
```

### Updating Containers

To update your containers with new images:

1. Build and push new images to Docker Hub
2. Restart the containers:
   ```bash
   az container restart --resource-group fabrico-rg --name fabrico-backend
   az container restart --resource-group fabrico-rg --name fabrico-frontend
   ```

## Cleanup

To remove all resources:
```bash
az group delete --name fabrico-rg --yes --no-wait
```

This will delete the resource group and all associated resources.