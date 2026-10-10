import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { Marquee, MarqueeComponent } from '../src/blocks/Marquee.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('Marquee component & block', () => {
  it('renders correctly with defaultProps in Puck format', () => {
    const { container } = render(
      <Wrap>{Marquee.render(Marquee.defaultProps)}</Wrap>
    );

    const marquee = container.querySelector('.tps-marquee');
    expect(marquee).not.toBeNull();
    expect(marquee.textContent).toContain('Updates');
    expect(marquee.textContent).toContain('Admissions open');
    expect(container.querySelector('a[href="/admissions"]')).not.toBeNull();
  });

  it('sorts items in ascending order based on the order prop', () => {
    const unorderedItems = [
      { order: 3, text: 'Third Item' },
      { order: 1, text: 'First Item' },
      { order: 2, text: 'Second Item' },
    ];

    const { container } = render(
      <Wrap>
        <MarqueeComponent items={unorderedItems} />
      </Wrap>
    );

    const firstGroup = container.querySelector('.tps-marquee__group');
    expect(firstGroup).not.toBeNull();
    const itemNodes = firstGroup.querySelectorAll('.tps-marquee__item');
    expect(itemNodes.length).toBe(3);

    expect(itemNodes[0].textContent).toContain('First Item');
    expect(itemNodes[1].textContent).toContain('Second Item');
    expect(itemNodes[2].textContent).toContain('Third Item');
  });

  it('renders HTML content with links inside text', () => {
    const itemsWithHtml = [
      {
        order: 1,
        text: 'Special event at <a href="/annual-day">Auditorium</a> with <strong>Free Entry</strong>!',
      },
    ];

    const { container } = render(
      <Wrap>
        <MarqueeComponent items={itemsWithHtml} />
      </Wrap>
    );

    const link = container.querySelector('a[href="/annual-day"]');
    expect(link).not.toBeNull();
    expect(link.textContent).toBe('Auditorium');

    const strongTag = container.querySelector('strong');
    expect(strongTag).not.toBeNull();
    expect(strongTag.textContent).toBe('Free Entry');
  });

  it('supports custom backgroundColor, textColor, and speed duration', () => {
    const items = [{ order: 1, text: 'Custom styling test' }];

    const { container } = render(
      <Wrap>
        <MarqueeComponent
          items={items}
          backgroundColor="#223344"
          textColor="#eeddcc"
          speed={15}
          direction="right"
          pauseOnHover={true}
        />
      </Wrap>
    );

    const marquee = container.querySelector('.tps-marquee');
    expect(marquee.style.backgroundColor).toBe('#223344');
    expect(marquee.style.color).toBe('#eeddcc');

    const track = container.querySelector('.tps-marquee__track');
    expect(track.style.animationDuration).toBe('15s');
    expect(track.classList.contains('tps-marquee__track--reverse')).toBe(true);
    expect(track.classList.contains('tps-marquee__track--pause-hover')).toBe(true);
  });

  it('gracefully returns null when items array is empty', () => {
    const { container } = render(
      <Wrap>
        <MarqueeComponent items={[]} />
      </Wrap>
    );

    expect(container.querySelector('.tps-marquee')).toBeNull();
  });
});
