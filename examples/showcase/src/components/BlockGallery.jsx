// Block gallery — a grid of all blocks rendered small. Each card holds a
// scaled-down PageStudioRender of a single-block Puck payload, so what you
// see is the real block rendering with the current brand's defaults applied.
//
// Clicking a card deep-links to /blocks/:name which renders the same block
// at full width plus its field reference.

import { Link } from 'react-router-dom'
import { PageStudioRender } from '@techrox/page-studio-renderer'

import { getCatalog, CATEGORY_ORDER } from '../data/blockCatalog.js'

// Puck's <Render> does not auto-apply defaultProps — those only fire when
// a block is inserted via the editor's drawer. To get a populated preview
// here, pull the resolved defaults straight off the config and seed them
// as the block's props.
function singleBlockData(name, blockConfig) {
  const defaults = blockConfig?.components?.[name]?.defaultProps || {}
  return {
    root: { props: { title: name } },
    content: [{ type: name, props: { ...defaults } }],
    zones: {},
  }
}

export default function BlockGallery({ studio, blockConfig }) {
  const all = getCatalog()
  // Group by category and sort by CATEGORY_ORDER.
  const byCategory = new Map(CATEGORY_ORDER.map((c) => [c, []]))
  for (const entry of all) {
    if (!byCategory.has(entry.category)) byCategory.set(entry.category, [])
    byCategory.get(entry.category).push(entry)
  }

  return (
    <>
      <div className="gallery-toolbar">
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Block gallery</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--tps-muted)', fontSize: 14 }}>
            All {all.length} blocks, grouped by category. Hover for the description; click for the full-size view + field reference.
          </p>
        </div>
      </div>

      {[...byCategory.entries()].map(([cat, entries]) =>
        entries.length === 0 ? null : (
          <section key={cat} style={{ padding: '8px 24px 0' }}>
            <h2
              style={{
                fontSize: 12,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: 'var(--tps-hint)',
                fontWeight: 700,
                margin: '20px 0 8px',
              }}
            >
              {cat} · {entries.length}
            </h2>
            <div className="gallery-grid" style={{ padding: 0 }}>
              {entries.map(({ name, summary }) => (
                <Link key={name} to={`/blocks/${name}`} className="gallery-card">
                  <div className="gallery-card-preview">
                    <div className="gallery-card-preview-inner">
                      <PageStudioRender data={singleBlockData(name, blockConfig)} config={blockConfig} studio={studio} />
                    </div>
                  </div>
                  <div className="gallery-card-meta">
                    <div className="gallery-card-meta-tag">{cat}</div>
                    <h3>{name}</h3>
                    <p className="gallery-card-meta-desc">{summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ),
      )}
      <div style={{ height: 48 }} />
    </>
  )
}
