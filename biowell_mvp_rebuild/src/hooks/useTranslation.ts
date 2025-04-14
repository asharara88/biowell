import { useEffect } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { en } from '../i18n/en';
import { ar } from '../i18n/ar';
import type { Translation } from '../i18n/types';

const translations: Record<string, Translation> = {
  en,
  ar
};

export function useTranslation() {
  const { language } = useLanguageStore();
  
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = (value as Record<string, unknown>)[k];
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t, language };
}