# @techrox/page-studio

[![npm](https://img.shields.io/npm/v/@techrox/page-studio?color=0b60d8&label=npm)](https://www.npmjs.com/package/@techrox/page-studio)
[![downloads](https://img.shields.io/npm/dm/@techrox/page-studio?color=64748b&label=downloads)](https://www.npmjs.com/package/@techrox/page-studio)
[![size](https://img.shields.io/bundlephobia/minzip/@techrox/page-studio?color=64748b&label=minzip)](https://bundlephobia.com/package/@techrox/page-studio)
[![license](https://img.shields.io/badge/license-MIT-64748b)](../../LICENSE)

The editor shell for Page Studio — a drop-in `<PageStudio />` component that gives you a visual page builder backed by [Puck](https://puckeditor.com).

```bash
pnpm add @techrox/page-studio @techrox/page-studio-blocks
pnpm add @puckeditor/core antd @ant-design/icons   # peers
```

## Usage

```jsx
'use client';

import { PageStudio } from '@techrox/page-studio';
import '@techrox/page-studio/styles.css';
import '@techrox/page-studio-blocks/styles.css';

export default function BuilderRoute({ pageKey, initialData }) {
  return (
    <PageStudio
      pageKey={pageKey}
      initialData={initialData}
      pageTitle="About us"
      adapter={{
        savePage: async (key, data) => api.savePage(key, data),
        loadPage: async (key) => api.loadPage(key),       // optional if initialData is provided
        onCreatePage: () => router.push('/admin/pages/new'),  // optional — shows "New page" button
      }}
      branding={{
        name: 'Acme CMS',
        logo: <SvgLogo />,
        primaryColor: '#0F766E',
      }}
      studio={{ Link, services, site, submitLead, track }}
      account={{ name: 'Jane', email: 'jane@acme.com' }}
      onSignOut={() => signOut()}
      homeHref="/admin/pages"
      livePath="/about"
    />
  );
}
```

## Props

| Prop | Type | Notes |
|---|---|---|
| `pageKey` | `string` | **Required.** Logical key for the page; passed to adapter functions. |
| `initialData` | `PuckData` | Optional. If supplied, `loadPage` is skipped — best for SSR. |
| `pageTitle` | `string` | Human-readable label shown in the top bar crumb. |
| `adapter` | `{ loadPage?, savePage?, onCreatePage? }` | Async functions the editor calls. `savePage` is required for publish. If `onCreatePage` is set, a "New page" button appears in the top bar. |
| `studio` | `StudioValue` | Forwarded to `<PageStudioProvider>` so blocks see `Link`, `services`, `site`, `submitLead`, `subscribeNewsletter`, `track`. See `@techrox/page-studio-blocks`. |
| `branding` | `{ name?, logo?, primaryColor?, accentColor?, inkColor? }` | Drives the top-bar identity + CSS variables (`--psd-primary`, `--psd-accent`, `--psd-ink`). |
| `header` | `ReactNode \| (props) => ReactNode` | Fully replace the default top bar. If a function, receives `{ pageKey, pageTitle, account, livePath, savedAt, pending, onPublish, onSignOut, onCreatePage, branding, extraActions, LinkComponent }`. |
| `headerActions` | `ReactNode` | Extra buttons appended to the default top bar (between View live + Publish). |
| `account` | `{ name, email }` | If set, an avatar/dropdown appears at the top right. |
| `onSignOut` | `() => void` | Optional sign-out handler for the account dropdown. |
| `homeHref` | `string` | If set, the brand mark + "Admin home" menu entry link here. |
| `livePath` | `string` | If set, a "View live" button opens this path in a new tab. |
| `config` | `PuckConfig` | Override the Puck config (use `createPuckConfig` from blocks). |
| `overrides` | `PuckOverrides` | Override Puck overrides (defaults to the block-card drawer item). |
| `sidebarLabels` | `{ blocks?, layers? }` | Labels for the injected sidebar tabs. Default: "Blocks" / "Layers". |
| `LinkComponent` | `Component` | Component used for top-bar links (defaults to `<a>`). Pass `next/link` or React Router's `Link` for client-side navigation. |

## What the editor renders

The default top bar shows:

- Brand mark + name on the left (links to `homeHref` if set)
- Page title crumb in the centre
- Right side: optional `headerActions`, optional "New page" (if `onCreatePage` set), optional "View live" (if `livePath` set), the **Publish** button, optional account avatar

The sidebar is Puck's, enhanced with:

- A **Blocks / Layers** tab bar at the top
- A count badge on each component category header

These enhancements live in `BuilderEnhancements.jsx` and are pure post-mount DOM mutations against Puck's emitted classnames — kept resilient to minor Puck version changes by tagging sections via content rather than DOM order.

## Adapter contract

```ts
type Adapter = {
  loadPage?:    (pageKey: string) => Promise<PuckData>;
  savePage?:    (pageKey: string, data: PuckData) => Promise<void>;
  onCreatePage?: () => void;
};
```

- The editor **does not** know how you persist data. JWT, session cookies, signed URLs, anything — `savePage` is your line of integration.
- Both `loadPage` and `savePage` should throw on failure. The editor turns errors into AntD message toasts.
- `onCreatePage` is a *callback*, not an adapter function — typically just `router.push('/new')`. The button stays hidden unless the prop is set.

## Customising the top bar

For small additions, use `headerActions` to slot extra buttons next to Publish.

For full control, pass `header` as a render function:

```jsx
<PageStudio
  header={({ onPublish, pending, pageTitle }) => (
    <MyCustomBar title={pageTitle} onPublish={onPublish} saving={pending} />
  )}
  // ...
/>
```

Your function receives all the same props the default top bar uses, so you can pick and choose what to render.

## Required host CSS

The editor ships:

- `@techrox/page-studio/styles.css` — editor chrome (top bar, sidebar tabs, loading state)
- `@techrox/page-studio-blocks/styles.css` — block-card picker UI + reveal animations

Block typography classes (`.tps-h1`, `.tps-section`, `.tps-container`, `.tps-lede`, etc.) are **not** in the package — they live in your host stylesheet. The blocks reference these class names but expect the host to define them. See `@techrox/page-studio-blocks` README for the full list.

## License

MIT.

## Credits

**Page Studio** is built and maintained by [Techlathon](https://www.techlathon.com/).

Made with ♥ in India.

### Work with us

Have a project in mind? We'd love to hear from you — reach out at **[info@techlathon.com](mailto:info@techlathon.com)**.

---

<p align="center">
  Built with <a href="https://techrox.github.io/page-studio/editor">Page Studio</a> · © Techlathon
</p>
