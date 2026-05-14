// Landing — the showcase's index page. Designed as a one-screen marketing
// surface for @techrox/page-studio: brand lockup, what's-in-the-box, tour
// cards, quickstart code, and credits to the upstream packages. Voice
// mirrors BRAND.md — short sentences, field names in monospace, no
// consultancy register.
//
// Brand assets are loaded from /brand/* — those SVGs are copied to the
// build output verbatim from examples/showcase/public/brand/.

import { Link } from 'react-router-dom'

const PACKAGES = [
  {
    name: '@techrox/page-studio',
    tag: 'Editor',
    desc: 'Drag-and-drop canvas, sidebar, top bar. Bring an adapter for persistence.',
  },
  {
    name: '@techrox/page-studio-blocks',
    tag: 'Blocks',
    desc: 'Fifty production blocks plus the Puck config builder and StudioProvider.',
  },
  {
    name: '@techrox/page-studio-renderer',
    tag: 'Renderer',
    desc: 'SSR-safe wrapper for displaying saved Puck JSON on a public page.',
  },
  {
    name: '@techrox/page-studio-form',
    tag: 'Form',
    desc: 'Schema-driven structured-form editor for content-shaped pages.',
  },
]

const TOUR = [
  {
    to: '/blocks',
    tag: 'Block gallery',
    title: 'All 50 blocks',
    body: 'Every block rendered in isolation with sample defaults. Click a tile to deep-dive at full size.',
  },
  {
    to: '/pages',
    tag: 'Sample pages',
    title: 'Prebuilt pages',
    body: 'Home, About, Services, Contact — composed from blocks and rendered through PageStudioRender.',
  },
  {
    to: '/editor',
    tag: 'Live editor',
    title: 'Drag-and-drop',
    body: 'The PageStudio editor preloaded with the home page. Saves to in-memory state — no backend needed.',
  },
  {
    to: null,
    tag: 'Brand switcher',
    title: 'Per-tenant defaults',
    body: 'The control top-right swaps brands. Each one passes a different blockDefaults object. Same pages, different copy.',
  },
]

const PRINCIPLES = [
  { title: 'Block-first', body: 'Fifty production blocks covering heroes, pricing, articles, contact — every prop themable through CSS variables.' },
  { title: 'Headless-ready', body: 'Pages serialise to plain JSON. Render them anywhere with the SSR-safe renderer — server or client, your call.' },
  { title: 'Per-tenant defaults', body: 'Same blocks, different brand. Pass a blockDefaults object — the editor and renderer pick it up.' },
]

const CREDITS = [
  { name: 'Puck', href: 'https://puckeditor.com', role: 'The drag-and-drop visual editor under the hood.' },
  { name: 'Ant Design', href: 'https://ant.design', role: 'Form widgets, layout primitives, and the icon set used across blocks.' },
  { name: 'React', href: 'https://react.dev', role: 'Component model the entire package set is built on.' },
  { name: 'TipTap', href: 'https://tiptap.dev', role: 'Rich text inside the structured form editor.' },
  { name: 'Vite', href: 'https://vite.dev', role: 'Dev server and build pipeline for this showcase.' },
  { name: 'tsup', href: 'https://tsup.egoist.dev', role: 'Library bundling for each of the four published packages.' },
]

export default function Landing() {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <img
            src="/brand/page-studio-logo.svg"
            alt="Page Studio by techrox"
            className="landing-hero-logo"
            width={320}
            height={80}
          />
          <p className="landing-eyebrow">Open source · MIT · Built on Puck</p>
          <h1 className="landing-h1">
            Drop a hero, drop two columns, <em>ship the page.</em>
          </h1>
          <p className="landing-lede">
            Page Studio is a Puck-based visual page builder, broken into four small packages.
            Use the editor in your admin, the renderer on your site, and the block library in both.
            Bring your own brand — pass a <code>blockDefaults</code> map and the whole library follows.
          </p>
          <div className="landing-ctas">
            <Link to="/editor" className="landing-cta landing-cta--primary">
              Try the live editor
            </Link>
            <Link to="/blocks" className="landing-cta landing-cta--ghost">
              Browse 50 blocks
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <header className="landing-section-head">
          <span className="landing-eyebrow">What ships</span>
          <h2 className="landing-h2">Four packages, one mental model.</h2>
          <p className="landing-section-lede">
            Install only what each surface needs. Public pages get a small SSR-safe renderer;
            admin routes pull in the editor on top.
          </p>
        </header>
        <div className="landing-packages">
          {PACKAGES.map((p) => (
            <article key={p.name} className="landing-package">
              <span className="landing-package-tag">{p.tag}</span>
              <code className="landing-package-name">{p.name}</code>
              <p className="landing-package-desc">{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section landing-section--soft">
        <header className="landing-section-head">
          <span className="landing-eyebrow">Take the tour</span>
          <h2 className="landing-h2">Four ways in.</h2>
        </header>
        <div className="landing-tour">
          {TOUR.map((t) => {
            const className = `landing-tour-card${t.to ? '' : ' is-static'}`
            const body = (
              <>
                <span className="landing-tour-tag">{t.tag}</span>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </>
            )
            return t.to ? (
              <Link key={t.tag} to={t.to} className={className}>{body}</Link>
            ) : (
              <div key={t.tag} className={className}>{body}</div>
            )
          })}
        </div>
      </section>

      <section className="landing-section">
        <header className="landing-section-head">
          <span className="landing-eyebrow">Quick start</span>
          <h2 className="landing-h2">Install, render, edit.</h2>
          <p className="landing-section-lede">
            Three small packages. Two peers. One adapter when you're ready to persist.
          </p>
        </header>
        <pre className="landing-code">
{`pnpm add @techrox/page-studio @techrox/page-studio-blocks \\
        @techrox/page-studio-renderer
pnpm add @measured/puck antd @ant-design/icons   # peers`}
        </pre>
        <pre className="landing-code">
{`import { PageStudio } from '@techrox/page-studio';
import '@techrox/page-studio/styles.css';
import '@techrox/page-studio-blocks/styles.css';

<PageStudio
  pageKey="home"
  initialData={data}
  branding={{ name: 'Acme', primaryColor: '#0B60D8' }}
  adapter={{ savePage: async (key, json) => fetch(\`/api/pages/\${key}\`, { method: 'PUT', body: JSON.stringify(json) }) }}
/>;`}
        </pre>
      </section>

      <section className="landing-section landing-section--soft">
        <header className="landing-section-head">
          <span className="landing-eyebrow">Why teams pick it</span>
          <h2 className="landing-h2">Predictable. Composable. Boring on purpose.</h2>
        </header>
        <div className="landing-principles">
          {PRINCIPLES.map((p) => (
            <article key={p.title} className="landing-principle">
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <header className="landing-section-head">
          <span className="landing-eyebrow">Standing on shoulders</span>
          <h2 className="landing-h2">Thanks and credits.</h2>
          <p className="landing-section-lede">
            Page Studio is a thin opinionated wrapper. The heavy lifting is done by the
            libraries below — go give them a star.
          </p>
        </header>
        <ul className="landing-credits">
          {CREDITS.map((c) => (
            <li key={c.name}>
              <a href={c.href} target="_blank" rel="noreferrer noopener">
                <span className="landing-credit-name">{c.name} ↗</span>
                <span className="landing-credit-role">{c.role}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <img
            src="/brand/page-studio-mark.svg"
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
          />
          <div className="landing-footer-text">
            <strong>Page Studio</strong> · MIT licensed · built by techrox
          </div>
          <div className="landing-footer-links">
            <a
              href="https://github.com/measuredco/puck"
              target="_blank"
              rel="noreferrer noopener"
            >Puck ↗</a>
            <Link to="/blocks">Blocks</Link>
            <Link to="/editor">Editor</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
