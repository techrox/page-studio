// Theme token sets for the showcase.
//
// Renderer surfaces (/blocks, /pages, the landing) get their theme purely from
// the `data-tps-theme` attribute on the .showcase root — the cascade does the
// rest, no JS needed (see .showcase[data-tps-theme="dark"] in styles.css and
// the [data-tps-theme] contract in @techrox/page-studio-blocks/styles.css).
//
// The editor is the one exception: Puck renders the canvas in an iframe that
// only inherits <head> :root rules, not the host's data-tps-theme attribute.
// So for the editor we hand the active theme's tokens to PageStudio via
// `branding.cssVars`, which writes them into :root for the iframe to clone.
//
// These values MIRROR the package's [data-tps-theme] rules. Keep them in sync;
// the package CSS is the source of truth for the rendered surfaces.

export const THEMES = ['light', 'dark']

const lightTokens = {
  '--tps-ink': '#0f172a',
  '--tps-ink-2': '#334155',
  '--tps-muted': '#64748b',
  '--tps-hint': '#94a3b8',
  '--tps-line': '#e2e8f0',
  '--tps-bg': '#ffffff',
  '--tps-bg-soft': '#fafaf7',
  '--tps-bg-section': '#f8fafc',
  '--tps-primary-soft': '#dbeafe',
}

const darkTokens = {
  '--tps-ink': '#f1f5f9',
  '--tps-ink-2': '#cbd5e1',
  '--tps-muted': '#94a3b8',
  '--tps-hint': '#64748b',
  '--tps-line': '#262626',
  '--tps-bg': '#141414',
  '--tps-bg-soft': '#1a1a1a',
  '--tps-bg-section': '#0a0a0a',
  '--tps-primary-soft': '#1a1a1a',
}

export const themeTokens = { light: lightTokens, dark: darkTokens }

// Resolve a theme name to its token map, falling back to light.
export function tokensFor(theme) {
  return themeTokens[theme] || themeTokens.light
}
