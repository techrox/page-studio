import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { App as AntdApp } from 'antd';
import { TestimonialQuote, TestimonialQuoteComponent } from '../src/blocks/TestimonialQuote.jsx';
import { PageStudioProvider } from '../src/context.jsx';

function Wrap({ children, studio }) {
  return (
    <AntdApp>
      <PageStudioProvider value={studio}>{children}</PageStudioProvider>
    </AntdApp>
  );
}

describe('TestimonialQuote block & component', () => {
  it('renders defaultProps in Puck format with multi-quote carousel', () => {
    const { container } = render(
      <Wrap>{TestimonialQuote.render(TestimonialQuote.defaultProps)}</Wrap>
    );

    // Decorative quote mark
    expect(container.textContent).toContain('“');

    // Default slides
    expect(container.textContent).toContain('Alex Rivera');
    expect(container.textContent).toContain('Founder · Acme Co.');

    // Carousel container and slick structure
    const carouselEl = container.querySelector('.tps-testimonial-carousel');
    expect(carouselEl).not.toBeNull();

    // Arrows present when show_arrows is true
    const prevBtn = container.querySelector('.tps-testimonial-nav-btn--prev');
    const nextBtn = container.querySelector('.tps-testimonial-nav-btn--next');
    expect(prevBtn).not.toBeNull();
    expect(nextBtn).not.toBeNull();
  });

  it('maintains backwards compatibility with single quote props', () => {
    const { container } = render(
      <Wrap>
        <TestimonialQuoteComponent
          quote="Custom legacy testimonial text"
          author_name="Jane Doe"
          author_role="Principal Engineer"
          author_company="Tech Labs"
        />
      </Wrap>
    );

    expect(container.textContent).toContain('Custom legacy testimonial text');
    expect(container.textContent).toContain('Jane Doe');
    expect(container.textContent).toContain('Principal Engineer · Tech Labs');

    // Single quote should not render carousel nav arrows
    expect(container.querySelector('.tps-testimonial-nav-btn')).toBeNull();
  });

  it('supports hiding arrows and dots via controls', () => {
    const { container } = render(
      <Wrap>
        <TestimonialQuoteComponent
          items={[
            { quote: 'Quote 1', author_name: 'Person 1' },
            { quote: 'Quote 2', author_name: 'Person 2' },
          ]}
          show_arrows={false}
          show_dots={false}
        />
      </Wrap>
    );

    expect(container.querySelector('.tps-testimonial-nav-btn--prev')).toBeNull();
    expect(container.querySelector('.tps-testimonial-nav-btn--next')).toBeNull();
  });

  it('supports white, soft, and dark background styles', () => {
    const { container: whiteContainer } = render(
      <Wrap>
        <TestimonialQuoteComponent
          items={[{ quote: 'White background quote', author_name: 'Pure White' }]}
          background="white"
        />
      </Wrap>
    );
    const whiteSection = whiteContainer.querySelector('section');
    expect(whiteSection.classList.contains('tps-section-soft')).toBe(false);
    expect(whiteSection.classList.contains('tps-section-dark')).toBe(false);

    const { container: softContainer } = render(
      <Wrap>
        <TestimonialQuoteComponent
          items={[{ quote: 'Soft background quote', author_name: 'Soft Gray' }]}
          background="soft"
        />
      </Wrap>
    );
    const softSection = softContainer.querySelector('section');
    expect(softSection.classList.contains('tps-section-soft')).toBe(true);

    const { container: darkContainer } = render(
      <Wrap>
        <TestimonialQuoteComponent
          items={[{ quote: 'Dark theme quote', author_name: 'Night Rider' }]}
          background="dark"
        />
      </Wrap>
    );
    const darkSection = darkContainer.querySelector('section');
    expect(darkSection.classList.contains('tps-section-dark')).toBe(true);
    expect(['#0F172A', 'rgb(15, 23, 42)', '#0f172a']).toContain(darkSection.style.background);
  });

  it('renders author avatar image when author_image is supplied', () => {
    const { container } = render(
      <Wrap>
        <TestimonialQuoteComponent
          items={[
            {
              quote: 'Avatar test',
              author_name: 'Visual Artist',
              author_image: 'https://example.com/avatar.jpg',
            },
          ]}
        />
      </Wrap>
    );

    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://example.com/avatar.jpg');
    expect(img.getAttribute('alt')).toBe('Visual Artist');
  });
});
