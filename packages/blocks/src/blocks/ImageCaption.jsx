// ImageCaption — single image with caption + optional credit. For
// editorial pages.
export const ImageCaption = {
  label: 'Image with caption',
  fields: {
    image_url: { type: 'text', label: 'Image URL' },
    alt: { type: 'text', label: 'Alt text' },
    caption: { type: 'text', label: 'Caption' },
    credit: { type: 'text', label: 'Photo credit (optional)' },
    max_width: {
      type: 'select', label: 'Max width',
      options: [
        { label: 'Narrow (640px)', value: 640 },
        { label: 'Comfortable (820px)', value: 820 },
        { label: 'Wide (940px)', value: 940 },
        { label: 'Full bleed', value: 0 },
      ],
    },
  },
  defaultProps: { image_url: '', alt: '', caption: 'A descriptive caption.', credit: '', max_width: 820 },
  render: ({ image_url, alt, caption, credit, max_width }) => (
    <section className="tps-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className={max_width ? 'tps-container' : ''} style={{ maxWidth: max_width || undefined }}>
        {image_url ? (
          <img src={image_url} alt={alt || ''} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: max_width ? 'var(--tps-radius)' : 0 }} />
        ) : (
          <div style={{ width: '100%', aspectRatio: '16 / 9', background: '#E2E8F0', borderRadius: max_width ? 'var(--tps-radius)' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>Image</div>
        )}
        {(caption || credit) && (
          <figcaption style={{ marginTop: 10, fontSize: 13, color: 'var(--tps-muted)', lineHeight: 1.5, textAlign: 'center', padding: max_width ? 0 : '0 16px' }}>
            {caption}
            {credit && <span style={{ marginLeft: 8, opacity: 0.7 }}>· {credit}</span>}
          </figcaption>
        )}
      </div>
    </section>
  ),
};
