// Notification Service - Handles notification fetching and management
import api from '../api';

class NotificationService {
  // Get notifications for a user
  async getUserNotifications(email, params = {}) {
    try {
      const response = await api.get(`/notifications/user/${email}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(email) {
    try {
      const response = await api.patch(`/notifications/user/${email}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get unread notification count
  async getUnreadCount(email) {
    try {
      const response = await api.get(`/notifications/user/${email}/unread-count`);
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService;