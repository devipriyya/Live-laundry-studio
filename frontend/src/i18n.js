import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en/translation.json';
import mlTranslation from './locales/ml/translation.json';

// Define resources
const resources = {
  en: {
    translation: enTranslation
  },
  ml: {
    translation: mlTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      // Use localStorage for language detection with custom key
      lookupLocalStorage: 'deliveryDashboardLanguage',
      // Cache the language in localStorage
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;