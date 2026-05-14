// Context tests — verify the provider injects values into the block tree and
// that adapter-style functions throw a clear error when not configured.

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  PageStudioProvider,
  useStudio,
  StudioLink,
} from '../src/context.jsx';

function Probe() {
  const studio = useStudio();
  return <span data-testid="probe">{studio.site.email || 'no-email'}</span>;
}

describe('PageStudioProvider', () => {
  it('serves defaults when no value passed', () => {
    render(
      <PageStudioProvider>
        <Probe />
      </PageStudioProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('no-email');
  });

  it('merges caller value over defaults', () => {
    render(
      <PageStudioProvider value={{ site: { email: 'ops@example.com' } }}>
        <Probe />
      </PageStudioProvider>,
    );
    expect(screen.getByTestId('probe')).toHaveTextContent('ops@example.com');
  });

  it('submitLead throws a helpful error when not configured', async () => {
    let captured;
    function Trigger() {
      const { submitLead } = useStudio();
      captured = submitLead;
      return null;
    }
    render(
      <PageStudioProvider>
        <Trigger />
      </PageStudioProvider>,
    );
    await expect(captured({ email: 'a@b.com' })).rejects.toThrow(/submitLead/);
  });

  it('track defaults to a no-op (does not throw)', () => {
    let track;
    function Trigger() {
      track = useStudio().track;
      return null;
    }
    render(
      <PageStudioProvider>
        <Trigger />
      </PageStudioProvider>,
    );
    expect(() => track('some_event', { x: 1 })).not.toThrow();
  });
});

describe('StudioLink', () => {
  it('falls back to a plain anchor by default', () => {
    render(
      <PageStudioProvider>
        <StudioLink href="/x">click</StudioLink>
      </PageStudioProvider>,
    );
    const a = screen.getByText('click');
    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('/x');
  });

  it('delegates to the caller-supplied Link component', () => {
    const CustomLink = vi.fn(({ href, children }) => (
      <button data-href={href}>{children}</button>
    ));
    render(
      <PageStudioProvider value={{ Link: CustomLink }}>
        <StudioLink href="/y">click</StudioLink>
      </PageStudioProvider>,
    );
    expect(CustomLink).toHaveBeenCalled();
    expect(screen.getByText('click').dataset.href).toBe('/y');
  });
});
