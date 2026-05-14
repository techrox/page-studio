'use client';

// Post-mount DOM enhancements for Puck's left sidebar:
//   1. Hide Puck's "Components" / "Outline" section titles
//   2. Inject a tab bar at the top that toggles between the two sections
//   3. Append a count badge to each component-category header
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
} = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let observer = null;

    const apply = () => {
      const sidebar = document.querySelector('[class*="_Sidebar--left"]');
      if (!sidebar) return;

      const sections = sidebar.querySelectorAll('[class*="_SidebarSection_"]');
      if (sections.length < 2) return;

      // Tag each section by content so CSS targets it regardless of DOM
      // order — Puck has flipped the order between minor versions.
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

      const headers = sidebar.querySelectorAll('[class*="_ComponentList-title_"]');
      headers.forEach((header) => {
        const parent = header.closest('[class*="_ComponentList_"]');
        if (!parent) return;
        const list = parent.querySelector('[class*="_ComponentList-content_"]');
        if (!list) return;
        const count = String(list.querySelectorAll('.tps-block-card').length);
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

    // Pause the observer for the duration of our writes — without this every
    // badge update fires a mutation that calls apply, which mutates again,
    // and the tab freezes.
    const safeApply = () => {
      if (observer) observer.disconnect();
      try { apply(); } catch { /* never break the host page */ }
      if (observer) observer.observe(document.body, { childList: true, subtree: true });
    };

    safeApply();

    // Debounce mutations via rAF so a burst from Puck collapses into one pass.
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
  }, [blocksLabel, layersLabel]);

  return null;
}
