import './styles.css';

import { type PropsWithChildren, useState } from 'react';
import { Caption, Accordion } from '@telegram-apps/telegram-ui';

export const UncontrolledAccordion = ({
  children,
  renderHeader,
}: PropsWithChildren<{ renderHeader?: (expanded: boolean) => React.ReactNode }>) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Accordion onChange={(expanded) => setExpanded(expanded)} expanded={expanded}>
      <div className="uncontrolled-accordion-summary-wrapper">
        <Accordion.Summary className="uncontrolled-accordion-summary">
          <Caption weight="3" style={{ textAlign: 'left' }}>
            {renderHeader?.(expanded)}
          </Caption>
        </Accordion.Summary>
      </div>
      <Accordion.Content>
        <div style={{ padding: '10px 20px' }}>{children}</div>
      </Accordion.Content>
    </Accordion>
  );
};
