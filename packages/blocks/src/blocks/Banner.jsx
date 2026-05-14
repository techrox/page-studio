// Banner — full-width announcement strip. Use for "we're hiring", a new
// service launch, an event invite, etc. Variant controls the colour
// scheme; the optional link turns it into a clickable strip.

import { StudioLink as Link } from '../context';
import { ArrowRightOutlined } from '@ant-design/icons';

// `info` is the "brand-coloured" variant. It reads --tps-primary-soft for the
// background (so a brand without a soft tint defined falls back to the teal
// palette) and --tps-primary for the foreground/accent.
const VARIANTS = {
  info: {
    bg: 'var(--tps-primary-soft, #E0F2F1)',
    fg: 'var(--tps-primary, #0F766E)',
    accent: 'var(--tps-primary, #0F766E)',
  },
  success: { bg: '#DCFCE7', fg: '#15803D', accent: '#15803D' },
  warning: { bg: '#FEF3C7', fg: '#92400E', accent: '#B45309' },
  dark: {
    bg: 'var(--tps-ink, #0F172A)',
    fg: '#FFFFFF',
    accent: 'var(--tps-accent, #F59E0B)',
  },
};

export const Banner = {
  label: 'Banner',
  fields: {
    variant: {
      type: 'select',
      label: 'Style',
      options: [
        { label: 'Info (teal)', value: 'info' },
        { label: 'Success (green)', value: 'success' },
        { label: 'Warning (amber)', value: 'warning' },
        { label: 'Dark', value: 'dark' },
      ],
    },
    label: { type: 'text', label: 'Small label (left, optional)' },
    title: { type: 'text', label: 'Title' },
    body: { type: 'text', label: 'Body (one line)' },
    link_label: { type: 'text', label: 'Link label (optional)' },
    link_href: { type: 'text', label: 'Link URL' },
  },
  defaultProps: {
    variant: 'info',
    label: 'NEW',
    title: 'Something fresh just landed',
    body: 'A short, one-line update you can rewrite.',
    link_label: 'Learn more',
    link_href: '/services',
  },
  render: ({ variant, label, title, body, link_label, link_href }) => {
    const v = VARIANTS[variant] || VARIANTS.info;
    return (
      <section
        style={{
          background: v.bg,
          color: v.fg,
          padding: '16px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {label && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                padding: '3px 8px',
                borderRadius: 4,
                background: v.accent,
                color: '#fff',
              }}
            >
              {label}
            </span>
          )}
          {title && <strong style={{ fontWeight: 700 }}>{title}</strong>}
          {body && <span style={{ opacity: 0.9 }}>{body}</span>}
          {link_label && link_href && (
            <Link
              href={link_href}
              style={{
                color: v.accent,
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {link_label} <ArrowRightOutlined />
            </Link>
          )}
        </div>
      </section>
    );
  },
};
