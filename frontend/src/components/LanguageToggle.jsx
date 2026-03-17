import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageToggle = ({ className = "" }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const currentLanguage = i18n.language || 'en';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <GlobeAltIcon className="h-5 w-5 text-slate-400" />
      <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            currentLanguage.startsWith('en')
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-[#0F172A]'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('ml')}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            currentLanguage.startsWith('ml')
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-500 hover:text-[#0F172A]'
          }`}
        >
          മല
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
