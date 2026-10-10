import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import {
  FooterNavigation,
  FooterNavigationComponent,
} from '../src/blocks/FooterNavigation.jsx';
import { defaultBlocks, defaultCategories } from '../src/config.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('FooterNavigation component & Puck block', () => {
  it('is properly registered in defaultBlocks and defaultCategories', () => {
    expect(defaultBlocks.FooterNavigation).toBeDefined();
    expect(defaultCategories.Footers).toBeDefined();
    expect(defaultCategories.Footers.components).toContain('FooterNavigation');
  });

  it('renders standard layout correctly with defaultProps and dummy data', () => {
    const { container } = render(
      <Wrap>{FooterNavigation.render(FooterNavigation.defaultProps)}</Wrap>
    );

    const footer = container.querySelector('.tps-footer-nav');
    expect(footer).not.toBeNull();
    expect(footer.classList.contains('tps-footer-nav--fullwidth')).toBe(false);

    // Brand dummy info
    expect(container.querySelector('.tps-footer-nav__brand')).not.toBeNull();
    expect(container.textContent).toContain('Company Name');
    expect(container.textContent).toContain('123 Business Avenue');

    // Columns
    const cols = container.querySelectorAll('.tps-footer-nav__column');
    expect(cols.length).toBeGreaterThanOrEqual(1);

    // Social links
    expect(container.querySelector('.tps-footer-nav__socials')).not.toBeNull();

    // Copyright
    expect(container.querySelector('.tps-footer-nav__copyright')).not.toBeNull();
  });

  it('supports "Full width (End-to-end screen)" option (fullWidth: true)', () => {
    const { container } = render(
      <Wrap>
        <FooterNavigationComponent fullWidth={true} />
      </Wrap>
    );

    const footer = container.querySelector('.tps-footer-nav');
    expect(footer).not.toBeNull();
    expect(footer.classList.contains('tps-footer-nav--fullwidth')).toBe(true);

    const containerDiv = container.querySelector('.tps-footer-nav__container');
    expect(containerDiv.style.maxWidth).toBe('100%');
  });

  it('replaces {year} dynamically in copyright text', () => {
    const currentYear = String(new Date().getFullYear());
    const { container } = render(
      <Wrap>
        <FooterNavigationComponent
          copyright_text="Copyright © {year} Acme Inc. All rights reserved."
        />
      </Wrap>
    );

    const cr = container.querySelector('.tps-footer-nav__copyright');
    expect(cr).not.toBeNull();
    expect(cr.textContent).toContain(`Copyright © ${currentYear} Acme Inc.`);
    expect(cr.textContent).not.toContain('{year}');
  });

  it('renders customized columns and clickable page links', () => {
    const customColumns = [
      {
        title: 'Academics',
        links: [
          { label: 'Courses Offering', href: '/courses-offering' },
          { label: 'Admissions', href: '/admissions' },
        ],
      },
      {
        title: 'Campus Infra',
        links: [
          { label: 'Moot Court', href: '/moot-court' },
          { label: 'Central Library', href: '/library' },
          { label: 'Laboratories', href: '/lab' },
        ],
      },
    ];

    const { container } = render(
      <Wrap>
        <FooterNavigationComponent columns={customColumns} />
      </Wrap>
    );

    expect(container.textContent).toContain('Academics');
    expect(container.textContent).toContain('Campus Infra');

    const links = Array.from(container.querySelectorAll('.tps-footer-nav__link')).map(
      (a) => ({
        label: a.textContent.trim(),
        href: a.getAttribute('href'),
      })
    );

    expect(links).toEqual(
      expect.arrayContaining([
        { label: 'Courses Offering', href: '/courses-offering' },
        { label: 'Admissions', href: '/admissions' },
        { label: 'Moot Court', href: '/moot-court' },
        { label: 'Central Library', href: '/library' },
        { label: 'Laboratories', href: '/lab' },
      ])
    );
  });

  it('supports adjustable backgrounds including white, soft, and dark', () => {
    // White background
    const { container: whiteContainer } = render(
      <Wrap>
        <FooterNavigationComponent background="white" />
      </Wrap>
    );
    expect(whiteContainer.querySelector('.tps-footer-nav--white')).not.toBeNull();
    expect(whiteContainer.querySelector('.tps-footer-nav--light')).not.toBeNull();

    // Soft background
    const { container: softContainer } = render(
      <Wrap>
        <FooterNavigationComponent background="soft" />
      </Wrap>
    );
    expect(softContainer.querySelector('.tps-footer-nav--soft')).not.toBeNull();
    expect(softContainer.querySelector('.tps-footer-nav--light')).not.toBeNull();

    // Dark background
    const { container: darkContainer } = render(
      <Wrap>
        <FooterNavigationComponent background="dark" />
      </Wrap>
    );
    expect(darkContainer.querySelector('.tps-footer-nav--dark')).not.toBeNull();

    // Gradient background
    const { container: gradContainer } = render(
      <Wrap>
        <FooterNavigationComponent background="gradient" />
      </Wrap>
    );
    expect(gradContainer.querySelector('.tps-footer-nav--gradient')).not.toBeNull();
  });
});
