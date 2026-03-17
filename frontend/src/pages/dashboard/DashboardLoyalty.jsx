import React from 'react';
import LoyaltyHistory from '../../components/loyalty/LoyaltyHistory';
import LoyaltyCard from '../../components/loyalty/LoyaltyCard';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const DashboardLoyalty = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/dashboard/home')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          <span>Back to Dashboard</span>
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Loyalty Rewards</h1>
          <p className="text-gray-600">Track your earnings and redeem points for exclusive discounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <LoyaltyCard />
          <div className="mt-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 text-white shadow-xl shadow-pink-200/50">
            <h3 className="text-xl font-black mb-4">How it works?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg mt-1">1️⃣</div>
                <p className="text-sm font-medium leading-relaxed">Earn 1 loyalty point for every ₹10 spent on any laundry service or product.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg mt-1">2️⃣</div>
                <p className="text-sm font-medium leading-relaxed">Wait for your order to be delivered – points are added automatically!</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-1.5 rounded-lg mt-1">3️⃣</div>
                <p className="text-sm font-medium leading-relaxed">Redeem 100 points for a ₹50 discount on your next checkout.</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <LoyaltyHistory />
        </div>
      </div>
    </div>
  );
};

export default DashboardLoyalty;
