// SectionHeader — eyebrow + heading + optional lede. The standard "what
// follows is a major section" introduction used across the site.

export const SectionHeader = {
  label: 'Section header',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading_html: {
      type: 'textarea',
      label: 'Heading (HTML allowed)',
    },
    lede: { type: 'textarea', label: 'Lede (optional)' },
    align: {
      type: 'radio',
      label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
      ],
    },
    spacing: {
      type: 'radio',
      label: 'Vertical spacing',
      options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Standard', value: 'standard' },
        { label: 'Generous', value: 'generous' },
      ],
    },
  },
  defaultProps: {
    eyebrow: 'What we do',
    heading_html: 'Built for what’s next.',
    lede: '',
    align: 'left',
    background: 'white',
    spacing: 'standard',
  },
  render: ({ eyebrow, heading_html, lede, align, background, spacing }) => {
    const pad =
      spacing === 'compact' ? 32 : spacing === 'generous' ? 96 : 56;
    return (
      <section
        className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
        style={{ paddingTop: pad, paddingBottom: pad }}
      >
        <div
          className="tps-container"
          style={{ textAlign: align, maxWidth: align === 'center' ? 720 : undefined }}
        >
          {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
          {heading_html && (
            <h2
              className="tps-h2"
              style={{ marginTop: 8 }}
              dangerouslySetInnerHTML={{ __html: heading_html }}
            />
          )}
          {lede && (
            <p className="tps-lede" style={{ marginTop: 12 }}>
              {lede}
            </p>
          )}
        </div>
      </section>
    );
  },
};
