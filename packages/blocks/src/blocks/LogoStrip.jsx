// LogoStrip — "Trusted by" client/partner logos in a single row. Renders
// each logo as an image OR (when no image_url is provided) as styled text,
// so authors can use it before they've uploaded SVGs.

export const LogoStrip = {
  label: 'Logo strip',
  fields: {
    heading: { type: 'text', label: 'Heading (small caps, optional)' },
    items: {
      type: 'array',
      label: 'Logos',
      arrayFields: {
        name: { type: 'text', label: 'Brand name (text fallback)' },
        image_url: { type: 'text', label: 'Image URL (optional)' },
        link: { type: 'text', label: 'Link URL (optional)' },
      },
      defaultItemProps: { name: 'New brand', image_url: '', link: '' },
      getItemSummary: (item, i) => item?.name || `Logo ${i + 1}`,
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
    heading: 'TRUSTED BY',
    items: [
      { name: 'Brand One', image_url: '', link: '' },
      { name: 'Brand Two', image_url: '', link: '' },
      { name: 'Brand Three', image_url: '', link: '' },
      { name: 'Brand Four', image_url: '', link: '' },
      { name: 'Brand Five', image_url: '', link: '' },
    ],
    background: 'soft',
  },
  render: ({ heading, items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`}
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <div className="tps-container" style={{ textAlign: 'center' }}>
        {heading && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: 'var(--tps-muted)',
              marginBottom: 24,
            }}
          >
            {heading}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 40,
          }}
        >
          {(items || []).map((logo, i) => {
            const inner = logo.image_url ? (
              <img
                src={logo.image_url}
                alt={logo.name || ''}
                style={{
                  height: 32,
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'grayscale(100%)',
                  opacity: 0.65,
                  transition: 'all 200ms ease',
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--tps-muted)',
                  letterSpacing: '-0.01em',
                }}
              >
                {logo.name}
              </span>
            );
            return logo.link ? (
              <a
                key={i}
                href={logo.link}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                {inner}
              </a>
            ) : (
              <div key={i}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  ),
};
