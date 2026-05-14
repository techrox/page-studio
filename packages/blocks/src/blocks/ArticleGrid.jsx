// ArticleGrid — grid of article cards (image + tag + headline + excerpt +
// byline). Standard blog/news landing layout.

import { StudioLink as Link } from '../context';

export const ArticleGrid = {
  label: 'Article — grid',
  fields: {
    eyebrow: { type: 'text', label: 'Section eyebrow' },
    heading: { type: 'text', label: 'Section heading' },
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
      label: 'Articles',
      arrayFields: {
        tag: { type: 'text', label: 'Tag' },
        headline: { type: 'text', label: 'Headline' },
        excerpt: { type: 'textarea', label: 'Excerpt', rows: 2 },
        image_url: { type: 'text', label: 'Cover image URL' },
        author: { type: 'text', label: 'Author' },
        date: { type: 'text', label: 'Date' },
        href: { type: 'text', label: 'Link URL' },
      },
      defaultItemProps: {
        tag: 'INSIGHT',
        headline: 'New article headline',
        excerpt: 'A short excerpt that gives the reader a reason to click through.',
        image_url: '',
        author: 'Author name',
        date: 'Mar 2026',
        href: '#',
      },
      getItemSummary: (item, i) => item?.headline || `Article ${i + 1}`,
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
    eyebrow: 'Latest',
    heading: 'Where good ideas grow.',
    columns: 3,
    items: [
      {
        tag: 'STORY',
        headline: 'A catchy article headline goes here',
        excerpt: 'A short, friendly preview that you can rewrite.',
        image_url: '',
        author: 'Author name',
        date: 'Mar 2026',
        href: '#',
      },
      {
        tag: 'GUIDE',
        headline: 'Another headline that earns the click',
        excerpt: 'A short, friendly preview that you can rewrite.',
        image_url: '',
        author: 'Author name',
        date: 'Feb 2026',
        href: '#',
      },
      {
        tag: 'OPINION',
        headline: 'A third headline to round out the row',
        excerpt: 'A short, friendly preview that you can rewrite.',
        image_url: '',
        author: 'Author name',
        date: 'Jan 2026',
        href: '#',
      },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, columns, items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
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
            gap: 24,
          }}
        >
          {(items || []).map((a, i) => (
            <Link
              key={i}
              href={a.href || '#'}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                border: '1px solid var(--tps-line)',
                borderRadius: 'var(--tps-radius)',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'var(--tps-ink)',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
              className="tps-card-hover"
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16 / 10',
                  background: a.image_url ? `url(${a.image_url}) center/cover no-repeat` : '#E2E8F0',
                }}
              />
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {a.tag && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      color: 'var(--tps-accent-dark)',
                    }}
                  >
                    {a.tag}
                  </span>
                )}
                <h3 style={{ fontSize: 19, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                  {a.headline}
                </h3>
                {a.excerpt && (
                  <p style={{ color: 'var(--tps-muted)', lineHeight: 1.6, margin: 0, fontSize: 14, flex: 1 }}>
                    {a.excerpt}
                  </p>
                )}
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    fontSize: 12,
                    color: 'var(--tps-muted)',
                    marginTop: 4,
                  }}
                >
                  {a.author && <span style={{ fontWeight: 600 }}>{a.author}</span>}
                  {a.date && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{a.date}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  ),
};
