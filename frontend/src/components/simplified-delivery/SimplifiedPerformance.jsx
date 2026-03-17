import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  StarIcon,
  ChartBarIcon,
  ClockIcon,
  TruckIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const SimplifiedPerformance = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState({
    rating: 5.0,
    totalDeliveries: 0,
    onTimePercentage: 100,
    avgDeliveryTime: 0,
    completedDeliveries: 0,
    cancelledDeliveries: 0,
    avgRating: 5.0
  });

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      
      const statsData = await deliveryBoyService.getStats();
      setPerformanceData({
        rating: statsData.rating || 5.0,
        totalDeliveries: statsData.totalDeliveries || 0,
        onTimePercentage: statsData.onTimePercentage || 100,
        avgDeliveryTime: statsData.avgDeliveryTime || 0,
        completedDeliveries: statsData.completedDeliveries || 0,
        cancelledDeliveries: statsData.cancelledDeliveries || 0,
        avgRating: statsData.avgRating || 5.0
      });
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">{t('performance', 'Performance')}</h1>
        <p className="text-sm text-gray-500">{t('performance_metrics', 'Your performance metrics and ratings')}</p>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('overall_rating', 'Overall Rating')}</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-gray-900">{performanceData.rating}</p>
                <StarIcon className="w-5 h-5 text-yellow-500" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('on_time_delivery', 'On-Time Delivery')}</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.onTimePercentage}%</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('total_deliveries', 'Total Deliveries')}</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.totalDeliveries}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('avg_delivery_time', 'Avg Delivery Time')}</p>
              <p className="text-2xl font-bold text-gray-900">{performanceData.avgDeliveryTime} min</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{performanceData.completedDeliveries}</p>
          <p className="text-sm text-gray-500">{t('completed', 'Completed')}</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
            <ArrowTrendingUpIcon className="w-6 h-6 text-red-600 transform rotate-90" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{performanceData.cancelledDeliveries}</p>
          <p className="text-sm text-gray-500">{t('cancelled', 'Cancelled')}</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-2">
            <StarIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{performanceData.avgRating}</p>
          <p className="text-sm text-gray-500">{t('avg_rating', 'Avg Rating')}</p>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
        <h2 className="font-medium text-gray-900 mb-4">{t('performance_trend', 'Performance Trend')}</h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <ChartBarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('performance_chart_placeholder', 'Performance trend chart will be displayed here')}</p>
        </div>
      </div>

      {/* Tips for Improvement */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h2 className="font-medium text-gray-900 mb-4">{t('improvement_tips', 'Tips for Improvement')}</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
              <span className="text-blue-600 text-sm font-medium">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('tip_be_punctual', 'Be punctual')}</p>
              <p className="text-sm text-gray-500">{t('tip_be_punctual_desc', 'Arrive on time for pickups and deliveries to maintain high ratings')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
              <span className="text-green-600 text-sm font-medium">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('communicate_well', 'Communicate Well')}</p>
              <p className="text-sm text-gray-500">{t('communicate_well_desc', 'Keep customers informed about delivery status and any delays')}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
              <span className="text-purple-600 text-sm font-medium">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('maintain_quality', 'Maintain Quality')}</p>
              <p className="text-sm text-gray-500">{t('maintain_quality_desc', 'Handle packages carefully and ensure they reach customers in perfect condition')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedPerformance;
