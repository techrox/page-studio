// TestimonialQuote — pull-quote testimonial section with slider / carousel
// support. Allows displaying a single quote or multiple quotes as an
// interactive carousel with arrows, dots, and autoplay controls.
//
// Backward-compatible: If legacy single-quote props (quote, author_name, etc.)
// are passed without `items`, they are automatically normalized into the first quote item.

import { useRef, useState } from 'react';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

/**
 * Pure React component for TestimonialQuote.
 * Can be used standalone outside Puck or rendered by the Puck TestimonialQuote block.
 */
export function TestimonialQuoteComponent({
  quote,
  author_name,
  author_role,
  author_company,
  author_image,
  items = [],
  autoplay = false,
  autoplay_speed = 5,
  show_arrows = true,
  show_dots = true,
  background = 'soft',
  className = '',
  style = {},
}) {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Normalize quotes: if `items` array is provided and not empty, use it;
  // otherwise fallback to the single quote props if available, or default quote.
  const normalizedItems = Array.isArray(items) && items.length > 0
    ? items.filter((it) => it && (it.quote || it.author_name))
    : [
        {
          quote:
            quote ||
            'A short, glowing quote from a happy customer. Replace this with the testimonial you want front and center.',
          author_name: author_name || 'Alex Rivera',
          author_role: author_role || 'Founder',
          author_company: author_company || 'Acme Co.',
          author_image: author_image || '',
        },
      ];

  const slides = normalizedItems.length > 0 ? normalizedItems : [
    {
      quote: 'A short, glowing quote from a happy customer.',
      author_name: 'Alex Rivera',
      author_role: 'Founder',
      author_company: 'Acme Co.',
      author_image: '',
    },
  ];

  const isMultiple = slides.length > 1;
  const isDark = background === 'dark';
  const isSoft = background === 'soft';

  const renderSingleQuoteContent = (item, idx) => {
    const q = item.quote || '';
    const name = item.author_name || '';
    const role = item.author_role || '';
    const comp = item.author_company || '';
    const img = item.author_image || '';
    const initials = (name || '?').slice(0, 1).toUpperCase();
    const meta = [role, comp].filter(Boolean).join(' · ');

    return (
      <div key={idx} className="tps-testimonial-slide" style={{ padding: '0 8px', outline: 'none' }}>
        <p
          className="tps-testimonial-quote-text"
          style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            lineHeight: 1.55,
            fontWeight: 500,
            color: isDark ? '#fff' : 'var(--tps-ink, #0f172a)',
            margin: '0 auto 32px',
            maxWidth: 760,
          }}
        >
          {q}
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            textAlign: 'left',
          }}
        >
          {img ? (
            <img
              src={img}
              alt={name || ''}
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                objectFit: 'cover',
                border: isDark ? '2px solid rgba(255,255,255,0.2)' : '2px solid var(--tps-line, #e2e8f0)',
              }}
            />
          ) : (
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: isDark ? 'rgba(255,255,255,0.12)' : 'var(--tps-primary, #0b60d8)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {initials}
            </div>
          )}

          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: isDark ? '#fff' : 'var(--tps-ink, #0f172a)',
              }}
            >
              {name}
            </div>
            {meta && (
              <div
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'var(--tps-muted, #64748b)',
                }}
              >
                {meta}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      className={`tps-section ${isSoft ? 'tps-section-soft' : ''}${isDark ? ' tps-section-dark' : ''} ${className}`.trim()}
      style={{
        paddingTop: 80,
        paddingBottom: 80,
        background: isDark ? '#0F172A' : isSoft ? undefined : 'var(--tps-bg, #ffffff)',
        color: isDark ? '#fff' : undefined,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div className="tps-container" style={{ maxWidth: 860, textAlign: 'center', position: 'relative' }}>
        {/* Large Decorative Quotation Mark */}
        <div
          style={{
            fontSize: 'clamp(54px, 12vw, 80px)',
            lineHeight: 1,
            color: isDark ? '#F59E0B' : 'var(--tps-primary, #0b60d8)',
            fontFamily: 'Georgia, serif',
            marginBottom: -24,
            opacity: 0.6,
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          “
        </div>

        <div className={`tps-testimonial-carousel${isDark ? ' tps-testimonial-carousel--dark' : ''}`}>
          {isMultiple ? (
            <>
              <Carousel
                ref={carouselRef}
                dots={show_dots}
                autoplay={Boolean(autoplay)}
                autoplaySpeed={Math.max(1000, (Number(autoplay_speed) || 5) * 1000)}
                effect="fade"
                beforeChange={(_from, to) => setCurrentSlide(to)}
              >
                {slides.map((item, idx) => renderSingleQuoteContent(item, idx))}
              </Carousel>

              {/* Navigation Arrows */}
              {show_arrows && (
                <>
                  <button
                    type="button"
                    className="tps-testimonial-nav-btn tps-testimonial-nav-btn--prev"
                    onClick={() => carouselRef.current?.prev()}
                    aria-label="Previous testimonial"
                  >
                    <LeftOutlined />
                  </button>
                  <button
                    type="button"
                    className="tps-testimonial-nav-btn tps-testimonial-nav-btn--next"
                    onClick={() => carouselRef.current?.next()}
                    aria-label="Next testimonial"
                  >
                    <RightOutlined />
                  </button>
                </>
              )}
            </>
          ) : (
            renderSingleQuoteContent(slides[0], 0)
          )}
        </div>
      </div>
    </section>
  );
}

export const TestimonialQuote = {
  label: 'Testimonial quote',
  fields: {
    items: {
      type: 'array',
      label: 'Quotes in carousel',
      arrayFields: {
        quote: { type: 'textarea', label: 'Quote', rows: 4 },
        author_name: { type: 'text', label: 'Author name' },
        author_role: { type: 'text', label: 'Role' },
        author_company: { type: 'text', label: 'Company' },
        author_image: { type: 'text', label: 'Photo URL (optional)' },
      },
      defaultItemProps: {
        quote: 'A short, glowing quote from a happy customer.',
        author_name: 'Alex Rivera',
        author_role: 'Founder',
        author_company: 'Acme Co.',
        author_image: '',
      },
      getItemSummary: (it, i) => it?.author_name || it?.quote?.slice(0, 30) || `Quote ${i + 1}`,
    },
    show_arrows: {
      type: 'radio',
      label: 'Show navigation arrows',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    show_dots: {
      type: 'radio',
      label: 'Show pagination dots',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    autoplay: {
      type: 'radio',
      label: 'Auto rotate carousel',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    autoplay_speed: {
      type: 'number',
      label: 'Slide duration (seconds)',
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    items: [
      {
        quote:
          'A short, glowing quote from a happy customer. Replace this with the testimonial you want front and center.',
        author_name: 'Alex Rivera',
        author_role: 'Founder',
        author_company: 'Acme Co.',
        author_image: '',
      },
      {
        quote:
          'Working with this platform completely changed how we ship new pages. Highly recommended!',
        author_name: 'Sophia Patel',
        author_role: 'Head of Growth',
        author_company: 'Vanguard Media',
        author_image: '',
      },
      {
        quote:
          'The attention to detail, performance, and flexibility is unmatched in modern web builders.',
        author_name: 'Marcus Chen',
        author_role: 'CTO',
        author_company: 'NextGen Solutions',
        author_image: '',
      },
    ],
    show_arrows: true,
    show_dots: true,
    autoplay: true,
    autoplay_speed: 6,
    background: 'soft',
  },
  render: (props) => <TestimonialQuoteComponent {...props} />,
};

