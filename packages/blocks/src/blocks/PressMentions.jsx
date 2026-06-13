// PressMentions — "As featured in" press logos. Same pattern as
// LogoStrip but the heading copy and visual treatment match journalism.
export const PressMentions = {
  label: 'Press mentions',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array', label: 'Outlets',
      arrayFields: {
        name: { type: 'text', label: 'Outlet name' },
        image_url: { type: 'text', label: 'Logo image URL (optional)' },
        link: { type: 'text', label: 'Article URL (optional)' },
        quote: { type: 'text', label: 'Pull-quote (optional)' },
      },
      defaultItemProps: { name: 'Outlet', image_url: '', link: '', quote: '' },
      getItemSummary: (it, i) => it?.name || `Outlet ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    heading: 'As featured in',
    items: [
      { name: 'Outlet One', image_url: '', link: '', quote: '' },
      { name: 'Outlet Two', image_url: '', link: '', quote: '' },
      { name: 'Outlet Three', image_url: '', link: '', quote: '' },
    ],
    background: 'soft',
  },
  render: ({ heading, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`} style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="tps-container" style={{ textAlign: 'center' }}>
        {heading && <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--tps-muted)', marginBottom: 28, textTransform: 'uppercase' }}>{heading}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
          {(items || []).map((p, i) => {
            const inner = p.image_url ? (
              <img src={p.image_url} alt={p.name} style={{ height: 28, opacity: 0.7, filter: 'grayscale(100%)' }} />
            ) : (
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: 'var(--tps-ink)', fontStyle: 'italic' }}>{p.name}</span>
            );
            return p.link ? <a key={i} href={p.link} target="_blank" rel="noreferrer">{inner}</a> : <span key={i}>{inner}</span>;
          })}
        </div>
      </div>
    </section>
  ),
};
