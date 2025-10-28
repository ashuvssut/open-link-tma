import { Locale } from '@/locales';

export {};

declare global {
  interface Window {
    locale: Locale;
  }
}
