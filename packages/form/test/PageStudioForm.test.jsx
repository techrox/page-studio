// Surface-level tests for PageStudioForm. We avoid mounting TipTap (heavy +
// brittle in happy-dom) by giving the form a schema with no `richtext`
// fields. The goal is to verify the adapter / Link / callback wiring, not
// to re-test AntD.

import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioForm } from '../src/index.js';

const SIMPLE_SCHEMA = [
  {
    title: 'Hero',
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
    ],
  },
];

function renderForm(props = {}) {
  return render(
    <AntdApp>
      <PageStudioForm
        pageKey="test.page"
        initialPage={{ title: 'X', content: { title: 'X' }, updated_at: '2026-01-01' }}
        schema={SIMPLE_SCHEMA}
        livePath="/test"
        {...props}
      />
    </AntdApp>,
  );
}

describe('PageStudioForm', () => {
  it('renders the page title from initialPage', () => {
    const { container } = renderForm();
    expect(container.textContent).toContain('X');
    expect(container.textContent).toContain('test.page');
  });

  it('renders fields from the supplied schema', () => {
    const { container } = renderForm();
    expect(container.textContent).toContain('Title');
    expect(container.textContent).toContain('Summary');
  });

  it('calls adapter.savePage and the onSaved callback', async () => {
    const savePage = vi.fn().mockResolvedValue({
      page: { title: 'X', updated_at: '2026-01-02' },
    });
    const onSaved = vi.fn();
    const { container } = renderForm({ adapter: { savePage }, onSaved });

    const saveBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Save',
    );
    expect(saveBtn).toBeTruthy();
    fireEvent.click(saveBtn);

    // Wait a microtask for the async savePage to resolve.
    await new Promise((r) => setTimeout(r, 0));
    expect(savePage).toHaveBeenCalledTimes(1);
    expect(savePage.mock.calls[0][0]).toBe('test.page');
    expect(onSaved).toHaveBeenCalledTimes(1);
  });
});
