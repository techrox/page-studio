// Server-safe renderer for Puck output. Designed to be dropped into a
// Next.js/Remix/Astro server component so the block HTML lands in the SSR
// response — no client-side render flash.
//
// `data` is the Puck JSON saved by the editor (typically stored on the
// page row in your CMS). If `data` is missing or empty we render the
// `fallback` so the host can still ship a static page when the CMS has
// no override yet.

import { Render } from '@measured/puck';
import { createPuckConfig, PageStudioProvider } from '@techrox/page-studio-blocks';

// Puck's <Render> does not auto-apply defaultProps — those only fire
// when a block is inserted via the editor drawer. We seed any missing
// fields from the resolved config so saved pages that store
// `{ type: 'Hero', props: {} }` still render with the brand's defaults.
// Existing props always win.
function applyDefaults(data, config) {
  if (!data || !Array.isArray(data.content)) return data;
  return {
    ...data,
    content: data.content.map((item) => {
      const defaults = config?.components?.[item.type]?.defaultProps;
      if (!defaults) return item;
      return { ...item, props: { ...defaults, ...(item.props || {}) } };
    }),
  };
}

export function PageStudioRender({
  data,
  config,
  fallback = null,
  studio,
}) {
  if (!data || !Array.isArray(data.content) || data.content.length === 0) {
    return fallback;
  }
  const resolved = config || createPuckConfig();
  const populated = applyDefaults(data, resolved);
  // Blocks read site/services/Link/etc. from StudioContext at render time.
  // Wrapping here means the renderer works the same whether the host is
  // server-rendered or hydrating on the client.
  return (
    <PageStudioProvider value={studio}>
      <Render config={resolved} data={populated} />
    </PageStudioProvider>
  );
}
