// RawHtml — escape hatch for pasting in arbitrary markup (embeds, custom
// layouts, etc.). Wrapped in a container so it inherits site spacing.

export const RawHtml = {
  label: 'Custom HTML',
  fields: {
    html: { type: 'textarea', label: 'HTML' },
    contained: {
      type: 'radio',
      label: 'Width',
      options: [
        { label: 'Inside container', value: 'contained' },
        { label: 'Full bleed', value: 'full' },
      ],
    },
  },
  defaultProps: {
    html: '<div style="padding: 24px; border: 1px dashed #cbd5e1; text-align: center; color: #64748b;">Custom HTML block — replace with your own markup</div>',
    contained: 'contained',
  },
  render: ({ html, contained }) => {
    if (contained === 'full') {
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
    return (
      <section className="tps-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
        <div className="tps-container" dangerouslySetInnerHTML={{ __html: html }} />
      </section>
    );
  },
};
