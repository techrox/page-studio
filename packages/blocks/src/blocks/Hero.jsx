// Hero block — eyebrow + heading (HTML allowed) + lede + two CTAs.
// Two visual variants:
//   - 'landing' (default): uses .tps-hero with the radial-gradient halo,
//     dot pattern, and bigger padding — matches the original landing page
//     hero so visitors see no visual shift after admin saves in Puck.
//   - 'simple': plain section padding for sub-page heroes.

import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const Hero = {
  label: 'Hero',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading_html: {
      type: 'textarea',
      label: 'Heading (HTML allowed)',
    },
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
  }) => {
    const isLanding = variant === 'landing';
    const sectionClass = isLanding ? 'tps-hero' : 'tps-section';
    const innerClass = isLanding ? 'tps-hero-inner' : 'tps-container';
    return (
      <section
        className={sectionClass}
        style={isLanding ? { textAlign: align } : { paddingTop: 96, paddingBottom: 56, textAlign: align }}
      >
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
                  <Button type="primary" size="large">
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
