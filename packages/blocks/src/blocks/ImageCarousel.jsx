'use client';

import { useMemo, useRef, useState } from 'react';
import { Carousel, Button } from 'antd';
import { LeftOutlined, RightOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { StudioLink as Link } from '../context';

const DEFAULT_SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    title: 'Excellence in Education & Innovation',
    description: 'Empowering future leaders with rigorous academics, world-class faculty, and hands-on experience.',
    cta_text: 'Explore Programs',
    cta_href: '/courses',
    alt: 'Academic Campus',
  },
  {
    url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1600&q=80',
    title: 'Modern Learning Facilities & Halls',
    description: 'State-of-the-art conference halls, collaborative research workspaces, and modern auditoriums.',
    cta_text: 'Discover Facilities',
    cta_href: '/facilities',
    alt: 'Auditorium and Hall',
  },
  {
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
    title: 'Comprehensive Knowledge & Research Library',
    description: 'Extensive physical collections, digital databases, quiet study wings, and collaborative rooms.',
    cta_text: 'Visit Library',
    cta_href: '/library',
    alt: 'Research Library',
  },
];

/**
 * Pure React component for the Image Carousel / Slider.
 */
export function ImageCarouselComponent({
  // Partition & Layout customizations
  layout = 'standard', // 'standard' | 'carousel_right' | 'carousel_left'
  fullWidth = false,
  partition_type = 'content', // 'content' | 'image' | 'both'
  partition_ratio = '50-50', // '50-50' | '40-60' | '60-40' | '33-67' | '67-33'
  show_partition_divider = false,
  partition_card = 'plain', // 'plain' | 'card'
  partition_eyebrow = '',
  partition_title = '',
  partition_description = '',
  partition_cta_text = '',
  partition_cta_href = '',
  partition_cta_variant = 'primary',
  partition_secondary_cta_text = '',
  partition_secondary_cta_href = '',
  partition_image_url = '',
  partition_image_alt = '',

  // Header
  eyebrow,
  heading,
  subheading,

  // Carousel items & settings
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
  background_image = '',
  background_overlay = 'gradient',
  button_style = 'solid',
  className = '',
  style = {},
}) {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const isFullWidth = Boolean(fullWidth || maxWidth === 'full' || maxWidth === 'full_width');
  const isSplit = layout === 'carousel_right' || layout === 'carousel_left';

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
    if (isFullWidth) return '100%';
    switch (maxWidth) {
      case 'compact':
        return '980px';
      case 'standard':
      default:
        return 'var(--tps-max, 1240px)';
    }
  }, [isFullWidth, maxWidth]);

  const gridTemplate = useMemo(() => {
    if (!isSplit) return '1fr';
    const [c1, c2] =
      partition_ratio === '40-60'
        ? layout === 'carousel_right' ? ['2fr', '3fr'] : ['3fr', '2fr']
        : partition_ratio === '60-40'
        ? layout === 'carousel_right' ? ['3fr', '2fr'] : ['2fr', '3fr']
        : partition_ratio === '33-67'
        ? layout === 'carousel_right' ? ['1fr', '2fr'] : ['2fr', '1fr']
        : partition_ratio === '67-33'
        ? layout === 'carousel_right' ? ['2fr', '1fr'] : ['1fr', '2fr']
        : ['1fr', '1fr'];

    if (show_partition_divider) {
      return `${c1} auto ${c2}`;
    }
    return `${c1} ${c2}`;
  }, [isSplit, partition_ratio, layout, show_partition_divider]);

  const bgClass =
    background === 'soft'
      ? 'tps-section-soft'
      : background === 'dark'
      ? 'tps-section-dark'
      : '';

  const buttonClass =
    button_style === 'gradient'
      ? 'tps-btn--gradient'
      : button_style === 'gradient-cyan'
      ? 'tps-btn--gradient tps-btn--gradient-cyan'
      : button_style === 'gradient-purple'
      ? 'tps-btn--gradient tps-btn--gradient-purple'
      : '';

  const renderPartitionSide = () => {
    const hasContent = partition_type === 'content' || partition_type === 'both';
    const hasImage = partition_type === 'image' || partition_type === 'both';

    const textContent = (
      <div className="tps-carousel-partition-text">
        {partition_eyebrow && <span className="tps-eyebrow">{partition_eyebrow}</span>}
        {partition_title && (
          <h2
            className="tps-h2"
            style={{
              marginTop: partition_eyebrow ? 8 : 0,
              marginBottom: 12,
              fontSize: 'clamp(22px, 2.5vw, 36px)',
              lineHeight: 1.25,
            }}
          >
            {partition_title}
          </h2>
        )}
        {partition_description && (
          <p
            className="tps-lede"
            style={{
              color: 'var(--tps-muted)',
              fontSize: 'clamp(14px, 1.2vw, 16px)',
              lineHeight: 1.65,
              marginBottom: (partition_cta_text || partition_secondary_cta_text) ? 24 : 0,
            }}
          >
            {partition_description}
          </p>
        )}
        {(partition_cta_text || partition_secondary_cta_text) && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {partition_cta_text && (
              <Link href={partition_cta_href || '#'}>
                <Button
                  type={partition_cta_variant === 'default' ? 'default' : 'primary'}
                  size="large"
                  className={partition_cta_variant !== 'default' ? buttonClass : ''}
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                    paddingInline: 24,
                  }}
                >
                  {partition_cta_text} <ArrowRightOutlined style={{ fontSize: 13 }} />
                </Button>
              </Link>
            )}
            {partition_secondary_cta_text && (
              <Link href={partition_secondary_cta_href || '#'}>
                <Button
                  size="large"
                  style={{
                    borderRadius: 8,
                    fontWeight: 600,
                    paddingInline: 20,
                  }}
                >
                  {partition_secondary_cta_text}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    );

    const imageEl = hasImage && (
      <div
        className="tps-carousel-partition-image-wrap"
        style={{
          borderRadius: radiusValue,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
          height: partition_type === 'image' ? (heightStyle.height || 480) : 260,
          marginTop: partition_type === 'both' ? 24 : 0,
        }}
      >
        <img
          src={
            partition_image_url ||
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80'
          }
          alt={partition_image_alt || 'Partition showcase image'}
          className="tps-carousel-partition-image"
        />
      </div>
    );

    const isCard = partition_card === 'card';

    return (
      <div
        className={`tps-carousel-partition-side${
          isCard ? ' tps-carousel-partition-side--card' : ''
        }`}
        style={{
          padding: isCard
            ? undefined
            : isFullWidth
            ? layout === 'carousel_right'
              ? 'clamp(24px, 4vw, 56px) clamp(24px, 4vw, 48px) clamp(24px, 4vw, 56px) clamp(24px, 6vw, 80px)'
              : 'clamp(24px, 4vw, 56px) clamp(24px, 6vw, 80px) clamp(24px, 4vw, 56px) clamp(24px, 4vw, 48px)'
            : 'clamp(16px, 2vw, 24px)',
        }}
      >
        {hasContent && textContent}
        {hasImage && imageEl}
      </div>
    );
  };

  const carouselEl = (
    <div
      className="tps-carousel-wrap"
      style={{
        position: 'relative',
        borderRadius: isFullWidth && layout === 'standard' ? '0px' : radiusValue,
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
        width: '100%',
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
                {(slide.title || slide.description || slide.cta_text) && (
                  <div
                    className="tps-carousel-slide__content"
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '100%',
                      padding: layout === 'standard' ? '36px 40px' : '28px 30px',
                      color: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div style={{ maxWidth: 760 }}>
                      {slide.title && (
                        <h3
                          style={{
                            color: '#ffffff',
                            fontSize: layout === 'standard' ? 'clamp(20px, 3.2vw, 36px)' : 'clamp(18px, 2.4vw, 28px)',
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
                            fontSize: layout === 'standard' ? 'clamp(14px, 1.6vw, 17px)' : 'clamp(13px, 1.3vw, 15px)',
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
                              size={layout === 'standard' ? 'large' : 'middle'}
                              className={buttonClass}
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
                )}
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
  );

    const bgUrl = String(background_image || '').trim();
    const hasBgImage = Boolean(bgUrl);

    let overlayBg = '';
    if (hasBgImage) {
      if (background_overlay === 'gradient') {
        overlayBg = background === 'dark'
          ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.94) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.95) 100%)';
      } else if (background_overlay === 'dark') {
        overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6))';
      } else if (background_overlay === 'subtle') {
        overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.2))';
      }
    }

    const carouselSectionStyle = {
      paddingTop: isFullWidth ? (eyebrow || heading || subheading ? 48 : 0) : 48,
      paddingBottom: isFullWidth ? (eyebrow || heading || subheading ? 48 : 0) : 48,
      paddingLeft: isFullWidth ? 0 : undefined,
      paddingRight: isFullWidth ? 0 : undefined,
      ...(hasBgImage
        ? {
            backgroundImage: overlayBg
              ? `${overlayBg}, url("${bgUrl}")`
              : `url("${bgUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            ...(background_overlay === 'dark' ? { color: '#ffffff' } : {}),
          }
        : {}),
      ...style,
    };

    return (
      <section
        className={`tps-section tps-image-carousel ${
          isFullWidth ? 'tps-image-carousel--fullwidth' : ''
        } ${bgClass} ${className}`.trim()}
        style={carouselSectionStyle}
      >
      <div
        className="tps-container"
        style={{
          maxWidth: containerMaxWidth,
          paddingLeft: isFullWidth && layout === 'standard' ? 0 : undefined,
          paddingRight: isFullWidth && layout === 'standard' ? 0 : undefined,
        }}
      >
        {(eyebrow || heading || subheading) && (
          <div
            style={{
              marginBottom: 32,
              textAlign: 'center',
              padding: isFullWidth ? '0 24px' : undefined,
            }}
          >
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

        {isSplit ? (
          <div
            className="tps-carousel-partition-grid"
            style={{
              gridTemplateColumns: gridTemplate,
              gap: show_partition_divider ? 24 : isFullWidth ? 0 : 36,
            }}
          >
            {layout === 'carousel_right' ? (
              <>
                {renderPartitionSide()}
                {show_partition_divider && <div className="tps-carousel-divider-col" />}
                <div style={{ minWidth: 0, width: '100%' }}>{carouselEl}</div>
              </>
            ) : (
              <>
                <div style={{ minWidth: 0, width: '100%' }}>{carouselEl}</div>
                {show_partition_divider && <div className="tps-carousel-divider-col" />}
                {renderPartitionSide()}
              </>
            )}
          </div>
        ) : (
          carouselEl
        )}
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
    layout: {
      type: 'select',
      label: 'Layout & Partition',
      options: [
        { label: 'Standard (Carousel only)', value: 'standard' },
        { label: 'Split: Content/Image on Left, Carousel on Right', value: 'carousel_right' },
        { label: 'Split: Carousel on Left, Content/Image on Right', value: 'carousel_left' },
      ],
    },
    fullWidth: {
      type: 'radio',
      label: 'Full width (End-to-end screen)',
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
    partition_type: {
      type: 'select',
      label: 'Partition side content',
      options: [
        { label: 'Content (Headline, text & button)', value: 'content' },
        { label: 'Single image', value: 'image' },
        { label: 'Both (Content + Image)', value: 'both' },
      ],
    },
    partition_ratio: {
      type: 'select',
      label: 'Partition split ratio',
      options: [
        { label: '50% / 50% (Equal)', value: '50-50' },
        { label: '40% Partition / 60% Carousel', value: '40-60' },
        { label: '60% Partition / 40% Carousel', value: '60-40' },
        { label: '33% Partition / 67% Carousel', value: '33-67' },
        { label: '67% Partition / 33% Carousel', value: '67-33' },
      ],
    },
    show_partition_divider: {
      type: 'radio',
      label: 'Show partition divider line',
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
    partition_card: {
      type: 'radio',
      label: 'Partition card style',
      options: [
        { label: 'Plain / Seamless', value: 'plain' },
        { label: 'Card box (bordered)', value: 'card' },
      ],
    },
    partition_eyebrow: { type: 'text', label: 'Partition eyebrow' },
    partition_title: { type: 'text', label: 'Partition title' },
    partition_description: { type: 'textarea', label: 'Partition description' },
    partition_cta_text: { type: 'text', label: 'Partition button text' },
    partition_cta_href: { type: 'text', label: 'Partition button link' },
    partition_cta_variant: {
      type: 'select',
      label: 'Partition button style',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Default', value: 'default' },
      ],
    },
    partition_secondary_cta_text: { type: 'text', label: 'Partition secondary button text' },
    partition_secondary_cta_href: { type: 'text', label: 'Partition secondary button link' },
    partition_image_url: { type: 'text', label: 'Partition single image URL' },
    partition_image_alt: { type: 'text', label: 'Partition image alt text' },

    eyebrow: { type: 'text', label: 'Section eyebrow' },
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
        { label: 'Full width (End to end)', value: 'full_width' },
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
    background_image: { type: 'text', label: 'Section background image URL (optional)' },
    background_overlay: {
      type: 'select',
      label: 'Image overlay effect',
      options: [
        { label: 'Gradient overlay (Recommended)', value: 'gradient' },
        { label: 'Dark tint (60%)', value: 'dark' },
        { label: 'Subtle tint (20%)', value: 'subtle' },
        { label: 'No overlay', value: 'none' },
      ],
    },
    button_style: {
      type: 'select',
      label: 'Button style',
      options: [
        { label: 'Brand primary (Solid)', value: 'solid' },
        { label: 'Gradient (Primary to Accent)', value: 'gradient' },
        { label: 'Gradient (Cyan to Blue)', value: 'gradient-cyan' },
        { label: 'Gradient (Purple to Pink)', value: 'gradient-purple' },
      ],
    },
  },
  defaultProps: {
    layout: 'standard',
    fullWidth: false,
    partition_type: 'content',
    partition_ratio: '50-50',
    show_partition_divider: false,
    partition_card: 'plain',
    partition_eyebrow: 'CAMPUS HIGHLIGHTS',
    partition_title: 'World-Class Infrastructure & Facilities',
    partition_description: 'Discover modern interactive lecture halls, dedicated research centres, and an inspiring academic environment designed to support your journey.',
    partition_cta_text: 'Explore Campus',
    partition_cta_href: '/about',
    partition_cta_variant: 'primary',
    partition_secondary_cta_text: '',
    partition_secondary_cta_href: '',
    partition_image_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    partition_image_alt: 'University Campus Building',
    eyebrow: '',
    heading: '',
    subheading: '',
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
    background_image: '',
    background_overlay: 'gradient',
    button_style: 'solid',
  },
  render: (props) => <ImageCarouselComponent {...props} />,
};
