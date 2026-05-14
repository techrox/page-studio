// HistoryPanel surface tests — verifies the loadHistory adapter is invoked
// and that the panel renders without a router/host present.

import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { HistoryPanel } from '../src/index.js';

describe('HistoryPanel', () => {
  it('calls loadHistory on mount', async () => {
    const loadHistory = vi.fn().mockResolvedValue({ revisions: [] });
    render(
      <AntdApp>
        <HistoryPanel
          pageKey="test.page"
          currentPage={{ title: 'X' }}
          loadHistory={loadHistory}
          restoreRevision={vi.fn()}
        />
      </AntdApp>,
    );
    await waitFor(() => expect(loadHistory).toHaveBeenCalledWith('test.page'));
  });

  it('shows an empty state when no revisions exist', async () => {
    const { container } = render(
      <AntdApp>
        <HistoryPanel
          pageKey="test.page"
          currentPage={{ title: 'X' }}
          loadHistory={async () => ({ revisions: [] })}
          restoreRevision={vi.fn()}
        />
      </AntdApp>,
    );
    await waitFor(() => {
      expect(container.textContent).toMatch(/no.*history|no revisions/i);
    });
  });
});
