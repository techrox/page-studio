// PillarsRow — 2/3/4-column grid of icon + title + body cards.

import {
  ApartmentOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  TeamOutlined,
  GlobalOutlined,
  BarChartOutlined,
  BulbOutlined,
} from '@ant-design/icons';

const ICONS = {
  ApartmentOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  TeamOutlined,
  GlobalOutlined,
  BarChartOutlined,
  BulbOutlined,
};

const ICON_OPTIONS = Object.keys(ICONS).map((k) => ({ label: k, value: k }));

export const PillarsRow = {
  label: 'Pillars row',
  fields: {
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
      label: 'Pillars',
      arrayFields: {
        icon: { type: 'select', label: 'Icon', options: ICON_OPTIONS },
        title: { type: 'text', label: 'Title' },
        text: { type: 'textarea', label: 'Body' },
      },
      defaultItemProps: {
        icon: 'ApartmentOutlined',
        title: 'New pillar',
        text: 'Short description of this pillar.',
      },
      getItemSummary: (item, i) => item?.title || `Pillar ${i + 1}`,
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
    columns: 3,
    items: [
      {
        icon: 'ApartmentOutlined',
        title: 'Built to last',
        text: 'Short, punchy supporting copy that you can rewrite.',
      },
      {
        icon: 'ToolOutlined',
        title: 'Speed where it counts',
        text: 'Short, punchy supporting copy that you can rewrite.',
      },
      {
        icon: 'ThunderboltOutlined',
        title: 'Designed in the open',
        text: 'Short, punchy supporting copy that you can rewrite.',
      },
    ],
    background: 'soft',
  },
  render: ({ items, columns, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${
              columns === 4 ? 220 : columns === 3 ? 280 : 360
            }px, 100%), 1fr))`,
            gap: 24,
          }}
        >
          {(items || []).map((p, i) => {
            const Icon = ICONS[p.icon] || ApartmentOutlined;
            return (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: '1px solid var(--tps-line)',
                  borderRadius: 'var(--tps-radius)',
                  padding: 32,
                }}
              >
                <div className="tps-service-icon" style={{ marginBottom: 20 }}>
                  <Icon />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--tps-muted)', lineHeight: 1.7, margin: 0 }}>
                  {p.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  ),
};
