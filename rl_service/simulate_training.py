import numpy as np
import requests
import random
import time

URL = "http://localhost:8008"

def generate_random_state():
    staff_count = random.randint(3, 8)
    staff = []
    for i in range(staff_count):
        staff.append({
            "staffId": f"staff_{i}",
            "workload": float(random.randint(0, 5)),
            "avgCompletionTime": float(random.uniform(1.0, 4.0))
        })
    
    return {
        "pendingOrdersCount": random.randint(1, 20),
        "availableStaff": staff,
        "orderPriority": random.choice(["low", "medium", "high"]),
        "orderAge": float(random.uniform(0.1, 10.0))
    }

def simulate_training(episodes=100):
    print(f"Starting simulation for {episodes} episodes...")
    
    for i in range(episodes):
        state = generate_random_state()
        
        # 1. Get Action
        try:
            res = requests.post(f"{URL}/get-action", json={"state": state})
            res.raise_for_status()
            action_data = res.json()
            action_idx = action_data["actionIndex"]
            staff_id = action_data["staffId"]
        except Exception as e:
            print(f"Error in get-action: {e}")
            continue
            
        # 2. Simulate Result and Reward
        reward = 0
        
        try:
            available_staff = state.get("availableStaff", [])
            if not available_staff or action_idx >= len(available_staff):
                print(f"Invalid action index {action_idx}")
                continue
                
            selected_staff = available_staff[action_idx]
            
            # Workload penalty
            workload = selected_staff.get("workload", 0)
            if workload > 3:
                reward -= 5
            else:
                reward += 5
                
            # Completion time bonus/penalty
            avg_time = selected_staff.get("avgCompletionTime", 2.0)
            if avg_time < 2.0:
                reward += 10
            elif avg_time > 3.5:
                reward -= 10
                
            # Priority logic
            if state.get("orderPriority") == "high":
                reward += 5
        except Exception as e:
            print(f"Error calculating reward: {e}")
            continue
            
        next_state = generate_random_state()
        
        # 3. Update Reward
        try:
            update_res = requests.post(f"{URL}/update-reward", json={
                "state": state,
                "actionIndex": action_idx,
                "reward": float(reward),
                "next_state": next_state,
                "done": True
            })
            update_res.raise_for_status()
            eps = update_res.json().get("epsilon", 0)
            
            if i % 10 == 0:
                print(f"Episode {i}/{episodes} | Reward: {reward} | Epsilon: {eps:.4f} | Assigned: {staff_id}")
        except Exception as e:
            print(f"Error in update-reward: {e}")
            
    print("Simulation complete.")

if __name__ == "__main__":
    # Wait for server to be ready
    print("Waiting for RL service to be online...")
    for _ in range(5):
        try:
            requests.get(f"{URL}/status")
            break
        except:
            time.sleep(2)
    
    simulate_training(200)
