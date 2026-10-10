// App — top-level routing, brand state, and the shared studio context.
//
// The brand id drives three things:
//   1. The `blockDefaults` passed to createPuckConfig (and to PageStudio).
//      Shallow-merged into each block's defaultProps when it renders.
//   2. The data-brand attribute on the showcase root, which activates the
//      per-brand CSS overrides in styles.css.
//   3. A React `key` on the renderer/editor tree so swapping brands
//      reseeds defaults immediately (no stale block content).

import { useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'

import { createPuckConfig, PageStudioProvider } from '@techrox/page-studio-blocks'

import Layout from './components/Layout.jsx'
import Landing from './components/Landing.jsx'
import BlockGallery from './components/BlockGallery.jsx'
import BlockShowcase from './components/BlockShowcase.jsx'
import PageList from './components/PageList.jsx'
import PageView from './components/PageView.jsx'
import EditorView from './components/EditorView.jsx'
import RouterLink from './components/RouterLink.jsx'

import { techroxDefaults, techroxBranding } from './brands/techrox.js'
import { neutralDefaults, neutralBranding } from './brands/neutral.js'
import { luminDefaults, luminBranding } from './brands/lumin.js'
import { acmeDefaults, acmeBranding } from './brands/acme.js'
import { pulsarDefaults, pulsarBranding } from './brands/pulsar.js'

import { tokensFor } from './themeTokens.js'

import { home } from './pages/home.js'
import { about } from './pages/about.js'
import { services } from './pages/services.js'
import { contact } from './pages/contact.js'
import { pulsar } from './pages/pulsar.js'

const BRANDS = [
  { ...techroxBranding, defaults: techroxDefaults },
  { ...neutralBranding, defaults: neutralDefaults },
  { ...luminBranding, defaults: luminDefaults },
  { ...acmeBranding, defaults: acmeDefaults },
  { ...pulsarBranding, defaults: pulsarDefaults },
]
const PAGES = [home, about, services, contact, pulsar]

// Lightweight services array so ServicesGrid + ContactSection's interest
// dropdown have something to render against. Each entry mirrors the
// `Service` shape documented in packages/blocks/README.md.
import {
  AppstoreOutlined, BulbOutlined, ToolOutlined, BarChartOutlined,
  TeamOutlined, SafetyOutlined, CloudOutlined, CustomerServiceOutlined,
} from '@ant-design/icons'

const DEMO_SERVICES = [
  { slug: 'discovery', short: 'Discovery', eyebrow: 'Phase one', summary: 'Workshops, research, and a written plan you can act on.', icon: BulbOutlined },
  { slug: 'design', short: 'Product design', eyebrow: 'Pixels', summary: 'IA, flows, and high-fidelity UI.', icon: AppstoreOutlined },
  { slug: 'engineering', short: 'Engineering', eyebrow: 'Build', summary: 'Web, mobile, and back-end. Production from day one.', icon: ToolOutlined },
  { slug: 'analytics', short: 'Analytics', eyebrow: 'Measure', summary: 'Tracking plans and dashboards your team will read.', icon: BarChartOutlined },
  { slug: 'coaching', short: 'Team coaching', eyebrow: 'Embed', summary: 'Design and engineering practice with your team.', icon: TeamOutlined },
  { slug: 'audit', short: 'Audit & review', eyebrow: 'Independent', summary: 'External reviews of an existing system.', icon: SafetyOutlined },
  { slug: 'infrastructure', short: 'Infrastructure', eyebrow: 'Hosting', summary: 'Pragmatic cloud setups without vendor lock-in.', icon: CloudOutlined },
  { slug: 'support', short: 'Support', eyebrow: 'After launch', summary: 'A retainer for ongoing care.', icon: CustomerServiceOutlined },
]

export default function App() {
  const [brandId, setBrandId] = useState('techrox')
  const brand = BRANDS.find((b) => b.id === brandId) || BRANDS[0]

  // Theme is a vendor-level default that the user can override live. Switching
  // brand re-seeds the theme to that vendor's default (light unless the brand
  // declares `theme: 'dark'`); the toggle then flips it independently.
  const [theme, setTheme] = useState(brand.theme || 'light')
  const handleBrandChange = (id) => {
    setBrandId(id)
    const next = BRANDS.find((b) => b.id === id)
    setTheme((next && next.theme) || 'light')
  }
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  // Build the Puck config (and so the shared block library) keyed by the
  // active brand. Memoised so we don't rebuild on every render — only when
  // the brand changes. Same config is fed to PageStudioRender (pages,
  // gallery, single-block view).
  const blockConfig = useMemo(
    () => createPuckConfig({ defaults: brand.defaults }),
    [brand.defaults],
  )

  // Studio context — Link wraps blocks' in-app navigation; services power
  // ServicesGrid + ContactSection's "areas of interest" dropdown. site
  // gives ContactSection an email/phone to show.
  const studio = useMemo(
    () => ({
      Link: RouterLink,
      services: DEMO_SERVICES,
      site: {
        email: 'hello@showcase.example',
        phone: '+1 (555) 012-3456',
        social: { linkedin: 'https://www.linkedin.com/', twitter: 'https://x.com/' },
      },
      submitLead: async () => {
        // No-op so ContactSection doesn't throw on the showcase. In a real
        // host this would POST to a backend.
        await new Promise((r) => setTimeout(r, 400))
      },
      subscribeNewsletter: async () => {
        await new Promise((r) => setTimeout(r, 200))
      },
      track: () => {},
    }),
    [],
  )

  // AntD theme follows the active brand so buttons / inputs inside blocks
  // pick up the brand's primary color (matches the rest of the UI, which
  // reads --tps-primary off the .showcase root).
  const antdThemeConfig = useMemo(
    () => ({
      // Follow the active theme so AntD form controls (ContactSection,
      // NewsletterSignup, …) and the showcase chrome flip with it.
      algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: brand.primaryColor,
        colorInfo: brand.primaryColor,
        borderRadius: 10,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      },
    }),
    [brand.primaryColor, theme],
  )

  // Branding handed to the editor. We fold the active theme's neutral tokens
  // into `cssVars` so PageStudio writes them into the Puck iframe's :root —
  // the renderer surfaces get their theme from data-tps-theme in the cascade,
  // but the iframe canvas can't see that attribute, so it needs the values.
  // `theme` (after `...brand`) carries the LIVE theme — the vendor default
  // overridden by the topbar toggle — so PageStudio stamps it on the editor
  // root and the chrome (sidebars, field panel, inputs) flips with the canvas.
  const editorBranding = useMemo(
    () => ({ ...brand, theme, cssVars: tokensFor(theme) }),
    [brand, theme],
  )

  // Wrap everything in PageStudioProvider so client-only blocks that call
  // useStudio() (ContactSection, ServicesGrid, NewsletterSignup, etc.)
  // resolve their host primitives. The renderer also wraps internally, but
  // wrapping here keeps the editor preview consistent.
  return (
    <ConfigProvider theme={antdThemeConfig}>
    <PageStudioProvider value={studio}>
      <Routes>
        <Route
          path="/editor"
          element={
            <Layout brands={BRANDS} brandId={brandId} onBrandChange={handleBrandChange} theme={theme} onThemeToggle={toggleTheme} title="Live editor">
              <EditorView
                initialData={home.data}
                studio={studio}
                branding={editorBranding}
                blockDefaults={brand.defaults}
                brandId={brand.id}
              />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout brands={BRANDS} brandId={brandId} onBrandChange={handleBrandChange} theme={theme} onThemeToggle={toggleTheme} title={titleFor()}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/blocks" element={<BlockGallery key={brandId} studio={studio} blockConfig={blockConfig} />} />
                <Route path="/blocks/:name" element={<BlockShowcase key={brandId} studio={studio} blockConfig={blockConfig} />} />
                <Route path="/pages" element={<PageList pages={PAGES} />} />
                <Route path="/pages/:slug" element={<PageView key={brandId} pages={PAGES} studio={studio} blockConfig={blockConfig} />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </PageStudioProvider>
    </ConfigProvider>
  )
}

// Best-effort title for the topbar derived from the current URL. We don't
// have full access to params here (this runs above the nested router) so
// keep it simple — pages override the title via their own header copy.
function titleFor() {
  if (typeof window === 'undefined') return 'Page Studio'
  const path = window.location.pathname
  if (path.startsWith('/blocks/')) return 'Block detail'
  if (path === '/blocks') return 'Block gallery'
  if (path === '/pages') return 'Sample pages'
  if (path.startsWith('/pages/')) return 'Page preview'
  return 'Page Studio'
}
