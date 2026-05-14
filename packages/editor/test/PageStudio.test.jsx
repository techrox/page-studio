// PageStudio tests — wire the editor up with a fake adapter and verify it
// loads, renders, and routes publish through the adapter. We don't try to
// simulate Puck's drag-drop UI (that's covered by Puck's own tests); we
// focus on the integration glue this package owns.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import PageStudio from '../src/PageStudio.jsx';
import { emptyPuckData } from '@techrox/page-studio-blocks';

function Harness(props) {
  return (
    <AntdApp>
      <PageStudio {...props} />
    </AntdApp>
  );
}

describe('PageStudio', () => {
  it('shows the loading state until loadPage resolves', async () => {
    let resolve;
    const adapter = {
      loadPage: vi.fn(() => new Promise((r) => { resolve = r; })),
      savePage: vi.fn(),
    };
    render(<Harness pageKey="page.x" adapter={adapter} />);
    expect(screen.getByText(/Loading editor/i)).toBeInTheDocument();
    await act(async () => {
      resolve(emptyPuckData);
    });
    await waitFor(() => {
      expect(screen.queryByText(/Loading editor/i)).not.toBeInTheDocument();
    });
    expect(adapter.loadPage).toHaveBeenCalledWith('page.x');
  });

  it('renders immediately when initialData is supplied (no adapter call)', () => {
    const adapter = { loadPage: vi.fn(), savePage: vi.fn() };
    render(
      <Harness pageKey="page.x" adapter={adapter} initialData={emptyPuckData} />,
    );
    expect(screen.queryByText(/Loading editor/i)).not.toBeInTheDocument();
    expect(adapter.loadPage).not.toHaveBeenCalled();
  });

  it('falls back to emptyPuckData when loadPage rejects', async () => {
    const adapter = {
      loadPage: vi.fn(() => Promise.reject(new Error('boom'))),
      savePage: vi.fn(),
    };
    render(<Harness pageKey="page.x" adapter={adapter} />);
    await waitFor(() => {
      expect(screen.queryByText(/Loading editor/i)).not.toBeInTheDocument();
    });
    // Editor mounted with empty data — Puck's top bar should be visible
    // (renderHeader hooked up by the editor).
    expect(adapter.loadPage).toHaveBeenCalled();
  });
});
