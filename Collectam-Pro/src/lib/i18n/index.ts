import { createContext, useContext } from 'react';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية'
} as const;

export type Language = keyof typeof SUPPORTED_LANGUAGES;

// Translation interface
export interface Translations {
  [key: string]: string | Translations;
}

// Language context
export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Hook to use i18n
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// RTL languages
export const RTL_LANGUAGES: Language[] = ['ar'];

// Check if language is RTL
export const isRTLLanguage = (lang: Language): boolean => {
  return RTL_LANGUAGES.includes(lang);
};

// Get browser language
export const getBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'fr';
  
  const browserLang = navigator.language.split('-')[0] as Language;
  return Object.keys(SUPPORTED_LANGUAGES).includes(browserLang) ? browserLang : 'fr';
};

// Storage key for language preference
export const LANGUAGE_STORAGE_KEY = 'collectam_language';

// Save language preference
export const saveLanguagePreference = (lang: Language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }
};

// Load language preference
export const loadLanguagePreference = (): Language => {
  if (typeof window === 'undefined') return 'fr';
  
  const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
  return saved && Object.keys(SUPPORTED_LANGUAGES).includes(saved) ? saved : getBrowserLanguage();
};

// Translation function
export const translate = (
  translations: Translations,
  key: string,
  params?: Record<string, string | number>
): string => {
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace parameters
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
};

// Format number based on locale
export const formatNumber = (num: number, lang: Language): string => {
  const locales = {
    fr: 'fr-FR',
    en: 'en-US',
    ar: 'ar-SA'
  };
  
  return new Intl.NumberFormat(locales[lang]).format(num);
};

// Format currency based on locale
export const formatCurrency = (amount: number, currency: string, lang: Language): string => {
  const locales = {
    fr: 'fr-FR',
    en: 'en-US',
    ar: 'ar-SA'
  };
  
  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date based on locale
export const formatDate = (date: Date | string, lang: Language, options?: Intl.DateTimeFormatOptions): string => {
  const locales = {
    fr: 'fr-FR',
    en: 'en-US',
    ar: 'ar-SA'
  };
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locales[lang], options).format(dateObj);
};

// Get direction based on language
export const getDirection = (lang: Language): 'ltr' | 'rtl' => {
  return isRTLLanguage(lang) ? 'rtl' : 'ltr';
};

// Get text alignment based on language
export const getTextAlign = (lang: Language): 'left' | 'right' => {
  return isRTLLanguage(lang) ? 'right' : 'left';
};
