// withTheme tests — per-block theme field + data-tps-theme stamping.

import { describe, it, expect } from 'vitest';
import { withTheme } from '../src/withTheme.jsx';
import { createPuckConfig } from '../src/config.jsx';

const Block = {
  label: 'B',
  fields: { heading: { type: 'text' } },
  defaultProps: { heading: 'hi' },
  render: () => <section className="tps-section">hi</section>,
};

describe('withTheme', () => {
  it('injects a theme field and an inherit-by-default prop', () => {
    const T = withTheme(Block);
    expect(T.fields.theme).toBeTruthy();
    expect(T.fields.heading).toBeTruthy(); // existing fields preserved
    expect(T.defaultProps.theme).toBe('');
    expect(T.defaultProps.heading).toBe('hi');
  });

  it('stamps data-tps-theme on the root when a theme is chosen', () => {
    const el = withTheme(Block).render({ theme: 'dark' });
    expect(el.props['data-tps-theme']).toBe('dark');
    expect(el.props.className).toBe('tps-section'); // root untouched otherwise
  });

  it('leaves the root untouched when the theme is inherit/unset', () => {
    expect(withTheme(Block).render({ theme: '' }).props['data-tps-theme']).toBeUndefined();
    expect(withTheme(Block).render({}).props['data-tps-theme']).toBeUndefined();
  });

  it('does not let a brand default for theme get clobbered', () => {
    // A brand can ship `theme: 'dark'` as a default; withTheme must not reset it.
    const Branded = { ...Block, defaultProps: { ...Block.defaultProps, theme: 'dark' } };
    expect(withTheme(Branded).defaultProps.theme).toBe('dark');
  });

  it('every block in the default config gets the theme field', () => {
    const cfg = createPuckConfig();
    for (const [name, comp] of Object.entries(cfg.components)) {
      expect(comp.fields.theme, `${name} missing theme field`).toBeTruthy();
    }
  });
});
