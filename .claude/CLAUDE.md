# Page Studio — Project Context

This file orients Claude (via Claude Code) to the Page Studio monorepo.
It is loaded into context on every session — keep it tight, factual,
current.

## What this project is

Page Studio is a **standalone, framework-agnostic visual page builder**,
packaged for cross-team reuse. It is a thin opinionated wrapper around
[Puck](https://puckeditor.com) with a 50-block library, a brand-aware
config builder, and an SSR-safe renderer.

It publishes as four coordinated packages. Consumers install only what
each surface needs: public pages pull in the renderer; admin routes
add the editor on top.

| Package | Path | What it is |
|---|---|---|
| `@techrox/page-studio` | `packages/editor` | Editor shell — drag-and-drop canvas, sidebar, top bar. Accepts an `adapter` for persistence and a `studio` context for host primitives (Link, services, analytics). |
| `@techrox/page-studio-blocks` | `packages/blocks` | 50 production-ready blocks + Puck config builder (`createPuckConfig`) + `PageStudioProvider`. |
| `@techrox/page-studio-renderer` | `packages/renderer` | Server-safe `PageStudioRender` for displaying saved Puck JSON on a public page. |
| `@techrox/page-studio-form` | `packages/form` | Schema-driven structured-form editor (TipTap-backed RichText, repeaters, revision history) for content-shaped pages where layout is fixed. |

Working tour lives in [`examples/showcase`](../examples/showcase/) —
block gallery, sample pages, brand-defaults injection, live editor.

## Stack

| Layer | Choice |
|---|---|
| Build / packages | **tsup** per package, **pnpm workspaces** at the root |
| Editor canvas | **Puck v0.20+** (mounts inside its own iframe) |
| UI primitives | **Ant Design v5** + `@ant-design/icons` |
| Rich text (form package) | **TipTap** |
| Showcase host | **Vite** + React Router |
| Tests | **Vitest** + Testing Library + happy-dom |
| Node | `>=18`, `pnpm >=8` |

React 18 and react-dom 18 are peer dependencies. The packages do not
ship a copy.

## Repo layout

```
page-studio/
├── LICENSE                     # MIT
├── BRAND.md                    # Logo, tokens, voice, do/don't
├── README.md
├── package.json                # Workspace root — pnpm scripts
├── pnpm-workspace.yaml
├── vitest.shared.js
├── packages/
│   ├── editor/                 # @techrox/page-studio
│   │   ├── src/
│   │   │   ├── PageStudio.jsx          # The editor component
│   │   │   ├── BuilderTopBar.jsx       # Header / brand / save buttons
│   │   │   ├── BuilderEnhancements.jsx # Sidebar tabs, picker tweaks
│   │   │   ├── styles.css
│   │   │   └── index.js
│   │   ├── tsup.config.js
│   │   └── package.json
│   ├── blocks/                 # @techrox/page-studio-blocks
│   │   ├── src/
│   │   │   ├── blocks/               # 50 block defs (.jsx)
│   │   │   ├── config.jsx            # createPuckConfig + categories
│   │   │   ├── context.jsx           # PageStudioProvider / useStudio
│   │   │   ├── BlockThumbnail.jsx
│   │   │   ├── styles.css            # `--tps-*` defaults + reveal CSS
│   │   │   └── index.js
│   │   └── package.json
│   ├── renderer/               # @techrox/page-studio-renderer
│   │   └── src/PageStudioRender.jsx
│   └── form/                   # @techrox/page-studio-form
│       └── src/{PageStudioForm,RichText,HistoryPanel,CustomBlocks}.jsx
└── examples/
    └── showcase/               # Vite tour app — gallery, pages, editor
        ├── BLOCKS.md           # Per-block reference
        ├── public/brand/       # Logo SVGs (logo, mark, reverse mark)
        └── src/{App.jsx,components/,brands/,pages/,styles.css}
```

## Brand voice — applies to docs, UI copy, error messages

The Page Studio voice is **designer-friendly, technical-but-warm,
pragmatic — never marketing-y**. Specific tells:

- Short sentences. Concrete examples.
- Show the field name in monospace (`heading_html`, `blockDefaults`),
  not bold.
- Mirror the `BLOCKS.md` lead style: "Hero — eyebrow + heading + lede +
  two CTAs" over "A powerful hero section that captivates your audience".
- Sentence case everywhere except proper nouns and acronyms.
- No ALL CAPS in headings or eyebrows. Eyebrows are slate-500, 11 px,
  `0.06em` tracking.
- No consultancy register: no "transformative," no "world-class," no
  "synergies."

Full guidelines in [BRAND.md](../BRAND.md).

## Brand tokens

The block library reads these CSS variables from the **host**. Defaults
live in `packages/blocks/src/styles.css` at `:root`. Override at `:root`
in your host (or via `PageStudio`'s `branding` prop, which injects them
into Puck's iframe automatically).

```css
:root {
  /* Brand */
  --tps-primary:        #0b60d8;  /* Techrox blue */
  --tps-primary-dark:   #0848a3;
  --tps-primary-light:  #3b82f6;
  --tps-primary-soft:   #dbeafe;
  --tps-accent:         #f59e0b;

  /* Ink + surfaces */
  --tps-ink:            #0f172a;
  --tps-muted:          #64748b;
  --tps-hint:           #94a3b8;
  --tps-line:           #e2e8f0;
  --tps-bg:             #ffffff;
  --tps-bg-soft:        #fafaf7;
  --tps-bg-section:     #f8fafc;

  /* Layout */
  --tps-max:            1240px;
  --tps-radius:         14px;
}
```

Component class names use `psd-*` (e.g. `.psd-builder-page`,
`.psd-builder-bar`). Those are **identifiers, not theme tokens** —
don't override them in host CSS.

## Block conventions

Every block in `packages/blocks/src/blocks/` is a Puck-shaped object:

```js
export const Hero = {
  label: 'Hero',
  fields: {
    heading_html: { type: 'text', label: 'Heading' },
    // …
  },
  defaultProps: { /* … */ },
  render: ({ heading_html /* … */ }) => ( /* JSX */ ),
};
```

Rules every new block follows:

1. **SSR-safe.** No `window`/`document` references in the render path.
   Anything that needs host primitives (Link, services, submitLead) is
   pulled from `useStudio()`.
2. **Schema-driven.** Fields and defaults are declared, never inferred.
   Add a sane `defaultProps` so the block looks reasonable the moment
   it lands on the canvas.
3. **Style-tokenised.** Reach for `var(--tps-*)` instead of literal
   colours. Always provide a fallback (`var(--tps-primary, #0b60d8)`)
   so the block still paints when a host omits the variable.
4. **Brand-overridable.** Block defaults should be the package's
   neutral defaults. Tenant-specific copy goes in the host's
   `blockDefaults` map (see `examples/showcase/src/brands/*.js`).
5. **Linked through `StudioLink`.** Use the `<Link>` from
   `../context` — it falls back to `<a>` when no host Link is passed.

When adding a new block:
- Add the `.jsx` file under `packages/blocks/src/blocks/`.
- Export it from `packages/blocks/src/index.js`.
- Register it in `packages/blocks/src/config.jsx` (block map +
  category).
- Mention it in `examples/showcase/BLOCKS.md`.

## Development workflow

All commands run from the repo root unless noted.

```bash
pnpm install
pnpm build         # tsup all four packages
pnpm test          # vitest in each package
pnpm test:watch
pnpm lint
pnpm clean         # rm -rf dist/ + node_modules/ everywhere
```

Per-package work:

```bash
pnpm --filter @techrox/page-studio-blocks build
pnpm --filter @techrox/page-studio-blocks test
pnpm --filter @techrox/page-studio dev      # tsup --watch
```

Showcase (the visual tour at `examples/showcase`):

```bash
cd examples/showcase
make install        # pnpm install
make dev            # vite dev server, port 5173
make build
```

The showcase consumes the packages via `workspace:*`, so any build of
the underlying packages is immediately visible after a rebuild — no
republish dance.

## Editor → iframe boundary (important)

Puck mounts the canvas inside an iframe. The host's `<body>` and any
wrapping `[data-brand="…"]` element **do not exist** inside that
iframe. Only `<head>` styles (including `:root` rules) cross the
boundary.

`PageStudio.setCssVars(branding)` therefore writes the brand into
**both** places: an inline style on `document.documentElement` (for the
editor chrome that lives outside the iframe) *and* a `<style id="tps-brand-vars">`
tag in `<head>` whose `:root { --tps-primary: …; }` rule Puck clones
into the iframe document.

If you find yourself painting variables on a host wrapper to control
block colour, also write a `:root` rule into `<head>` — otherwise the
canvas falls back to the package defaults.

## Things to be careful about

1. **Don't add new top-level dependencies casually.** Each peer is a
   maintenance burden. The current set (Puck, AntD, AntD icons, React)
   is intentional.
2. **Keep the renderer small.** `@techrox/page-studio-renderer` is the
   only package that goes onto public pages — anything heavyweight
   (Puck, AntD form widgets, TipTap) belongs in the editor or form
   packages, not the renderer.
3. **Don't put literal brand colours in blocks.** Use
   `var(--tps-primary, #0b60d8)`. Hard-coding `#0b60d8` (or `#0F766E`,
   the legacy default) defeats per-tenant theming.
4. **`--psd-*` is reserved for component identifiers.** `--tps-*` is
   the theme prefix. They are not interchangeable.
5. **No `'use client'` directives in the packages.** They're consumed
   by Next App Router hosts that decide the client/server boundary
   themselves. Mark client-only paths via package conventions
   (`StudioLink`, `useStudio`), not Next-specific directives.
6. **Commit messages stay clean.** No `Co-Authored-By` tags or
   "Generated with …" footers anywhere in source code or commit
   messages.

## Common tasks → where to start

| Task | Start in |
|---|---|
| Add a new block | `packages/blocks/src/blocks/<Name>.jsx` + register in `config.jsx` + export from `index.js` + add to `examples/showcase/BLOCKS.md` |
| Tweak a block's defaults | The block's own file, then mention in `examples/showcase/BLOCKS.md` if the change is visible |
| Add a host-context primitive | `packages/blocks/src/context.jsx` + document in `packages/blocks/README.md` |
| Theme adjustment | `packages/blocks/src/styles.css` (`--tps-*` defaults). Editor chrome is `packages/editor/src/styles.css`. |
| Editor UX change | `packages/editor/src/{PageStudio,BuilderTopBar,BuilderEnhancements}.jsx` |
| Renderer change | `packages/renderer/src/PageStudioRender.jsx` (keep it SSR-safe and small) |
| Showcase page / brand demo | `examples/showcase/src/{pages,brands}/<file>.js` |
| Brand asset update | `examples/showcase/public/brand/*.svg` + mirror in BRAND.md if guidelines change |

## License

MIT. See [LICENSE](../LICENSE).
