// PricingTable — 3-tier pricing cards with feature lists.
import { StudioLink as Link } from '../context';
import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export const PricingTable = {
  label: 'Pricing table',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    tiers: {
      type: 'array',
      label: 'Tiers',
      arrayFields: {
        name: { type: 'text', label: 'Tier name' },
        price: { type: 'text', label: 'Price (e.g. $499)' },
        period: { type: 'text', label: 'Period (e.g. /mo, one-time)' },
        description: { type: 'text', label: 'One-line description' },
        features: { type: 'textarea', label: 'Features (one per line)', rows: 6 },
        cta_label: { type: 'text', label: 'CTA label' },
        cta_href: { type: 'text', label: 'CTA URL' },
        highlighted: {
          type: 'radio',
          label: 'Highlight',
          options: [
            { label: 'No', value: false },
            { label: 'Yes', value: true },
          ],
        },
      },
      defaultItemProps: {
        name: 'New tier', price: '', period: '', description: '',
        features: '', cta_label: 'Get started', cta_href: '/contact', highlighted: false,
      },
      getItemSummary: (item, i) => item?.name || `Tier ${i + 1}`,
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }],
    },
  },
  defaultProps: {
    eyebrow: 'Pricing',
    heading: 'Simple plans for every team.',
    tiers: [
      { name: 'Starter', price: '$19', period: '/mo', description: 'Everything you need to get going.', features: 'Up to 3 seats\nCore features\nEmail support', cta_label: 'Get started', cta_href: '/contact', highlighted: false },
      { name: 'Pro', price: '$49', period: '/mo', description: 'For growing teams that need more.', features: 'Up to 20 seats\nAll Starter features\nPriority support\nAdvanced analytics', cta_label: 'Start free trial', cta_href: '/contact', highlighted: true },
      { name: 'Enterprise', price: 'Custom', period: 'annual', description: 'For teams with bigger needs.', features: 'Unlimited seats\nAll Pro features\nDedicated manager\nCustom SLAs', cta_label: 'Talk to sales', cta_href: '/contact', highlighted: false },
    ],
    background: 'soft',
  },
  render: ({ eyebrow, heading, tiers, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="tps-container">
        {(eyebrow || heading) && (
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 16, alignItems: 'stretch' }}>
          {(tiers || []).map((t, i) => {
            const featList = (t.features || '').split('\n').map((s) => s.trim()).filter(Boolean);
            return (
              <div key={i} style={{
                position: 'relative', padding: 28,
                background: t.highlighted ? 'var(--tps-primary)' : '#fff',
                color: t.highlighted ? '#fff' : 'var(--tps-ink)',
                border: t.highlighted ? 'none' : '1px solid var(--tps-line)',
                borderRadius: 'var(--tps-radius)',
                boxShadow: t.highlighted ? '0 16px 40px -16px rgba(15,118,110,0.45)' : 'none',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}>
                {t.highlighted && (
                  <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#F59E0B', color: '#0F172A', fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 4 }}>POPULAR</div>
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.9 }}>{t.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                    <span style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em' }}>{t.price}</span>
                    {t.period && <span style={{ fontSize: 13, opacity: 0.75 }}>{t.period}</span>}
                  </div>
                  {t.description && <p style={{ marginTop: 8, marginBottom: 0, fontSize: 14, opacity: 0.85, lineHeight: 1.5 }}>{t.description}</p>}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {featList.map((f, j) => (
                    <li key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.5 }}>
                      <CheckOutlined style={{ color: t.highlighted ? '#F59E0B' : 'var(--tps-primary)', fontSize: 14, marginTop: 4 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {t.cta_label && (
                  <Link href={t.cta_href || '/contact'}>
                    <Button block size="large" type={t.highlighted ? 'default' : 'primary'} ghost={!t.highlighted ? false : true}>
                      {t.cta_label}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  ),
};
