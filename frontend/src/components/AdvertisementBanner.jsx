import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  TagIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const AdvertisementBanner = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get('/advertisements');
        if (response.data.success) {
          setAds(response.data.advertisements);
        }
      } catch (error) {
        console.error('Error fetching advertisements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (ads.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [ads.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  if (loading) return null;
  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl group mb-12 shadow-2xl">
      <div 
        className="relative h-[250px] md:h-[300px] w-full bg-cover bg-center transition-all duration-700 ease-in-out transform scale-100 group-hover:scale-105"
        style={{ backgroundImage: `url(${currentAd.imageUrl})` }}
      >
        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center p-8 md:p-12">
          <div className="max-w-xl space-y-4">
            <div className="flex items-center space-x-2 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 w-fit px-3 py-1 rounded-full">
              <SparklesIcon className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Sponsored Promotion</span>
            </div>
            
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                {currentAd.title}
              </h3>
              <p className="text-gray-200 text-sm md:text-base line-clamp-2 max-w-md drop-shadow-md">
                {currentAd.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <BuildingOfficeIcon className="h-5 w-5 text-indigo-400" />
                <span className="text-white font-bold">{currentAd.businessName}</span>
              </div>
              
              {currentAd.offerText && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-xl shadow-lg animate-pulse">
                  <TagIcon className="h-5 w-5 text-white" />
                  <span className="text-white font-black uppercase">{currentAd.offerText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {ads.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 border border-white/20"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 border border-white/20"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {ads.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Glossy Reflection Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50"></div>
    </div>
  );
};

export default AdvertisementBanner;
