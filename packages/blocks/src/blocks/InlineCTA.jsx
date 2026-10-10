// InlineCTA - compact one-line CTA strip. Smaller than CTABanner; sits
// between content sections to nudge conversion without dominating.
import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const InlineCTA = {
  label: 'Inline CTA',
  fields: {
    headline: { type: 'text', label: 'Headline' },
    body: { type: 'text', label: 'Body (one line)' },
    button_label: { type: 'text', label: 'Button label' },
    button_href: { type: 'text', label: 'Button URL' },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
        { label: 'Primary', value: 'primary' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    background_image: { type: 'text', label: 'Background image URL (optional)' },
    button_style: {
      type: 'select',
      label: 'Button style',
      options: [
        { label: 'Default / Auto', value: 'solid' },
        { label: 'Gradient (Primary to Accent)', value: 'gradient' },
        { label: 'Gradient (Cyan to Blue)', value: 'gradient-cyan' },
        { label: 'Gradient (Purple to Pink)', value: 'gradient-purple' },
      ],
    },
  },
  defaultProps: {
    headline: 'Want to chat?',
    body: 'A short, friendly nudge that you can rewrite.',
    button_label: 'Get in touch',
    button_href: '/contact',
    background: 'soft',
    background_image: '',
    button_style: 'solid',
  },
  render: ({
    headline,
    body,
    button_label,
    button_href,
    background = 'soft',
    background_image = '',
    button_style = 'solid',
  }) => {
    const isPrimary = background === 'primary';
    const isDark = background === 'dark';
    const isSoft = background === 'soft';

    const bgUrl = String(background_image || '').trim();
    const hasBgImage = Boolean(bgUrl);

    const buttonClass =
      button_style === 'gradient'
        ? 'tps-btn--gradient'
        : button_style === 'gradient-cyan'
        ? 'tps-btn--gradient tps-btn--gradient-cyan'
        : button_style === 'gradient-purple'
        ? 'tps-btn--gradient tps-btn--gradient-purple'
        : '';

    const cardStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '20px 28px',
      borderRadius: 'var(--tps-radius)',
      ...(hasBgImage
        ? {
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url("${bgUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            border: 'none',
          }
        : isPrimary
        ? {
            background: 'var(--tps-primary)',
            color: '#fff',
            border: 'none',
          }
        : isDark
        ? {
            background: '#0F172A',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)',
          }
        : isSoft
        ? {
            background: 'var(--tps-bg-soft)',
            color: 'var(--tps-ink)',
            border: '1px solid var(--tps-line)',
          }
        : {
            background: 'var(--tps-bg, #ffffff)',
            color: 'var(--tps-ink)',
            border: '1px solid var(--tps-line)',
          }),
    };

    return (
      <section
        className={`tps-section${isDark ? ' tps-section-dark' : ''}`}
        style={{ paddingTop: 24, paddingBottom: 24 }}
      >
        <div className="tps-container">
          <div className="tps-inline-cta-card tps-card" style={cardStyle}>
            <div style={{ flex: 1, minWidth: 'min(240px, 100%)' }}>
              {headline && <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{headline}</div>}
              {body && <div style={{ fontSize: 14, opacity: 0.85 }}>{body}</div>}
            </div>
            {button_label && (
              <Link href={button_href || '/contact'}>
                <Button
                  type={isPrimary || hasBgImage ? 'default' : 'primary'}
                  size="large"
                  className={buttonClass}
                >
                  {button_label} <ArrowRightOutlined />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  },
};
