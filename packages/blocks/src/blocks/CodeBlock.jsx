// CodeBlock — code snippet with optional title bar. No syntax highlighting
// (no extra dependency); plain monospace with line wrapping.
export const CodeBlock = {
  label: 'Code block',
  fields: {
    title: { type: 'text', label: 'Title bar (e.g. terminal, Dockerfile)' },
    language: { type: 'text', label: 'Language label (e.g. bash, json)' },
    code: { type: 'textarea', label: 'Code', rows: 10 },
  },
  defaultProps: {
    title: 'terminal',
    language: 'bash',
    code: '$ make db-reset-pages\n[seed] Reset complete: 18 pages.',
  },
  render: ({ title, language, code }) => (
    <section className="tps-section" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div className="tps-container" style={{ maxWidth: 820 }}>
        <div style={{ background: '#0F172A', borderRadius: 'var(--tps-radius)', overflow: 'hidden', border: '1px solid #1E293B' }}>
          {(title || language) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: '#1E293B', color: '#94A3B8', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
              <span>{title}</span>
              {language && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#F59E0B' }}>{language.toUpperCase()}</span>}
            </div>
          )}
          <pre style={{ margin: 0, padding: 16, color: '#E2E8F0', fontSize: 13, lineHeight: 1.6, overflowX: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', whiteSpace: 'pre' }}>{code}</pre>
        </div>
      </div>
    </section>
  ),
};
