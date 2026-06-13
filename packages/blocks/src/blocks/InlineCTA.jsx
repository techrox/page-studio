// InlineCTA — compact one-line CTA strip. Smaller than CTABanner; sits
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
      type: 'radio', label: 'Background',
      options: [{ label: 'Soft', value: 'soft' }, { label: 'Primary', value: 'primary' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    headline: 'Want to chat?',
    body: 'A short, friendly nudge that you can rewrite.',
    button_label: 'Get in touch',
    button_href: '/contact',
    background: 'soft',
  },
  render: ({ headline, body, button_label, button_href, background }) => {
    const primary = background === 'primary';
    return (
      <section className={`tps-section${background === 'dark' ? ' tps-section-dark' : ''}`} style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="tps-container">
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, padding: '20px 28px',
            background: primary ? 'var(--tps-primary)' : 'var(--tps-bg-soft)',
            color: primary ? '#fff' : 'var(--tps-ink)',
            border: primary ? 'none' : '1px solid var(--tps-line)',
            borderRadius: 'var(--tps-radius)',
          }}>
            <div style={{ flex: 1, minWidth: 'min(240px, 100%)' }}>
              {headline && <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{headline}</div>}
              {body && <div style={{ fontSize: 14, opacity: 0.85 }}>{body}</div>}
            </div>
            {button_label && (
              <Link href={button_href || '/contact'}>
                <Button type={primary ? 'default' : 'primary'} size="large">
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
