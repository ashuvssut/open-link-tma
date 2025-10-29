const allowedDomains = import.meta.env.VITE_ALLOWED_DOMAINS
  ? import.meta.env.VITE_ALLOWED_DOMAINS.split(',').map((d: string) => d.trim())
  : [];

const showFallbackBrowsers = import.meta.env.VITE_SHOW_FALLBACK_BROWSERS
  ? import.meta.env.VITE_SHOW_FALLBACK_BROWSERS === 'true'
  : true;

export const ENV = {
  /** Github pages take time to update. So this is a workaround to know if the page is outdated */
  debugVersionCode: 5,
  /** Disable `enableDebug` in production! */
  enableDebug: false,
  /**
   * Use Base62 encoding for `start_param` parameter.
   *
   * By default, the TMA doesnt work when we put an `encodeURIComponent` in `start_param` of the TMA link
   * e.g. The following link is not working:
   * - `https://t.me/OpenLinkTMA_bot/OpenLinkTMA?startapp=${encodeURIComponent('https://example.com?token=mock-token&lang=en')}`
   * But the following Base62 link is working:
   * - `https://t.me/OpenLinkTMA_bot/OpenLinkTMA?startapp=${encodeBase62('https://example.com?token=mock-token&lang=en')}`
   * - which then becomes: `https://ashuvssut.github.io/open-link-tma/?open=dI8kHEYJoDUAyMrva8TvcQNUuMdI5QeSERnBYyICVeNkaFfNvQlZuRwZ2tIPiRUgFM`
   *
   * But if you are going to use Inline Keyboard buttons in the Bot, then you would be using `web_app` mode
   * for the inline button. Here you can use the `encodeURIComponent` for the web_app url.
   * e.g. The following link is working:
   * - `https://ashuvssut.github.io/open-link-tma/#?open=${encodeURIComponent('https://example.com?token=mock-token&lang=en')}`
   * - NOTE: The URL has a `#` at the beginning. Its because we are using the react-router-dom `HashRouter`
   */
  /**
   * Controls whether to use **Base62 encoding** for the `start_param` parameter in Telegram Mini App (TMA) links. Always set this to `true`.
   *
   * ---
   *
   * ⚠️ **Why this matters**
   *
   * Telegram Mini Apps often fail to open correctly when `encodeURIComponent` is used inside the `start_param` to encode our `open` search param link.
   *
   * ❌ Example (does NOT work):
   * ```
   * https://t.me/OpenLinkTMA_bot/OpenLinkTMA?startapp=${encodeURIComponent('https://example.com?token=mock-token&lang=en')}
   * ```
   *
   * ✅ Example (works with Base62 encoding):
   * ```
   * https://t.me/OpenLinkTMA_bot/OpenLinkTMA?startapp=${encodeBase62('https://example.com?token=mock-token&lang=en')}
   * ```
   * This encodes to something like:
   * ```
   * https://ashuvssut.github.io/open-link-tma/?open=dI8kHEYJoDUAyMrva8TvcQNUuMdI5QeSERnBYyICVeNkaFfNvQlZuRwZ2tIPiRUgFM
   * ```
   *
   * ---
   *
   * 🧩 **Inline Keyboard Buttons (Web App Mode)**
   *
   * When using inline keyboard buttons with `web_app` mode, you can safely use `encodeURIComponent`
   * instead of Base62. For example:
   * ```
   * https://ashuvssut.github.io/open-link-tma/#?open=${encodeURIComponent('https://example.com?token=mock-token&lang=en')}
   * ```
   *
   * **Note:** The `#` prefix is required because the app uses React Router’s `HashRouter`.
   */
  useBase62: true,
  allowedDomains,
  showFallbackBrowsers,
};
