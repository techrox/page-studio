// EventsList — upcoming events list. Date pill + title + venue + CTA.
import { StudioLink as Link } from '../context';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';

export const EventsList = {
  label: 'Events list',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    items: {
      type: 'array', label: 'Events',
      arrayFields: {
        date_short: { type: 'text', label: 'Date (e.g. MAR 12)' },
        date_long: { type: 'text', label: 'Date long-form (e.g. March 12, 2026)' },
        title: { type: 'text', label: 'Title' },
        body: { type: 'text', label: 'One-line description' },
        venue: { type: 'text', label: 'Venue / mode (e.g. Bengaluru, online)' },
        cta_label: { type: 'text', label: 'CTA label' },
        cta_href: { type: 'text', label: 'CTA URL' },
      },
      defaultItemProps: { date_short: 'MAR 12', date_long: 'March 12, 2026', title: 'New event', body: 'Description.', venue: 'Online', cta_label: 'Register', cta_href: '#' },
      getItemSummary: (it, i) => it?.title || `Event ${i + 1}`,
    },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }],
    },
  },
  defaultProps: {
    eyebrow: 'Upcoming', heading: 'Where we’ll be next.',
    items: [
      { date_short: 'MAR 12', date_long: 'March 12, 2026', title: 'An event title goes here', body: 'A short, friendly description that you can rewrite.', venue: 'Online · 90 min', cta_label: 'Register', cta_href: '#' },
      { date_short: 'APR 04', date_long: 'April 4, 2026', title: 'Another event title', body: 'A short, friendly description that you can rewrite.', venue: 'In person', cta_label: 'RSVP', cta_href: '#' },
      { date_short: 'MAY 21', date_long: 'May 21, 2026', title: 'One more event for the calendar', body: 'A short, friendly description that you can rewrite.', venue: 'Online · 60 min', cta_label: 'Register', cta_href: '#' },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, items, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 56, paddingBottom: 56 }}>
      <div className="tps-container" style={{ maxWidth: 920 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 32 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(items || []).map((e, i) => (
            <li key={i} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 24, alignItems: 'center', padding: 20, background: '#fff', border: '1px solid var(--tps-line)', borderRadius: 'var(--tps-radius)' }}>
              <div style={{ background: 'rgba(15,118,110,0.08)', color: 'var(--tps-primary)', padding: '12px 8px', borderRadius: 'var(--tps-radius)', textAlign: 'center', fontWeight: 700, fontSize: 13, lineHeight: 1.2, letterSpacing: 0.5 }}>
                <CalendarOutlined style={{ display: 'block', marginBottom: 4 }} />
                {e.date_short}
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 4px' }}>{e.title}</h3>
                {e.body && <p style={{ color: 'var(--tps-muted)', margin: '0 0 6px', fontSize: 14, lineHeight: 1.5 }}>{e.body}</p>}
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--tps-muted)' }}>
                  <span>{e.date_long}</span>
                  {e.venue && <span><EnvironmentOutlined /> {e.venue}</span>}
                </div>
              </div>
              {e.cta_label && (
                <Link href={e.cta_href || '#'} style={{ color: 'var(--tps-primary)', fontWeight: 700, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  {e.cta_label} →
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  ),
};
