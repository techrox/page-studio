// Baseline contract for every registered block. Loops over `defaultBlocks`,
// so a new block is covered the moment it lands in config.jsx - no opt-in.
// Behaviour-specific tests still live in each block's own test file.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { defaultBlocks, createPuckConfig } from '../src/config.jsx';

function Wrap({ children }) {
  return (
    <AntdApp>
      <PageStudioProvider>{children}</PageStudioProvider>
    </AntdApp>
  );
}

// Puck renders `block.render` as a component, so hooks inside it are legal.
// Mirror that here instead of calling render() as a plain function.
function asComponent(block) {
  return function BlockUnderTest(props) {
    return block.render(props);
  };
}

const entries = Object.entries(defaultBlocks);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('every registered block', () => {
  it('registers at least one block', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  describe.each(entries)('%s', (name, block) => {
    it('declares label, fields, defaultProps and render', () => {
      expect(typeof block.label).toBe('string');
      expect(block.label.length).toBeGreaterThan(0);
      expect(block.fields).toBeTypeOf('object');
      expect(block.defaultProps).toBeTypeOf('object');
      expect(block.render).toBeTypeOf('function');
    });

    it('only sets defaultProps for declared fields', () => {
      const declared = new Set(Object.keys(block.fields || {}));
      const stray = Object.keys(block.defaultProps || {}).filter(
        (key) => !declared.has(key),
      );
      expect(stray).toEqual([]);
    });

    it('renders with defaultProps without errors', () => {
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
      const Block = asComponent(block);
      const { container } = render(
        <Wrap>
          <Block {...block.defaultProps} />
        </Wrap>,
      );
      expect(container.innerHTML.length).toBeGreaterThan(0);
      expect(errors).not.toHaveBeenCalled();
    });

    it('renders with no props at all', () => {
      const Block = asComponent(block);
      expect(() =>
        render(
          <Wrap>
            <Block />
          </Wrap>,
        ),
      ).not.toThrow();
    });
  });
});

describe('createPuckConfig categories', () => {
  it('places every block in a category', () => {
    const cfg = createPuckConfig();
    const categorised = new Set(
      Object.values(cfg.categories || {}).flatMap((c) => c.components || []),
    );
    const orphans = Object.keys(cfg.components).filter(
      (name) => !categorised.has(name),
    );
    expect(orphans).toEqual([]);
  });
});
