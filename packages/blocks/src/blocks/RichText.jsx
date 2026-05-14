// RichText — paragraph(s) of body copy. Accepts HTML for inline emphasis,
// links, lists. Use for intros, legal pages, free-form content.

export const RichText = {
  label: 'Rich text',
  fields: {
    html: {
      type: 'textarea',
      label: 'HTML content',
    },
    align: {
      type: 'radio',
      label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    maxWidth: {
      type: 'select',
      label: 'Max width',
      options: [
        { label: 'Narrow (680px)', value: 680 },
        { label: 'Comfortable (820px)', value: 820 },
        { label: 'Wide (940px)', value: 940 },
        { label: 'Full', value: 0 },
      ],
    },
  },
  defaultProps: {
    html: '<p>Body copy goes here. You can include <strong>bold</strong>, <em>italics</em>, <a href="#">links</a>, and <code>inline</code> styles.</p>',
    align: 'left',
    maxWidth: 820,
  },
  render: ({ html, align, maxWidth }) => (
    <section className="tps-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div
        className="tps-container"
        style={{
          maxWidth: maxWidth || undefined,
          textAlign: align,
          color: 'var(--tps-ink-2)',
          lineHeight: 1.75,
          fontSize: 16.5,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  ),
};
