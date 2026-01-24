import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, SUPPORTED_LANGUAGES, getLanguage, t } from '../utils/i18n';

interface LanguageContextType {
  language: LanguageCode; // Current immersive language (entire UI in this language)
  setLanguage: (lang: LanguageCode) => void;
  translate: (key: string) => string;
  getLanguageName: (code: LanguageCode) => string;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Immersive language - entire UI in this language
  // Default to Cree for immersive learning experience
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('immersive_language');
    return (saved as LanguageCode) || 'cr';
  });

  useEffect(() => {
    localStorage.setItem('immersive_language', language);
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const translate = (key: string): string => {
    return t(key, language);
  };

  const getLanguageName = (code: LanguageCode): string => {
    const lang = getLanguage(code);
    return lang ? lang.nativeName : code;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        getLanguageName,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

