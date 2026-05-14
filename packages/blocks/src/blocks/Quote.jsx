// Quote — simple pull-quote without testimonial framing. For editorial
// emphasis inside long-form content.
export const Quote = {
  label: 'Pull quote',
  fields: {
    text: { type: 'textarea', label: 'Quote', rows: 4 },
    cite: { type: 'text', label: 'Attribution (optional)' },
    align: {
      type: 'radio', label: 'Alignment',
      options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }],
    },
  },
  defaultProps: {
    text: 'A short, memorable line that deserves the spotlight. Replace with your own.',
    cite: '',
    align: 'center',
  },
  render: ({ text, cite, align }) => (
    <section className="tps-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className="tps-container" style={{ maxWidth: 720, textAlign: align }}>
        <blockquote style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 500,
          lineHeight: 1.45,
          color: 'var(--tps-ink)',
          borderLeft: align === 'left' ? '3px solid var(--tps-primary)' : 'none',
          paddingLeft: align === 'left' ? 24 : 0,
        }}>
          “{text}”
        </blockquote>
        {cite && (
          <cite style={{ display: 'block', marginTop: 12, fontStyle: 'normal', fontSize: 14, color: 'var(--tps-muted)' }}>— {cite}</cite>
        )}
      </div>
    </section>
  ),
};
