const axios = require('axios');

const RL_SERVICE_URL = process.env.RL_SERVICE_URL || 'http://localhost:8008';

/**
 * Communicates with the Python RL Microservice
 */
const rlClient = {
  /**
   * Get the best action (staff assignment) for a given state
   */
  getAction: async (state) => {
    try {
      const response = await axios.post(`${RL_SERVICE_URL}/get-action`, { state });
      return response.data;
    } catch (error) {
      console.error('Error calling RL service /get-action:', error.message);
      return null; // Fallback to manual/heuristic assignment
    }
  },

  /**
   * Update the RL agent with the reward for a previous action
   */
  updateReward: async (state, actionIndex, reward, nextState, done = false) => {
    try {
      const response = await axios.post(`${RL_SERVICE_URL}/update-reward`, {
        state,
        actionIndex,
        reward,
        next_state: nextState,
        done
      });
      return response.data;
    } catch (error) {
      console.error('Error calling RL service /update-reward:', error.message);
      return null;
    }
  }
};

module.exports = rlClient;
