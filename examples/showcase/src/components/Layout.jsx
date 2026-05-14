// Showcase shell — left rail navigation + top bar with brand switcher.
// Children render in `.showcase-content`. The brand id propagates into a
// data attribute on the root container so the per-brand CSS overrides in
// styles.css activate without remounting the page.
//
// Mobile: the rail collapses to an off-canvas drawer toggled by the
// hamburger in the topbar. A backdrop closes the drawer, and route
// changes auto-close it so you never land on a new page with the menu
// stuck open.

import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import BrandSwitcher from './BrandSwitcher.jsx'

export default function Layout({ brands, brandId, onBrandChange, title, children }) {
  const location = useLocation()
  // Hide the topbar title on the index page — the landing handles its own headline.
  const showTitle = location.pathname !== '/'

  const [navOpen, setNavOpen] = useState(false)
  // Close on route change so the rail doesn't stay covering content.
  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])
  // Esc-to-close while the drawer is open.
  useEffect(() => {
    if (!navOpen) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navOpen])

  return (
    <div className="showcase" data-brand={brandId} data-nav-open={navOpen ? 'true' : undefined}>
      <div
        className="showcase-nav-backdrop"
        aria-hidden="true"
        onClick={() => setNavOpen(false)}
      />
      <aside className="showcase-nav" aria-label="Primary">
        <Link to="/" className="showcase-brand">
          <img
            src="/brand/page-studio-logo.svg"
            alt="Page Studio"
            width={204}
            height={44}
            className="showcase-brand-logo"
          />
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

        <div className="showcase-nav-brands">
          <div className="showcase-nav-section">Brand</div>
          <BrandSwitcher
            brands={brands}
            current={brandId}
            onChange={onBrandChange}
            layout="stacked"
          />
        </div>

        <div style={{ fontSize: 12, color: 'var(--tps-hint)' }}>
          The showcase is a working tour of <strong>@techrox/page-studio</strong> — block library, renderer, and editor.
        </div>
      </aside>

      <main className="showcase-main">
        <div className="showcase-topbar">
          <button
            type="button"
            className="showcase-nav-toggle"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="showcase-nav"
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
          <Link to="/" className="showcase-topbar-brand">
            <img
              src="/brand/page-studio-logo.svg"
              alt="Page Studio"
              width={167}
              height={36}
              className="showcase-topbar-logo"
            />
          </Link>
          <h2>{showTitle ? title || ' ' : ' '}</h2>
          <BrandSwitcher brands={brands} current={brandId} onChange={onBrandChange} />
        </div>
        <div className="showcase-content">{children}</div>
      </main>
    </div>
  )
}
