// Config tests — verify the factory produces a valid Puck-shaped config and
// that overrides flow through.

import { describe, it, expect } from 'vitest';
import {
  createPuckConfig,
  defaultBlocks,
  defaultCategories,
  emptyPuckData,
} from '../src/config.jsx';

describe('createPuckConfig', () => {
  it('returns a config with components, categories, and root', () => {
    const cfg = createPuckConfig();
    expect(cfg.components).toBeTypeOf('object');
    expect(cfg.categories).toEqual(defaultCategories);
    expect(cfg.root).toBeTypeOf('object');
  });

  it('includes every block from defaultBlocks', () => {
    const cfg = createPuckConfig();
    const expected = Object.keys(defaultBlocks);
    expect(Object.keys(cfg.components).sort()).toEqual(expected.sort());
  });

  it('accepts a custom blocks dictionary and ignores unknown blocks in reveal map', () => {
    const MyBlock = { label: 'Mine', fields: {}, defaultProps: {}, render: () => null };
    const cfg = createPuckConfig({
      blocks: { Mine: MyBlock },
      categories: { Custom: { components: ['Mine'] } },
    });
    expect(Object.keys(cfg.components)).toEqual(['Mine']);
    expect(cfg.categories.Custom.components).toEqual(['Mine']);
  });

  it('respects a caller-provided reveal map (passing null skips wrapping)', () => {
    const Plain = {
      label: 'P',
      fields: {},
      defaultProps: {},
      render: () => null,
      _marker: 'original',
    };
    const cfg = createPuckConfig({
      blocks: { Plain },
      reveal: null,
    });
    // reveal=null short-circuits wrapping; render fn should be untouched.
    expect(cfg.components.Plain._marker).toBe('original');
  });
});

describe('emptyPuckData', () => {
  it('has the shape Puck expects for a blank canvas', () => {
    expect(emptyPuckData).toEqual({
      root: { props: { title: '' } },
      content: [],
      zones: {},
    });
  });
});
