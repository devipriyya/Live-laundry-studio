# WashLab RL Assistant - Setup & Usage Guide

This document explains how to run and use the Reinforcement Learning-based decision system for staff assignment.

## System Components
1. **Node.js Backend**: Existing Express server (Port 5000).
2. **Python RL Service**: New microservice for DQN agent (Port 8000).
3. **React Frontend**: Updated dashboard to trigger AI assignments.

---

## 1. Setup Python RL Microservice

### Prerequisites
- Python 3.10, 3.11, or 3.12 (Highly Recommended)
  - *Note: Python 3.15+ is currently NOT supported by PyTorch.*
- pip

### Installation
```bash
cd rl_service
pip install -r requirements.txt
```

### Running the Service
```bash
python app.py
```
*The service will start on `http://localhost:8000`.*

---

## 2. Setup Node.js Backend

Ensure the `.env` file in the `backend` directory includes:
```env
RL_SERVICE_URL=http://localhost:8000
```

### Running the Backend
```bash
cd backend
npm run dev
```

---

## 3. Using the AI Assistant

1. Go to the **Admin Dashboard** (or Assistant Dashboard).
2. Navigate to the **Orders** section.
3. You will see a new **Sparkles Icon (✨)** next to each order in the actions column.
4. Click the **✨ AI Auto-Assign** button.
5. The system will:
   - Fetch the current system state (pending orders, staff workloads).
   - Send it to the Python RL microservice.
   - The DQN agent will select the optimal staff member.
   - The order will be automatically assigned.

### Learning Loop
The system learns over time:
- **Assignment**: DQN selects staff based on current state.
- **Reward**: When an order is marked as `delivered`, the backend calculates a reward:
  - `+10`: Fast completion (< 2 hours).
  - `-5`: Average completion.
  - `-10`: Slow completion (> 5 hours).
- **Update**: The reward is sent back to the Python service to improve the model weights.

---

## 4. Fallback Mechanism
If the Python RL service is down, the system will log an error and allow you to proceed with manual assignment, ensuring no disruption to business operations.
