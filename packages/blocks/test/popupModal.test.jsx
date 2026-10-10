import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { PopupModal, PopupModalComponent } from '../src/blocks/PopupModal.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

// The modal opens from a timer (even with delay 0), so flush it after render.
function renderOpen(ui) {
  const result = render(ui);
  act(() => {
    vi.runOnlyPendingTimers();
  });
  return result;
}

describe('PopupModal component & block', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly on load with defaultProps in Puck format', () => {
    const { container } = renderOpen(
      <Wrap>{PopupModal.render(PopupModal.defaultProps)}</Wrap>
    );

    const overlay = container.querySelector('.tps-modal-overlay');
    expect(overlay).not.toBeNull();
    expect(container.textContent).toContain('Special Announcement');
    expect(container.textContent).toContain('Welcome');
    expect(container.textContent).toContain('Explore Now');

    const img = container.querySelector('.tps-modal-card__img');
    expect(img).not.toBeNull();
  });

  it('closes when close button (x) is clicked and shows the inline preview placeholder', () => {
    const onClose = vi.fn();
    const { container } = renderOpen(
      <Wrap>
        <PopupModalComponent
          heading="Summer Discount"
          onClose={onClose}
        />
      </Wrap>
    );

    expect(container.querySelector('.tps-modal-overlay')).not.toBeNull();

    const closeBtn = container.querySelector('.tps-modal-card__close');
    expect(closeBtn).not.toBeNull();
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.tps-modal-overlay')).toBeNull();

    // Inline placeholder card is now visible
    const placeholder = container.querySelector('.tps-modal-placeholder');
    expect(placeholder).not.toBeNull();
    expect(placeholder.textContent).toContain('Summer Discount');
  });

  it('closes when backdrop overlay is clicked with closeOnBackdrop=true', () => {
    const onClose = vi.fn();
    const { container } = renderOpen(
      <Wrap>
        <PopupModalComponent
          heading="Backdrop Test"
          closeOnBackdrop={true}
          onClose={onClose}
        />
      </Wrap>
    );

    const overlay = container.querySelector('.tps-modal-overlay');
    expect(overlay).not.toBeNull();

    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.tps-modal-overlay')).toBeNull();
  });

  it('closes when Escape key is pressed with closeOnEsc=true', () => {
    const onClose = vi.fn();
    const { container } = renderOpen(
      <Wrap>
        <PopupModalComponent
          heading="ESC Test"
          closeOnEsc={true}
          onClose={onClose}
        />
      </Wrap>
    );

    expect(container.querySelector('.tps-modal-overlay')).not.toBeNull();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.tps-modal-overlay')).toBeNull();
  });

  it('supports side image layout when image_position is left', () => {
    const { container } = renderOpen(
      <Wrap>
        <PopupModalComponent
          heading="Side Image Modal"
          image_url="https://example.com/test.jpg"
          image_position="left"
        />
      </Wrap>
    );

    const card = container.querySelector('.tps-modal-card');
    expect(card.classList.contains('tps-modal-card--side-img')).toBe(true);
    expect(container.querySelector('.tps-modal-card__side-img-wrap')).not.toBeNull();
  });

  it('supports custom backgroundColor and dark theme', () => {
    const { container } = renderOpen(
      <Wrap>
        <PopupModalComponent
          heading="Dark Modal"
          variant="dark"
          backgroundColor="#112233"
        />
      </Wrap>
    );

    const card = container.querySelector('.tps-modal-card');
    expect(card.classList.contains('tps-modal-card--dark')).toBe(true);
    expect(card.style.backgroundColor).toBe('#112233');
  });
});
