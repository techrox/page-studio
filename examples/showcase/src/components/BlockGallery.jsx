// Block gallery — a grid of all blocks rendered small. Each card holds a
// scaled-down PageStudioRender of a single-block Puck payload, so what you
// see is the real block rendering with the current brand's defaults applied.
//
// Clicking a card deep-links to /blocks/:name which renders the same block
// at full width plus its field reference.
//
// Layout: search input + left-rail category tabs (sticky). Tabs scroll-spy
// the sections via IntersectionObserver so the active tab follows the
// reader. Clicking a tab smooth-scrolls to its section.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { PageStudioRender } from '@techrox/page-studio-renderer'

import { getCatalog, CATEGORY_ORDER } from '../data/blockCatalog.js'

function singleBlockData(name, blockConfig) {
  const defaults = blockConfig?.components?.[name]?.defaultProps || {}
  return {
    root: { props: { title: name } },
    content: [{ type: name, props: { ...defaults } }],
    zones: {},
  }
}

const slugifyCat = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export default function BlockGallery({ studio, blockConfig }) {
  const all = useMemo(() => getCatalog(), [])
  const [query, setQuery] = useState('')

  const visibleCats = useMemo(() => {
    const q = query.trim().toLowerCase()
    const map = new Map(CATEGORY_ORDER.map((c) => [c, []]))
    for (const entry of all) {
      if (q) {
        const hay = `${entry.name} ${entry.summary}`.toLowerCase()
        if (!hay.includes(q)) continue
      }
      if (!map.has(entry.category)) map.set(entry.category, [])
      map.get(entry.category).push(entry)
    }
    return [...map.entries()].filter(([, arr]) => arr.length)
  }, [all, query])

  const totalVisible = useMemo(
    () => visibleCats.reduce((n, [, arr]) => n + arr.length, 0),
    [visibleCats],
  )

  const [activeCat, setActiveCat] = useState(visibleCats[0]?.[0])
  const sectionRefs = useRef({})

  // Keep activeCat in sync with the visible categories whenever the search
  // changes — the previously active one may have filtered away.
  useEffect(() => {
    if (!visibleCats.length) return
    if (!visibleCats.some(([cat]) => cat === activeCat)) {
      setActiveCat(visibleCats[0][0])
    }
  }, [visibleCats, activeCat])

  // Scroll-spy: highlight the tab for whichever section is closest to the
  // top of the viewport (accounting for the sticky topbar at ~64px).
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const obs = new IntersectionObserver(
      (entries) => {
        const hits = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (hits[0]) {
          const cat = hits[0].target.getAttribute('data-cat')
          if (cat) setActiveCat(cat)
        }
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
    )
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [visibleCats])

  const scrollToCat = (cat) => {
    const el = sectionRefs.current[cat]
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
    setActiveCat(cat)
  }

  return (
    <div className="gallery">
      <div className="gallery-toolbar">
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Block gallery</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--tps-muted)', fontSize: 14 }}>
            All {all.length} blocks, grouped by category. Hover for a description; click for the full-size view + field reference.
          </p>
        </div>
        <label className="gallery-search">
          <SearchOutlined className="gallery-search-icon" />
          <input
            type="search"
            placeholder="Search blocks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search blocks"
          />
        </label>
      </div>

      <div className="gallery-layout">
        <aside className="gallery-tabs" aria-label="Categories">
          {visibleCats.map(([cat, arr]) => (
            <button
              key={cat}
              type="button"
              className={`gallery-tab${activeCat === cat ? ' is-active' : ''}`}
              onClick={() => scrollToCat(cat)}
            >
              <span className="gallery-tab-label">{cat}</span>
              <span className="gallery-tab-count">{arr.length}</span>
            </button>
          ))}
        </aside>

        <div className="gallery-sections">
          {visibleCats.map(([cat, entries]) => (
            <section
              key={cat}
              ref={(el) => { sectionRefs.current[cat] = el }}
              data-cat={cat}
              id={`cat-${slugifyCat(cat)}`}
              className="gallery-section"
            >
              <h2 className="gallery-section-title">
                {cat} <span className="gallery-section-count">· {entries.length}</span>
              </h2>
              <div className="gallery-grid">
                {entries.map(({ name, summary }) => (
                  <Link key={name} to={`/blocks/${name}`} className="gallery-card">
                    <div className="gallery-card-preview">
                      <div className="gallery-card-preview-inner">
                        <PageStudioRender data={singleBlockData(name, blockConfig)} config={blockConfig} studio={studio} />
                      </div>
                      <div className="gallery-card-preview-overlay" aria-hidden="true">
                        <span className="gallery-card-preview-cta">Open block →</span>
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
          ))}

          {totalVisible === 0 && (
            <div className="gallery-empty">
              No blocks match <strong>“{query}”</strong>. Try a shorter term.
            </div>
          )}
          <div style={{ height: 48 }} />
        </div>
      </div>
    </div>
  )
}
