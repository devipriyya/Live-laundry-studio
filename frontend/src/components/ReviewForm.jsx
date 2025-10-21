import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import api from '../api';

const ReviewForm = ({ orderId, orderNumber, customerInfo, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [serviceQuality, setServiceQuality] = useState(0);
  const [deliverySpeed, setDeliverySpeed] = useState(0);
  const [customerService, setCustomerService] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const reviewData = {
        orderId,
        rating,
        serviceQuality: serviceQuality || rating,
        deliverySpeed: deliverySpeed || rating,
        customerService: customerService || rating,
        comment,
        customerInfo
      };

      await api.post('/reviews', reviewData);
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ value, onChange, label }) => {
    const [hover, setHover] = useState(0);
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              {star <= (hover || value) ? (
                <StarIcon className="h-8 w-8 text-yellow-400" />
              ) : (
                <StarOutline className="h-8 w-8 text-gray-300" />
              )}
            </button>
          ))}
          <span className="ml-2 text-gray-600 self-center">
            {(hover || value) > 0 && `${hover || value} star${(hover || value) > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>
      <p className="text-gray-600 mb-6">Order #{orderNumber}</p>

      <form onSubmit={handleSubmit}>
        {/* Overall Rating */}
        <StarRating 
          value={rating}
          onChange={setRating}
          label="Overall Rating *"
        />

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <StarRating 
            value={serviceQuality}
            onChange={setServiceQuality}
            label="Service Quality"
          />
          <StarRating 
            value={deliverySpeed}
            onChange={setDeliverySpeed}
            label="Delivery Speed"
          />
          <StarRating 
            value={customerService}
            onChange={setCustomerService}
            label="Customer Service"
          />
        </div>

        {/* Comment */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience..."
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">{comment.length}/1000 characters</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
