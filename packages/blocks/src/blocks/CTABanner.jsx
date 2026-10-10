// CTABanner — full-width call-to-action with tagline + heading + body + button.

import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { htmlField } from './HtmlField.jsx';

export const CTABanner = {
  label: 'CTA banner',
  fields: {
    tagline: { type: 'text', label: 'Tagline (small caps)' },
    heading_html: htmlField('Heading (HTML allowed)'),
    body: { type: 'textarea', label: 'Body' },
    button_label: { type: 'text', label: 'Button label' },
    button_href: { type: 'text', label: 'Button link' },
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
    tagline: 'READY WHEN YOU ARE',
    heading_html: 'Make it count.<br />Start the conversation.',
    body:
      'A clear, friendly call to action. Replace this with the one thing you want a reader to do next.',
    button_label: 'Get in touch',
    button_href: '/contact',
    background: 'soft',
    background_image: '',
    background_overlay: 'gradient',
    button_style: 'solid',
  },
  render: ({
    tagline,
    heading_html,
    body,
    button_label,
    button_href,
    background = 'soft',
    background_image = '',
    background_overlay = 'gradient',
    button_style = 'solid',
  }) => {
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

    const ctaInlineStyle = {
      paddingTop: 80,
      paddingBottom: 80,
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

    const buttonClass =
      button_style === 'gradient'
        ? 'tps-btn--gradient'
        : button_style === 'gradient-cyan'
        ? 'tps-btn--gradient tps-btn--gradient-cyan'
        : button_style === 'gradient-purple'
        ? 'tps-btn--gradient tps-btn--gradient-purple'
        : '';

    return (
      <section
        className={`tps-section ${isSoft ? 'tps-section-soft' : ''}${isDark ? ' tps-section-dark' : ''}`}
        style={ctaInlineStyle}
      >
        <div className="tps-container" style={{ textAlign: 'center', maxWidth: 720 }}>
          {tagline && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: isDark ? 'var(--tps-accent)' : 'var(--tps-accent-dark)',
                marginBottom: 12,
              }}
            >
              {tagline}
            </div>
          )}
          {heading_html && (
            <h2
              className="tps-h2"
              dangerouslySetInnerHTML={{ __html: heading_html }}
            />
          )}
          {body && (
            <p className="tps-lede" style={{ margin: '16px auto 32px' }}>
              {body}
            </p>
          )}
          {button_label && (
            <Link href={button_href || '/contact'}>
              <Button type="primary" size="large" className={buttonClass}>
                {button_label} <ArrowRightOutlined />
              </Button>
            </Link>
          )}
        </div>
      </section>
    );
  },
};
