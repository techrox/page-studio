// Server-safe renderer for Puck output. Designed to be dropped into a
// Next.js/Remix/Astro server component so the block HTML lands in the SSR
// response — no client-side render flash.
//
// `data` is the Puck JSON saved by the editor (typically stored on the
// page row in your CMS). If `data` is missing or empty we render the
// `fallback` so the host can still ship a static page when the CMS has
// no override yet.

import { useEffect, useRef } from 'react';
import { Render } from '@puckeditor/core';
import { ConfigProvider } from 'antd';
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
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rootEl = rootRef.current;
    if (!rootEl) return;

    // Add .tps-anim class to html / documentElement if not already present
    document.documentElement.classList.add('tps-anim');

    // Query all reveal elements within this renderer instance
    const reveals = rootEl.querySelectorAll('.tps-reveal');
    if (!reveals || reveals.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      },
    );

    reveals.forEach((el) => {
      // If element is already in viewport, mark immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-in-view');
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [data]);
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

  const antdTheme = primary
    ? {
        token: {
          colorPrimary: primary,
          colorInfo: primary,
          borderRadius: 8,
        },
      }
    : undefined;

  // Blocks read site/services/Link/etc. from StudioContext at render time.
  // Wrapping here means the renderer works the same whether the host is
  // server-rendered or hydrating on the client.
  return (
    <ConfigProvider theme={antdTheme}>
      <PageStudioProvider value={studio}>
        <div ref={rootRef} className={`tps-renderer-root ${className}`.trim()} style={brandStyle}>
          <Render config={resolved} data={populated} />
        </div>
      </PageStudioProvider>
    </ConfigProvider>
  );
}
