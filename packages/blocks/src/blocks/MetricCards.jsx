// MetricCards — large-number cards with optional trend indicator. The
// "by the numbers" section. Bigger, bolder, more visual than StatsStrip.

import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export const MetricCards = {
  label: 'Metric cards',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading: { type: 'text', label: 'Heading (optional)' },
    items: {
      type: 'array',
      label: 'Metrics',
      arrayFields: {
        value: { type: 'text', label: 'Value (e.g. 80%, 4.8/5)' },
        label: { type: 'text', label: 'Label' },
        delta: { type: 'text', label: 'Trend label (e.g. +12 YoY)' },
        trend: {
          type: 'select',
          label: 'Trend direction',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Up (positive)', value: 'up' },
            { label: 'Down (positive)', value: 'down' },
          ],
        },
      },
      defaultItemProps: { value: '0', label: 'New metric', delta: '', trend: 'none' },
      getItemSummary: (item, i) => item?.label || `Metric ${i + 1}`,
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  },
  defaultProps: {
    eyebrow: 'By the numbers',
    heading: 'Results that speak for themselves.',
    items: [
      { value: '80%', label: 'A short, generic stat label you can rewrite', delta: '+12 YoY', trend: 'up' },
      { value: '4 wk', label: 'Median time to first ship', delta: '−2 wk vs avg.', trend: 'up' },
      { value: '4.8 / 5', label: 'Customer satisfaction', delta: '', trend: 'none' },
      { value: '0', label: 'Late deliveries this quarter', delta: '', trend: 'none' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => {
    const dark = background === 'dark';
    return (
      <section
        className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
        style={{
          paddingTop: 64,
          paddingBottom: 64,
          background: dark ? '#0F172A' : undefined,
          color: dark ? '#fff' : undefined,
        }}
      >
        <div className="tps-container">
          {(eyebrow || heading) && (
            <div style={{ marginBottom: 40 }}>
              {eyebrow && (
                <span
                  className="tps-eyebrow"
                  style={{ color: dark ? '#F59E0B' : undefined }}
                >
                  {eyebrow}
                </span>
              )}
              {heading && (
                <h2
                  className="tps-h2"
                  style={{ marginTop: 8, color: dark ? '#fff' : undefined }}
                >
                  {heading}
                </h2>
              )}
            </div>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
              gap: 16,
            }}
          >
            {(items || []).map((m, i) => (
              <div
                key={i}
                style={{
                  padding: 28,
                  background: dark ? 'rgba(255,255,255,0.04)' : '#fff',
                  border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--tps-line)',
                  borderRadius: 'var(--tps-radius)',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(28px, 6vw, 44px)',
                    fontWeight: 800,
                    color: dark ? '#fff' : 'var(--tps-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                    marginBottom: 12,
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: dark ? 'rgba(255,255,255,0.85)' : 'var(--tps-ink-2)',
                    lineHeight: 1.55,
                    marginBottom: m.delta ? 12 : 0,
                  }}
                >
                  {m.label}
                </div>
                {m.delta && m.trend !== 'none' && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: 4,
                      background:
                        m.trend === 'up'
                          ? 'rgba(15, 128, 61, 0.12)'
                          : 'rgba(220, 38, 38, 0.12)',
                      color: m.trend === 'up' ? '#15803D' : '#DC2626',
                    }}
                  >
                    {m.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {m.delta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
};
