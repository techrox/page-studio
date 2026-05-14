// Renderer tests — fallback path, empty data path, and a sanity check that
// non-empty data goes down the Puck-render branch (not the fallback). The
// real Puck render is Puck's responsibility; we stub it here so the test
// stays focused on this package's logic.

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@puckeditor/core', () => ({
  Render: ({ data }) => <div data-testid="puck-render" data-count={data?.content?.length || 0} />,
}));

import { PageStudioRender } from '../src/PageStudioRender.jsx';

describe('PageStudioRender', () => {
  it('returns the fallback when data is missing', () => {
    const { container } = render(
      <PageStudioRender data={null} fallback={<div data-testid="fallback">fb</div>} />,
    );
    expect(container.querySelector('[data-testid="fallback"]')).not.toBeNull();
  });

  it('returns the fallback for empty content', () => {
    const { container } = render(
      <PageStudioRender
        data={{ content: [], root: {} }}
        fallback={<div data-testid="fallback">fb</div>}
      />,
    );
    expect(container.querySelector('[data-testid="fallback"]')).not.toBeNull();
  });

  it('delegates to Puck Render when data has content', () => {
    const data = {
      root: { props: { title: '' } },
      content: [{ type: 'RichText', props: { id: 'r1', html: '<p>hi</p>' } }],
      zones: {},
    };
    const { container } = render(
      <PageStudioRender data={data} fallback={<div data-testid="fallback" />} />,
    );
    expect(container.querySelector('[data-testid="fallback"]')).toBeNull();
    expect(container.querySelector('[data-testid="puck-render"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="puck-render"]').dataset.count).toBe('1');
  });
});
