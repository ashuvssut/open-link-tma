import { defaultLocale, Locale, TranslationKey, translations } from '@/locales';
import { useSafeOpenLink } from '@/pages/OpenLinkPage/useSafeOpenLink';
import { useEffect } from 'react';

export const t = <TTransKey extends TranslationKey, TLocale extends Locale>(
  key: TTransKey,
  lang?: TLocale
): (typeof translations)[TLocale][TTransKey] => {
  let selectedLang: Locale | undefined = lang;
  if (!selectedLang) {
    selectedLang = localStorage.getItem('locale') as Locale;
  }
  if (!selectedLang) {
    selectedLang = defaultLocale;
  }

  return translations[selectedLang]?.[key] || translations[defaultLocale]?.[key] || key || '';
};

const useLocaleTranslations = <TLocale extends Locale>(lang: TLocale) => {
  useEffect(() => {
    localStorage.setItem('locale', lang);
  }, [lang]);

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

export const Trans = ({ k, vars }: { k: TranslationKey; vars?: Record<string, string> }) => {
  const { t } = useTranslation();
  let trans = t(k);
  for (const [key, value] of Object.entries(vars ?? {})) {
    if (!trans) console.error('Translation not found', key, vars);
    trans = trans.replace(`{{${key}}}`, value);
  }

  return trans;
};
