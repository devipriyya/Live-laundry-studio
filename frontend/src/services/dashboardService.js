import api from '../api';

export const dashboardService = {
  // Get admin dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/auth/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get order statistics
  async getOrderStats() {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },

  // Get recent orders
  async getRecentOrders(limit = 5) {
    try {
      const response = await api.get('/orders', {
        params: { limit }
      });
      return response.data.orders || [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },

  // Get order trends (last 7 days)
  async getOrderTrends(days = 7) {
    try {
      const response = await api.get('/orders/analytics/orders', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching order trends:', error);
      throw error;
    }
  },

  // Get monthly income trends
  async getMonthlyIncome(months = 6) {
    try {
      const response = await api.get('/orders/analytics/income', {
        params: { months }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly income:', error);
      throw error;
    }
  }
};

export default dashboardService;