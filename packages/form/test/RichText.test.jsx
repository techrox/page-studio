// RichText smoke test — verifies the component renders without throwing
// and accepts the uploadMedia prop. We don't drive TipTap interactions
// (the editor + ProseMirror are too heavy for happy-dom to simulate
// reliably), so this is intentionally surface-only.

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { RichText } from '../src/index.js';

describe('RichText', () => {
  it('renders without crashing when uploadMedia is supplied', () => {
    const { container } = render(
      <AntdApp>
        <RichText value="<p>hi</p>" onChange={() => {}} uploadMedia={vi.fn()} />
      </AntdApp>,
    );
    expect(container.querySelector('.tiptap')).not.toBeNull();
  });
});
