// MapEmbed — Google Maps iframe embed. Author pastes a Maps embed URL
// (the long iframe src from Maps "Share > Embed a map > HTML").
export const MapEmbed = {
  label: 'Map (Google Maps)',
  fields: {
    embed_url: { type: 'text', label: 'Google Maps embed URL' },
    height: {
      type: 'select', label: 'Height',
      options: [
        { label: 'Compact (280px)', value: 280 },
        { label: 'Standard (420px)', value: 420 },
        { label: 'Large (560px)', value: 560 },
      ],
    },
    caption: { type: 'text', label: 'Caption (optional)' },
  },
  defaultProps: {
    embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77622.9!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzUnNDAuNCJF!5e0!3m2!1sen!2sin!4v0',
    height: 420,
    caption: '',
  },
  render: ({ embed_url, height, caption }) => (
    <section className="tps-section" style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className="tps-container">
        <div style={{ borderRadius: 'var(--tps-radius)', overflow: 'hidden', border: '1px solid var(--tps-line)' }}>
          {embed_url ? (
            <iframe src={embed_url} title="Map" width="100%" height={height} style={{ border: 0, display: 'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <div style={{ height, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: 13 }}>
              Paste a Google Maps embed URL in the field on the right.
            </div>
          )}
        </div>
        {caption && <p style={{ marginTop: 10, fontSize: 13, color: 'var(--tps-muted)', textAlign: 'center' }}>{caption}</p>}
      </div>
    </section>
  ),
};
