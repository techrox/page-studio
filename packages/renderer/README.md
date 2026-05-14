# @techrox/page-studio-renderer

Server-safe renderer for `@techrox/page-studio` Puck output.

Use this on public pages to display whatever your admin saved in the editor. Renders to clean HTML in SSR, so search engines + users see the content immediately — no hydration flash.

```bash
pnpm add @techrox/page-studio-renderer @techrox/page-studio-blocks
pnpm add @measured/puck                            # peer
```

## Usage

Next.js App Router (server component):

```jsx
import { PageStudioRender } from '@techrox/page-studio-renderer';
import { fetchPage } from '@/lib/cms';

export default async function HomePage() {
  const data = await fetchPage('page.home');  // your CMS read
  return (
    <PageStudioRender
      data={data}
      studio={{ /* same shape as the editor */ }}
      fallback={<StaticDefault />}
    />
  );
}
```

If `data` is empty or missing, `fallback` is rendered instead — so the public site can always ship a sensible default when the CMS has no override yet.

## Props

| Prop | Type | Notes |
|---|---|---|
| `data` | `PuckData \| null` | The JSON your editor saved. Empty `content` arrays render the fallback. |
| `config` | `PuckConfig` | Optional override; default uses `createPuckConfig()`. |
| `fallback` | `ReactNode` | Rendered when `data` is missing/empty. Defaults to `null`. |
| `studio` | `StudioValue` | Forwarded to `<PageStudioProvider>` — same shape as the editor's `studio` prop. |

The renderer **must** see the same `studio` value as the editor so blocks see consistent service catalogues, Link components, and site metadata across edit + view.

## What this package wraps

`<Render>` from `@measured/puck`, plus `<PageStudioProvider>` from `@techrox/page-studio-blocks`. That's it.

You could write the same five lines yourself; this package exists so server-only consumers don't have to add the editor as an indirect dependency.

## License

MIT.
