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

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
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

// The header override is passed to Puck via `overrides.header`. Puck treats
// the value as a component type — when its reference changes, React diffs
// and unmounts the old override before mounting the new one. During that
// gap Puck briefly paints its default top bar, which flashes a stock
// Publish button on screen. To avoid that we keep the override component
// reference stable for the entire lifetime of the editor and pipe live
// props (branding, savedAt, callbacks, etc.) through a context provider
// rendered by PageStudio. Live updates flow as normal context updates —
// the component never gets unmounted.
const HeaderPropsContext = createContext(null);

function StableHeaderOverride() {
  const getPuck = useGetPuck();
  const live = useContext(HeaderPropsContext);
  if (!live) return null;
  const props = {
    pageKey: live.pageKey,
    pageTitle: live.pageTitle,
    account: live.account,
    livePath: live.livePath,
    homeHref: live.homeHref,
    savedAt: live.savedAt,
    pending: live.pending,
    onPublish: () => live.handlePublish(getPuck().appState.data),
    onSignOut: live.onSignOut,
    onCreatePage: live.onCreatePage,
    branding: live.branding,
    extraActions: live.headerActions,
    LinkComponent: live.LinkComponent,
  };
  if (typeof live.header === 'function') return live.header(props);
  if (live.header) return live.header;
  return <DefaultTopBar {...props} />;
}

// `overrides.header` is referentially stable so Puck never remounts the
// override. The internal stack also stabilizes `headerActions: () => null`
// — that's how we suppress Puck's own actions area.
const NO_OP_ACTIONS = () => null;
function buildStableOverrides(hostOverrides) {
  return { ...hostOverrides, header: StableHeaderOverride, headerActions: NO_OP_ACTIONS };
}

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

  // Apply brand CSS variables synchronously during render — before Puck
  // mounts its iframe and before the first paint. Running this in useEffect
  // makes the canvas paint once with the package-default teal and then
  // repaint when the effect commits, producing a visible colour flash on
  // every load. The function is idempotent (it only writes when the head
  // <style> content actually differs) so repeated calls during strict-mode
  // double-render are a no-op.
  setCssVars(branding);

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

  // Live values consumed by the stable header override via context. The
  // context VALUE may change every render — that's fine, it triggers a
  // normal re-render of StableHeaderOverride. The override COMPONENT
  // reference (passed to Puck via overrides.header) never changes, so
  // Puck never unmounts it. That's what kills the default-button flash
  // on brand switch.
  const headerLive = useMemo(() => ({
    pageKey,
    pageTitle,
    account,
    livePath,
    homeHref,
    savedAt,
    pending,
    handlePublish,
    onSignOut,
    onCreatePage: adapter.onCreatePage,
    branding,
    headerActions,
    LinkComponent,
    header,
  }), [
    pageKey, pageTitle, account, livePath, homeHref, savedAt, pending,
    handlePublish, onSignOut, adapter.onCreatePage, branding, headerActions,
    LinkComponent, header,
  ]);

  // Build the overrides object ONCE per `overrides` prop change. The
  // header slot is the stable component declared at module scope —
  // brand swaps don't invalidate the reference.
  const mergedOverrides = useMemo(
    () => buildStableOverrides(overrides),
    [overrides],
  );

  if (loading || !data) {
    return (
      <div className="psd-builder-page psd-builder-page--loading">
        <div className="psd-builder-loading">Loading editor…</div>
      </div>
    );
  }

  return (
    <PageStudioProvider value={studio}>
      <HeaderPropsContext.Provider value={headerLive}>
        <div className="psd-builder-page">
          <BuilderEnhancements
            blocksLabel={sidebarLabels?.blocks}
            layersLabel={sidebarLabels?.layers}
            searchPlaceholder={sidebarLabels?.search}
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
      </HeaderPropsContext.Provider>
    </PageStudioProvider>
  );
}
