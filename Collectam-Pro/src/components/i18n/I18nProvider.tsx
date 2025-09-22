"use client";

import { useState, useEffect, ReactNode } from 'react';
import { 
  I18nContext, 
  Language, 
  translate, 
  loadLanguagePreference, 
  saveLanguagePreference, 
  isRTLLanguage,
  getDirection 
} from '@/lib/i18n';
import { translations } from '@/lib/i18n/translations';

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = 'fr' }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from storage
  useEffect(() => {
    const savedLanguage = loadLanguagePreference();
    setLanguage(savedLanguage);
    setIsInitialized(true);
  }, []);

  // Update document direction and language when language changes
  useEffect(() => {
    if (!isInitialized) return;

    // Update document direction
    document.documentElement.dir = getDirection(language);
    document.documentElement.lang = language;

    // Update CSS custom properties for RTL support
    if (isRTLLanguage(language)) {
      document.documentElement.classList.add('rtl');
      document.documentElement.classList.remove('ltr');
    } else {
      document.documentElement.classList.add('ltr');
      document.documentElement.classList.remove('rtl');
    }

    // Save language preference
    saveLanguagePreference(language);
  }, [language, isInitialized]);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return translate(translations[language], key, params);
  };

  const contextValue = {
    language,
    setLanguage: handleSetLanguage,
    t,
    isRTL: isRTLLanguage(language)
  };

  // Don't render until initialized to prevent hydration issues
  if (!isInitialized) {
    return null;
  }

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}
