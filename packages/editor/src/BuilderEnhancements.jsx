'use client';

// Post-mount DOM enhancements for Puck's left sidebar:
//   1. Hide Puck's "Components" / "Outline" section titles
//   2. Inject a tab bar at the top that toggles between the two sections
//   3. Inject a search input that filters the block cards by name + summary
//   4. Append a count badge to each component-category header (visible-only)
//
// IMPORTANT: every DOM mutation we make MUST be idempotent (no-op when the
// target state already matches) AND we disconnect the MutationObserver
// while applying so our own writes don't feed back into the observer and
// cause an infinite loop / tab freeze.

import { useEffect } from 'react';

const STORAGE_KEY = 'psd.builderTab';

export default function BuilderEnhancements({
  blocksLabel = 'Blocks',
  layersLabel = 'Layers',
  searchPlaceholder = 'Search blocks',
} = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let observer = null;
    // Search query persists across re-renders even if Puck wipes the sidebar
    // and we have to re-inject the input. Lives in this closure (per mount).
    let query = '';

    // Filtering is done via attributes on elements WE own (.tps-block-card
    // and _ComponentList_ groups). CSS in editor/styles.css hides the
    // matching Puck wrapper via :has(). Writing only attributes — not
    // inline styles on Puck's wrappers — keeps us out of a fight with
    // Puck's React reconciler when it re-renders the picker after a drop.
    const matchesQuery = (card, q) => {
      if (!q) return true;
      const name = (card.querySelector('.tps-block-card__name')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.tps-block-card__desc')?.textContent || '').toLowerCase();
      return name.includes(q) || desc.includes(q);
    };

    const setAttrIfChanged = (el, name, value) => {
      const current = el.getAttribute(name);
      if (value == null) {
        if (current !== null) el.removeAttribute(name);
      } else if (current !== value) {
        el.setAttribute(name, value);
      }
    };

    const applyFilter = (sidebar) => {
      const q = query.trim().toLowerCase();
      const cards = sidebar.querySelectorAll('.tps-block-card');
      cards.forEach((card) => {
        const hidden = !matchesQuery(card, q);
        setAttrIfChanged(card, 'data-psd-hidden', hidden ? 'true' : null);
      });

      // Mark the actual grid cell so it collapses out of layout — not just
      // our inner card. Puck's <DrawerItem> renders an unnamed <div> as the
      // direct child of [data-puck-drawer]; that <div> IS the grid cell.
      // Hiding only the .tps-block-card or any class-bearing inner wrapper
      // leaves the cell empty so visible matches stay in their original
      // grid slots (which is what the user was seeing). We tag the cell
      // directly here so a single CSS attribute selector can collapse it.
      const drawers = sidebar.querySelectorAll('[data-puck-drawer]');
      drawers.forEach((drawer) => {
        Array.from(drawer.children).forEach((cell) => {
          const card = cell.querySelector('.tps-block-card');
          if (!card) {
            setAttrIfChanged(cell, 'data-psd-cell-hidden', null);
            return;
          }
          const hidden = !matchesQuery(card, q);
          setAttrIfChanged(cell, 'data-psd-cell-hidden', hidden ? 'true' : null);
        });
      });

      // Hide entire category groups when all of their cards are filtered out.
      const groups = sidebar.querySelectorAll('[class*="_ComponentList_"]');
      groups.forEach((g) => {
        const items = g.querySelectorAll('.tps-block-card');
        if (!items.length) {
          setAttrIfChanged(g, 'data-psd-empty', null);
          return;
        }
        const allHidden = Array.from(items).every(
          (c) => c.getAttribute('data-psd-hidden') === 'true',
        );
        setAttrIfChanged(g, 'data-psd-empty', q && allHidden ? 'true' : null);
      });
    };

    const apply = () => {
      const sidebar = document.querySelector('[class*="_Sidebar--left"]');
      if (!sidebar) return;

      const sections = sidebar.querySelectorAll('[class*="_SidebarSection_"]');
      if (sections.length < 2) return;

      sections.forEach((s) => {
        const isComponents = !!s.querySelector('[class*="_ComponentList_"]');
        const want = isComponents ? 'components' : 'outline';
        if (s.getAttribute('data-psd-section') !== want) {
          s.setAttribute('data-psd-section', want);
        }
      });

      sections.forEach((s) => {
        const title = s.querySelector('[class*="_SidebarSection-title_"]');
        if (title && !title.hasAttribute('data-psd-hidden-title')) {
          title.setAttribute('data-psd-hidden-title', 'true');
        }
      });

      let tabs = sidebar.querySelector('.psd-sidebar-tabs');
      if (!tabs) {
        tabs = document.createElement('div');
        tabs.className = 'psd-sidebar-tabs';
        tabs.innerHTML = `
          <button type="button" class="psd-sidebar-tab" data-tab="components">${blocksLabel}</button>
          <button type="button" class="psd-sidebar-tab" data-tab="outline">${layersLabel}</button>
        `;
        sidebar.insertBefore(tabs, sidebar.firstChild);

        const setActive = (which) => {
          if (sidebar.getAttribute('data-psd-active-tab') === which) return;
          sidebar.setAttribute('data-psd-active-tab', which);
          try { sessionStorage.setItem(STORAGE_KEY, which); } catch {}
          tabs.querySelectorAll('button').forEach((b) => {
            const active = b.dataset.tab === which;
            if (b.classList.contains('is-active') !== active) {
              b.classList.toggle('is-active', active);
            }
          });
        };

        tabs.addEventListener('click', (e) => {
          const btn = e.target.closest('button[data-tab]');
          if (btn) setActive(btn.dataset.tab);
        });

        let initial = 'components';
        try { initial = sessionStorage.getItem(STORAGE_KEY) || 'components'; } catch {}
        setActive(initial);
      }

      // Search input — visible only when the components tab is active
      // (the [data-psd-active-tab="components"] CSS gate does the toggling).
      let search = sidebar.querySelector('.psd-sidebar-search');
      if (!search) {
        search = document.createElement('div');
        search.className = 'psd-sidebar-search';
        const input = document.createElement('input');
        input.type = 'search';
        input.className = 'psd-sidebar-search__input';
        input.placeholder = searchPlaceholder;
        input.setAttribute('aria-label', searchPlaceholder);
        search.appendChild(input);
        // Place directly after the tab bar.
        if (tabs.nextSibling) sidebar.insertBefore(search, tabs.nextSibling);
        else sidebar.appendChild(search);

        input.addEventListener('input', () => {
          query = input.value || '';
          applyFilter(sidebar);
        });
      }
      // Re-sync the input value across Puck re-renders.
      const searchInput = search.querySelector('input');
      if (searchInput && searchInput.value !== query) searchInput.value = query;

      applyFilter(sidebar);

      const headers = sidebar.querySelectorAll('[class*="_ComponentList-title_"]');
      headers.forEach((header) => {
        const parent = header.closest('[class*="_ComponentList_"]');
        if (!parent) return;
        const list = parent.querySelector('[class*="_ComponentList-content_"]');
        if (!list) return;
        const cards = list.querySelectorAll('.tps-block-card');
        const visible = Array.from(cards).filter(
          (c) => c.getAttribute('data-psd-hidden') !== 'true',
        ).length;
        const count = String(visible);
        let badge = header.querySelector('.psd-cat-count');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'psd-cat-count';
          badge.textContent = count;
          const chevron = header.querySelector('[class*="_ComponentList-titleIcon_"]');
          if (chevron) {
            header.insertBefore(badge, chevron);
          } else {
            header.appendChild(badge);
          }
        } else if (badge.textContent !== count) {
          badge.textContent = count;
        }
      });
    };

    const safeApply = () => {
      if (observer) observer.disconnect();
      try { apply(); } catch { /* never break the host page */ }
      if (observer) observer.observe(document.body, { childList: true, subtree: true });
    };

    safeApply();

    let queued = false;
    observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        safeApply();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (observer) observer.disconnect();
    };
  }, [blocksLabel, layersLabel, searchPlaceholder]);

  return null;
}
