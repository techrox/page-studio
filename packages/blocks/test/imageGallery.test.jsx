import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { ImageGallery, ImageGalleryComponent } from '../src/blocks/ImageGallery.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('ImageGallery component & Puck block', () => {
  const sampleItems = [
    { url: 'https://example.com/photo1.jpg', alt: 'Photo 1', caption: 'Caption 1' },
    { url: 'https://example.com/photo2.jpg', alt: 'Photo 2', caption: 'Caption 2' },
    { url: 'https://example.com/photo3.jpg', alt: 'Photo 3', caption: 'Caption 3' },
  ];

  it('renders standard layout correctly with defaultProps', () => {
    const { container } = render(
      <Wrap>
        <ImageGalleryComponent {...ImageGallery.defaultProps} />
      </Wrap>,
    );

    expect(container.querySelector('.tps-container')).not.toBeNull();
    const figures = container.querySelectorAll('figure');
    expect(figures.length).toBe(3);
  });

  it('renders eyebrow and heading when provided', () => {
    const { container } = render(
      <Wrap>
        <ImageGalleryComponent
          eyebrow="Our Moments"
          heading="Photo Gallery"
          items={sampleItems}
        />
      </Wrap>,
    );

    expect(container.textContent).toContain('Our Moments');
    expect(container.textContent).toContain('Photo Gallery');
  });

  it('opens non-jumping lightbox when an image thumbnail is clicked', () => {
    const { container } = render(
      <Wrap>
        <ImageGalleryComponent
          heading="Project Gallery"
          items={sampleItems}
        />
      </Wrap>,
    );

    // Find first clickable image thumbnail
    const thumbButton = container.querySelector('[role="button"]');
    expect(thumbButton).not.toBeNull();

    // Click to open lightbox
    fireEvent.click(thumbButton);

    // Lightbox modal should be opened in document.body
    const lightbox = document.querySelector('[role="dialog"]');
    expect(lightbox).not.toBeNull();
    expect(lightbox.getAttribute('aria-label')).toBe('Photo 1');

    // Close button should be present
    const closeBtn = document.querySelector('button[aria-label="Close image preview"]');
    expect(closeBtn).not.toBeNull();

    // Close lightbox
    fireEvent.click(closeBtn);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('navigates with next/prev buttons and closes on Escape', () => {
    const { container } = render(
      <Wrap>
        <ImageGalleryComponent
          heading="Project Gallery"
          items={sampleItems}
        />
      </Wrap>,
    );

    const thumbButtons = container.querySelectorAll('[role="button"]');
    fireEvent.click(thumbButtons[0]);

    // Check counter
    expect(document.body.textContent).toContain('1 / 3');

    // Click Next
    const nextBtn = document.querySelector('button[aria-label="Next image"]');
    expect(nextBtn).not.toBeNull();
    fireEvent.click(nextBtn);

    expect(document.body.textContent).toContain('2 / 3');

    // Press Escape to close
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});
