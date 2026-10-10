import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { Hero } from '../src/blocks/Hero';
import { CTABanner } from '../src/blocks/CTABanner';
import { ImageText } from '../src/blocks/ImageText';
import { InlineCTA } from '../src/blocks/InlineCTA';
import { NewsletterSignup } from '../src/blocks/NewsletterSignup';
import { ImageCarousel } from '../src/blocks/ImageCarousel';

describe('Background Image and Button Style features across blocks', () => {
  it('Hero renders background_image and button_style gradient', () => {
    const { container } = render(
      <Hero.render
        {...Hero.defaultProps}
        background_image="https://example.com/hero.jpg"
        background_overlay="none"
        button_style="gradient"
      />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('url("https://example.com/hero.jpg")');

    const primaryBtn = container.querySelector('.ant-btn.tps-btn--gradient');
    expect(primaryBtn).not.toBeNull();
  });

  it('CTABanner renders background_image and button_style gradient-cyan', () => {
    const { container } = render(
      <CTABanner.render
        {...CTABanner.defaultProps}
        background_image="https://example.com/cta.jpg"
        background_overlay="none"
        button_style="gradient-cyan"
      />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('url("https://example.com/cta.jpg")');

    const btn = container.querySelector('.ant-btn.tps-btn--gradient-cyan');
    expect(btn).not.toBeNull();
  });

  it('ImageText renders background_image and button_style gradient-purple', () => {
    const { container } = render(
      <ImageText.render
        {...ImageText.defaultProps}
        background_image="https://example.com/imagetext.jpg"
        background_overlay="none"
        button_style="gradient-purple"
        cta_label="Click Me"
      />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('url("https://example.com/imagetext.jpg")');

    const btn = container.querySelector('.ant-btn.tps-btn--gradient-purple');
    expect(btn).not.toBeNull();
  });

  it('InlineCTA renders background_image and button_style gradient', () => {
    const { container } = render(
      <InlineCTA.render
        {...InlineCTA.defaultProps}
        background_image="https://example.com/card-bg.jpg"
        button_style="gradient"
      />
    );
    const card = container.querySelector('.tps-card');
    expect(card).not.toBeNull();

    const btn = container.querySelector('.ant-btn.tps-btn--gradient');
    expect(btn).not.toBeNull();
  });

  it('NewsletterSignup renders background_image and gradient button', () => {
    const { container } = render(
      <NewsletterSignup.render
        {...NewsletterSignup.defaultProps}
        background_image="https://example.com/news.jpg"
        background_overlay="none"
        button_style="gradient-cyan"
      />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('url("https://example.com/news.jpg")');

    const btn = container.querySelector('button[type="submit"].tps-btn--gradient-cyan');
    expect(btn).not.toBeNull();
  });

  it('ImageCarousel renders background_image and button_style on slide CTA', () => {
    const { container } = render(
      <ImageCarousel.render
        {...ImageCarousel.defaultProps}
        background_image="https://example.com/carousel.jpg"
        background_overlay="none"
        button_style="gradient"
      />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('url("https://example.com/carousel.jpg")');

    const slideBtn = container.querySelector('.ant-btn.tps-btn--gradient');
    expect(slideBtn).not.toBeNull();
  });
});
