'use client';
// CountUpStats — animated counter stats. Numbers tick from 0 to value
// when scrolled into view. Subtle, used for "by the numbers" hero strips.
import { useEffect, useRef, useState } from 'react';

function CountUp({ to, duration = 1200, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const target = Number(to) || 0;
        const start = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(target * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

export const CountUpStats = {
  label: 'Count-up stats',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array', label: 'Stats',
      arrayFields: {
        value: { type: 'text', label: 'Numeric value (e.g. 80)' },
        prefix: { type: 'text', label: 'Prefix (e.g. $, +)' },
        suffix: { type: 'text', label: 'Suffix (e.g. %, +)' },
        label: { type: 'text', label: 'Label' },
      },
      defaultItemProps: { value: '0', prefix: '', suffix: '', label: 'New stat' },
      getItemSummary: (it, i) => it?.label || `Stat ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }, { label: 'Dark', value: 'dark' }],
    },
  },
  defaultProps: {
    eyebrow: 'By the numbers',
    heading: '',
    items: [
      { value: '120', prefix: '', suffix: '+', label: 'Happy customers' },
      { value: '80', prefix: '', suffix: '%', label: 'Time saved on average' },
      { value: '24', prefix: '', suffix: '/7', label: 'Support, always on' },
      { value: '5', prefix: '', suffix: '★', label: 'Average review' },
    ],
    background: 'soft',
  },
  render: ({ eyebrow, heading, items, background }) => {
    const dark = background === 'dark';
    return (
      <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 64, paddingBottom: 64, background: dark ? '#0F172A' : undefined, color: dark ? '#fff' : undefined }}>
        <div className="tps-container" style={{ textAlign: 'center' }}>
          {eyebrow && <span className="tps-eyebrow" style={{ color: dark ? '#F59E0B' : undefined }}>{eyebrow}</span>}
          {heading && <h2 className="tps-h2" style={{ marginTop: 8, color: dark ? '#fff' : undefined, marginBottom: 32 }}>{heading}</h2>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginTop: heading ? 16 : 0 }}>
            {(items || []).map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 48, fontWeight: 800, color: dark ? '#fff' : 'var(--tps-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  <CountUp to={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                </div>
                <div style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.75)' : 'var(--tps-muted)', marginTop: 8, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  },
};
