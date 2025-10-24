import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Section,
  Cell,
  Button,
  Placeholder,
  Spinner,
  Snackbar,
  Text,
  Caption,
  Tooltip,
} from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { useSafeOpenLink } from '@/pages/useSafeOpenLink';
import { miniApp, openLink } from '@tma.js/sdk-react';
import { useClipboard } from '@mantine/hooks';

export const OpenLinkPage = () => {
  const { link, error } = useSafeOpenLink();
  const [status, setStatus] = useState<'idle' | 'opening' | 'error' | 'success'>('idle');
  const { showSnackbar, triggerSnackbar } = useSnackbar(6000);

  useEffect(() => {
    if (!link) return triggerSnackbar();

    setStatus('opening');
    try {
      console.log('Opening link', link);
      openLink(link, { tryBrowser: 'chrome', tryInstantView: false });
      setStatus('success');
    } catch (err) {
      console.error('Link open failed', err);
      setStatus('error');
      triggerSnackbar();
    }
  }, [link]);

  return (
    <Page>
      {!link ? (
        <Placeholder
          header="Something went wrong"
          description="We couldn’t find the link to open."
          action={
            <Button mode="filled" onClick={() => miniApp.close()}>
              Close
            </Button>
          }
        />
      ) : (
        <>
          <CopyLinkButton link={link} />

          {status === 'opening' && (
            <Section>
              <Cell>
                <Spinner size="m" />
                <Text style={{ marginTop: 12 }}>Opening link...</Text>
              </Cell>
            </Section>
          )}

          {status === 'error' && (
            <Section>
              <Placeholder
                header="Couldn’t open the link"
                description="Tap the button below to open it manually."
                action={
                  <Button mode="filled" onClick={() => window.open(link, '_blank')}>
                    Open in Browser
                  </Button>
                }
              />
            </Section>
          )}

          {status === 'success' && (
            <Section>
              <Placeholder
                header="Opening..."
                description="If the page didn’t open automatically, tap below."
                action={
                  <Button mode="filled" onClick={() => window.open(link, '_blank')}>
                    Open Again
                  </Button>
                }
              />
            </Section>
          )}
        </>
      )}
      {showSnackbar && (
        <Snackbar onClose={() => {}}>
          {error ?? 'Failed to open the link. Please try again.'}
        </Snackbar>
      )}
    </Page>
  );
};

function useSnackbar(timeout = 3000) {
  const [showSnackbar, setShowSnackbar] = useState(false);

  const triggerSnackbar = useCallback(() => {
    setShowSnackbar(true);
    const timer = setTimeout(() => setShowSnackbar(false), timeout);
    return () => clearTimeout(timer); // cleanup if needed
  }, [timeout]);

  return { showSnackbar, triggerSnackbar, setShowSnackbar };
}

const CopyLinkButton = ({ link }: { link: string }) => {
  const buttonRef = useRef(null);
  const clipboard = useClipboard({ timeout: 1000 });

  if (!link) return null;
  return (
    <Section>
      <div style={{ paddingTop: 12 }}>
        <div
          style={{
            position: 'relative',
            background: 'var(--tg-theme-secondary-bg-color)',
            borderRadius: 12,
            paddingLeft: 12,
            overflow: 'hidden',
            maxWidth: 300,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Caption
            level="2"
            style={{
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
            }}
          >
            {link}
          </Caption>

          <Button
            ref={buttonRef}
            mode="bezeled"
            size="s"
            style={{ minWidth: 80, transform: 'scale(0.8)' }}
            onClick={() => clipboard.copy(link)}
          >
            COPY
          </Button>

          {clipboard.copied && (
            <Tooltip targetRef={buttonRef} mode="light">
              Copied!
            </Tooltip>
          )}
        </div>
      </div>
    </Section>
  );
};
