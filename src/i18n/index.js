import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language modules
import en from './locales/en';
import hi from './locales/hi';
import te from './locales/te';
import kn from './locales/kn';
import ta from './locales/ta';
// Import other languages similarly when you create them
// import mr from './locales/mr';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  te: { translation: te },
  kn: { translation: kn },
  ta: { translation: ta },
  // Add other languages here
  // mr: { translation: mr }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
