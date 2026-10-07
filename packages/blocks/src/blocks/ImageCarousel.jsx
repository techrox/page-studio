'use client';

import { useMemo, useRef, useState } from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { StudioLink as Link } from '../context';

const DEFAULT_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    title: 'Excellence in Legal Education & Advocacy',
    description: 'Empowering future legal leaders with rigorous academics, world-class faculty, and hands-on courtroom experience.',
    cta_text: 'Explore Programs',
    cta_href: '/courses-offering',
    alt: 'PRIST Law College Campus',
  },
  {
    url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1600&q=80',
    title: 'State-of-the-Art Moot Court Hall',
    description: 'Simulated high-court courtroom environment fostering trial advocacy, appellate argument, and arbitration skills.',
    cta_text: 'Discover Moot Court',
    cta_href: '/moot-court',
    alt: 'PRIST Moot Court Hall',
  },
  {
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
    title: 'Comprehensive Legal Research Library',
    description: 'Over 25,000 physical volumes, digital law databases (SCC Online, Manupatra, LexisNexis), and quiet research wings.',
    cta_text: 'Visit Library',
    cta_href: '/library',
    alt: 'PRIST Law Library',
  },
];

/**
 * Pure React component for the Image Carousel / Slider.
 */
export function ImageCarouselComponent({
  eyebrow,
  heading,
  subheading,
  items = [],
  height = 'medium',
  autoplay = true,
  autoplaySpeed = 4000,
  effect = 'fade',
  arrows = true,
  dots = true,
  overlay = 'gradient',
  maxWidth = 'standard',
  borderRadius = 'medium',
  background = 'white',
  className = '',
  style = {},
}) {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    if (Array.isArray(items) && items.length > 0) {
      return items;
    }
    return DEFAULT_SLIDES;
  }, [items]);

  const heightStyle = useMemo(() => {
    switch (height) {
      case 'small':
        return { minHeight: 340, height: 360 };
      case 'large':
        return { minHeight: 560, height: 620 };
      case 'full':
        return { minHeight: '75vh', height: '80vh' };
      case 'medium':
      default:
        return { minHeight: 440, height: 480 };
    }
  }, [height]);

  const radiusValue = useMemo(() => {
    switch (borderRadius) {
      case 'none':
        return '0px';
      case 'small':
        return '8px';
      case 'large':
        return '24px';
      case 'medium':
      default:
        return '16px';
    }
  }, [borderRadius]);

  const containerMaxWidth = useMemo(() => {
    switch (maxWidth) {
      case 'full':
        return '100%';
      case 'compact':
        return '980px';
      case 'standard':
      default:
        return 'var(--tps-max, 1240px)';
    }
  }, [maxWidth]);

  const bgClass =
    background === 'soft'
      ? 'tps-section-soft'
      : background === 'dark'
      ? 'tps-section-dark'
      : '';

  return (
    <section
      className={`tps-section tps-image-carousel ${bgClass} ${className}`.trim()}
      style={{
        paddingTop: maxWidth === 'full' ? 0 : 48,
        paddingBottom: maxWidth === 'full' ? 0 : 48,
        ...style,
      }}
    >
      <div
        className="tps-container"
        style={{
          maxWidth: containerMaxWidth,
          paddingLeft: maxWidth === 'full' ? 0 : undefined,
          paddingRight: maxWidth === 'full' ? 0 : undefined,
        }}
      >
        {(eyebrow || heading || subheading) && (
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && (
              <h2 className="tps-h2" style={{ marginTop: 6, marginBottom: 8 }}>
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                style={{
                  color: 'var(--tps-muted)',
                  fontSize: 16,
                  maxWidth: 720,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        <div
          className="tps-carousel-wrap"
          style={{
            position: 'relative',
            borderRadius: radiusValue,
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Carousel
            ref={carouselRef}
            autoplay={autoplay}
            autoplaySpeed={autoplaySpeed || 4000}
            effect={effect}
            dots={dots}
            afterChange={(idx) => setCurrentSlide(idx)}
            className="tps-carousel-main"
          >
            {slides.map((slide, idx) => {
              const bgUrl =
                slide.url ||
                DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].url;

              return (
                <div key={idx} className="tps-carousel-slide">
                  <div
                    className="tps-carousel-slide__bg"
                    style={{
                      ...heightStyle,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      backgroundImage: `url("${bgUrl}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Gradient Overlay for Readability */}
                    {overlay !== 'none' && (
                      <div
                        className="tps-carousel-slide__overlay"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            overlay === 'dark'
                              ? 'rgba(0, 0, 0, 0.65)'
                              : overlay === 'subtle'
                              ? 'rgba(0, 0, 0, 0.35)'
                              : 'linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.5) 45%, rgba(15, 23, 42, 0.88) 100%)',
                          zIndex: 1,
                        }}
                      />
                    )}

                    {/* Content Box */}
                    <div
                      className="tps-carousel-slide__content"
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        width: '100%',
                        padding: '36px 40px',
                        color: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div style={{ maxWidth: 760 }}>
                        {slide.title && (
                          <h3
                            style={{
                              color: '#ffffff',
                              fontSize: 'clamp(20px, 3.2vw, 36px)',
                              fontWeight: 700,
                              lineHeight: 1.25,
                              marginBottom: 10,
                              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                            }}
                          >
                            {slide.title}
                          </h3>
                        )}
                        {slide.description && (
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.92)',
                              fontSize: 'clamp(14px, 1.6vw, 17px)',
                              lineHeight: 1.6,
                              marginBottom: slide.cta_text ? 20 : 0,
                              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                            }}
                          >
                            {slide.description}
                          </p>
                        )}
                        {slide.cta_text && (
                          <div>
                            <Link href={slide.cta_href || '#'}>
                              <Button
                                type="primary"
                                size="large"
                                style={{
                                  borderRadius: 8,
                                  fontWeight: 600,
                                  paddingInline: 24,
                                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                                }}
                              >
                                {slide.cta_text} <ArrowRightOutlined style={{ fontSize: 13 }} />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>

          {/* Navigation Arrows */}
          {arrows && slides.length > 1 && (
            <>
              <button
                type="button"
                className="tps-carousel-nav-btn tps-carousel-nav-btn--prev"
                onClick={() => carouselRef.current?.prev()}
                aria-label="Previous slide"
              >
                <LeftOutlined />
              </button>
              <button
                type="button"
                className="tps-carousel-nav-btn tps-carousel-nav-btn--next"
                onClick={() => carouselRef.current?.next()}
                aria-label="Next slide"
              >
                <RightOutlined />
              </button>
            </>
          )}

          {/* Slide Indicator Badge */}
          {slides.length > 1 && (
            <div className="tps-carousel-counter">
              {currentSlide + 1} / {slides.length}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Puck Block configuration for ImageCarousel.
 */
export const ImageCarousel = {
  label: 'Image carousel slider',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow text' },
    heading: { type: 'text', label: 'Section heading' },
    subheading: { type: 'text', label: 'Section description' },
    items: {
      type: 'array',
      label: 'Carousel slides',
      arrayFields: {
        url: { type: 'text', label: 'Image URL' },
        title: { type: 'text', label: 'Slide headline (overlay)' },
        description: { type: 'textarea', label: 'Slide description' },
        cta_text: { type: 'text', label: 'Button text (optional)' },
        cta_href: { type: 'text', label: 'Button link (optional)' },
        alt: { type: 'text', label: 'Alt text' },
      },
      defaultItemProps: {
        url: '',
        title: 'New Slide Title',
        description: 'Describe the facility, event, or academic highlight.',
        cta_text: 'Learn More',
        cta_href: '/courses-offering',
        alt: 'Campus Highlight',
      },
      getItemSummary: (it, i) => it?.title || it?.alt || `Slide ${i + 1}`,
    },
    height: {
      type: 'select',
      label: 'Slider height',
      options: [
        { label: 'Medium (480px)', value: 'medium' },
        { label: 'Small (360px)', value: 'small' },
        { label: 'Large (620px)', value: 'large' },
        { label: 'Full screen (80vh)', value: 'full' },
      ],
    },
    autoplay: {
      type: 'radio',
      label: 'Autoplay',
      options: [
        { label: 'Enabled', value: true },
        { label: 'Disabled', value: false },
      ],
    },
    autoplaySpeed: {
      type: 'number',
      label: 'Autoplay interval (ms)',
    },
    effect: {
      type: 'select',
      label: 'Transition effect',
      options: [
        { label: 'Fade', value: 'fade' },
        { label: 'Slide (Scroll)', value: 'scrollx' },
      ],
    },
    arrows: {
      type: 'radio',
      label: 'Show arrow buttons',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    dots: {
      type: 'radio',
      label: 'Show dot pagination',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    overlay: {
      type: 'select',
      label: 'Image overlay',
      options: [
        { label: 'Gradient (Recommended)', value: 'gradient' },
        { label: 'Dark overlay', value: 'dark' },
        { label: 'Subtle overlay', value: 'subtle' },
        { label: 'No overlay', value: 'none' },
      ],
    },
    maxWidth: {
      type: 'select',
      label: 'Container width',
      options: [
        { label: 'Standard (1240px)', value: 'standard' },
        { label: 'Full bleed (100%)', value: 'full' },
        { label: 'Compact (980px)', value: 'compact' },
      ],
    },
    borderRadius: {
      type: 'select',
      label: 'Corner rounding',
      options: [
        { label: 'Medium (16px)', value: 'medium' },
        { label: 'Small (8px)', value: 'small' },
        { label: 'Large (24px)', value: 'large' },
        { label: 'Square (0px)', value: 'none' },
      ],
    },
    background: {
      type: 'select',
      label: 'Section background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft gray', value: 'soft' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    eyebrow: 'CAMPUS HIGHLIGHTS & FACILITIES',
    heading: 'Life & Learning at PRIST',
    subheading: 'Explore our state-of-the-art campus, courtroom environments, and specialized law resource centres.',
    items: DEFAULT_SLIDES,
    height: 'medium',
    autoplay: true,
    autoplaySpeed: 4500,
    effect: 'fade',
    arrows: true,
    dots: true,
    overlay: 'gradient',
    maxWidth: 'standard',
    borderRadius: 'medium',
    background: 'white',
  },
  render: (props) => <ImageCarouselComponent {...props} />,
};
