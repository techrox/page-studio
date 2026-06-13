// ApproachSteps — numbered step list with title + description.

export const ApproachSteps = {
  label: 'Approach steps',
  fields: {
    items: {
      type: 'array',
      label: 'Steps',
      arrayFields: {
        n: { type: 'text', label: 'Step number (e.g. 01)' },
        title: { type: 'text', label: 'Title' },
        text: { type: 'textarea', label: 'Description' },
      },
      defaultItemProps: {
        n: '01',
        title: 'New step',
        text: 'Short description of this step.',
      },
      getItemSummary: (item, i) =>
        item?.title ? `${item.n || i + 1}. ${item.title}` : `Step ${i + 1}`,
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
      { n: '01', title: 'Listen', text: 'Short, punchy supporting copy that you can rewrite.' },
      { n: '02', title: 'Plan', text: 'Short, punchy supporting copy that you can rewrite.' },
      { n: '03', title: 'Build', text: 'Short, punchy supporting copy that you can rewrite.' },
      { n: '04', title: 'Launch', text: 'Short, punchy supporting copy that you can rewrite.' },
    ],
    background: 'white',
  },
  render: ({ items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 24,
          }}
        >
          {(items || []).map((s, i) => (
            <div key={i} style={{ position: 'relative', paddingTop: 20 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: 'var(--tps-accent-dark)',
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '8px 0 8px' }}>
                {s.title}
              </h3>
              <p style={{ color: 'var(--tps-muted)', lineHeight: 1.7, margin: 0 }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
