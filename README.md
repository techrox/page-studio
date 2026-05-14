# Page Studio

A standalone, framework-agnostic visual page builder, packaged for cross-team reuse. Built on [Puck](https://puckeditor.com).

This monorepo publishes four coordinated packages:

| Package | What it is |
|---|---|
| [`@techrox/page-studio`](./packages/editor) | The editor shell — drag-and-drop canvas, sidebar, top bar. Accepts adapter props for persistence and a `studio` context for host primitives (Link, services, analytics). |
| [`@techrox/page-studio-blocks`](./packages/blocks) | 50 production-ready content blocks (Hero, Pricing, FAQ, Contact, …) + the Puck config builder + the StudioProvider context. |
| [`@techrox/page-studio-renderer`](./packages/renderer) | Server-safe `Render` wrapper for displaying saved Puck output on a public page. |
| [`@techrox/page-studio-form`](./packages/form) | Schema-driven structured-form page editor — typed fields per page key (hero, summary, pricing rows, …) with rich text, repeaters, live preview, and revision history. Companion to the visual builder for content-shaped pages where layout is fixed. |

## Why split into packages?

- The **editor** is heavy (Puck + AntD). Only admin surfaces need it.
- The **blocks** library is shared between the editor and the renderer — both need the Puck config.
- The **renderer** is small and SSR-safe. Public pages should ship as little JS as possible.

A consumer that only renders saved Puck output on a public site can install `@techrox/page-studio-renderer` (plus its peer of blocks) and never pay the bundle cost of the editor.

## Quick start

```bash
pnpm add @techrox/page-studio @techrox/page-studio-blocks @techrox/page-studio-renderer
# peers
pnpm add @puckeditor/core antd @ant-design/icons
```

In your admin route:

```jsx
'use client';
import { PageStudio } from '@techrox/page-studio';
import '@techrox/page-studio/styles.css';
import '@techrox/page-studio-blocks/styles.css';
import NextLink from 'next/link';

export default function BuilderPage({ pageKey, initialData }) {
  return (
    <PageStudio
      pageKey={pageKey}
      initialData={initialData}
      branding={{ name: 'Acme CMS', primaryColor: '#0F766E' }}
      adapter={{
        savePage: async (key, data) => fetch(`/api/pages/${key}`, {
          method: 'PUT',
          body: JSON.stringify({ puck_data: data }),
        }),
      }}
      studio={{
        Link: NextLink,
        services: [/* your service catalogue */],
        site: { email: 'hello@acme.com', social: { linkedin: 'https://…' } },
        submitLead: async (payload) => fetch('/api/leads', { method: 'POST', body: JSON.stringify(payload) }),
        track: (type, props) => window.posthog?.capture(type, props),
      }}
    />
  );
}
```

On the public page (server component):

```jsx
import { PageStudioRender } from '@techrox/page-studio-renderer';

export default async function PublicPage() {
  const data = await fetchCmsData('page.home');
  return <PageStudioRender data={data} studio={{ /* same shape as above */ }} />;
}
```

## Development

A root `Makefile` wraps the common workflows. Run `make help` to see every target.

```bash
make install       # workspace install
make build         # build the four packages
make test          # vitest across packages
make dev           # build packages, then run the showcase dev server
make clean         # wipe dist/ + node_modules/ everywhere
```

The same things via pnpm if you prefer:

```bash
pnpm install
pnpm test          # all packages
pnpm build         # all packages
```

To consume from a local checkout (e.g., during host development), set up workspace links:

```jsonc
// host-app/package.json
{
  "dependencies": {
    "@techrox/page-studio": "file:../page-studio/packages/editor",
    "@techrox/page-studio-blocks": "file:../page-studio/packages/blocks",
    "@techrox/page-studio-renderer": "file:../page-studio/packages/renderer"
  }
}
```

Or use pnpm's `link:` protocol if your host repo is a pnpm workspace.

## Repo layout

```
page-studio/
├── packages/
│   ├── editor/      # @techrox/page-studio
│   ├── blocks/      # @techrox/page-studio-blocks
│   └── renderer/    # @techrox/page-studio-renderer
├── examples/        # Minimal usage examples
├── pnpm-workspace.yaml
└── package.json
```

Each package has its own README with the full API reference.

## Example

A working end-to-end tour — block gallery, sample pages, brand-defaults injection, and the live editor — lives in [`examples/showcase`](./examples/showcase). From the repo root: `make dev` (builds the packages, then starts the showcase on [localhost:5173](http://localhost:5173)). Or step-by-step: `cd examples/showcase && make install && make dev`.

## License

MIT.
