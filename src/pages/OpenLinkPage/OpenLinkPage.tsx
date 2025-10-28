import './styles.css';

import { useEffect } from 'react';
import {
  Section,
  Placeholder,
  Button,
  List,
  Cell,
  IconContainer,
  Text,
  Card,
  Headline,
  Subheadline,
  Divider,
  Caption,
} from '@telegram-apps/telegram-ui';
import { LuExternalLink } from 'react-icons/lu';
import { Page } from '@/components/Page';
import { useSafeOpenLink } from '@/pages/OpenLinkPage/useSafeOpenLink';
import { miniApp, useLaunchParams } from '@tma.js/sdk-react';
import { CopyLinkButton } from '@/pages/OpenLinkPage/CopyLinkButton';
import { FaEdge, FaFirefoxBrowser, FaBrave, FaChrome, FaSafari } from 'react-icons/fa6';
import { RiPlanetFill } from 'react-icons/ri';
import { openLink, OpenLinkBrowser } from '@tma.js/sdk-react';
import { showErrorToast } from '@/utils';
import toast from 'react-hot-toast';

export const OpenLinkPage = () => {
  const { link, error } = useSafeOpenLink();
  useEffect(() => {
    if (error) showErrorToast(error);
  }, [error]);

  const handleOpen = createOpenLink(link);

  if (!link) {
    return (
      <Page>
        <Placeholder
          header="Something went wrong"
          description="We couldn’t find the link you were trying to open."
          action={
            <Button mode="filled" onClick={() => miniApp.close()}>
              Close
            </Button>
          }
        />
      </Page>
    );
  }

  // const { showSnackbar, triggerSnackbar } = useSnackbar(6000);

  const platform = useLaunchParams().tgWebAppPlatform;
  return (
    <Page>
      <div style={{ display: 'grid', padding: '1rem' }}>
        <Card style={{ margin: 'auto', maxWidth: '100%' }}>
          <Section>
            {/* <AutoOpenLink>
              <CopyLinkButton link={link} />
            </AutoOpenLink> */}
            <div style={{ padding: '2rem 1rem' }}>
              <Headline weight="2">Open your link</Headline>
              <Subheadline style={{ color: 'var(--tgui--hint_color)', maxWidth: 340 }}>
                Copy the link and open it directly in your preferred browser&nbsp;
                <em>(Recommended)</em>.
              </Subheadline>
              <CopyLinkButton link={link} style={{ marginTop: 16 }} />

              <DividerWithText>or open with</DividerWithText>

              <List>
                {fallbackBrowsers.map((b) => {
                  if (b.type && platform !== b.type) return null;
                  return (
                    <Cell
                      key={b.id}
                      before={
                        <IconContainer style={{ alignItems: 'center', display: 'flex' }}>
                          {b.icon}
                        </IconContainer>
                      }
                      after={<LuExternalLink size={16} />}
                      onClick={() => handleOpen(b.id)}
                      role="button"
                      style={{ borderRadius: 20 }}
                    >
                      <Text style={{ fontSize: 15 }}>{b.label}</Text>
                    </Cell>
                  );
                })}

                {/* <Button
                mode="filled"
                onClick={() => handleOpen('chrome')}
                style={{ marginTop: 8, width: '100%' }}
                className="open-in-chrome-btn"
              >
                Try <FaChrome />
                Chrome Again
              </Button> */}
              </List>
            </div>
          </Section>
        </Card>
      </div>

      {/* {showSnackbar && (
        <Snackbar onClose={() => {}}>
          {error ?? 'Failed to open the link. Please try again.'}
        </Snackbar>
      )} */}
    </Page>
  );
};

const DividerWithText = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: '1rem 0',
    }}
  >
    <Divider style={{ flex: 1 }} />
    <Text style={{ color: 'var(--tgui--hint_color)' }} weight="2">
      {children}
    </Text>
    <Divider style={{ flex: 1 }} />
  </div>
);

/** @see https://docs.telegram-mini-apps.com/platform/about#supported-applications */
type TgPlaform = 'ios' | 'android' | 'maocs' | 'tdesktop' | 'weba' | 'web';
type BrowserType = OpenLinkBrowser | 'safari';
export const fallbackBrowsers = [
  { id: 'safari', label: 'Open in Safari', icon: <FaSafari size={20} />, type: 'ios' },
  { id: 'chrome', label: 'Open in Chrome', icon: <FaChrome size={20} /> },
  { id: 'firefox', label: 'Open in Firefox', icon: <FaFirefoxBrowser size={20} /> },
  { id: 'edge', label: 'Open in Microsoft Edge', icon: <FaEdge size={20} /> },
  { id: 'brave', label: 'Open in Brave', icon: <FaBrave size={20} /> },
  { id: 'samsung-browser', label: 'Open in Samsung Internet', icon: <RiPlanetFill size={20} /> },
] as { id: OpenLinkBrowser | 'safari'; label: string; icon: JSX.Element; type?: TgPlaform }[];

export const createOpenLink = (link: string | null) => (browser: BrowserType) => {
  if (!link) return;
  try {
    if (browser === 'safari') openLink(link, { tryInstantView: false });
    else openLink(link, { tryBrowser: browser, tryInstantView: false });
    toast.success(
      <div style={{ display: 'grid' }}>
        <Subheadline>Opening in {formatBrowserName(browser)}!</Subheadline>
        <Caption>If it doesn’t open, try again with a different browser.</Caption>
      </div>
    );
  } catch (err) {
    console.error('Failed to open link', err);
    showErrorToast(err, 'Could not open the link.');
  }
};

export function formatBrowserName(id: string): string {
  return id
    .split(/[-_]/) // split on dash or underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
