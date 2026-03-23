from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import os
from agent import DQNAgent

app = FastAPI(title="WashLab RL Assistant Service")

# State constants
MAX_STAFF_SLOTS = 10
STATE_DIM = 3 + (MAX_STAFF_SLOTS * 3) # 3 (pending, priority, age) + slots * (exists, workload, avg_time)

# Initialize agent
agent = DQNAgent(input_dim=STATE_DIM, output_dim=MAX_STAFF_SLOTS)
MODEL_PATH = "assistant_model.pth"

if os.path.exists(MODEL_PATH):
    try:
        agent.load(MODEL_PATH)
        print("Moaded existing model weights.")
    except:
        print("Found model but failed to load. Starting fresh.")

class StaffMember(BaseModel):
    staffId: str
    workload: float
    avgCompletionTime: float

class StateData(BaseModel):
    pendingOrdersCount: int
    availableStaff: List[StaffMember]
    orderPriority: str # 'low', 'medium', 'high'
    orderAge: float # Hours since booking

class ActionRequest(BaseModel):
    state: StateData

class RewardUpdate(BaseModel):
    state: StateData
    actionIndex: int
    reward: float
    next_state: StateData
    done: bool

def encode_priority(p: str) -> float:
    mapping = {'low': 0.0, 'medium': 0.5, 'high': 1.0}
    return mapping.get(p.lower(), 0.5)

def format_state_vector(data: StateData):
    vector = [
        float(data.pendingOrdersCount), 
        encode_priority(data.orderPriority),
        float(data.orderAge)
    ]
    available_mask = []
    
    # Map staff info to slots
    for i in range(MAX_STAFF_SLOTS):
        if i < len(data.availableStaff):
            staff = data.availableStaff[i]
            vector.extend([1.0, float(staff.workload), float(staff.avgCompletionTime)])
            available_mask.append(1.0)
        else:
            vector.extend([0.0, 0.0, 0.0])
            available_mask.append(0.0)
            
    return np.array(vector, dtype=np.float32), available_mask

@app.post("/get-action")
async def get_action(request: ActionRequest):
    state_vector, available_mask = format_state_vector(request.state)
    action_idx = agent.act(state_vector, available_mask)
    
    # Map action index back to staffId
    if action_idx < len(request.state.availableStaff):
        selected_staff = request.state.availableStaff[action_idx].staffId
        return {"actionIndex": action_idx, "staffId": selected_staff}
    else:
        # Should not happen with masking, but fallback to first available if it does
        if request.state.availableStaff:
            return {"actionIndex": 0, "staffId": request.state.availableStaff[0].staffId}
        raise HTTPException(status_code=400, detail="No available staff")

@app.post("/update-reward")
async def update_reward(update: RewardUpdate):
    state_vector, _ = format_state_vector(update.state)
    next_state_vector, _ = format_state_vector(update.next_state)
    
    agent.remember(state_vector, update.actionIndex, update.reward, next_state_vector, update.done)
    agent.replay()
    
    # Periodically save model and update target network
    if len(agent.memory) % 10 == 0:
        agent.save(MODEL_PATH)
        agent.update_target_model()
        
    return {"status": "updated", "epsilon": agent.epsilon}

@app.get("/status")
async def status():
    return {
        "memory_size": len(agent.memory),
        "epsilon": agent.epsilon,
        "model_path": MODEL_PATH
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)
