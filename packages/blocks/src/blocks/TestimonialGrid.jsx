// TestimonialGrid — 2 or 3 testimonial cards in a row. Used when you want
// social proof from multiple voices without a single quote dominating.

export const TestimonialGrid = {
  label: 'Testimonial grid',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading: { type: 'text', label: 'Heading (optional)' },
    columns: {
      type: 'radio',
      label: 'Columns',
      options: [
        { label: '2', value: 2 },
        { label: '3', value: 3 },
      ],
    },
    items: {
      type: 'array',
      label: 'Testimonials',
      arrayFields: {
        quote: { type: 'textarea', label: 'Quote', rows: 4 },
        name: { type: 'text', label: 'Name' },
        role: { type: 'text', label: 'Role' },
        company: { type: 'text', label: 'Company' },
      },
      defaultItemProps: {
        quote: 'Add a short quote here.',
        name: 'Name',
        role: 'Role',
        company: 'Company',
      },
      getItemSummary: (item, i) => item?.name || `Testimonial ${i + 1}`,
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
    eyebrow: 'Kind words',
    heading: 'Loved by people like you.',
    columns: 3,
    items: [
      {
        quote:
          'A short, friendly quote from a happy customer. Replace this with your own.',
        name: 'Alex Rivera',
        role: 'Founder',
        company: 'Acme Co.',
      },
      {
        quote:
          'A short, friendly quote from a happy customer. Replace this with your own.',
        name: 'Sam Lee',
        role: 'Product Lead',
        company: 'Northwind',
      },
      {
        quote:
          'A short, friendly quote from a happy customer. Replace this with your own.',
        name: 'Jamie Chen',
        role: 'Operations',
        company: 'Lighthouse Labs',
      },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, columns, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`}
      style={{ paddingTop: 64, paddingBottom: 64 }}
    >
      <div className="tps-container">
        {(eyebrow || heading) && (
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${columns === 2 ? 360 : 280}px, 100%), 1fr))`,
            gap: 24,
          }}
        >
          {(items || []).map((t, i) => (
            <div
              key={i}
              style={{
                background: 'var(--tps-bg)',
                border: '1px solid var(--tps-line)',
                borderRadius: 'var(--tps-radius)',
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--tps-ink-2)',
                  margin: 0,
                  flex: 1,
                }}
              >
                “{t.quote}”
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--tps-primary)',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {(t.name || '?').slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--tps-muted)' }}>
                    {[t.role, t.company].filter(Boolean).join(' · ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
