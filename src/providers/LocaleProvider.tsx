'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { defaultLocale, dictionaries, type Dictionary, type Locale } from '~/i18n';

type LocaleContextValue = {
  dictionary: Dictionary;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const storageKey = 'csu-app-locale';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const savedLocale = window.localStorage.getItem(storageKey) as Locale | null;
    if (savedLocale && savedLocale in dictionaries) {
      setLocaleState(savedLocale);
      document.documentElement.lang = savedLocale;
    }
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    document.documentElement.lang = nextLocale;
    window.localStorage.setItem(storageKey, nextLocale);
  };

  const value = useMemo(
    () => ({
      dictionary: dictionaries[locale],
      locale,
      setLocale,
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }

  return context;
}
