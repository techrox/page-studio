import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { MastheadHeader, MastheadHeaderComponent } from '../src/blocks/MastheadHeader.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

function setScrollY(value) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value,
  });
}

afterEach(() => {
  setScrollY(0);
});

describe('MastheadHeader component & block', () => {
  it('renders correctly with defaultProps in Puck format', () => {
    const { container } = render(
      <Wrap>{MastheadHeader.render(MastheadHeader.defaultProps)}</Wrap>
    );

    expect(container.querySelector('.tps-masthead')).not.toBeNull();
    expect(container.querySelector('.tps-masthead__bar')).not.toBeNull();
    expect(container.textContent).toContain('Tamil Nadu National Law University');
    expect(container.textContent).toContain('தமிழ்நாடு தேசிய சட்டப்பல்கலைக்கழகம்');
    expect(container.textContent).toContain('The University');
    expect(container.textContent).toContain('Quick Links');
  });

  it('splits menu items either side of the centre crest', () => {
    const { container } = render(
      <Wrap>{MastheadHeader.render(MastheadHeader.defaultProps)}</Wrap>
    );

    const start = container.querySelector('.tps-masthead__menu--start');
    const end = container.querySelector('.tps-masthead__menu--end');

    expect(start.textContent).toContain('The University');
    expect(start.textContent).toContain('Study');
    expect(start.textContent).toContain('Research');
    expect(start.textContent).not.toContain('Campus Life');

    expect(end.textContent).toContain('Campus Life');
    expect(end.textContent).toContain('News');
    expect(end.textContent).toContain('Quick Links');
    expect(end.textContent).not.toContain('The University');

    expect(container.querySelector('.tps-masthead__crest-gap')).not.toBeNull();
  });

  it('renders a ringed monogram when no crest image is set', () => {
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent title="Alpha Beta University" menus={[]} />
      </Wrap>
    );

    const fallback = container.querySelector('.tps-masthead__crest-fallback');
    expect(fallback).not.toBeNull();
    expect(fallback.textContent).toBe('ABU');
    expect(container.querySelector('.tps-masthead__crest-img')).toBeNull();
  });

  it('renders the crest image when crest_url is provided', () => {
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent
          crest_url="https://example.com/crest.png"
          crest_alt="Seal"
        />
      </Wrap>
    );

    const img = container.querySelector('.tps-masthead__crest-img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/crest.png');
    expect(img.getAttribute('alt')).toBe('Seal');
  });

  it('is sticky by default and drops the class when sticky is false', () => {
    const { container, rerender } = render(
      <Wrap>{MastheadHeader.render(MastheadHeader.defaultProps)}</Wrap>
    );
    expect(container.querySelector('.tps-masthead--sticky')).not.toBeNull();

    rerender(
      <Wrap>
        <MastheadHeaderComponent {...MastheadHeader.defaultProps} sticky={false} />
      </Wrap>
    );
    expect(container.querySelector('.tps-masthead--sticky')).toBeNull();
  });

  it('compacts once the page scrolls past shrink_after', () => {
    setScrollY(0);
    const { container } = render(
      <Wrap>{MastheadHeader.render(MastheadHeader.defaultProps)}</Wrap>
    );
    expect(container.querySelector('.tps-masthead.is-compact')).toBeNull();

    act(() => {
      setScrollY(200);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(container.querySelector('.tps-masthead.is-compact')).not.toBeNull();

    act(() => {
      setScrollY(0);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(container.querySelector('.tps-masthead.is-compact')).toBeNull();
  });

  it('stays full size when shrink_on_scroll is off', () => {
    setScrollY(0);
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent {...MastheadHeader.defaultProps} shrink_on_scroll={false} />
      </Wrap>
    );

    act(() => {
      setScrollY(400);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(container.querySelector('.tps-masthead.is-compact')).toBeNull();
  });

  it('honours the shrink_after threshold', () => {
    setScrollY(0);
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent {...MastheadHeader.defaultProps} shrink_after={300} />
      </Wrap>
    );

    act(() => {
      setScrollY(100);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(container.querySelector('.tps-masthead.is-compact')).toBeNull();

    act(() => {
      setScrollY(320);
      window.dispatchEvent(new Event('scroll'));
    });
    expect(container.querySelector('.tps-masthead.is-compact')).not.toBeNull();
  });

  it('renders dropdown buttons for menus with children', () => {
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent
          menus={[
            { label: 'Study', path: '/study' },
            {
              label: 'Research',
              children: [
                { label: 'Centres', path: '/research/centres' },
                { label: 'Publications', path: '/research/pubs' },
              ],
            },
          ]}
        />
      </Wrap>
    );

    const dropdown = container.querySelector('.tps-masthead__link--dropdown');
    expect(dropdown).not.toBeNull();
    expect(dropdown.textContent).toContain('Research');
  });

  it('invokes onNavigate when a menu link is clicked', () => {
    const onNavigate = vi.fn();
    render(
      <Wrap>
        <MastheadHeaderComponent
          menus={[{ label: 'Study', path: '/study' }]}
          onNavigate={onNavigate}
        />
      </Wrap>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Study' }));
    expect(onNavigate).toHaveBeenCalledWith(
      '/study',
      expect.objectContaining({ label: 'Study' }),
      expect.anything()
    );
  });

  it('highlights the menu item matching activePath', () => {
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent
          menus={[
            { label: 'Study', path: '/study' },
            { label: 'News', path: '/news' },
          ]}
          activePath="/study"
        />
      </Wrap>
    );

    const active = container.querySelector('.tps-masthead__link.is-active');
    expect(active).not.toBeNull();
    expect(active.textContent).toContain('Study');
  });

  it('applies background color and nav bar color overrides', () => {
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent
          backgroundColor="#101820"
          bar_color="#7a1fa2"
          bar_text_color="#ffee58"
        />
      </Wrap>
    );

    const header = container.querySelector('.tps-masthead');
    expect(header.style.backgroundColor).toMatch(/(#101820|16,\s*24,\s*32)/);
    expect(header.style.getPropertyValue('--tps-masthead-bar').trim()).toBe('#7a1fa2');
    expect(header.style.getPropertyValue('--tps-masthead-bar-text').trim()).toBe('#ffee58');
  });

  it('renders without menus, titles, or a crest', () => {
    const { container } = render(
      <Wrap>
        <MastheadHeaderComponent />
      </Wrap>
    );
    expect(container.querySelector('.tps-masthead')).not.toBeNull();
    expect(container.querySelector('.tps-masthead__crest-link')).toBeNull();
    expect(container.querySelectorAll('.tps-masthead__item').length).toBe(0);
  });
});
