// ContactInfo — office address + email + phone + hours card. No form;
// for a contact page or footer-adjacent placement.
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';

export const ContactInfo = {
  label: 'Contact info card',
  fields: {
    eyebrow: { type: 'text', label: 'Eyebrow' },
    heading: { type: 'text', label: 'Heading' },
    email: { type: 'text', label: 'Email' },
    phone: { type: 'text', label: 'Phone' },
    address: { type: 'textarea', label: 'Address (multi-line)' },
    hours: { type: 'text', label: 'Hours' },
    background: {
      type: 'radio', label: 'Background',
      options: [{ label: 'White', value: 'white' }, { label: 'Soft', value: 'soft' }],
    },
  },
  defaultProps: {
    eyebrow: 'Get in touch', heading: 'Say hello',
    email: 'hello@example.com',
    phone: '',
    address: 'Your street\nYour city, Country',
    hours: 'Mon–Fri · 09:00–18:00',
    background: 'soft',
  },
  render: ({ eyebrow, heading, email, phone, address, hours, background }) => (
    <section className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`} style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="tps-container" style={{ maxWidth: 720 }}>
        {(eyebrow || heading) && (
          <div style={{ marginBottom: 24 }}>
            {eyebrow && <span className="tps-eyebrow">{eyebrow}</span>}
            {heading && <h2 className="tps-h2" style={{ marginTop: 8 }}>{heading}</h2>}
          </div>
        )}
        <div style={{ background: '#fff', border: '1px solid var(--tps-line)', borderRadius: 'var(--tps-radius)', padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 20 }}>
            {email && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--tps-muted)', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                  <MailOutlined /> Email
                </div>
                <a href={`mailto:${email}`} style={{ color: 'var(--tps-primary)', fontSize: 15, fontWeight: 600 }}>{email}</a>
              </div>
            )}
            {phone && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--tps-muted)', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                  <PhoneOutlined /> Phone
                </div>
                <a href={`tel:${phone}`} style={{ color: 'var(--tps-ink)', fontSize: 15, fontWeight: 600 }}>{phone}</a>
              </div>
            )}
            {address && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--tps-muted)', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                  <EnvironmentOutlined /> Address
                </div>
                <div style={{ color: 'var(--tps-ink)', fontSize: 14, whiteSpace: 'pre-line', lineHeight: 1.5 }}>{address}</div>
              </div>
            )}
            {hours && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--tps-muted)', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                  <ClockCircleOutlined /> Hours
                </div>
                <div style={{ color: 'var(--tps-ink)', fontSize: 14 }}>{hours}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  ),
};
