// ArticleFeatured — large hero-style featured article. Big image on one
// side, tag/headline/excerpt/byline + CTA on the other. The "lead story"
// of a blog or news section.

import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const ArticleFeatured = {
  label: 'Article — featured',
  fields: {
    eyebrow: { type: 'text', label: 'Section eyebrow (optional)' },
    tag: { type: 'text', label: 'Article tag (small, coloured)' },
    headline: { type: 'text', label: 'Headline' },
    excerpt: { type: 'textarea', label: 'Excerpt', rows: 3 },
    image_url: { type: 'text', label: 'Cover image URL' },
    image_alt: { type: 'text', label: 'Image alt text' },
    author: { type: 'text', label: 'Author' },
    date: { type: 'text', label: 'Published date (e.g. Mar 2026)' },
    read_minutes: { type: 'text', label: 'Read time (e.g. 6 min)' },
    link_label: { type: 'text', label: 'Read button label' },
    link_href: { type: 'text', label: 'Article URL' },
    image_position: {
      type: 'radio',
      label: 'Image position',
      options: [
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left' },
      ],
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
    eyebrow: 'Featured',
    tag: 'STORY',
    headline: 'A catchy headline that makes a reader want to click.',
    excerpt:
      'A short, one-paragraph excerpt that previews the story. Replace this with your own.',
    image_url: '',
    image_alt: '',
    author: 'Author name',
    date: 'Mar 2026',
    read_minutes: '6 min',
    link_label: 'Read more',
    link_href: '#',
    image_position: 'right',
    background: 'white',
  },
  render: ({
    eyebrow,
    tag,
    headline,
    excerpt,
    image_url,
    image_alt,
    author,
    date,
    read_minutes,
    link_label,
    link_href,
    image_position,
    background,
  }) => {
    const image = (
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          background: image_url ? `url(${image_url}) center/cover no-repeat` : '#0F172A',
          borderRadius: 'var(--tps-radius)',
          backgroundClip: 'padding-box',
        }}
        role={image_url ? 'img' : undefined}
        aria-label={image_url ? image_alt || '' : undefined}
      >
        {!image_url && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              fontSize: 14,
            }}
          >
            Cover image
          </div>
        )}
      </div>
    );
    const text = (
      <div>
        {tag && (
          <span
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: '#fff',
              background: 'var(--tps-primary)',
              padding: '4px 10px',
              borderRadius: 4,
              marginBottom: 16,
            }}
          >
            {tag}
          </span>
        )}
        <h2
          className="tps-h2"
          style={{ marginTop: 0, marginBottom: 16, lineHeight: 1.15 }}
        >
          {headline}
        </h2>
        {excerpt && <p className="tps-lede" style={{ marginBottom: 24 }}>{excerpt}</p>}
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            color: 'var(--tps-muted)',
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          {author && <span style={{ fontWeight: 600 }}>{author}</span>}
          {date && (
            <>
              <span aria-hidden>·</span>
              <span>{date}</span>
            </>
          )}
          {read_minutes && (
            <>
              <span aria-hidden>·</span>
              <span>{read_minutes} read</span>
            </>
          )}
        </div>
        {link_label && (
          <Link href={link_href || '#'}>
            <Button type="primary" size="large">
              {link_label} <ArrowRightOutlined />
            </Button>
          </Link>
        )}
      </div>
    );

    return (
      <section
        className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${
          background === 'dark' ? ' tps-section-dark' : ''
        }`}
        style={{ paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="tps-container">
          {eyebrow && (
            <div style={{ marginBottom: 32 }}>
              <span className="tps-eyebrow">{eyebrow}</span>
            </div>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
              gap: 48,
              alignItems: 'center',
            }}
          >
            {image_position === 'left' ? (
              <>
                {image}
                {text}
              </>
            ) : (
              <>
                {text}
                {image}
              </>
            )}
          </div>
        </div>
      </section>
    );
  },
};
