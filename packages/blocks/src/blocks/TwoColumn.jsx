// TwoColumn — generic side-by-side text columns with editable headings + body.

export const TwoColumn = {
  label: 'Two columns',
  fields: {
    left_heading: { type: 'text', label: 'Left heading' },
    left_body: { type: 'textarea', label: 'Left body' },
    right_heading: { type: 'text', label: 'Right heading' },
    right_body: { type: 'textarea', label: 'Right body' },
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
    left_heading: 'Column one',
    left_body: 'Body copy for the first column.',
    right_heading: 'Column two',
    right_body: 'Body copy for the second column.',
    background: 'white',
  },
  render: ({ left_heading, left_body, right_heading, right_body, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
          }}
        >
          <div>
            {left_heading && (
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                {left_heading}
              </h3>
            )}
            {left_body && (
              <p style={{ color: 'var(--tps-muted)', lineHeight: 1.7, fontSize: 16 }}>
                {left_body}
              </p>
            )}
          </div>
          <div>
            {right_heading && (
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                {right_heading}
              </h3>
            )}
            {right_body && (
              <p style={{ color: 'var(--tps-muted)', lineHeight: 1.7, fontSize: 16 }}>
                {right_body}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  ),
};
