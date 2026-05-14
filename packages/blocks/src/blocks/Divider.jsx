// Divider — horizontal divider with optional centered label.
export const Divider = {
  label: 'Divider',
  fields: {
    label: { type: 'text', label: 'Center label (optional)' },
    style: {
      type: 'select', label: 'Style',
      options: [
        { label: 'Hairline', value: 'hairline' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Thick', value: 'thick' },
        { label: 'Dot', value: 'dot' },
      ],
    },
    spacing: {
      type: 'select', label: 'Vertical spacing',
      options: [
        { label: 'Compact (24px)', value: 24 },
        { label: 'Standard (48px)', value: 48 },
        { label: 'Generous (96px)', value: 96 },
      ],
    },
  },
  defaultProps: { label: '', style: 'hairline', spacing: 48 },
  render: ({ label, style, spacing }) => (
    <section style={{ padding: `${spacing}px 24px` }}>
      <div className="tps-container" style={{ maxWidth: 820 }}>
        {style === 'dot' ? (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {[0,1,2].map((i) => <span key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1' }} />)}
          </div>
        ) : label ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: 1, height: style === 'thick' ? 2 : 1, borderTop: style === 'dashed' ? `1px dashed #CBD5E1` : 'none', background: style !== 'dashed' ? '#E2E8F0' : 'none' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ flex: 1, height: style === 'thick' ? 2 : 1, borderTop: style === 'dashed' ? `1px dashed #CBD5E1` : 'none', background: style !== 'dashed' ? '#E2E8F0' : 'none' }} />
          </div>
        ) : (
          <hr style={{ margin: 0, border: 0, borderTop: style === 'dashed' ? '1px dashed #CBD5E1' : `${style === 'thick' ? 2 : 1}px solid #E2E8F0` }} />
        )}
      </div>
    </section>
  ),
};
