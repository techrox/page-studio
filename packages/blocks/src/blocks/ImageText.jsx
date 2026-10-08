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
    image_ratio: {
      type: 'select',
      label: 'Image ratio',
      options: [
        { label: 'Auto / Original', value: 'auto' },
        { label: '1:1 Square', value: '1/1' },
        { label: '4:3 Standard', value: '4/3' },
        { label: '3:2 Classic', value: '3/2' },
        { label: '16:9 Landscape / Widescreen', value: '16/9' },
        { label: '21:9 Ultrawide', value: '21/9' },
        { label: '3:4 Portrait', value: '3/4' },
        { label: '9:16 Vertical / Story', value: '9/16' },
      ],
    },
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
        { label: 'Dark', value: 'dark' },
      ],
    },
    background_image: { type: 'text', label: 'Background image URL (optional)' },
    background_overlay: {
      type: 'select',
      label: 'Image overlay effect',
      options: [
        { label: 'Gradient overlay (Recommended)', value: 'gradient' },
        { label: 'Dark tint (60%)', value: 'dark' },
        { label: 'Subtle tint (20%)', value: 'subtle' },
        { label: 'No overlay', value: 'none' },
      ],
    },
    button_style: {
      type: 'select',
      label: 'Button style',
      options: [
        { label: 'Brand primary (Solid)', value: 'solid' },
        { label: 'Gradient (Primary to Accent)', value: 'gradient' },
        { label: 'Gradient (Cyan to Blue)', value: 'gradient-cyan' },
        { label: 'Gradient (Purple to Pink)', value: 'gradient-purple' },
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
    image_ratio: 'auto',
    image_position: 'left',
    cta_label: 'Learn more',
    cta_href: '/services',
    background: 'white',
    background_image: '',
    background_overlay: 'gradient',
    button_style: 'solid',
  },
  render: ({
    eyebrow,
    heading,
    body,
    image_url,
    image_alt,
    image_ratio = 'auto',
    image_position,
    cta_label,
    cta_href,
    background = 'white',
    background_image = '',
    background_overlay = 'gradient',
    button_style = 'solid',
  }) => {
    // Normalise ratio strings like '16:9' or '16/9' or '16 / 9' into CSS aspect-ratio values ('16 / 9')
    const normalizedRatio = (() => {
      if (!image_ratio || image_ratio === 'auto') return 'auto';
      const clean = String(image_ratio).trim();
      if (clean.includes(':')) {
        const [w, h] = clean.split(':').map((s) => s.trim());
        return `${w} / ${h}`;
      }
      if (clean.includes('/')) {
        const [w, h] = clean.split('/').map((s) => s.trim());
        return `${w} / ${h}`;
      }
      return clean;
    })();

    const imageStyle = {
      width: '100%',
      borderRadius: 'var(--tps-radius)',
      display: 'block',
      ...(normalizedRatio !== 'auto'
        ? {
            aspectRatio: normalizedRatio,
            objectFit: 'cover',
            height: '100%',
          }
        : {
            height: 'auto',
          }),
    };

    const imageEl = image_url ? (
      <img
        src={image_url}
        alt={image_alt || ''}
        style={imageStyle}
      />
    ) : (
      <div
        className="tps-image-text__placeholder"
        style={{
          width: '100%',
          aspectRatio: normalizedRatio !== 'auto' ? normalizedRatio : '4 / 3',
          background: 'var(--tps-line)',
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
    const buttonClass =
      button_style === 'gradient'
        ? 'tps-btn--gradient'
        : button_style === 'gradient-cyan'
        ? 'tps-btn--gradient tps-btn--gradient-cyan'
        : button_style === 'gradient-purple'
        ? 'tps-btn--gradient tps-btn--gradient-purple'
        : '';

    const textEl = (
      <div>
        {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
        {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
        {body && <p className="tps-lede">{body}</p>}
        {cta_label && (
          <Link href={cta_href || '/contact'}>
            <Button
              type="primary"
              size="large"
              className={buttonClass}
              style={{ marginTop: 8 }}
            >
              {cta_label} <ArrowRightOutlined />
            </Button>
          </Link>
        )}
      </div>
    );

    const isDark = background === 'dark';
    const isSoft = background === 'soft';

    const bgUrl = String(background_image || '').trim();
    const hasBgImage = Boolean(bgUrl);

    let overlayBg = '';
    if (hasBgImage) {
      if (background_overlay === 'gradient') {
        overlayBg = isDark
          ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.94) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.95) 100%)';
      } else if (background_overlay === 'dark') {
        overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6))';
      } else if (background_overlay === 'subtle') {
        overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.2))';
      }
    }

    const sectionStyle = {
      paddingTop: 56,
      paddingBottom: 56,
      ...(hasBgImage
        ? {
            backgroundImage: overlayBg
              ? `${overlayBg}, url("${bgUrl}")`
              : `url("${bgUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            ...(background_overlay === 'dark' ? { color: '#ffffff' } : {}),
          }
        : {
            background: isDark ? '#0F172A' : isSoft ? undefined : 'var(--tps-bg, #ffffff)',
          }),
    };

    return (
      <section
        className={`tps-section ${isSoft ? 'tps-section-soft' : ''}${isDark ? ' tps-section-dark' : ''}`}
        style={sectionStyle}
      >
        <div className="tps-container">
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
