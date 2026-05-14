// AwardsBar — certifications/awards row. Same shape as LogoStrip but with
// a more prominent label per award (year, body) suited for accreditation
// strips like "ISO 22000 · 2024 · DNV".
import { TrophyOutlined } from '@ant-design/icons';

export const AwardsBar = {
  label: 'Awards / certifications',
  fields: {
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array',
      label: 'Awards',
      arrayFields: {
        title: { type: 'text', label: 'Title' },
        body: { type: 'text', label: 'Body / sub-line' },
        year: { type: 'text', label: 'Year (optional)' },
      },
      defaultItemProps: { title: 'New award', body: 'Issuing body', year: '' },
      getItemSummary: (it, i) => it?.title || `Award ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }],
    },
  },
  defaultProps: {
    heading: 'Recognised work',
    items: [
      { title: 'Award name', body: 'Issuing body', year: '2024' },
      { title: 'Another award', body: 'Issuing body', year: '2023' },
      { title: 'One more honour', body: 'Issuing body', year: '2023' },
    ],
    background: 'white',
  },
  render: ({ heading, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="tps-container" style={{ textAlign: 'center' }}>
        {heading && <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.5, color: 'var(--tps-muted)', textTransform: 'uppercase', marginBottom: 32 }}>{heading}</h3>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          {(items || []).map((a, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16 }}>
              <TrophyOutlined style={{ fontSize: 28, color: 'var(--tps-accent)' }} />
              <div style={{ fontWeight: 700, fontSize: 15 }}>{a.title}</div>
              {a.body && <div style={{ fontSize: 13, color: 'var(--tps-muted)' }}>{a.body}</div>}
              {a.year && <div style={{ fontSize: 11, color: 'var(--tps-muted)', letterSpacing: 1 }}>{a.year}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
