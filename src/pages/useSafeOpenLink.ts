import { useLaunchParams } from '@tma.js/sdk-react';
import { useMemo } from 'react';

const allowedDomains = import.meta.env.VITE_ALLOWED_DOMAINS
  ? import.meta.env.VITE_ALLOWED_DOMAINS.split(',').map((d: string) => d.trim())
  : [];

/**
 * Returns a safe link to open.
 * The launch parameter `open=...` is decoded and checked for validity. Make sure you call the TMA using a link with `start_param` like:-
 * - `https://t.me/OpenLinkTMA_bot/OpenLinkTMA?startapp=open=https%3A%2F%2Fexample.com%2Flink`
 * Also, the link must be HTTPS and allowed domain.
 */
export function useSafeOpenLink() {
  const lp = useLaunchParams();
  const startParam = lp.tgWebAppData?.start_param;

  const { link, error } = useMemo(() => {
    try {
      const params = new URLSearchParams(startParam);
      const openLink = params.get('open');
      const decodedLink = decodeURIComponent(openLink ?? '');

      if (!decodedLink) return { link: null, error: "Missing 'open' parameter" };

      const url = new URL(decodedLink);

      if (url.protocol !== 'https:') return { link: null, error: 'Only HTTPS links are allowed' };

      if (
        allowedDomains.length > 0 &&
        !allowedDomains.some((d: string) => url.hostname.endsWith(d))
      ) {
        return { link: null, error: 'Domain not allowed' };
      }

      return { link: url.toString(), error: null };
    } catch {
      return { link: null, error: 'Invalid URL' };
    }
  }, [startParam, allowedDomains]);

  return { link, error };
}
