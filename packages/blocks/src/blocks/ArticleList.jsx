// ArticleList — text-heavy chronological list (no images). Best for an
// archive page or sidebar "more posts" rail. Each row is a date + headline
// + one-line excerpt.

import { StudioLink as Link } from '../context';
import { ArrowRightOutlined } from '@ant-design/icons';

export const ArticleList = {
  label: 'Article — list',
  fields: {
    eyebrow: { type: 'text', label: 'Section eyebrow' },
    heading: { type: 'text', label: 'Section heading' },
    items: {
      type: 'array',
      label: 'Articles',
      arrayFields: {
        date: { type: 'text', label: 'Date' },
        tag: { type: 'text', label: 'Tag (optional)' },
        headline: { type: 'text', label: 'Headline' },
        excerpt: { type: 'text', label: 'One-line excerpt' },
        href: { type: 'text', label: 'Link URL' },
      },
      defaultItemProps: {
        date: 'Mar 2026',
        tag: 'GUIDE',
        headline: 'New article',
        excerpt: 'One-line description.',
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
    eyebrow: 'Archive',
    heading: 'All articles.',
    items: [
      { date: 'Mar 2026', tag: 'STORY', headline: 'A catchy article headline goes here', excerpt: 'A one-line preview you can rewrite.', href: '#' },
      { date: 'Feb 2026', tag: 'GUIDE', headline: 'Another headline that earns the click', excerpt: 'A one-line preview you can rewrite.', href: '#' },
      { date: 'Jan 2026', tag: 'OPINION', headline: 'A third headline to fill out the list', excerpt: 'A one-line preview you can rewrite.', href: '#' },
      { date: 'Dec 2025', tag: 'STORY', headline: 'One more headline for good measure', excerpt: 'A one-line preview you can rewrite.', href: '#' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container" style={{ maxWidth: 820 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {(items || []).map((a, i) => (
            <li
              key={i}
              style={{
                borderBottom: '1px solid var(--tps-line)',
              }}
            >
              <Link
                href={a.href || '#'}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr auto',
                  alignItems: 'baseline',
                  gap: 24,
                  padding: '20px 0',
                  textDecoration: 'none',
                  color: 'var(--tps-ink)',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--tps-muted)',
                    fontWeight: 600,
                  }}
                >
                  {a.date}
                </div>
                <div>
                  {a.tag && (
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        color: 'var(--tps-accent-dark)',
                        marginRight: 12,
                      }}
                    >
                      {a.tag}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {a.headline}
                  </span>
                  {a.excerpt && (
                    <div
                      style={{
                        marginTop: 4,
                        color: 'var(--tps-muted)',
                        fontSize: 14,
                      }}
                    >
                      {a.excerpt}
                    </div>
                  )}
                </div>
                <ArrowRightOutlined style={{ color: 'var(--tps-muted)', fontSize: 14 }} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  ),
};
