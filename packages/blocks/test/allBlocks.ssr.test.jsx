// @vitest-environment node
//
// SSR contract: every block must render on the server, where `window` and
// `document` don't exist. Runs in plain Node (no DOM) so a stray browser
// global in a render path fails here instead of in a host's Next.js build.

import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';

import { PageStudioProvider } from '../src/context.jsx';
import { defaultBlocks } from '../src/config.jsx';

function asComponent(block) {
  return function BlockUnderTest(props) {
    return block.render(props);
  };
}

describe('every registered block renders on the server', () => {
  it.each(Object.entries(defaultBlocks))('%s', (name, block) => {
    expect(typeof window).toBe('undefined');
    const Block = asComponent(block);
    const html = renderToString(
      <PageStudioProvider>
        <Block {...block.defaultProps} />
      </PageStudioProvider>,
    );
    expect(typeof html).toBe('string');
  });
});
