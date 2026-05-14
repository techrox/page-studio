'use client';
// AccordionBlock — generic accordion (siblings open simultaneously). Use
// for product features lists, multi-section content. (FAQ block is the
// strict question/answer variant.)
import { Collapse } from 'antd';

export const AccordionBlock = {
  label: 'Accordion',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array', label: 'Sections',
      arrayFields: {
        title: { type: 'text', label: 'Title' },
        content_html: { type: 'textarea', label: 'Content (HTML)', rows: 5 },
      },
      defaultItemProps: { title: 'New section', content_html: '<p>Content.</p>' },
      getItemSummary: (it, i) => it?.title || `Section ${i + 1}`,
    },
    multiple_open: {
      type: 'radio', label: 'Allow multiple open',
      options: [{ label: 'No', value: false }, { label: 'Yes', value: true }],
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }],
    },
  },
  defaultProps: {
    eyebrow: '', heading: 'More details',
    items: [
      { title: 'A common question', content_html: '<p>A short, friendly answer you can rewrite.</p>' },
      { title: 'Another common question', content_html: '<p>A short, friendly answer you can rewrite.</p>' },
    ],
    multiple_open: false, background: 'white',
  },
  render: ({ eyebrow, heading, items, multiple_open, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="tps-container" style={{ maxWidth: 820 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 24 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <Collapse
          accordion={!multiple_open}
          bordered={false}
          expandIconPosition="end"
          style={{ background: 'transparent' }}
          items={(items || []).map((it, i) => ({
            key: String(i),
            label: <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--tps-ink)' }}>{it.title}</span>,
            children: <div style={{ color: 'var(--tps-ink-2)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: it.content_html || '' }} />,
            style: { background: '#fff', border: '1px solid var(--tps-line)', borderRadius: 'var(--tps-radius)', marginBottom: 10, overflow: 'hidden' },
          }))}
        />
      </div>
    </section>
  ),
};
