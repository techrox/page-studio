// Server-safe renderer for Puck output. Designed to be dropped into a
// Next.js/Remix/Astro server component so the block HTML lands in the SSR
// response — no client-side render flash.
//
// `data` is the Puck JSON saved by the editor (typically stored on the
// page row in your CMS). If `data` is missing or empty we render the
// `fallback` so the host can still ship a static page when the CMS has
// no override yet.

import { Render } from '@puckeditor/core';
import {
  applyConfigDefaults,
  createPuckConfig,
  PageStudioProvider,
} from '@techrox/page-studio-blocks';

export function PageStudioRender({
  data,
  config,
  fallback = null,
  studio,
  branding,
  brandColor,
  className = '',
  style = {},
}) {
  if (!data || !Array.isArray(data.content) || data.content.length === 0) {
    return fallback;
  }
  const resolved = config || createPuckConfig();
  const populated = applyConfigDefaults(data, resolved);

  // Compute CSS variable overrides from branding
  const primary = branding?.primaryColor || branding?.brandColor || brandColor;
  const brandStyle = { ...style };
  if (primary) {
    brandStyle['--tps-primary'] = primary;
    if (!branding?.cssVars?.['--tps-primary-soft']) {
      brandStyle['--tps-primary-soft'] = `${primary}18`;
    }
  }
  if (branding?.accentColor) brandStyle['--tps-accent'] = branding.accentColor;
  if (branding?.inkColor) brandStyle['--tps-ink'] = branding.inkColor;
  if (branding?.cssVars) {
    Object.assign(brandStyle, branding.cssVars);
  }

  // Blocks read site/services/Link/etc. from StudioContext at render time.
  // Wrapping here means the renderer works the same whether the host is
  // server-rendered or hydrating on the client.
  return (
    <PageStudioProvider value={studio}>
      <div className={`tps-renderer-root ${className}`.trim()} style={brandStyle}>
        <Render config={resolved} data={populated} />
      </div>
    </PageStudioProvider>
  );
}
