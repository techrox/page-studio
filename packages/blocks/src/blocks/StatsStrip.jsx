// StatsStrip — horizontal row of stat cards (value + label).

export const StatsStrip = {
  label: 'Stats strip',
  fields: {
    items: {
      type: 'array',
      label: 'Stats',
      arrayFields: {
        value: { type: 'text', label: 'Value (e.g. ISO · FSSC)' },
        label: { type: 'text', label: 'Label' },
      },
      defaultItemProps: { value: 'New stat', label: 'Caption' },
      getItemSummary: (item, i) => item?.value || `Stat ${i + 1}`,
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'Soft', value: 'soft' },
        { label: 'White', value: 'white' },
      ],
    },
  },
  defaultProps: {
    items: [
      { value: '120+', label: 'Happy customers' },
      { value: '24/7', label: 'Support, always on' },
      { value: '99.9%', label: 'Uptime, year after year' },
      { value: '5★', label: 'Average review' },
    ],
    background: 'soft',
  },
  render: ({ items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 32, paddingBottom: 32 }}
    >
      <div className="tps-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 24,
            textAlign: 'center',
          }}
        >
          {(items || []).map((it, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--tps-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {it.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--tps-muted)',
                  marginTop: 4,
                }}
              >
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
