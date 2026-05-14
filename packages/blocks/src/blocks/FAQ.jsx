'use client';

// FAQ — accordion of question / answer items. Uses AntD Collapse so it gets
// the accessibility + keyboard handling for free.

import { Collapse } from 'antd';

export const FAQ = {
  label: 'FAQ accordion',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading: { type: 'text', label: 'Heading (optional)' },
    items: {
      type: 'array',
      label: 'Questions',
      arrayFields: {
        question: { type: 'text', label: 'Question' },
        answer_html: {
          type: 'textarea',
          label: 'Answer (HTML allowed)',
          rows: 5,
        },
      },
      defaultItemProps: {
        question: 'New question?',
        answer_html: '<p>Answer goes here.</p>',
      },
      getItemSummary: (item, i) => item?.question || `Question ${i + 1}`,
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
    eyebrow: 'Frequently asked',
    heading: 'Quick answers.',
    items: [
      {
        question: 'What does a typical project look like?',
        answer_html:
          '<p>A short, friendly answer that you can rewrite to match your own process.</p>',
      },
      {
        question: 'How do we get started?',
        answer_html:
          '<p>A short, friendly answer that you can rewrite to match your own process.</p>',
      },
      {
        question: 'How much does it cost?',
        answer_html:
          '<p>A short, friendly answer that you can rewrite to match your own pricing.</p>',
      },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 56, paddingBottom: 56 }}
    >
      <div className="tps-container" style={{ maxWidth: 820 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <Collapse
          accordion
          bordered={false}
          expandIconPosition="end"
          style={{ background: 'transparent' }}
          items={(items || []).map((it, i) => ({
            key: String(i),
            label: (
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--tps-ink)' }}>
                {it.question}
              </span>
            ),
            children: (
              <div
                style={{ color: 'var(--tps-ink-2)', lineHeight: 1.7, fontSize: 15 }}
                dangerouslySetInnerHTML={{ __html: it.answer_html || '' }}
              />
            ),
            style: {
              background: '#fff',
              border: '1px solid var(--tps-line)',
              borderRadius: 'var(--tps-radius)',
              marginBottom: 12,
              overflow: 'hidden',
            },
          }))}
        />
      </div>
    </section>
  ),
};
