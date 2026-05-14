// IconCards — small icon + title + 1-line body, in a 3 / 4-column grid.
// Lighter than PillarsRow — meant for sub-features or quick "what you get"
// rundowns under a primary section.

import {
  CheckCircleOutlined,
  ApartmentOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  GlobalOutlined,
  BarChartOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileSearchOutlined,
  AuditOutlined,
} from '@ant-design/icons';

const ICONS = {
  CheckCircleOutlined,
  ApartmentOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  GlobalOutlined,
  BarChartOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FileSearchOutlined,
  AuditOutlined,
};
const ICON_OPTIONS = Object.keys(ICONS).map((k) => ({ label: k, value: k }));

export const IconCards = {
  label: 'Icon cards',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading: { type: 'text', label: 'Heading (optional)' },
    columns: {
      type: 'radio',
      label: 'Columns',
      options: [
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
      ],
    },
    items: {
      type: 'array',
      label: 'Cards',
      arrayFields: {
        icon: { type: 'select', label: 'Icon', options: ICON_OPTIONS },
        title: { type: 'text', label: 'Title' },
        body: { type: 'textarea', label: 'Body', rows: 2 },
      },
      defaultItemProps: {
        icon: 'CheckCircleOutlined',
        title: 'Card title',
        body: 'A short description (1–2 lines).',
      },
      getItemSummary: (item, i) => item?.title || `Card ${i + 1}`,
    },
    background: {
      type: 'radio',
      label: 'Background',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Soft', value: 'soft' },
      ],
    },
  },
  defaultProps: {
    eyebrow: '',
    heading: '',
    columns: 4,
    items: [
      { icon: 'CheckCircleOutlined', title: 'Built to last', body: 'Short, punchy supporting copy.' },
      { icon: 'ClockCircleOutlined', title: 'Quick to ship', body: 'Short, punchy supporting copy.' },
      { icon: 'TeamOutlined', title: 'Made with care', body: 'Short, punchy supporting copy.' },
      { icon: 'TrophyOutlined', title: 'Worth keeping', body: 'Short, punchy supporting copy.' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, columns, items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container">
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 40 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${
              columns === 4 ? 200 : columns === 3 ? 260 : 320
            }px, 1fr))`,
            gap: 24,
          }}
        >
          {(items || []).map((c, i) => {
            const Icon = ICONS[c.icon] || CheckCircleOutlined;
            return (
              <div
                key={i}
                style={{
                  padding: 24,
                  background: '#fff',
                  border: '1px solid var(--tps-line)',
                  borderRadius: 'var(--tps-radius)',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: 'rgba(15, 118, 110, 0.1)',
                    color: 'var(--tps-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    marginBottom: 16,
                  }}
                >
                  <Icon />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>
                  {c.title}
                </h3>
                <p style={{ color: 'var(--tps-muted)', lineHeight: 1.55, margin: 0, fontSize: 14 }}>
                  {c.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  ),
};
