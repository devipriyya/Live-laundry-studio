import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  SparklesIcon, 
  GiftIcon,
  ArrowRightIcon,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoyaltyCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/loyalty/summary');
        setSummary(response.data);
      } catch (error) {
        console.error('Error fetching loyalty summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const balance = summary?.balance || 0;
  const nextTarget = 500;
  const progress = Math.min((balance / nextTarget) * 100, 100);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl p-5 shadow-2xl shadow-indigo-100/50 border border-white/60 relative overflow-hidden group hover:scale-[1.01] transition-all duration-500">
      {/* Animated Gradient Background Glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-700"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl group-hover:bg-indigo-400/20 transition-all duration-700"></div>

      <div className="relative flex flex-col space-y-4">
        {/* Top Section: Tier Badge & Icon */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-indigo-50 shadow-sm">
            <TrophyIcon className="w-4 h-4 text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900">
              {t('loyalty.member', { tier: summary?.tier || 'Platinum' })}
            </span>
          </div>
          <SparklesIcon className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>

        {/* Content Section: Balance */}
        <div className="flex items-end justify-between py-1">
          <div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1">
              {t('loyalty.available_balance')}
            </p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter">
                {balance}
              </h2>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">
                {t('loyalty.pts')}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">{t('loyalty.next_tier_progress')}</span>
            <span className="text-indigo-600">{balance} / {nextTarget}</span>
          </div>
          <div className="h-1.5 w-full bg-indigo-100/50 rounded-full overflow-hidden border border-white/50">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.4)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-indigo-100/30">
          <div className="flex items-center space-x-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            <GiftIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('loyalty.points_value')}</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard/loyalty')}
            className="flex items-center space-x-1 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors group/btn"
          >
            <span>{t('loyalty.details')}</span>
            <ChevronRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyCard;
