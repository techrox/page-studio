// TestimonialQuote — single large pull-quote with attribution. Use when
// one testimonial deserves the full spotlight (e.g. lead case study).

export const TestimonialQuote = {
  label: 'Testimonial quote',
  fields: {
    quote: { type: 'textarea', label: 'Quote', rows: 4 },
    author_name: { type: 'text', label: 'Author name' },
    author_role: { type: 'text', label: 'Role' },
    author_company: { type: 'text', label: 'Company' },
    author_image: { type: 'text', label: 'Photo URL (optional)' },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    quote:
      "A short, glowing quote from a happy customer. Replace this with the testimonial you want front and center.",
    author_name: 'Alex Rivera',
    author_role: 'Founder',
    author_company: 'Acme Co.',
    author_image: '',
    background: 'soft',
  },
  render: ({ quote, author_name, author_role, author_company, author_image, background }) => {
    const dark = background === 'dark';
    return (
      <section
        className={`tps-section ${!dark ? 'tps-section-soft' : ''}`}
        style={{
          paddingTop: 80,
          paddingBottom: 80,
          background: dark ? '#0F172A' : undefined,
          color: dark ? '#fff' : undefined,
        }}
      >
        <div className="tps-container" style={{ maxWidth: 820, textAlign: 'center' }}>
          <div
            style={{
              fontSize: 'clamp(40px, 10vw, 64px)',
              lineHeight: 1,
              color: dark ? '#F59E0B' : 'var(--tps-primary)',
              fontFamily: 'Georgia, serif',
              marginBottom: -16,
              opacity: 0.6,
            }}
          >
            “
          </div>
          <p
            style={{
              fontSize: 22,
              lineHeight: 1.55,
              fontWeight: 500,
              color: dark ? '#fff' : 'var(--tps-ink)',
              margin: '0 0 32px',
            }}
          >
            {quote}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            {author_image ? (
              <img
                src={author_image}
                alt={author_name || ''}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: dark ? 'rgba(255,255,255,0.1)' : 'var(--tps-primary)',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {(author_name || '?').slice(0, 1).toUpperCase()}
              </div>
            )}
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontWeight: 700,
                  color: dark ? '#fff' : 'var(--tps-ink)',
                }}
              >
                {author_name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: dark ? 'rgba(255,255,255,0.7)' : 'var(--tps-muted)',
                }}
              >
                {[author_role, author_company].filter(Boolean).join(' · ')}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  },
};
