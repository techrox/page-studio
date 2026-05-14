// TeamGrid — team member cards (photo, name, role, bio, LinkedIn link).

import { LinkedinFilled } from '@ant-design/icons';

export const TeamGrid = {
  label: 'Team grid',
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
    members: {
      type: 'array',
      label: 'Team members',
      arrayFields: {
        name: { type: 'text', label: 'Name' },
        role: { type: 'text', label: 'Role' },
        bio: { type: 'textarea', label: 'Short bio', rows: 3 },
        image_url: { type: 'text', label: 'Photo URL' },
        linkedin: { type: 'text', label: 'LinkedIn URL' },
      },
      defaultItemProps: {
        name: 'New team member',
        role: 'Role',
        bio: 'A short bio (2–3 sentences).',
        image_url: '',
        linkedin: '',
      },
      getItemSummary: (item, i) => item?.name || `Member ${i + 1}`,
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
    eyebrow: 'The team',
    heading: 'The people behind the work.',
    columns: 3,
    members: [
      {
        name: 'Add a name',
        role: 'Role',
        bio: 'A short bio (2–3 sentences). Rewrite to match the person.',
        image_url: '',
        linkedin: '',
      },
    ],
    background: 'white',
  },
  render: ({ eyebrow, heading, columns, members, background }) => (
    <section
      className={`tps-section ${background === 'soft' ? 'tps-section-soft' : ''}`}
      style={{ paddingTop: 64, paddingBottom: 64 }}
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
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${
              columns === 4 ? 220 : columns === 3 ? 260 : 320
            }px, 100%), 1fr))`,
            gap: 24,
          }}
        >
          {(members || []).map((m, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '1px solid var(--tps-line)',
                borderRadius: 'var(--tps-radius)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  background: m.image_url ? `url(${m.image_url}) center/cover` : '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94A3B8',
                  fontSize: 13,
                }}
              >
                {!m.image_url && (m.name || 'Photo')}
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>
                  {m.name}
                </h3>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--tps-accent-dark)',
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  {m.role}
                </div>
                {m.bio && (
                  <p style={{ color: 'var(--tps-muted)', lineHeight: 1.6, fontSize: 14, margin: 0 }}>
                    {m.bio}
                  </p>
                )}
                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 14,
                      color: 'var(--tps-primary)',
                      fontSize: 13,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <LinkedinFilled /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
