// Index of sample pages. Each links to `PageView`, which actually renders
// the Puck content with the current brand's defaults.

import { Link } from 'react-router-dom'

export default function PageList({ pages }) {
  return (
    <div className="page-list">
      <h1 style={{ margin: '0 0 6px', fontSize: 26 }}>Sample pages</h1>
      <p style={{ color: 'var(--tps-muted)', margin: '0 0 24px' }}>
        Each page is a Puck data object — the same shape your CMS would store. We render it through{' '}
        <code>PageStudioRender</code>, passing the current brand's <code>blockDefaults</code> into
        the Puck config so blocks pick up tenant-specific copy.
      </p>
      {pages.map((p) => (
        <Link key={p.slug} to={`/pages/${p.slug}`} className="page-list-item">
          <div>
            <h3>{p.title}</h3>
            <div className="page-list-item-meta">{p.summary}</div>
            <div className="page-list-item-blocks">
              {p.data.content.length} block{p.data.content.length === 1 ? '' : 's'} ·{' '}
              {p.data.content.map((b) => b.type).join(' · ')}
            </div>
          </div>
          <span aria-hidden style={{ color: 'var(--tps-primary)', fontWeight: 700 }}>→</span>
        </Link>
      ))}
    </div>
  )
}
