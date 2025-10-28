import { ENV } from '@/constants';
import { decodeX, showErrorToast } from '@/helpers/utils';
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

  const { decodedLink, type } = extractLink(startParam, search);
  const { link, error } = useMemo(() => {
    try {
      if (!decodedLink) return { link: null, error: "Missing 'open' parameter", decodeType: null };

      const url = new URL(decodedLink);

      if (url.protocol !== 'https:') return { link: null, error: 'Only HTTPS links are allowed' };

      if (
        ENV.allowedDomains.length > 0 &&
        !ENV.allowedDomains.some((d: string) => url.hostname.endsWith(d))
      ) {
        return { link: null, error: 'Domain not allowed' };
      }

      return { link: url.toString(), error: null };
    } catch (err) {
      showErrorToast(err, 'Link parsing failed!');
      return { link: null, error: 'Invalid URL' };
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

  return { link, error, __: { debug } };
}

const extractLinkFromStartParam = (startParam: string) => {
  if (!startParam) return '';
  const decodedStartParam = decodeX(startParam);
  const params = new URLSearchParams(decodedStartParam);
  const openLink = params.get('open');
  const decodedLink = decodeURIComponent(openLink ?? '');
  return decodedLink;
};

/** For Inline button web_app urls: https://ashuvssut.github.io/open-link-tma/#?open=https%3A%2F%2Fexample.com%3Ftoken%3Dmock-token-123%26lang%3Den` */
const extractLinkFromWebAppSearchParam = (search: string) => {
  if (!search) return '';
  const params = new URLSearchParams(search);
  const openParam = params.get('open');
  console.log('params openParam', openParam);
  return openParam || '';
};

const extractLink = (startParam: string | undefined, search: string) => {
  let decodedLink = extractLinkFromWebAppSearchParam(search);
  if (decodedLink) return { decodedLink, type: 'web_app_search_param' as const };

  decodedLink = extractLinkFromStartParam(startParam ?? '');
  if (decodedLink) return { decodedLink, type: 'start_param' as const };

  return { decodedLink: null, type: null };
};
