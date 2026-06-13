// PricingComparison — feature comparison table across N tiers. For "what's
// in / what's out" matrices.
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export const PricingComparison = {
  label: 'Pricing comparison',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    tiers: {
      type: 'array', label: 'Tier columns',
      arrayFields: {
        name: { type: 'text', label: 'Tier name' },
      },
      defaultItemProps: { name: 'Tier' },
      getItemSummary: (it, i) => it?.name || `Tier ${i + 1}`,
    },
    rows: {
      type: 'array', label: 'Feature rows',
      arrayFields: {
        feature: { type: 'text', label: 'Feature' },
        values: { type: 'text', label: 'Per-tier values (CSV; "yes"/"no" for ticks)' },
      },
      defaultItemProps: { feature: 'Feature', values: 'yes,yes,yes' },
      getItemSummary: (it, i) => it?.feature || `Row ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    eyebrow: 'Compare', heading: 'What you get at each tier.',
    tiers: [{ name: 'Starter' }, { name: 'Pro' }, { name: 'Enterprise' }],
    rows: [
      { feature: 'Core features', values: 'yes,yes,yes' },
      { feature: 'Priority support', values: 'no,yes,yes' },
      { feature: 'Advanced analytics', values: 'no,yes,yes' },
      { feature: 'Single sign-on', values: 'no,no,yes' },
      { feature: 'Dedicated manager', values: 'no,no,yes' },
      { feature: 'Custom SLAs', values: 'no,no,yes' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, tiers, rows, background }) => {
    const tierList = tiers || [];
    return (
      <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
        <div className="tps-container" style={{ maxWidth: 940 }}>
          {(eyebrow || heading) && (
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
              {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
            </div>
          )}
          <div style={{ overflowX: 'auto', border: '1px solid var(--tps-line)', borderRadius: 'var(--tps-radius)', background: 'var(--tps-bg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--tps-muted)', borderBottom: '1px solid var(--tps-line)' }}>Feature</th>
                  {tierList.map((t, i) => (
                    <th key={i} style={{ textAlign: 'center', padding: '14px 16px', fontSize: 13, fontWeight: 700, color: 'var(--tps-ink)', borderBottom: '1px solid var(--tps-line)' }}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(rows || []).map((r, i) => {
                  const vals = (r.values || '').split(',').map((v) => v.trim());
                  return (
                    <tr key={i}>
                      <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 500, borderBottom: '1px solid var(--tps-line)' }}>{r.feature}</td>
                      {tierList.map((_, j) => {
                        const v = vals[j] || '';
                        const isYes = v.toLowerCase() === 'yes';
                        const isNo = v.toLowerCase() === 'no';
                        return (
                          <td key={j} style={{ padding: '14px 16px', textAlign: 'center', borderBottom: '1px solid var(--tps-line)', fontSize: 14, color: isYes ? 'var(--tps-primary)' : isNo ? '#CBD5E1' : 'var(--tps-ink)' }}>
                            {isYes ? <CheckOutlined /> : isNo ? <CloseOutlined /> : v}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  },
};
