import React, { useState, useEffect } from 'react';
import { 
  ArrowUpCircleIcon, 
  ArrowDownCircleIcon,
  ClockIcon,
  ShoppingBagIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import api from '../../api';

const LoyaltyHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/loyalty/history');
        setHistory(response.data.transactions);
      } catch (error) {
        console.error('Error fetching loyalty history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>
      ))}
    </div>
  );

  if (history.length === 0) return (
    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <ClockIcon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2">No Transactions Yet</h3>
      <p className="text-gray-500 text-sm italic">Start placing orders to earn loyalty points!</p>
    </div>
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Points History</h2>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">All Transactions</span>
      </div>
      
      <div className="divide-y divide-gray-50">
        {history.map((tx) => (
          <div key={tx._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
            <div className="flex items-center space-x-4">
              <div className={`p-2.5 rounded-2xl ${
                tx.type === 'earned' ? 'bg-green-100' : 'bg-pink-100'
              }`}>
                {tx.type === 'earned' ? (
                  <ArrowUpCircleIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <ArrowDownCircleIcon className="w-6 h-6 text-pink-600" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">
                  {tx.description}
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold italic">
                  <ClockIcon className="w-3 h-3" />
                  <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{tx.type === 'earned' ? 'Earned' : 'Redeemed'}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-black ${
                tx.type === 'earned' ? 'text-green-600' : 'text-pink-600'
              }`}>
                {tx.type === 'earned' ? '+' : '-'}{tx.points}
              </p>
              <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">
                PTS
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoyaltyHistory;
