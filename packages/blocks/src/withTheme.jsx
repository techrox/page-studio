// withTheme — gives EVERY block a per-block theme control, for free.
//
// A theme is just a re-scope of the neutral --tps-* tokens (see the "Themes"
// section in styles.css). Setting `data-tps-theme="<name>"` on any element
// re-paints it and its descendants through the CSS cascade — no per-block
// code. This HOC does exactly that at the block level:
//
//   1. It injects a shared `theme` field into the block's field panel, so an
//      author can theme a single block independently of the page/site theme.
//   2. On render it clones the block's outermost element and stamps
//      `data-tps-theme` onto it when the author picks a non-inherit value.
//
// Default is '' ("Inherit") — the block follows whatever theme the page or
// site sets, which is the common case. Pick "Dark" on one block and only that
// block flips, regardless of the surrounding theme.
//
// Adding a future theme (e.g. "sepia") is one entry in THEME_OPTIONS below
// plus one CSS rule in styles.css. No block, and nothing here, changes.
//
// SSR-safe: no window/document. Works identically in the editor canvas and on
// a rendered page (unlike withReveal, we do NOT skip in the editor — the
// author needs to see the theme they picked while editing).

import { cloneElement, isValidElement } from 'react';

// The single source of truth for which themes a block can be set to. Keep the
// values in sync with the `[data-tps-theme="…"]` rules in styles.css. The
// empty value means "inherit the surrounding theme" and stamps no attribute.
export const THEME_OPTIONS = [
  { label: 'Inherit', value: '' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export const themeField = {
  type: 'select',
  label: 'Theme',
  options: THEME_OPTIONS,
};

export function withTheme(component) {
  const fields = { ...(component.fields || {}), theme: themeField };
  const defaultProps = { theme: '', ...(component.defaultProps || {}) };

  const RenderThemed = (props) => {
    const node = component.render(props);
    const theme = props?.theme;
    // Inherit (or unset / unknown) → render untouched, follow the cascade.
    if (!theme || !isValidElement(node)) return node;
    return cloneElement(node, { 'data-tps-theme': theme });
  };

  return { ...component, fields, defaultProps, render: RenderThemed };
}
