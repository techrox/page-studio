// Smoke tests for a representative sample of blocks. Each block is an object
// with `render`, so we just invoke it with defaultProps and assert non-empty
// output — catches regressions where a refactor drops a required dependency.

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { Hero } from '../src/blocks/Hero.jsx';
import { Spacer } from '../src/blocks/Spacer.jsx';
import { RichText } from '../src/blocks/RichText.jsx';
import { ServicesGrid } from '../src/blocks/ServicesGrid.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('Hero block', () => {
  it('renders heading text from defaultProps', () => {
    const { container } = render(
      <Wrap>{Hero.render(Hero.defaultProps)}</Wrap>,
    );
    // Heading is HTML so we render the raw mark-up; assert a known fragment.
    expect(container.textContent).toContain('reactive');
  });
});

describe('Spacer block', () => {
  it('renders a spacer of the requested height', () => {
    const { container } = render(<Wrap>{Spacer.render({ height: 96 })}</Wrap>);
    // Spacer is the only [aria-hidden] descendant; matches regardless of any
    // wrapper divs AntdApp introduces.
    const spacer = container.querySelector('[aria-hidden]');
    expect(spacer).not.toBeNull();
    expect(spacer.style.height).toBe('96px');
  });
});

describe('RichText block', () => {
  it('respects custom HTML', () => {
    const { container } = render(
      <Wrap>{RichText.render({ html: '<p>hi <strong>there</strong></p>', align: 'left', maxWidth: 0 })}</Wrap>,
    );
    expect(container.textContent).toContain('hi there');
  });
});

describe('ServicesGrid block', () => {
  // block.render uses hooks (useStudio) — Puck renders it as a component
  // internally; tests have to do the same or React rejects the hook call.
  const Block = (props) => ServicesGrid.render(props);

  it('renders an empty grid when no services are wired (no crash)', () => {
    const { container } = render(
      <Wrap>
        <Block {...ServicesGrid.defaultProps} />
      </Wrap>,
    );
    expect(container.querySelector('section')).not.toBeNull();
  });

  it('renders one tile per service when services are injected', () => {
    const Icon = () => <span data-testid="icon" />;
    const services = [
      { slug: 'a', short: 'A', eyebrow: 'EY', summary: 'sum', icon: Icon },
      { slug: 'b', short: 'B', eyebrow: 'EY', summary: 'sum', icon: Icon },
    ];
    const { container } = render(
      <Wrap studio={{ services }}>
        <Block {...ServicesGrid.defaultProps} show="all" />
      </Wrap>,
    );
    expect(container.querySelectorAll('a').length).toBe(2);
  });
});
