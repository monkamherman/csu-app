import en from '~/i18n/en';
import fr from '~/i18n/fr';

export const dictionaries = {
  en,
  fr,
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];

export const defaultLocale: Locale = 'fr';
