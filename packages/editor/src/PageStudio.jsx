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

// Apply brand colors + theme tokens by injecting a single <style id="tps-brand-vars">
// into <head>. Its `:root { --tps-*: … }` rule themes BOTH surfaces: the outer
// editor chrome reads it directly, and Puck clones <head> <style>/<link> nodes
// into its canvas iframe (keeping them in sync via a MutationObserver), so the
// blocks pick up the same tokens.
//
// Do NOT also write these tokens as inline styles on document.documentElement.
// It looks harmless — inline styles on the outer <html> don't "leak" into the
// iframe through the cascade — but Puck SNAPSHOTS the outer <html>'s style
// attribute onto the iframe's <html> ONCE at canvas mount and never re-syncs it.
// On a later theme flip the head <style> updates (and re-clones), but the iframe's
// inline <html> tokens stay frozen at their mount-time values. Inline styles beat
// every stylesheet rule, so those stale light tokens override the synced dark
// :root rule — the chrome goes dark while the canvas stays light. Keeping tokens
// in the <style> tag only (no inline) lets the synced :root rule win cleanly.
//
// We write to `--tps-*` because that's what the block library reads. The host
// page may also paint these vars on a wrapping element (e.g. a brand-switcher's
// `[data-brand]` div), but that element doesn't exist inside Puck's iframe — so
// without this :root injection the canvas falls back to the package defaults.
function setCssVars(branding) {
  if (typeof document === 'undefined' || !branding) return;

  const lines = [];
  if (branding.primaryColor) lines.push(`--tps-primary: ${branding.primaryColor};`);
  if (branding.accentColor) lines.push(`--tps-accent: ${branding.accentColor};`);
  if (branding.inkColor) lines.push(`--tps-ink: ${branding.inkColor};`);

  // Arbitrary theme tokens — a flat { '--tps-bg': '#141414', … } map. This is
  // how a host flips the whole canvas to a non-default theme (dark, sepia, …):
  // the iframe only inherits <head> :root rules, not a `data-tps-theme`
  // attribute on the host wrapper, so we write the resolved token values
  // straight into :root. The host picks the set; the package owns the values.
  const cssVars = branding.cssVars || {};
  for (const [k, v] of Object.entries(cssVars)) {
    if (v == null) continue;
    lines.push(`${k}: ${v};`);
  }
  if (!lines.length) return;

  // Paint the canvas backdrop from the theme's section token when supplied, so
  // plain (transparent) sections sit on the themed surface inside the iframe.
  const bg = cssVars['--tps-bg-section'];
  const canvas = bg ? ` html { background: ${bg}; }` : '';
  const next = `:root { ${lines.join(' ')} }${canvas}`;

  const existing = document.getElementById('tps-brand-vars');
  if (existing && existing.textContent === next) return;

  // Replace the node — do NOT just edit textContent. Puck clones <head> styles
  // into the canvas iframe and keeps them in sync with a MutationObserver that
  // only reacts to childList changes (nodes added/removed), not characterData.
  // Editing an existing tag's text therefore never reaches the iframe, so the
  // canvas keeps the theme it mounted with while the chrome (which reads
  // data-tps-theme directly, outside the iframe) flips — the exact split where
  // sidebars go dark but the blocks stay light. Removing + re-appending a fresh
  // node fires a childList mutation, so Puck re-clones the new tokens and the
  // canvas flips with the chrome.
  if (existing) existing.remove();
  const tag = document.createElement('style');
  tag.id = 'tps-brand-vars';
  tag.textContent = next;
  document.head.appendChild(tag);
}

export default function PageStudio({
  pageKey,
  initialData,
  pageTitle,
  account,
  livePath,
  homeHref,
  branding,
  // Active editor theme — 'light' | 'dark' | any future token-scope name.
  // Stamped as data-tps-theme on the editor root so the whole chrome (top
  // bar, sidebars, field panel, inputs) re-paints through the CSS cascade,
  // alongside the canvas (which is themed via branding.cssVars). Falls back
  // to branding.theme so a host that only passes branding still themes.
  theme,
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

  // Resolve the config ONCE on first mount and freeze the reference. Puck
  // treats `config` as a structural prop — passing a new object on every
  // brand switch makes it re-diff its block registry, drop @dnd-kit's
  // collision cache and rebuild a chunk of internal memos. That's the
  // bulk of what makes brand switching feel sluggish.
  //
  // Trade-off: a `blockDefaults` change after mount (e.g. host swapping
  // tenant defaults mid-edit) no longer updates the per-block defaults
  // applied to newly dropped blocks — those will use whatever defaults
  // were active at first mount. CSS vars (color, ink, accent) still
  // update live via setCssVars. For the showcase that's exactly what we
  // want: brand swaps repaint colors instantly without churning Puck.
  // Hosts that genuinely need brand-aware drop defaults should remount
  // PageStudio with a fresh key when they swap tenants.
  const [resolvedConfig] = useState(
    () => config || createPuckConfig({ defaults: blockDefaults }),
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

  // Single external theme switch for the editor chrome. The canvas gets its
  // theme from branding.cssVars (the iframe can't see this attribute); the
  // chrome — top bar, both sidebars, the field panel and its inputs — gets
  // it from data-tps-theme on the root below. Default 'light'.
  const resolvedTheme = theme || branding?.theme || 'light';

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
      <div
        className="psd-builder-page psd-builder-page--loading"
        data-tps-theme={resolvedTheme}
      >
        <div className="psd-builder-loading">Loading editor…</div>
      </div>
    );
  }

  return (
    <PageStudioProvider value={studio}>
      <HeaderPropsContext.Provider value={headerLive}>
        <div className="psd-builder-page" data-tps-theme={resolvedTheme}>
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
