// PrinciplesList — checkmark bullets with editable items.

import { CheckCircleFilled } from '@ant-design/icons';

export const PrinciplesList = {
  label: 'Principles list',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading_html: { type: 'textarea', label: 'Heading (HTML, optional)' },
    lede: { type: 'textarea', label: 'Lede (optional)' },
    label: { type: 'text', label: 'List label (small caps, optional)' },
    items: {
      type: 'array',
      label: 'Principles',
      arrayFields: {
        text: { type: 'text', label: 'Principle' },
      },
      defaultItemProps: { text: 'A new principle' },
      getItemSummary: (item, i) => item?.text || `Principle ${i + 1}`,
    },
    layout: {
      type: 'radio',
      label: 'Layout',
      options: [
        { label: 'Two columns (heading + list)', value: 'split' },
        { label: 'List only', value: 'list-only' },
      ],
    },
  },
  defaultProps: {
    eyebrow: 'What we believe',
    heading_html: 'A simpler way<br />to ship great work.',
    lede: 'Replace this with the one belief that shapes everything you do.',
    label: 'EVERY PROJECT IS:',
    items: [
      { text: 'Designed in the open' },
      { text: 'Built to last' },
      { text: 'Made with care' },
    ],
    layout: 'split',
  },
  render: ({ eyebrow, heading_html, lede, label, items, layout }) => {
    const list = (
      <div
        style={{
          background: 'var(--tps-bg-soft)',
          border: '1px solid var(--tps-line)',
          borderRadius: 'var(--tps-radius)',
          padding: 32,
        }}
      >
        {label && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              color: 'var(--tps-accent-dark)',
              marginBottom: 16,
            }}
          >
            {label}
          </div>
        )}
        {(items || []).map((p, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}
          >
            <CheckCircleFilled style={{ color: 'var(--tps-primary)', fontSize: 22 }} />
            <span style={{ fontSize: 17, fontWeight: 500 }}>{p.text}</span>
          </div>
        ))}
      </div>
    );
    return (
      <section className="tps-section" style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div className="tps-container">
          {layout === 'split' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: 48,
                alignItems: 'center',
              }}
            >
              <div>
                {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
                {heading_html && (
                  <h2
                    className="tps-h2"
                    style={{ marginTop: 8 }}
                    dangerouslySetInnerHTML={{ __html: heading_html }}
                  />
                )}
                {lede && <p className="tps-lede">{lede}</p>}
              </div>
              {list}
            </div>
          ) : (
            <div style={{ maxWidth: 640, margin: '0 auto' }}>{list}</div>
          )}
        </div>
      </section>
    );
  },
};
