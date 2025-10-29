import { ENV } from '@/constants';
import { decodeX, showErrorToast } from '@/helpers/utils';
import { defaultLocale, isLocaleSupported, Locale } from '@/locales';
import { createT, usePersistLocale } from '@/locales/useTranslation';
import { useLaunchParams } from '@tma.js/sdk-react';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Returns a safe link to open.
 * The launch parameter `open=...` is decoded and checked for validity. Make sure you call the TMA using a link with `start_param` like:-
 * - `https://t.me/OpenLinkTMA_bot/OpenLinkTMA?startapp=open=https%3A%2F%2Fexample.com%2Flink`
 * Also, the link must be HTTPS and allowed domain.
 */
export function useSafeOpenLink() {
  const lp = useLaunchParams();
  const startParam = lp.tgWebAppData?.start_param || lp.tgWebAppStartParam;

  const { search } = useLocation();

  const { decodedLink, type, lang } = extractLink(startParam, search);
  usePersistLocale(lang);
  const t = createT(lang);
  const { link, error } = useMemo(() => {
    try {
      if (!decodedLink) return { link: null, error: t('error.missingOpenParam'), decodeType: null };

      const url = new URL(decodedLink);

      if (url.protocol !== 'https:') return { link: null, error: t('error.httpsOnly') };

      if (
        ENV.allowedDomains.length > 0 &&
        !ENV.allowedDomains.some((d: string) => url.hostname.endsWith(d))
      ) {
        return { link: null, error: t('error.domainNotAllowed') };
      }

      return { link: url.toString(), error: null };
    } catch (err) {
      showErrorToast(err, t('linkParsingFailed'));
      return { link: null, error: t('error.invalidUrl') };
    }
  }, [decodedLink]);

  const debug = {
    url: window.location.toString(),
    linkType: type,
    search: {
      full: search,
      openParam: new URLSearchParams(search).get('open'),
      langParam: new URLSearchParams(search).get('lang'),
    },
    startParam,
    link,
    error,
  };

  return { link, error, lang, __: { debug } };
}

const extractSearchParamsFromStartParam = (startParam: string) => {
  if (!startParam) return;
  const decodedStartParam = decodeX(startParam);
  const params = new URLSearchParams(decodedStartParam);
  return params;
};

/** For Inline button web_app urls: https://ashuvssut.github.io/open-link-tma/#?open=https%3A%2F%2Fexample.com%3Ftoken%3Dmock-token-123&lang=en` */
const extractSearchParamsFromWebAppSearchParam = (search: string) => {
  if (!search) return null;
  const params = new URLSearchParams(search);
  return params;
  // const openParam = params.get('open');
  // console.log('params openParam', openParam);
  // return openParam || '';
};

const extractLink = (
  startParam: string | undefined,
  search: string
): {
  decodedLink: string | null;
  type: 'start_param' | 'web_app_search_param' | null;
  lang: Locale;
} => {
  const searchParamsWebapp = extractSearchParamsFromWebAppSearchParam(search);
  const openParam = searchParamsWebapp?.get('open');

  if (openParam)
    return {
      decodedLink: openParam,
      lang: getLang(searchParamsWebapp),
      type: 'web_app_search_param' as const,
    };

  const searchParamsStartParam = extractSearchParamsFromStartParam(startParam ?? '');
  const decodedLink = searchParamsStartParam?.get('open');

  if (decodedLink)
    return {
      decodedLink,
      lang: getLang(searchParamsStartParam),
      type: 'start_param' as const,
    };

  return { decodedLink: null, type: null, lang: defaultLocale };
};

const getLang = (searchParams: URLSearchParams | undefined | null): Locale => {
  if (!searchParams) return defaultLocale;

  const lang = searchParams.get('lang');
  if (isLocaleSupported(lang)) return lang;
  return defaultLocale;
};
