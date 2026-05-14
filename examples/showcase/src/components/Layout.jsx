// Showcase shell — left rail navigation + top bar with brand switcher.
// Children render in `.showcase-content`. The brand id propagates into a
// data attribute on the root container so the per-brand CSS overrides in
// styles.css activate without remounting the page.

import { Link, NavLink, useLocation } from 'react-router-dom'
import BrandSwitcher from './BrandSwitcher.jsx'

export default function Layout({ brands, brandId, onBrandChange, title, children }) {
  const location = useLocation()
  // Hide the topbar title on the index page — the landing handles its own headline.
  const showTitle = location.pathname !== '/'

  return (
    <div className="showcase" data-brand={brandId}>
      <aside className="showcase-nav">
        <Link to="/" className="showcase-brand">
          <img
            src="/brand/page-studio-mark.svg"
            alt=""
            aria-hidden="true"
            width={28}
            height={28}
            className="showcase-brand-mark"
          />
          Page Studio
        </Link>

        <div>
          <div className="showcase-nav-section">Tour</div>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Overview
          </NavLink>
          <NavLink to="/blocks" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Block gallery
          </NavLink>
          <NavLink to="/pages" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Sample pages
          </NavLink>
          <NavLink to="/editor" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Live editor
          </NavLink>
        </div>

        <div>
          <div className="showcase-nav-section">Reference</div>
          <a
            href="https://github.com/measuredco/puck"
            target="_blank"
            rel="noreferrer noopener"
          >
            Puck on GitHub ↗
          </a>
          <Link to="/blocks">All 50 blocks</Link>
        </div>

        <div style={{ marginTop: 'auto', fontSize: 12, color: 'var(--tps-hint)' }}>
          The showcase is a working tour of <strong>@techrox/page-studio</strong> — block library, renderer, and editor.
        </div>
      </aside>

      <main className="showcase-main">
        <div className="showcase-topbar">
          <h2>{showTitle ? title || ' ' : ' '}</h2>
          <BrandSwitcher brands={brands} current={brandId} onChange={onBrandChange} />
        </div>
        <div className="showcase-content">{children}</div>
      </main>
    </div>
  )
}
