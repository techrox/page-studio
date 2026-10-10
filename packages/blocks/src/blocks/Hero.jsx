// Hero block - eyebrow + heading (HTML allowed) + lede + two CTAs.
// Two visual variants:
//   - 'landing' (default): uses .tps-hero with the radial-gradient halo,
//     dot pattern, and bigger padding - matches the original landing page
//     hero so visitors see no visual shift after admin saves in Puck.
//   - 'simple': plain section padding for sub-page heroes.

import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { htmlField } from './HtmlField.jsx';

export const Hero = {
  label: 'Hero',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading_html: htmlField('Heading (HTML allowed)'),
    lede: { type: 'textarea', label: 'Lede' },
    primary_cta_label: { type: 'text', label: 'Primary button label' },
    primary_cta_href: { type: 'text', label: 'Primary button link' },
    secondary_cta_label: { type: 'text', label: 'Secondary button label' },
    secondary_cta_href: { type: 'text', label: 'Secondary button link' },
    align: {
      type: 'radio',
      label: 'Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
    variant: {
      type: 'radio',
      label: 'Visual style',
      options: [
        { label: 'Landing (gradient halo)', value: 'landing' },
        { label: 'Simple (plain section)', value: 'simple' },
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
    background_image: { type: 'text', label: 'Background image URL (optional)' },
    background_overlay: {
      type: 'select',
      label: 'Image overlay effect',
      options: [
        { label: 'Gradient overlay (Recommended)', value: 'gradient' },
        { label: 'Dark tint (50%)', value: 'dark' },
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
    eyebrow: 'Welcome',
    heading_html:
      'Build something <em>worth keeping</em>.',
    lede:
      'A short, friendly intro to your story. Replace this with the one sentence that makes someone want to read on.',
    primary_cta_label: 'Get in touch',
    primary_cta_href: '/contact',
    secondary_cta_label: 'Learn more',
    secondary_cta_href: '/about',
    align: 'left',
    variant: 'landing',
    background: 'white',
    background_image: '',
    background_overlay: 'gradient',
    button_style: 'solid',
  },
  render: ({
    eyebrow,
    heading_html,
    lede,
    primary_cta_label,
    primary_cta_href,
    secondary_cta_label,
    secondary_cta_href,
    align,
    variant,
    background = 'white',
    background_image = '',
    background_overlay = 'gradient',
    button_style = 'solid',
  }) => {
    const isLanding = variant === 'landing';
    const isDark = background === 'dark';
    const isSoft = background === 'soft';

    const sectionClass = `${isLanding ? 'tps-hero' : 'tps-section'}${
      isSoft ? ' tps-section-soft' : ''
    }${isDark ? ' tps-section-dark' : ''}`;
    const innerClass = isLanding ? 'tps-hero-inner' : 'tps-container';

    // Background image & gradient overlay handling
    const bgUrl = String(background_image || '').trim();
    const hasBgImage = Boolean(bgUrl);

    let overlayBg = '';
    if (hasBgImage) {
      if (background_overlay === 'gradient') {
        overlayBg = isDark
          ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.94) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.86) 0%, rgba(255, 255, 255, 0.94) 100%)';
      } else if (background_overlay === 'dark') {
        overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6))';
      } else if (background_overlay === 'subtle') {
        overlayBg = 'linear-gradient(rgba(15, 23, 42, 0.2), rgba(15, 23, 42, 0.2))';
      }
    }

    const heroInlineStyle = {
      ...(isLanding ? { textAlign: align } : { paddingTop: 96, paddingBottom: 56, textAlign: align }),
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

    // Button style class
    const buttonClass =
      button_style === 'gradient'
        ? 'tps-btn--gradient'
        : button_style === 'gradient-cyan'
        ? 'tps-btn--gradient tps-btn--gradient-cyan'
        : button_style === 'gradient-purple'
        ? 'tps-btn--gradient tps-btn--gradient-purple'
        : '';

    return (
      <section className={sectionClass} style={heroInlineStyle}>
        <div className={innerClass} style={isLanding ? undefined : { maxWidth: 940 }}>
          {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
          {heading_html && (
            <h1
              className="tps-h1"
              style={{ marginTop: 12, maxWidth: align === 'left' ? 920 : undefined }}
              dangerouslySetInnerHTML={{ __html: heading_html }}
            />
          )}
          {lede && (
            <p
              className="tps-lede"
              style={{
                marginTop: 16,
                maxWidth: align === 'center' ? 720 : 720,
                marginLeft: align === 'center' ? 'auto' : undefined,
                marginRight: align === 'center' ? 'auto' : undefined,
              }}
            >
              {lede}
            </p>
          )}
          {(primary_cta_label || secondary_cta_label) && (
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 32,
                justifyContent: align === 'center' ? 'center' : 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              {primary_cta_label && (
                <Link href={primary_cta_href || '/contact'}>
                  <Button
                    type="primary"
                    size="large"
                    className={buttonClass}
                  >
                    {primary_cta_label} <ArrowRightOutlined />
                  </Button>
                </Link>
              )}
              {secondary_cta_label && (
                <Link href={secondary_cta_href || '/services'}>
                  <Button size="large">{secondary_cta_label}</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    );
  },
};
