'use client';
// TabsBlock — tabbed content panel. Each tab has a label + HTML body.
import { Tabs as AntTabs } from 'antd';

export const TabsBlock = {
  label: 'Tabs',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array', label: 'Tabs',
      arrayFields: {
        label: { type: 'text', label: 'Tab label' },
        content_html: { type: 'textarea', label: 'Tab content (HTML)', rows: 6 },
      },
      defaultItemProps: { label: 'New tab', content_html: '<p>Tab content.</p>' },
      getItemSummary: (it, i) => it?.label || `Tab ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    eyebrow: '', heading: '',
    items: [
      { label: 'For teams', content_html: '<p>A short, friendly description that you can rewrite.</p>' },
      { label: 'For leaders', content_html: '<p>A short, friendly description that you can rewrite.</p>' },
      { label: 'For founders', content_html: '<p>A short, friendly description that you can rewrite.</p>' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}${background === 'dark' ? ' tps-section-dark' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="tps-container" style={{ maxWidth: 920 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <AntTabs
          items={(items || []).map((t, i) => ({
            key: String(i),
            label: t.label,
            children: <div style={{ padding: '12px 0', color: 'var(--tps-ink-2)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: t.content_html || '' }} />,
          }))}
        />
      </div>
    </section>
  ),
};
