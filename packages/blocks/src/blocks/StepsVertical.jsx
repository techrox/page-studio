// StepsVertical — large vertical numbered steps with body. Heavier than
// ApproachSteps (which is a horizontal grid). Best for "how it works"
// or onboarding sequences.
export const StepsVertical = {
  label: 'Steps — vertical',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array', label: 'Steps',
      arrayFields: {
        title: { type: 'text', label: 'Title' },
        body: { type: 'textarea', label: 'Body', rows: 3 },
      },
      defaultItemProps: { title: 'New step', body: 'Description.' },
      getItemSummary: (it, i) => it?.title || `Step ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    eyebrow: 'How it works', heading: 'A simpler way to ship.',
    items: [
      { title: 'Get in touch', body: 'A short, friendly description that you can rewrite.' },
      { title: 'Plan together', body: 'A short, friendly description that you can rewrite.' },
      { title: 'Build the thing', body: 'A short, friendly description that you can rewrite.' },
      { title: 'Launch and learn', body: 'A short, friendly description that you can rewrite.' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="tps-container" style={{ maxWidth: 820 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {(items || []).map((s, i) => (
            <li key={i} className="tps-row-stack" style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24, paddingBottom: 32, position: 'relative' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--tps-primary-soft, #dbeafe)', color: 'var(--tps-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '6px 0 8px' }}>{s.title}</h3>
                <p style={{ color: 'var(--tps-muted)', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  ),
};
