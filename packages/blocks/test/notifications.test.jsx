import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { Notifications, NotificationsComponent } from '../src/blocks/Notifications.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('Notifications component & block', () => {
  it('renders correctly with defaultProps in Puck format', () => {
    const { container } = render(
      <Wrap>{Notifications.render(Notifications.defaultProps)}</Wrap>
    );

    const notif = container.querySelector('.tps-notifications');
    expect(notif).not.toBeNull();
    expect(notif.textContent).toContain('Notifications & Announcements');
    expect(notif.textContent).toContain('Notice Board');
    expect(notif.textContent).toContain('System upgrade scheduled');
    expect(container.querySelector('a[href="/announcements"]')).not.toBeNull();
  });

  it('renders NEW tag badge when is_new is true', () => {
    const items = [
      {
        order: 1,
        is_new: true,
        new_badge_text: 'NEW',
        text: 'Release 2026',
      },
      {
        order: 2,
        is_new: false,
        text: 'Archived Notice',
      },
    ];

    const { container } = render(
      <Wrap>
        <NotificationsComponent items={items} />
      </Wrap>
    );

    const newBadges = container.querySelectorAll('.tps-notifications__new-badge');
    expect(newBadges.length).toBeGreaterThan(0);
    expect(newBadges[0].textContent).toBe('NEW');
  });

  it('sorts items in ascending order based on order prop', () => {
    const unorderedItems = [
      { order: 2, text: 'Second Notice' },
      { order: 1, text: 'First Notice' },
    ];

    const { container } = render(
      <Wrap>
        <NotificationsComponent items={unorderedItems} />
      </Wrap>
    );

    const firstGroup = container.querySelector('.tps-notifications__group');
    expect(firstGroup).not.toBeNull();
    const itemNodes = firstGroup.querySelectorAll('.tps-notifications__item');
    expect(itemNodes.length).toBe(2);
    expect(itemNodes[0].textContent).toContain('First Notice');
    expect(itemNodes[1].textContent).toContain('Second Notice');
  });

  it('supports custom height, direction, speed, and pauseOnHover', () => {
    const items = [{ order: 1, text: 'Auto scroll test notice' }];

    const { container } = render(
      <Wrap>
        <NotificationsComponent
          items={items}
          height={420}
          direction="up"
          speed={18}
          pauseOnHover={true}
        />
      </Wrap>
    );

    const viewport = container.querySelector('.tps-notifications__viewport');
    expect(viewport.style.height).toBe('420px');

    const track = container.querySelector('.tps-notifications__track');
    expect(track.style.animationDuration).toBe('18s');
    expect(track.classList.contains('tps-notifications__track--up')).toBe(true);
    expect(track.classList.contains('tps-notifications__track--pause-hover')).toBe(true);
  });

  it('gracefully returns null when items array is empty', () => {
    const { container } = render(
      <Wrap>
        <NotificationsComponent items={[]} />
      </Wrap>
    );

    expect(container.querySelector('.tps-notifications')).toBeNull();
  });
});
