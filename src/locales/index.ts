import { cs } from '@/locales/cs';
import { de } from '@/locales/de';
import { en } from '@/locales/en';
import { es } from '@/locales/es';
import { fr } from '@/locales/fr';
import { ja } from '@/locales/ja';
import { pl } from '@/locales/pl';
import { pt } from '@/locales/pt';
import { ro } from '@/locales/ro';
import { ru } from '@/locales/ru';
import { tr } from '@/locales/tr';
import { zh } from '@/locales/zh';

export const defaultLocale = 'en' as const;
export const translations = {
  cs,
  de,
  en,
  es,
  fr,
  ja,
  pl,
  pt,
  ro,
  ru,
  tr,
  zh,
} as const;

export type AllTranslations = typeof translations;
export type Locale = keyof AllTranslations;
type TranslationSet = AllTranslations[Locale];
export type TranslationKey = keyof TranslationSet;

const locales = Object.keys(translations) as Locale[];
export const isLocaleSupported = (locale: string | null): locale is Locale => {
  if (!locale) return false;
  return locales.includes(locale as Locale);
};
