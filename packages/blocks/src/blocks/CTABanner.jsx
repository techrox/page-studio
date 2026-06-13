// CTABanner — full-width call-to-action with tagline + heading + body + button.

import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export const CTABanner = {
  label: 'CTA banner',
  fields: {
    tagline: { type: 'text', label: 'Tagline (small caps)' },
    heading_html: { type: 'textarea', label: 'Heading (HTML allowed)' },
    body: { type: 'textarea', label: 'Body' },
    button_label: { type: 'text', label: 'Button label' },
    button_href: { type: 'text', label: 'Button link' },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
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
  },
  render: ({ tagline, heading_html, body, button_label, button_href, background }) => {
    const dark = background === 'dark';
    return (
      <section
        className={`tps-section ${!dark ? 'tps-section-soft' : 'tps-section-dark'}`}
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="tps-container" style={{ textAlign: 'center', maxWidth: 720 }}>
          {tagline && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2,
                color: dark ? 'var(--tps-accent)' : 'var(--tps-accent-dark)',
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
              <Button type="primary" size="large">
                {button_label} <ArrowRightOutlined />
              </Button>
            </Link>
          )}
        </div>
      </section>
    );
  },
};
