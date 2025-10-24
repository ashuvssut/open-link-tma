import { useCallback, useEffect, useState } from 'react';
import {
  Section,
  Cell,
  Button,
  Placeholder,
  Spinner,
  Snackbar,
  Text,
} from '@telegram-apps/telegram-ui';
import { Page } from '@/components/Page';
import { useSafeOpenLink } from '@/pages/useSafeOpenLink';
import { miniApp, openLink } from '@tma.js/sdk-react';

export const OpenLinkPage = () => {
  const { link, error } = useSafeOpenLink();
  const [status, setStatus] = useState<'idle' | 'opening' | 'error' | 'success'>('idle');
  const { showSnackbar, triggerSnackbar } = useSnackbar(6000);

  useEffect(() => {
    if (!link) return triggerSnackbar();

    setStatus('opening');
    try {
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
      {!link && (
        <Placeholder
          header="Something went wrong"
          description="We couldn’t find the link to open."
          action={
            <Button mode="filled" onClick={() => miniApp.close()}>
              Close
            </Button>
          }
        />
      )}

      {link && status === 'opening' && (
        <Section>
          <Cell>
            <Spinner size="m" />
            <Text style={{ marginTop: 12 }}>Opening link...</Text>
          </Cell>
        </Section>
      )}

      {link && status === 'error' && (
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

      {link && status === 'success' && (
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
