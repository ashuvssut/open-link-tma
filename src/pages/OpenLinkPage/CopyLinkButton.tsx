import { HTMLProps, useRef } from 'react';
import { Button, Caption, Tooltip } from '@telegram-apps/telegram-ui';
import { useClipboard } from '@mantine/hooks';

export const CopyLinkButton = ({
  link,
  style,
  ...props
}: { link: string } & HTMLProps<HTMLDivElement>) => {
  const buttonRef = useRef(null);
  const clipboard = useClipboard({ timeout: 1000 });

  if (!link) return null;
  return (
    <div
      {...props}
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
        ...style,
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
  );
};
