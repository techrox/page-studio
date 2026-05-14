// Timeline — vertical chronological events list. Each item has a date, a
// title, and a body. Useful for company history, project milestones, or a
// "what happens after you contact us" walkthrough.

export const Timeline = {
  label: 'Timeline',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading: { type: 'text', label: 'Heading (optional)' },
    items: {
      type: 'array',
      label: 'Events',
      arrayFields: {
        date: { type: 'text', label: 'Date / label (e.g. 2024 Q1)' },
        title: { type: 'text', label: 'Title' },
        body: { type: 'textarea', label: 'Body', rows: 3 },
      },
      defaultItemProps: {
        date: 'New event',
        title: 'Title',
        body: 'Short description of what happened.',
      },
      getItemSummary: (item, i) =>
        item?.title ? `${item.date || ''} ${item.title}` : `Event ${i + 1}`,
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
      ],
    },
  },
  defaultProps: {
    eyebrow: 'Our story',
    heading: 'How we got here.',
    items: [
      { date: '2022', title: 'Founded', body: 'A short, friendly description of this milestone. Rewrite to match your story.' },
      { date: '2023', title: 'First customers', body: 'A short, friendly description of this milestone. Rewrite to match your story.' },
      { date: '2024', title: 'A growing team', body: 'A short, friendly description of this milestone. Rewrite to match your story.' },
      { date: '2025', title: 'Where good ideas grow', body: 'A short, friendly description of this milestone. Rewrite to match your story.' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container" style={{ maxWidth: 720 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            position: 'relative',
            paddingLeft: 32,
          }}
        >
          {/* Vertical line */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 9,
              top: 6,
              bottom: 6,
              width: 2,
              background: 'var(--tps-line)',
            }}
          />
          {(items || []).map((it, i) => (
            <li
              key={i}
              style={{
                position: 'relative',
                paddingBottom: 28,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  left: -32 + 4,
                  top: 6,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: 'var(--tps-primary)',
                  boxShadow: '0 0 0 4px #fff',
                }}
              />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: 'var(--tps-accent-dark)',
                  marginBottom: 4,
                }}
              >
                {it.date}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px' }}>
                {it.title}
              </h3>
              <p style={{ color: 'var(--tps-muted)', lineHeight: 1.7, margin: 0 }}>
                {it.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  ),
};
