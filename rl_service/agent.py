import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import random
from collections import deque
from dqn_model import DQNModel

class DQNAgent:
    def __init__(self, input_dim=32, output_dim=10, learning_rate=0.001, gamma=0.95, epsilon=1.0, epsilon_decay=0.995, epsilon_min=0.01):
        self.input_dim = input_dim
        self.output_dim = output_dim
        self.memory = deque(maxlen=2000)
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = epsilon_min
        self.learning_rate = learning_rate
        
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        self.model = DQNModel(input_dim, output_dim).to(self.device)
        self.target_model = DQNModel(input_dim, output_dim).to(self.device)
        self.update_target_model()
        
        self.optimizer = optim.Adam(self.model.parameters(), lr=self.learning_rate)
        self.criterion = nn.MSELoss()

    def update_target_model(self):
        self.target_model.load_state_dict(self.model.state_dict())

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def act(self, state, available_mask=None):
        if np.random.rand() <= self.epsilon:
            if available_mask is not None:
                # Select only from available indices
                available_indices = [i for i, val in enumerate(available_mask) if val > 0]
                return random.choice(available_indices) if available_indices else random.randrange(self.output_dim)
            return random.randrange(self.output_dim)
        
        state = torch.FloatTensor(state).unsqueeze(0).to(self.device)
        with torch.no_grad():
            act_values = self.model(state)
        
        if available_mask is not None:
            # Mask unavailable staff with a very low value
            mask = torch.FloatTensor(available_mask).to(self.device)
            act_values = act_values + (1.0 - mask) * -1e9
            
        return torch.argmax(act_values).item()

    def replay(self, batch_size=32):
        if len(self.memory) < batch_size:
            return
        
        minibatch = random.sample(self.memory, batch_size)
        
        states = torch.FloatTensor(np.array([m[0] for m in minibatch])).to(self.device)
        actions = torch.LongTensor([m[1] for m in minibatch]).to(self.device)
        rewards = torch.FloatTensor([m[2] for m in minibatch]).to(self.device)
        next_states = torch.FloatTensor(np.array([m[3] for m in minibatch])).to(self.device)
        dones = torch.FloatTensor([m[4] for m in minibatch]).to(self.device)

        # Q(s, a)
        q_values = self.model(states).gather(1, actions.unsqueeze(1)).squeeze(1)
        
        # max Q(s', a') from target model
        next_q_values = self.target_model(next_states).max(1)[0]
        
        # Target = r + gamma * max Q(s', a') * (1 - done)
        target_q_values = rewards + (1 - dones) * self.gamma * next_q_values

        loss = self.criterion(q_values, target_q_values)
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

    def save(self, name):
        torch.save(self.model.state_dict(), name)

    def load(self, name):
        self.model.load_state_dict(torch.load(name))
        self.update_target_model()
