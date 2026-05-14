// Container — styled background + padding container for visually grouping
// adjacent blocks. Doesn't accept children blocks (Puck DropZones add too
// much complexity); instead this is a single decorative wrapper for one
// title + one body of content.
export const Container = {
  label: 'Container box',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    body_html: { type: 'textarea', label: 'Body (HTML)', rows: 5 },
    background: {
      type: 'select', label: 'Box background',
      options: [
        { label: 'Soft', value: 'soft' },
        { label: 'Primary tint', value: 'primary' },
        { label: 'Dark', value: 'dark' },
        { label: 'White (with border)', value: 'white' },
      ],
    },
    align: {
      type: 'radio', label: 'Alignment',
      options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }],
    },
  },
  defaultProps: {
    eyebrow: '', heading: 'Important note',
    body_html: '<p>Use this box to highlight a callout or key takeaway.</p>',
    background: 'soft', align: 'left',
  },
  render: ({ eyebrow, heading, body_html, background, align }) => {
    const bg = {
      soft: { bg: 'var(--tps-bg-soft)', fg: 'var(--tps-ink)', border: '1px solid var(--tps-line)' },
      primary: { bg: 'rgba(15, 118, 110, 0.08)', fg: 'var(--tps-ink)', border: '1px solid rgba(15, 118, 110, 0.2)' },
      dark: { bg: '#0F172A', fg: '#fff', border: 'none' },
      white: { bg: '#fff', fg: 'var(--tps-ink)', border: '1px solid var(--tps-line)' },
    }[background] || { bg: 'var(--tps-bg-soft)', fg: 'var(--tps-ink)', border: '1px solid var(--tps-line)' };
    return (
      <section className="tps-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="tps-container" style={{ maxWidth: 820 }}>
          <div style={{ background: bg.bg, color: bg.fg, border: bg.border, borderRadius: 'var(--tps-radius)', padding: 32, textAlign: align }}>
            {eyebrow && <span className="tps-eyebrow" style={{ color: background === 'dark' ? '#F59E0B' : undefined }}>{eyebrow}</span>}
            {heading && <h3 style={{ fontSize: 22, fontWeight: 700, margin: '8px 0 14px' }}>{heading}</h3>}
            {body_html && <div style={{ lineHeight: 1.7, fontSize: 15, opacity: background === 'dark' ? 0.92 : 1 }} dangerouslySetInnerHTML={{ __html: body_html }} />}
          </div>
        </div>
      </section>
    );
  },
};
