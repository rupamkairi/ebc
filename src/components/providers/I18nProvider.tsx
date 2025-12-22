'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize i18next with the language from localStorage or browser
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
