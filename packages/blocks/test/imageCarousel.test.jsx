import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';

import { PageStudioProvider } from '../src/context.jsx';
import { ImageCarousel, ImageCarouselComponent } from '../src/blocks/ImageCarousel.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('ImageCarousel component & Puck block', () => {
  it('renders standard layout correctly with defaultProps', () => {
    const { container } = render(
      <Wrap>{ImageCarousel.render(ImageCarousel.defaultProps)}</Wrap>
    );

    expect(container.querySelector('.tps-image-carousel')).not.toBeNull();
    expect(container.querySelector('.tps-carousel-wrap')).not.toBeNull();
    expect(container.querySelector('.tps-carousel-partition-grid')).toBeNull();
  });

  it('renders full-width mode when fullWidth prop is enabled', () => {
    const { container } = render(
      <Wrap>
        <ImageCarouselComponent fullWidth={true} />
      </Wrap>
    );

    const section = container.querySelector('.tps-image-carousel');
    expect(section).not.toBeNull();
    expect(section.classList.contains('tps-image-carousel--fullwidth')).toBe(true);
  });

  it('renders full-width mode when maxWidth is full_width', () => {
    const { container } = render(
      <Wrap>
        <ImageCarouselComponent maxWidth="full_width" />
      </Wrap>
    );

    const section = container.querySelector('.tps-image-carousel');
    expect(section).not.toBeNull();
    expect(section.classList.contains('tps-image-carousel--fullwidth')).toBe(true);
  });

  it('renders partitioned layout with Content on Left and Carousel on Right', () => {
    const { container } = render(
      <Wrap>
        <ImageCarouselComponent
          layout="carousel_right"
          partition_type="content"
          partition_eyebrow="Featured"
          partition_title="State of the Art Facilities"
          partition_description="Built for teams"
          partition_cta_text="Read Details"
        />
      </Wrap>
    );

    const grid = container.querySelector('.tps-carousel-partition-grid');
    expect(grid).not.toBeNull();

    const textSide = container.querySelector('.tps-carousel-partition-side');
    expect(textSide).not.toBeNull();
    expect(textSide.textContent).toContain('Featured');
    expect(textSide.textContent).toContain('State of the Art Facilities');
    expect(textSide.textContent).toContain('Built for teams');
    expect(textSide.textContent).toContain('Read Details');

    const carousel = container.querySelector('.tps-carousel-wrap');
    expect(carousel).not.toBeNull();
  });

  it('renders partitioned layout with Carousel on Left and Content on Right', () => {
    const { container } = render(
      <Wrap>
        <ImageCarouselComponent
          layout="carousel_left"
          partition_type="content"
          partition_title="Right Side Content"
        />
      </Wrap>
    );

    const grid = container.querySelector('.tps-carousel-partition-grid');
    expect(grid).not.toBeNull();
    expect(container.textContent).toContain('Right Side Content');
  });

  it('renders partitioned layout with single Image on the other side', () => {
    const { container } = render(
      <Wrap>
        <ImageCarouselComponent
          layout="carousel_right"
          partition_type="image"
          partition_image_url="https://example.com/custom-image.jpg"
          partition_image_alt="Custom image"
        />
      </Wrap>
    );

    const img = container.querySelector('.tps-carousel-partition-image');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/custom-image.jpg');
    expect(img.getAttribute('alt')).toBe('Custom image');
  });

  it('renders partitioned layout with Both (Content + Image)', () => {
    const { container } = render(
      <Wrap>
        <ImageCarouselComponent
          layout="carousel_right"
          partition_type="both"
          partition_title="Head Office"
          partition_image_url="https://example.com/complex.jpg"
        />
      </Wrap>
    );

    expect(container.textContent).toContain('Head Office');
    const img = container.querySelector('.tps-carousel-partition-image');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/complex.jpg');
  });

  it('renders partition divider line when show_partition_divider is true', () => {
    const { container } = render(
      <Wrap>
        <ImageCarouselComponent
          layout="carousel_right"
          show_partition_divider={true}
        />
      </Wrap>
    );

    expect(container.querySelector('.tps-carousel-divider-col')).not.toBeNull();
  });
});
