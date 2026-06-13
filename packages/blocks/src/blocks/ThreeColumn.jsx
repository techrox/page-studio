// ThreeColumn — generic 3-col text layout. Lighter than PillarsRow
// (which is icon + body cards). Use for parallel text features.
export const ThreeColumn = {
  label: 'Three columns',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    columns: {
      type: 'array', label: 'Columns',
      arrayFields: {
        title: { type: 'text', label: 'Column title' },
        body: { type: 'textarea', label: 'Column body', rows: 4 },
      },
      defaultItemProps: { title: 'Column', body: 'Body text.' },
      getItemSummary: (it, i) => it?.title || `Column ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    eyebrow: '', heading: '',
    columns: [
      { title: 'For teams', body: 'A short, friendly description you can rewrite.' },
      { title: 'For leaders', body: 'A short, friendly description you can rewrite.' },
      { title: 'For founders', body: 'A short, friendly description you can rewrite.' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, columns, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="tps-container">
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 32 }}>
          {(columns || []).map((c, i) => (
            <div key={i}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{c.title}</h3>
              <p style={{ color: 'var(--tps-muted)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
