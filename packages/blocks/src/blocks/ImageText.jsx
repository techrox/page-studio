// ImageText — image on one side, heading/body/CTA on the other. Classic
// alternating "feature" section. Image position is editable so you can flip
// it to break visual rhythm.

import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const ImageText = {
  label: 'Image + text',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    body: { type: 'textarea', label: 'Body', rows: 4 },
    image_url: { type: 'text', label: 'Image URL' },
    image_alt: { type: 'text', label: 'Image alt text' },
    image_position: {
      type: 'radio',
      label: 'Image position',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    cta_label: { type: 'text', label: 'Button label' },
    cta_href: { type: 'text', label: 'Button link' },
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
    eyebrow: 'Feature',
    heading: 'A focused capability',
    body:
      'Describe what this section is about — what value it delivers, and why it matters to the reader.',
    image_url: '',
    image_alt: '',
    image_position: 'left',
    cta_label: 'Learn more',
    cta_href: '/services',
    background: 'white',
  },
  render: ({
    eyebrow,
    heading,
    body,
    image_url,
    image_alt,
    image_position,
    cta_label,
    cta_href,
    background,
  }) => {
    const imageEl = image_url ? (
      <img
        src={image_url}
        alt={image_alt || ''}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: 'var(--tps-radius)',
          display: 'block',
        }}
      />
    ) : (
      <div
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          background: '#E2E8F0',
          borderRadius: 'var(--tps-radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94A3B8',
          fontSize: 13,
        }}
      >
        Image placeholder
      </div>
    );
    const textEl = (
      <div>
        {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
        {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
        {body && <p className="tps-lede">{body}</p>}
        {cta_label && (
          <Link href={cta_href || '/contact'}>
            <Button type="primary" size="large" style={{ marginTop: 8 }}>
              {cta_label} <ArrowRightOutlined />
            </Button>
          </Link>
        )}
      </div>
    );
    return (
      <section
        className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
        style={{ paddingTop: 56, paddingBottom: 56 }}
      >
        <div className="tps-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 48,
              alignItems: 'center',
            }}
          >
            {image_position === 'left' ? (
              <>
                {imageEl}
                {textEl}
              </>
            ) : (
              <>
                {textEl}
                {imageEl}
              </>
            )}
          </div>
        </div>
      </section>
    );
  },
};
