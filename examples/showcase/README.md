# Page Studio — Showcase

A self-contained Vite + React 18 app that exercises every part of the
`@techrox/page-studio` family:

- `@techrox/page-studio-blocks` — the 50 production-ready blocks
- `@techrox/page-studio` — the drag-and-drop editor
- `@techrox/page-studio-renderer` — the SSR-safe public renderer
- `@techrox/page-studio-form` — the schema-driven form editor (peer-installed; not yet surfaced in this app)

## Run it

From this directory:

```bash
make install   # pnpm install at the monorepo root + builds the four packages
make dev       # Vite dev server on http://localhost:5174
```

`make help` lists every available target.

## What the showcase demonstrates

The app has four routes, each a different way someone might use the library.

### 1. Block gallery — `/blocks`

A grid of all 50 blocks. Each tile is a real `PageStudioRender` of a
single-block Puck payload, scaled down. Click any tile to see the same
block at full width plus its field reference (`/blocks/:name`).

This is what a designer scrolls through to figure out what's in the box.

### 2. Sample pages — `/pages`

Four prebuilt pages stored as Puck JSON, composed from the block library:

| Slug | Blocks |
|---|---|
| `home` | Hero · StatsStrip · PillarsRow · ApproachSteps · TestimonialQuote · CTABanner |
| `about` | Hero (simple) · PrinciplesList · TwoColumn · TeamGrid · Timeline · CTABanner |
| `services` | SectionHeader · IconCards · MetricCards · TestimonialQuote · FAQ · InlineCTA |
| `contact` | Hero (simple) · ContactSection |

Each renders through `PageStudioRender` — the same code path a real public
site would use.

### 3. Brand switcher — top-right of every page

Three brands ship in the box:

- **Neutral** — no overrides. You see the package's intrinsic `defaultProps`.
- **Lumin Labs** — punchy indie-studio voice. Violet palette.
- **Acme Co** — corporate enterprise voice. Navy palette.

Switching the brand swaps two things at once:

1. The CSS variable palette (`--tps-primary`, `--tps-accent`, …) via a
   `data-brand="…"` attribute on the showcase root. Pure CSS, no remount.
2. The `blockDefaults` object passed to `createPuckConfig({ defaults })`
   in `App.jsx`. This is the brand-injection seam — same blocks, tenant
   copy shallow-merged into each block's `defaultProps`.

The renderer/editor get a React `key` set to the brand id so the
defaults are re-applied immediately on switch.

### 4. Live editor — `/editor`

A full `PageStudio` instance preloaded with the home-page Puck data and
wired with the current brand's `blockDefaults`. Drag, drop, tweak.
Publish writes to in-memory state and pops a toast — no backend needed.

## Per-block documentation — `BLOCKS.md`

Designer-friendly reference for every block: category, summary, field
list, "when to use", and tips. Open it in any markdown viewer.

## Files of interest

| Path | Purpose |
|---|---|
| `src/App.jsx` | Top-level routes + brand state + the shared `StudioContext` |
| `src/brands/*` | Per-brand `blockDefaults` objects |
| `src/pages/*` | Puck data for the four sample pages |
| `src/data/blockCatalog.js` | Source of truth for the gallery + `BLOCKS.md` |
| `src/components/RouterLink.jsx` | React Router adapter for the block library's `Link` prop |
| `src/styles.css` | Host CSS — the `.tps-*` classes the block library expects + showcase chrome |

## Layering the showcase against a real host

This example deliberately avoids two things a production host would have:

- **No persistence** — `EditorView` stores published Puck data in React
  state. Wire `adapter.savePage` to your CMS endpoint to make edits stick.
- **No auth / role gating** — Cibus IQ (the host that originated this
  package) gates `/admin/*` via middleware. Add what your stack uses.

Everything else — block library, editor chrome, renderer, brand
defaults — is identical to the production path.
