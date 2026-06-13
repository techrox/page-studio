// ImageOverlayCards — full-bleed image cards with text overlay. The
// "category" / "explore" pattern. Click-through to a destination URL.

import { StudioLink as Link } from '../context';
import { ArrowRightOutlined } from '@ant-design/icons';

export const ImageOverlayCards = {
  label: 'Image overlay cards',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading: { type: 'text', label: 'Heading (optional)' },
    columns: {
      type: 'radio',
      label: 'Columns',
      options: [
        { label: '2', value: 2 },
        { label: '3', value: 3 },
      ],
    },
    items: {
      type: 'array',
      label: 'Cards',
      arrayFields: {
        kicker: { type: 'text', label: 'Kicker (small label)' },
        title: { type: 'text', label: 'Title' },
        body: { type: 'textarea', label: 'Body', rows: 2 },
        image_url: { type: 'text', label: 'Background image URL' },
        href: { type: 'text', label: 'Link URL' },
      },
      defaultItemProps: {
        kicker: 'CATEGORY',
        title: 'New card',
        body: 'Short description.',
        image_url: '',
        href: '#',
      },
      getItemSummary: (item, i) => item?.title || `Card ${i + 1}`,
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
    eyebrow: 'Explore',
    heading: 'Pick a place to start.',
    columns: 3,
    items: [
      { kicker: 'CATEGORY', title: 'A category title', body: 'A short, friendly description.', image_url: '', href: '/services' },
      { kicker: 'CATEGORY', title: 'Another category', body: 'A short, friendly description.', image_url: '', href: '/services' },
      { kicker: 'CATEGORY', title: 'One more option', body: 'A short, friendly description.', image_url: '', href: '/services' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, columns, items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`}
      style={{ paddingTop: 64, paddingBottom: 64 }}
    >
      <div className="tps-container">
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 40 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${columns === 2 ? 360 : 280}px, 100%), 1fr))`,
            gap: 16,
          }}
        >
          {(items || []).map((c, i) => (
            <Link
              key={i}
              href={c.href || '#'}
              style={{
                position: 'relative',
                display: 'block',
                aspectRatio: '4 / 5',
                borderRadius: 'var(--tps-radius)',
                overflow: 'hidden',
                textDecoration: 'none',
                color: '#fff',
                background: c.image_url
                  ? `linear-gradient(180deg, rgba(15, 23, 42, 0.05) 0%, rgba(15, 23, 42, 0.85) 80%), url(${c.image_url}) center/cover no-repeat`
                  : 'linear-gradient(180deg, var(--tps-primary, #0b60d8) 0%, var(--tps-ink, #0F172A) 100%)',
              }}
              className="tps-overlay-card"
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                {c.kicker && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: '#F59E0B',
                      marginBottom: 8,
                    }}
                  >
                    {c.kicker}
                  </div>
                )}
                <h3
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    margin: '0 0 8px',
                    lineHeight: 1.2,
                  }}
                >
                  {c.title}
                </h3>
                {c.body && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      lineHeight: 1.5,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {c.body}
                  </p>
                )}
                <div
                  style={{
                    marginTop: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  Explore <ArrowRightOutlined />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  ),
};
