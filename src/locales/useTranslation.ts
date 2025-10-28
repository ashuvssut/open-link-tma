import { defaultLocale, Locale, TranslationKey, translations } from '@/locales';
import { useSafeOpenLink } from '@/pages/OpenLinkPage/useSafeOpenLink';

export const t = <TTransKey extends TranslationKey, TLocale extends Locale>(
  key: TTransKey,
  lang?: TLocale
): (typeof translations)[TLocale][TTransKey] => {
  let selectedLang: Locale | undefined = lang;
  if (!selectedLang && typeof window !== 'undefined') {
    selectedLang = window.locale;
  }
  if (!selectedLang) {
    selectedLang = defaultLocale;
  }

  return translations[selectedLang]?.[key] || translations[defaultLocale]?.[key] || key;
};

const useLocaleTranslations = <TLocale extends Locale>(lang: TLocale) => {
  if (typeof window !== 'undefined') {
    window.locale = lang;
  }

  return {
    t: <TTransKey extends TranslationKey>(
      key: TTransKey
    ): (typeof translations)[TLocale][TTransKey] => t(key, lang),
  };
};

export const useTranslation = () => {
  const { lang } = useSafeOpenLink();
  return useLocaleTranslations(lang);
};

export const Trans = ({ key: t, vars }: { key: TranslationKey; vars?: Record<string, string> }) => {
  const trans = useTranslation().t(t);

  for (const [key, value] of Object.entries(vars ?? {})) {
    trans.replace(`{{${key}}}`, value);
  }

  return trans;
};
