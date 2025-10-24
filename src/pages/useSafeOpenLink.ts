import { type LaunchParams, useLaunchParams } from '@tma.js/sdk-react';
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
  const lp = useLaunchParams() as LaunchParams;
  const linkText = lp.tgWebAppStartParam?.startsWith('open=')
    ? decodeURIComponent(lp.tgWebAppStartParam.replace('open=', ''))
    : null;

  console.log(lp, linkText);

  const { link, error } = useMemo(() => {
    if (!linkText) return { link: null, error: "Missing 'open' parameter" };

    try {
      const url = new URL(linkText);

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
  }, [linkText, allowedDomains]);

  return { link, error };
}
