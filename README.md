# Fabrico - Laundry Service Application

Fabrico is a comprehensive laundry service application with both frontend and backend components.

## Project Structure

- `frontend/` - React frontend application
- `backend/` - Node.js/Express backend API
- `selenium-tests/` - Selenium test suite
- `tests/` - Unit and integration tests

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Docker (for containerized deployment)

## Local Development Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Docker Deployment

This application can be deployed to Azure using Docker containers. Refer to [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Building Docker Images

#### Backend
```bash
cd backend
docker build -t fabrico-backend .
```

#### Frontend
```bash
cd frontend
docker build -t fabrico-frontend .
```

## Docker Compose

You can also use docker-compose to run both services locally:

```bash
docker-compose up --build
```

## Testing

### Unit Tests
```bash
npm test
```

### Selenium Tests
```bash
cd selenium-tests
npm test
```

## Documentation

Refer to the various documentation files in the root directory for specific feature guides and implementation details.

## Deployment

For Azure deployment instructions, see [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md).