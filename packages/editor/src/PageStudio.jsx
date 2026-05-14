'use client';

// PageStudio — the editor entry point consumers render. Wraps Puck with:
//   - an adapter for persistence (loadPage / savePage / onCreatePage)
//   - a StudioProvider that injects host primitives (Link, services, …)
//     into the block tree
//   - a replaceable top bar (header prop) with sane brand-agnostic defaults
//   - sidebar enhancements (Blocks / Layers tabs, count badges)
//
// Everything except `pageKey` is optional. Passing only `pageKey` works —
// you'll get the default block library, default top bar, and a console
// warning when Publish is clicked without an adapter wired.

import { useEffect, useMemo, useState, useTransition } from 'react';
import { Puck, useGetPuck, legacySideBarPlugin } from '@puckeditor/core';
import { App as AntdApp } from 'antd';

import {
  applyConfigDefaults,
  createPuckConfig,
  defaultOverrides,
  emptyPuckData,
  normalizePuckData,
  PageStudioProvider,
} from '@techrox/page-studio-blocks';

import BuilderEnhancements from './BuilderEnhancements.jsx';
import DefaultTopBar from './BuilderTopBar.jsx';

import '@puckeditor/core/puck.css';

// 0.21 ships a new side navigation rail. Our BuilderEnhancements observes
// the legacy `_Sidebar--left` layout, so keep that DOM by applying the
// legacy plugin once at module load.
const PSD_LEGACY_SIDEBAR = legacySideBarPlugin();

// Apply brand colors via BOTH an inline style on <html> (for the outer
// editor chrome) and a <style> tag in <head> (so Puck's iframe canvas,
// which clones head styles into its document, picks them up too). Pure
// inline styles on document.documentElement do not propagate to the
// iframe — only <style>/<link> elements do.
//
// We write to `--tps-*` because that's what the block library reads. The
// host page may also paint these vars on a wrapping element (e.g. a
// brand-switcher's `[data-brand]` div), but that element doesn't exist
// inside Puck's iframe — so without this :root injection the canvas
// falls back to the package's default values and ignores the brand.
function setCssVars(branding) {
  if (typeof document === 'undefined' || !branding) return;
  const root = document.documentElement.style;
  if (branding.primaryColor) root.setProperty('--tps-primary', branding.primaryColor);
  if (branding.accentColor) root.setProperty('--tps-accent', branding.accentColor);
  if (branding.inkColor) root.setProperty('--tps-ink', branding.inkColor);

  const lines = [];
  if (branding.primaryColor) lines.push(`--tps-primary: ${branding.primaryColor};`);
  if (branding.accentColor) lines.push(`--tps-accent: ${branding.accentColor};`);
  if (branding.inkColor) lines.push(`--tps-ink: ${branding.inkColor};`);
  if (!lines.length) return;

  let tag = document.getElementById('tps-brand-vars');
  if (!tag) {
    tag = document.createElement('style');
    tag.id = 'tps-brand-vars';
    document.head.appendChild(tag);
  }
  const next = `:root { ${lines.join(' ')} }`;
  if (tag.textContent !== next) tag.textContent = next;
}

export default function PageStudio({
  pageKey,
  initialData,
  pageTitle,
  account,
  livePath,
  homeHref,
  branding,
  studio,
  adapter = {},
  config,
  blockDefaults,
  overrides = defaultOverrides,
  header,
  headerActions,
  onSignOut,
  sidebarLabels,
  LinkComponent,
  // Forwarded to Puck. Defaults to iframe enabled — Puck v0.20 mounts the
  // @dnd-kit context inside the canvas iframe; with the iframe disabled,
  // strict-mode double-mount and Vite HMR can leave the canvas with no live
  // drop targets, so dropped blocks vanish into an empty content array.
  // Hosts that need the canvas to share the host document (e.g. to inherit
  // global CSS without copying it across) can pass { enabled: false }.
  iframe = { enabled: true },
}) {
  const { message } = AntdApp.useApp();
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState(null);

  // Resolve the config first so we can populate missing defaults on any
  // seeded data the host passed in. Puck only applies defaultProps when a
  // block is dragged in via the drawer — without this, blocks stored as
  // `{ type, props: {} }` show empty fields when the author clicks them.
  const resolvedConfig = useMemo(
    () => config || createPuckConfig({ defaults: blockDefaults }),
    [config, blockDefaults],
  );

  const [data, setData] = useState(() =>
    initialData && Array.isArray(initialData.content)
      ? applyConfigDefaults(normalizePuckData(initialData), resolvedConfig)
      : null,
  );
  const [loading, setLoading] = useState(!data && !!adapter.loadPage);

  // Apply brand CSS variables once on mount + whenever branding changes.
  useEffect(() => {
    setCssVars(branding);
  }, [branding?.primaryColor, branding?.accentColor, branding?.inkColor]);

  // Initial load when initialData wasn't server-supplied. Hosts that SSR
  // their CMS read should always pass initialData and skip this code path.
  useEffect(() => {
    if (data || !adapter.loadPage) return;
    let cancelled = false;
    setLoading(true);
    adapter.loadPage(pageKey)
      .then((loaded) => {
        if (cancelled) return;
        setData(
          loaded && Array.isArray(loaded.content)
            ? applyConfigDefaults(normalizePuckData(loaded), resolvedConfig)
            : emptyPuckData,
        );
      })
      .catch((err) => {
        if (cancelled) return;
        message.error(err?.message || 'Could not load page.');
        setData(emptyPuckData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pageKey, adapter, data, message]);

  const handlePublish = (nextData) => {
    if (!adapter.savePage) {
      message.error('No savePage adapter configured.');
      return;
    }
    startTransition(async () => {
      try {
        await adapter.savePage(pageKey, nextData);
        setSavedAt(new Date().toISOString());
        message.success('Published.');
      } catch (err) {
        message.error(err?.message || 'Save failed.');
      }
    });
  };

  // Build a Puck `overrides.header` that pulls live state via useGetPuck()
  // and forwards it to the host's top bar. Migrated from `renderHeader` —
  // Puck deprecated the render-prop form in 0.20.x.
  // NOTE: useMemo must run on every render (no early-return above), otherwise
  // we violate the rules of hooks when transitioning loading → loaded.
  const headerOverride = useMemo(() => {
    function PsdHeaderOverride() {
      const getPuck = useGetPuck();
      const props = {
        pageKey,
        pageTitle,
        account,
        livePath,
        homeHref,
        savedAt,
        pending,
        onPublish: () => handlePublish(getPuck().appState.data),
        onSignOut,
        onCreatePage: adapter.onCreatePage,
        branding,
        extraActions: headerActions,
        LinkComponent,
      };
      if (typeof header === 'function') return header(props);
      if (header) return header;
      return <DefaultTopBar {...props} />;
    }
    return PsdHeaderOverride;
  }, [
    pageKey, pageTitle, account, livePath, homeHref, savedAt, pending,
    onSignOut, adapter.onCreatePage, branding, headerActions, LinkComponent,
    header,
  ]);

  const mergedOverrides = useMemo(() => ({
    ...overrides,
    header: headerOverride,
    headerActions: () => null,
  }), [overrides, headerOverride]);

  if (loading || !data) {
    return (
      <div className="psd-builder-page psd-builder-page--loading">
        <div className="psd-builder-loading">Loading editor…</div>
      </div>
    );
  }

  return (
    <PageStudioProvider value={studio}>
      <div className="psd-builder-page">
        <BuilderEnhancements
          blocksLabel={sidebarLabels?.blocks}
          layersLabel={sidebarLabels?.layers}
        />
        <Puck
          config={resolvedConfig}
          data={data}
          overrides={mergedOverrides}
          onPublish={handlePublish}
          iframe={iframe}
          plugins={[PSD_LEGACY_SIDEBAR]}
        />
      </div>
    </PageStudioProvider>
  );
}
