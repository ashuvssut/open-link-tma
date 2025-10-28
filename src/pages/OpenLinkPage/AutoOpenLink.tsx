// import { useSafeOpenLink } from '@/pages/useSafeOpenLink';
import { Placeholder } from '@telegram-apps/telegram-ui';
import { type PropsWithChildren } from 'react';
import { FaChrome } from 'react-icons/fa6';

export const AutoOpenLink = ({ children }: PropsWithChildren) => {
  // const { link } = useSafeOpenLink();
  // useEffect(() => {
  //   /**
  //    * ⚠️ NOTE: This approach doesn’t work due to browser / WebView security restrictions.
  //    * Verified experimentally:
  //    * - I repeatedly called handleOpen('chrome') in a setInterval (with delay of 500ms) for 10 seconds.
  //    * - The link only opened after I manually tapped anywhere on the screen within those 10 seconds.
  //    * → Conclusion: Opening links requires a real user interaction event.
  //    */
  //   if (link) handleOpen('chrome');
  // }, [link]);

  return (
    <Placeholder
      header={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Trying to open in <FaChrome />
          Chrome ...
        </div>
      }
      description="If it didn’t open automatically, choose your browser below."
    >
      {children}
    </Placeholder>
  );
};
