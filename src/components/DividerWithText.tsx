import { Divider, Text } from '@telegram-apps/telegram-ui';

export const DividerWithText = ({ children }: { children: React.ReactNode }) => (
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
