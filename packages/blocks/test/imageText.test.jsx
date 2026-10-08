import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';
import { ImageText } from '../src/blocks/ImageText.jsx';
import { PageStudioProvider } from '../src/context.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('ImageText block', () => {
  it('has image_ratio field configured with standard aspect ratios', () => {
    expect(ImageText.fields.image_ratio).toBeDefined();
    expect(ImageText.fields.image_ratio.type).toBe('select');
    const values = ImageText.fields.image_ratio.options.map((o) => o.value);
    expect(values).toContain('auto');
    expect(values).toContain('1/1');
    expect(values).toContain('16/9');
    expect(values).toContain('4/3');
  });

  it('renders default placeholder with default ratio', () => {
    const { container } = render(
      <Wrap>{ImageText.render(ImageText.defaultProps)}</Wrap>
    );
    const placeholder = container.querySelector('.tps-image-text__placeholder');
    expect(placeholder).not.toBeNull();
    expect(placeholder.textContent).toContain('Image placeholder');
    expect(placeholder.style.aspectRatio).toBe('4 / 3');
  });

  it('renders image with auto aspect ratio by default', () => {
    const { container } = render(
      <Wrap>
        {ImageText.render({
          ...ImageText.defaultProps,
          image_url: 'https://example.com/photo.jpg',
          image_alt: 'Photo sample',
        })}
      </Wrap>
    );
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
    expect(img.getAttribute('alt')).toBe('Photo sample');
    expect(img.style.height).toBe('auto');
  });

  it('applies selected 1:1 and 16:9 aspect ratios correctly to the image', () => {
    const { container: squareContainer } = render(
      <Wrap>
        {ImageText.render({
          ...ImageText.defaultProps,
          image_url: 'https://example.com/photo.jpg',
          image_ratio: '1/1',
        })}
      </Wrap>
    );
    const squareImg = squareContainer.querySelector('img');
    expect(squareImg.style.aspectRatio).toBe('1 / 1');
    expect(squareImg.style.objectFit).toBe('cover');

    const { container: wideContainer } = render(
      <Wrap>
        {ImageText.render({
          ...ImageText.defaultProps,
          image_url: 'https://example.com/photo.jpg',
          image_ratio: '16/9',
        })}
      </Wrap>
    );
    const wideImg = wideContainer.querySelector('img');
    expect(wideImg.style.aspectRatio).toBe('16 / 9');
    expect(wideImg.style.objectFit).toBe('cover');
  });

  it('supports colon-separated ratio values like 16:9 and 1:1', () => {
    const { container } = render(
      <Wrap>
        {ImageText.render({
          ...ImageText.defaultProps,
          image_url: 'https://example.com/photo.jpg',
          image_ratio: '16:9',
        })}
      </Wrap>
    );
    const img = container.querySelector('img');
    expect(img.style.aspectRatio).toBe('16 / 9');
    expect(img.style.objectFit).toBe('cover');
  });

  it('applies ratio to image placeholder when image_url is empty', () => {
    const { container } = render(
      <Wrap>
        {ImageText.render({
          ...ImageText.defaultProps,
          image_url: '',
          image_ratio: '16/9',
        })}
      </Wrap>
    );
    const placeholder = container.querySelector('.tps-image-text__placeholder');
    expect(placeholder).not.toBeNull();
    expect(placeholder.style.aspectRatio).toBe('16 / 9');
  });
});
