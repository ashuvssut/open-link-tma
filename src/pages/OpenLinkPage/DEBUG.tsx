import { Button, List, Text } from '@telegram-apps/telegram-ui';
import { LuExternalLink } from 'react-icons/lu';
import { openLink, OpenLinkBrowser, useLaunchParams } from '@tma.js/sdk-react';
import { ENV } from '@/constants';
import { useSafeOpenLink } from '@/pages/OpenLinkPage/useSafeOpenLink';
import { type PropsWithChildren } from 'react';

export const DEBUGLaunchParams = ({ children }: PropsWithChildren) => {
  const lp = useLaunchParams();
  return (
    <div style={{ position: 'relative', width: '100%', height: 500 }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          overflow: 'auto',
        }}
      >
        <pre>{`versionCode: ${ENV.debugVersionCode}  `.repeat(5)}</pre>
        {children}
        <pre>Launch Params</pre>
        <pre>{JSON.stringify(lp, null, 2)}</pre>
      </div>
    </div>
  );
};

const SafariTest = ({ n, onClick }: { n: number; onClick: () => void }) => {
  return (
    <Button
      after={<LuExternalLink size={16} />}
      onClick={onClick}
      role="button"
      style={{ borderRadius: 20 }}
    >
      <Text style={{ fontSize: 15 }}>Safari Test {n}</Text>
    </Button>
  );
};

// https://christiantietze.de/posts/2023/05/safari-for-mac-url-scheme/
export const DEBUGSafariTestSet = ({ link }: { link: string }) => {
  if (!link) return null;
  return (
    <>
      {/* tryBrowser: 'safari', tryInstantView: false */}
      <SafariTest
        n={1}
        onClick={() => {
          openLink(link, {
            tryBrowser: 'safari' as OpenLinkBrowser,
            tryInstantView: false,
          });
        }}
      />

      {/* tryBrowser: 'safari', tryInstantView: true */}
      <SafariTest
        n={2}
        onClick={() => {
          openLink(link, {
            tryBrowser: 'safari' as OpenLinkBrowser,
            tryInstantView: true,
          });
        }}
      />

      {/* tryBrowser: 'safari', tryInstantView: not mentioned */}
      <SafariTest
        n={3}
        onClick={() => {
          openLink(link, {
            tryBrowser: 'safari' as OpenLinkBrowser,
          });
        }}
      />

      {/* tryBrowser: true, tryInstantView: false */}
      <SafariTest
        n={4}
        onClick={() => {
          openLink(link, {
            tryBrowser: true as unknown as OpenLinkBrowser,
            tryInstantView: false,
          });
        }}
      />

      {/* tryBrowser: true, tryInstantView: true */}
      <SafariTest
        n={5}
        onClick={() => {
          openLink(link, {
            tryBrowser: true as unknown as OpenLinkBrowser,
            tryInstantView: true,
          });
        }}
      />

      {/* tryBrowser: true, tryInstantView: not mentioned */}
      <SafariTest
        n={6}
        onClick={() => {
          openLink(link, {
            tryBrowser: true as unknown as OpenLinkBrowser,
          });
        }}
      />

      {/* tryBrowser: false, tryInstantView: false */}
      <SafariTest
        n={7}
        onClick={() => {
          openLink(link, {
            tryBrowser: false as unknown as OpenLinkBrowser,
            tryInstantView: false,
          });
        }}
      />

      {/* tryBrowser: false, tryInstantView: true */}
      <SafariTest
        n={8}
        onClick={() => {
          openLink(link, {
            tryBrowser: false as unknown as OpenLinkBrowser,
            tryInstantView: true,
          });
        }}
      />

      {/* tryBrowser: false, tryInstantView: not mentioned */}
      <SafariTest
        n={9}
        onClick={() => {
          openLink(link, {
            tryBrowser: false as unknown as OpenLinkBrowser,
          });
        }}
      />

      {/* tryBrowser: not mentioned, tryInstantView: false */}
      <SafariTest
        n={10}
        onClick={() => {
          openLink(link, {
            tryInstantView: false,
          });
        }}
      />

      {/* tryBrowser: not mentioned, tryInstantView: true */}
      <SafariTest
        n={11}
        onClick={() => {
          openLink(link, {
            tryInstantView: true,
          });
        }}
      />

      {/* tryBrowser: not mentioned, tryInstantView: not mentioned */}
      <SafariTest
        n={12}
        onClick={() => {
          openLink(link);
        }}
      />
    </>
  );
};

export const DEBUG = () => {
  const { link, __ } = useSafeOpenLink();

  return (
    <>
      <DEBUGLaunchParams>
        <pre>Logs</pre>
        <pre>{JSON.stringify(__.debug, null, 2)}</pre>
      </DEBUGLaunchParams>

      {link && (
        <List style={{ padding: '1rem', display: 'grid' }}>
          <Text style={{ fontSize: 15 }}>1st test set uses https:// schema</Text>
          <DEBUGSafariTestSet link={link} />
          <Text style={{ fontSize: 15 }}>2nd test set uses x-safari-https:// schema</Text>
          <DEBUGSafariTestSet link={link.replace('https://', 'x-safari-https://')} />
          <Text style={{ fontSize: 15 }}>
            3rd test set uses com-apple-mobilesafari-tab:https:// schema
          </Text>
          <DEBUGSafariTestSet link={link.replace('https://', 'com-apple-mobilesafari-tab:://')} />
        </List>
      )}
    </>
  );
};
