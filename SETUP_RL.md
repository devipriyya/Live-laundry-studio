# RL Assistant Setup Guide

This guide explains how to set up and run the Reinforcement Learning-based Assistant module for the WashLab Laundry Management System.

## Prerequisites

- **Node.js** (v16+)
- **Python** (v3.9+)
- **MongoDB** (running locally or a connection string)

## Python RL Service Setup

1. **Navigate to the RL service directory:**
   ```bash
   cd rl_service
   ```

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe -m pip install -r requirements.txt
   ```
   *Note: If torch or fastapi are not found, install them manually:*
   `C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe -m pip install torch fastapi uvicorn numpy requests pydantic`

4. **Run the RL Service:**
   ```bash
   C:\Users\User\AppData\Local\Programs\Python\Python312\python.exe app.py
   ```
   The service will start on `http://localhost:8008`.

## Node.js Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Update your `.env` file:**
   Ensure the `RL_SERVICE_URL` is set:
   ```env
   RL_SERVICE_URL=http://localhost:8000
   ```

3. **Install dependencies & Start:**
   ```bash
   npm install
   npm start
   ```

## Pre-training the RL Model

Before the first demo, it's recommended to run the simulation script to pre-train the agent:

1. Ensure the Python RL Service is running.
2. Run the simulation:
   ```bash
   cd rl_service
   python simulate_training.py
   ```
3. This will create `assistant_model.pth` in the `rl_service` folder.

## How it works

1. **Assignment**: When an Admin clicks "Auto-Assign", the Node.js backend sends the current system state (pending orders, staff workload, etc.) to the Python RL Service.
2. **Decision**: The DQN Agent selects the best `staffId` based on its learned policy.
3. **Reward**: When an order is marked as `delivered`, the backend calculates a reward (positive for speed and balance, negative for delays) and sends it back to the Python service to improve future decisions.
4. **Fallback**: If the Python service is offline, the backend automatically uses a "Least Workload" heuristic.
