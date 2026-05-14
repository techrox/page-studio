// ServicesGrid — auto-renders the 10 service capability cards from the
// services data file. Editor only chooses how many to show + section chrome.

import { StudioLink as Link, useStudio } from '../context';

export const ServicesGrid = {
  label: 'Services grid',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow (optional)' },
    heading: { type: 'text', label: 'Heading (optional)' },
    show: {
      type: 'radio',
      label: 'Show',
      options: [
        { label: 'All services', value: 'all' },
        { label: 'First 4', value: 4 },
        { label: 'First 6', value: 6 },
        { label: 'First 8', value: 8 },
      ],
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
    show: 'all',
    background: 'white',
  },
  render: ({ eyebrow, heading, show, background }) => {
    const { services } = useStudio();
    const list = show === 'all' ? services : services.slice(0, Number(show));
    return (
      <section
        className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
        style={{ paddingTop: 56, paddingBottom: 56 }}
      >
        <div className="tps-container">
          {(eyebrow || heading) && (
            <div style={{ marginBottom: 32 }}>
              {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
              {heading && (
                <h2 className="tps-h2" style={{ marginTop: 8 }}>
                  {heading}
                </h2>
              )}
            </div>
          )}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: 16,
            }}
          >
            {list.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                style={{
                  display: 'block',
                  padding: 24,
                  background: '#fff',
                  border: '1px solid var(--tps-line)',
                  borderRadius: 'var(--tps-radius)',
                  textDecoration: 'none',
                  color: 'var(--tps-ink)',
                  transition: 'transform 120ms ease, box-shadow 120ms ease',
                }}
              >
                <div className="tps-service-icon" style={{ marginBottom: 16 }}>
                  <s.icon />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--tps-accent-dark)' }}>
                  {s.eyebrow}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '6px 0 8px' }}>
                  {s.short}
                </h3>
                <p style={{ color: 'var(--tps-muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {s.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  },
};
