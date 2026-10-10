// KeyValueList — definition list / specs table. For "what's included",
// product specs, deal terms.
export const KeyValueList = {
  label: 'Key / value list',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array', label: 'Rows',
      arrayFields: {
        key: { type: 'text', label: 'Key' },
        value: { type: 'text', label: 'Value' },
      },
      defaultItemProps: { key: 'New row', value: '—' },
      getItemSummary: (it, i) => it?.key || `Row ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    eyebrow: '', heading: 'The details',
    items: [
      { key: 'Duration', value: '4–8 weeks' },
      { key: 'Format', value: 'Remote + on-site' },
      { key: 'Includes', value: 'Discovery · build · launch' },
      { key: 'Starts at', value: 'Talk to us' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`} style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="tps-container" style={{ maxWidth: 820 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 24 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <dl className="tps-row-stack" style={{ margin: 0, display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 0 }}>
          {(items || []).map((row, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <dt style={{ padding: '14px 0', borderTop: '1px solid var(--tps-line)', fontSize: 13, fontWeight: 700, color: 'var(--tps-muted)', letterSpacing: 0.5 }}>{row.key}</dt>
              <dd style={{ padding: '14px 0', borderTop: '1px solid var(--tps-line)', margin: 0, fontSize: 15, color: 'var(--tps-ink)' }}>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  ),
};
