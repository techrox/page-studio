// AnnouncementBar — top-of-page slim strip. For event announcements,
// new product, beta access etc. Compact and dismissible-looking but
// statically rendered.
import { StudioLink as Link } from '../context';

export const AnnouncementBar = {
  label: 'Announcement bar',
  fields: {
    text: { type: 'text', label: 'Text' },
    link_label: { type: 'text', label: 'Inline link label (optional)' },
    link_href: { type: 'text', label: 'Link URL' },
    variant: {
      type: 'select', label: 'Style',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
        { label: 'Accent', value: 'accent' },
      ],
    },
  },
  defaultProps: {
    text: 'Something new is here.',
    link_label: 'Learn more',
    link_href: '/services',
    variant: 'dark',
  },
  render: ({ text, link_label, link_href, variant }) => {
    // `dark` is an inverse strip: bg uses the ink token, fg the bg token, so
    // it stays a dark-on-light bar in a light theme and flips to a light-on-dark
    // bar in a dark theme — readable either way (the old fixed '#fff' fg turned
    // invisible once --tps-ink flipped light). `accent` keeps dark text since
    // the amber bg is light in both themes.
    const palette = {
      dark: { bg: 'var(--tps-ink, #0F172A)', fg: 'var(--tps-bg, #fff)', link: 'var(--tps-accent, #F59E0B)' },
      primary: { bg: 'var(--tps-primary, #0b60d8)', fg: '#fff', link: 'var(--tps-accent, #F59E0B)' },
      accent: { bg: 'var(--tps-accent, #F59E0B)', fg: '#0F172A', link: 'var(--tps-primary, #0b60d8)' },
    }[variant] || { bg: 'var(--tps-ink, #0F172A)', fg: 'var(--tps-bg, #fff)', link: 'var(--tps-accent, #F59E0B)' };
    return (
      <div style={{ background: palette.bg, color: palette.fg, padding: '8px 16px', textAlign: 'center', fontSize: 13 }}>
        <span>{text}</span>
        {link_label && link_href && (
          <Link href={link_href} style={{ color: palette.link, fontWeight: 700, marginLeft: 8, textDecoration: 'underline' }}>
            {link_label}
          </Link>
        )}
      </div>
    );
  },
};
