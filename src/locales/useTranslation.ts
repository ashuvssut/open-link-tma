import { defaultLocale, Locale, TranslationKey, translations } from '@/locales';
import { useSafeOpenLink } from '@/pages/OpenLinkPage/useSafeOpenLink';
import { useEffect } from 'react';

export const createT = <TLocale extends Locale>(locale?: TLocale) => {
  // Resolve effective locale
  let selectedLocale: Locale =
    locale ?? (localStorage.getItem('locale') as Locale) ?? defaultLocale;

  // Return the actual translation function
  return <TTransKey extends TranslationKey>(
    key: TTransKey
  ): (typeof translations)[TLocale][TTransKey] => {
    return (
      translations[selectedLocale]?.[key] || translations[defaultLocale]?.[key] || (key as any)
    );
  };
};

export const t = <TTransKey extends TranslationKey>(
  key: TTransKey,
  locale = defaultLocale as Locale
): string => {
  const translator = createT(locale);
  return translator(key);
};

export const usePersistLocale = (lang: Locale) => {
  useEffect(() => {
    localStorage.setItem('locale', lang);
  }, [lang]);
};

const useLocaleTranslations = <TLocale extends Locale>(lang: TLocale) => {
  usePersistLocale(lang);

  return {
    t: createT<TLocale>(lang),
  };
};

export const useTranslation = () => {
  const { lang } = useSafeOpenLink();
  return useLocaleTranslations(lang);
};

export const Trans = ({ k, vars }: { k: TranslationKey; vars?: Record<string, string> }) => {
  const { t } = useTranslation();
  let trans = t(k);
  for (const [key, value] of Object.entries(vars ?? {})) {
    if (!trans) console.error('Translation not found', key, vars);
    trans = trans.replace(`{{${key}}}`, value);
  }

  return trans;
};
