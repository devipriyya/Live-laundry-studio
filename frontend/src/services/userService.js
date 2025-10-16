import api from '../api';
import mockApiService from './mockApiService';

// User Dashboard API Service
export const userService = {
  // Get user dashboard statistics
  async getDashboardStats(userId) {
    try {
      // Try real API first
      const response = await api.get(`/users/${userId}/dashboard-stats`);
      return response.data;
    } catch (error) {
      console.warn('Real API unavailable, using mock data:', error.message);
      // Use mock API service for demonstration
      return await mockApiService.getDashboardStats(userId);
    }
  },

  // Get user's recent orders
  async getRecentOrders(userId, limit = 5) {
    try {
      // Try real API first
      const response = await api.get(`/users/${userId}/orders/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('Real API unavailable, using mock data:', error.message);
      // Use mock API service for demonstration
      return await mockApiService.getRecentOrders(userId, limit);
    }
  },

  // Get user's active orders
  async getActiveOrders(userId) {
    try {
      // Try real API first
      const response = await api.get(`/users/${userId}/orders/active`);
      return response.data;
    } catch (error) {
      console.warn('Real API unavailable, using mock data:', error.message);
      // Use mock API service for demonstration
      return await mockApiService.getActiveOrders(userId);
    }
  },

  // Get user's recent activities/notifications
  async getRecentActivities(userId, limit = 5) {
    try {
      // Try real API first
      const response = await api.get(`/users/${userId}/activities/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.warn('Real API unavailable, using mock data:', error.message);
      // Use mock API service for demonstration
      return await mockApiService.getRecentActivities(userId, limit);
    }
  },

  // Get user profile information
  async getUserProfile(userId) {
    try {
      // Try real API first
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.warn('Real API unavailable, using mock data:', error.message);
      // Use mock API service for demonstration
      return await mockApiService.getUserProfile(userId);
    }
  },

  // Get service pricing and availability
  async getServices() {
    try {
      // Try real API first
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      console.warn('Real API unavailable, using mock data:', error.message);
      // Use mock API service for demonstration
      return await mockApiService.getServices();
    }
  },

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const response = await api.put(`/users/${userId}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  // Get user's reward points and tier information
  async getRewardInfo(userId) {
    try {
      // Try real API first
      const response = await api.get(`/users/${userId}/rewards`);
      return response.data;
    } catch (error) {
      console.warn('Real API unavailable, using mock data:', error.message);
      // Use mock API service for demonstration
      return await mockApiService.getRewardInfo(userId);
    }
  }
};

export default userService;
