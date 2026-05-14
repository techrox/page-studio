// SocialLinks — row of social media icons. Standalone block — site-wide
// social URLs are stored on `site.globals` for the footer; this is for
// ad-hoc placements on individual pages.
import {
  LinkedinFilled, FacebookFilled, YoutubeFilled, InstagramFilled,
  TwitterOutlined, GithubOutlined, MailOutlined, GlobalOutlined,
} from '@ant-design/icons';

const NETWORKS = {
  linkedin: { icon: LinkedinFilled, label: 'LinkedIn' },
  facebook: { icon: FacebookFilled, label: 'Facebook' },
  youtube: { icon: YoutubeFilled, label: 'YouTube' },
  instagram: { icon: InstagramFilled, label: 'Instagram' },
  twitter: { icon: TwitterOutlined, label: 'Twitter / X' },
  github: { icon: GithubOutlined, label: 'GitHub' },
  email: { icon: MailOutlined, label: 'Email' },
  website: { icon: GlobalOutlined, label: 'Website' },
};

export const SocialLinks = {
  label: 'Social links',
  fields: {
    label: { type: 'text', label: 'Label (e.g. Follow us)' },
    align: {
      type: 'radio', label: 'Alignment',
      options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }],
    },
    items: {
      type: 'array', label: 'Links',
      arrayFields: {
        network: {
          type: 'select', label: 'Network',
          options: Object.keys(NETWORKS).map((k) => ({ value: k, label: NETWORKS[k].label })),
        },
        href: { type: 'text', label: 'URL' },
      },
      defaultItemProps: { network: 'linkedin', href: '' },
      getItemSummary: (it, i) => NETWORKS[it?.network]?.label || `Link ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }],
    },
  },
  defaultProps: {
    label: 'Follow us', align: 'center',
    items: [
      { network: 'linkedin', href: '#' },
      { network: 'twitter', href: '#' },
      { network: 'youtube', href: '#' },
    ],
    background: 'white',
  },
  render: ({ label, align, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 32, paddingBottom: 32 }}>
      <div className="tps-container" style={{ textAlign: align }}>
        {label && <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, color: 'var(--tps-muted)', textTransform: 'uppercase', marginBottom: 12 }}>{label}</div>}
        <div style={{ display: 'inline-flex', gap: 14 }}>
          {(items || []).filter((l) => l.href).map((l, i) => {
            const Icon = (NETWORKS[l.network] || NETWORKS.linkedin).icon;
            return (
              <a key={i} href={l.href} target="_blank" rel="noreferrer" aria-label={NETWORKS[l.network]?.label || l.network}
                 style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(15,118,110,0.08)', color: 'var(--tps-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'background 150ms ease' }}>
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  ),
};
