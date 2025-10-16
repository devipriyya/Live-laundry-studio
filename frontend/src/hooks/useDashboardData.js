import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export const useDashboardData = (userId) => {
  const [data, setData] = useState({
    stats: null,
    recentOrders: [],
    activeOrders: [],
    recentActivities: [],
    services: [],
    userProfile: null,
    rewardInfo: null
  });
  
  const [loading, setLoading] = useState({
    stats: true,
    orders: true,
    activities: true,
    services: true,
    profile: true,
    rewards: true
  });
  
  const [errors, setErrors] = useState({});

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const stats = await userService.getDashboardStats(userId);
      setData(prev => ({ ...prev, stats }));
      setErrors(prev => ({ ...prev, stats: null }));
    } catch (error) {
      console.error('Error fetching stats:', error);
      setErrors(prev => ({ ...prev, stats: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, [userId]);

  // Fetch recent orders
  const fetchRecentOrders = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const recentOrders = await userService.getRecentOrders(userId, 3);
      setData(prev => ({ ...prev, recentOrders }));
      setErrors(prev => ({ ...prev, orders: null }));
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      setErrors(prev => ({ ...prev, orders: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }, [userId]);

  // Fetch active orders
  const fetchActiveOrders = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const activeOrders = await userService.getActiveOrders(userId);
      setData(prev => ({ ...prev, activeOrders }));
      setErrors(prev => ({ ...prev, orders: null }));
    } catch (error) {
      console.error('Error fetching active orders:', error);
      setErrors(prev => ({ ...prev, orders: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }, [userId]);

  // Fetch recent activities
  const fetchActivities = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(prev => ({ ...prev, activities: true }));
      const recentActivities = await userService.getRecentActivities(userId, 4);
      setData(prev => ({ ...prev, recentActivities }));
      setErrors(prev => ({ ...prev, activities: null }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      setErrors(prev => ({ ...prev, activities: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  }, [userId]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, services: true }));
      const services = await userService.getServices();
      setData(prev => ({ ...prev, services }));
      setErrors(prev => ({ ...prev, services: null }));
    } catch (error) {
      console.error('Error fetching services:', error);
      setErrors(prev => ({ ...prev, services: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, services: false }));
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      const userProfile = await userService.getUserProfile(userId);
      setData(prev => ({ ...prev, userProfile }));
      setErrors(prev => ({ ...prev, profile: null }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setErrors(prev => ({ ...prev, profile: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, [userId]);

  // Fetch reward information
  const fetchRewardInfo = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(prev => ({ ...prev, rewards: true }));
      const rewardInfo = await userService.getRewardInfo(userId);
      setData(prev => ({ ...prev, rewardInfo }));
      setErrors(prev => ({ ...prev, rewards: null }));
    } catch (error) {
      console.error('Error fetching reward info:', error);
      setErrors(prev => ({ ...prev, rewards: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, rewards: false }));
    }
  }, [userId]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchStats(),
      fetchRecentOrders(),
      fetchActiveOrders(),
      fetchActivities(),
      fetchServices(),
      fetchUserProfile(),
      fetchRewardInfo()
    ]);
  }, [fetchStats, fetchRecentOrders, fetchActiveOrders, fetchActivities, fetchServices, fetchUserProfile, fetchRewardInfo]);

  // Initial data fetch
  useEffect(() => {
    if (userId) {
      refreshData();
    }
  }, [userId, refreshData]);

  // Calculate overall loading state
  const isLoading = Object.values(loading).some(Boolean);
  const hasErrors = Object.values(errors).some(Boolean);

  return {
    data,
    loading,
    errors,
    isLoading,
    hasErrors,
    refreshData,
    fetchStats,
    fetchRecentOrders,
    fetchActiveOrders,
    fetchActivities,
    fetchServices,
    fetchUserProfile,
    fetchRewardInfo
  };
};
