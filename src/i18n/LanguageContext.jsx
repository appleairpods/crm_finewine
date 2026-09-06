import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ru, en } from './translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'finewine_lang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' ? 'en' : 'ru';
  });

  const t = lang === 'en' ? en : ru;

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const format = useCallback((template, vars = {}) => {
    return Object.entries(vars).reduce(
      (str, [key, val]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), val),
      template
    );
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, format }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function useLocalized() {
  const { lang } = useLanguage();
  return (obj) => (typeof obj === 'object' && obj !== null ? obj[lang] || obj.ru : obj);
}
