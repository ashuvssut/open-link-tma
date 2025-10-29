import './styles.css';

import { type PropsWithChildren, useEffect } from 'react';
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
  Caption,
} from '@telegram-apps/telegram-ui';
import { LuExternalLink } from 'react-icons/lu';
import { Page } from '@/components/Page';
import { useSafeOpenLink } from '@/pages/OpenLinkPage/useSafeOpenLink';
import { miniApp, useLaunchParams } from '@tma.js/sdk-react';
import { CopyLinkButton } from '@/pages/OpenLinkPage/CopyLinkButton';
import { FaEdge, FaBrave, FaChrome, FaSafari } from 'react-icons/fa6';
import { RiPlanetFill } from 'react-icons/ri';
import { openLink, OpenLinkBrowser } from '@tma.js/sdk-react';
import { showErrorToast } from '@/helpers/utils';
import toast from 'react-hot-toast';
import { t, Trans, useTranslation } from '@/locales/useTranslation';
import { TranslationKey } from '@/locales';
import { UncontrolledAccordion } from '@/components/UncontrolledAccordion';
import { DividerWithText } from '@/components/DividerWithText';
import { ENV } from '@/constants';

export const OpenLinkPage = () => {
  const { link, error } = useSafeOpenLink();
  useEffect(() => {
    if (error) showErrorToast(error);
  }, [error]);

  const { t } = useTranslation();
  if (!link) {
    return (
      <Page>
        <Placeholder
          header={t('sthWentWrong')}
          description={t('couldNotFindLink')}
          action={
            <Button mode="filled" onClick={() => miniApp.close()}>
              {t('close')}
            </Button>
          }
        />
      </Page>
    );
  }

  // const { showSnackbar, triggerSnackbar } = useSnackbar(6000);
  return (
    <Page>
      <div style={{ display: 'grid', padding: '1rem' }}>
        <Card style={{ margin: 'auto', maxWidth: '100%' }}>
          <Section>
            {/* <AutoOpenLink>
              <CopyLinkButton link={link} />
            </AutoOpenLink> */}
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <Headline weight="2">{t('openLink')}</Headline>
              <Subheadline style={{ color: 'var(--tgui--hint_color)', maxWidth: 340 }}>
                {t('copyAndOpen')}
                {/* <em>({t('recommended')})</em>. */}
              </Subheadline>
              <CopyLinkButton link={link} style={{ marginTop: 16 }} />

              <DividerWithText>{t('orOpenWith')}</DividerWithText>

              <BrowserChoiceList browsers={mainBrowsers} />
              {ENV.showFallbackBrowsers && (
                <UncontrolledAccordion
                  renderHeader={(isOpen) =>
                    isOpen ? t('hideOtherBrowsers') : t('showOtherBrowsers')
                  }
                >
                  <BrowserChoiceList browsers={fallbackBrowsers} />
                </UncontrolledAccordion>
              )}
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

const BrowserChoiceList = ({
  browsers,
  children,
}: PropsWithChildren<{ browsers: BrowserChoices }>) => {
  const { link } = useSafeOpenLink();
  const handleOpen = createOpenLink(link);

  const platform = useLaunchParams().tgWebAppPlatform;
  return (
    <List>
      {browsers.map((b) => {
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
            <Text style={{ fontSize: 15 }}>{t(b.label)}</Text>
          </Cell>
        );
      })}

      {children}
    </List>
  );
};

/** @see https://docs.telegram-mini-apps.com/platform/about#supported-applications */
type TgPlaform = 'ios' | 'android' | 'maocs' | 'tdesktop' | 'weba' | 'web';
type BrowserType = OpenLinkBrowser | 'safari';
type BrowserChoices = {
  id: OpenLinkBrowser | 'safari';
  label: TranslationKey;
  icon: JSX.Element;
  type?: TgPlaform;
}[];
export const mainBrowsers: BrowserChoices = [
  { id: 'chrome', label: 'openInChrome', icon: <FaChrome size={20} /> },
  { id: 'safari', label: 'openInSafari', icon: <FaSafari size={20} />, type: 'ios' },
];
export const fallbackBrowsers: BrowserChoices = [
  // { id: 'firefox', label: 'openInFirefox', icon: <FaFirefoxBrowser size={20} /> },
  { id: 'edge', label: 'openInEdge', icon: <FaEdge size={20} /> },
  { id: 'brave', label: 'openInBrave', icon: <FaBrave size={20} /> },
  { id: 'samsung-browser', label: 'openInSamsungBrowser', icon: <RiPlanetFill size={20} /> },
];
export const createOpenLink = (link: string | null) => (browser: BrowserType) => {
  if (!link) return;
  try {
    if (browser === 'safari') openLink(link, { tryInstantView: false });
    else openLink(link, { tryBrowser: browser, tryInstantView: false });
    toast.success(
      <div style={{ display: 'grid' }}>
        <Subheadline>
          <Trans k="openingInBrowserName" vars={{ browserName: formatBrowserName(browser) }} />
        </Subheadline>
        <Caption>
          <Trans k="tryAgainWithDifferentBrowser" />
        </Caption>
      </div>
    );
  } catch (err) {
    console.error('failedToOpenLink', err);
    showErrorToast(err, t('failedToOpenLink'));
  }
};

export function formatBrowserName(id: string): string {
  return id
    .split(/[-_]/) // split on dash or underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
