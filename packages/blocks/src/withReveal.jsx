// withReveal — wraps a Puck block's render so it gets a default subtle
// "fade up on scroll" entrance animation in production, with zero FOUC.
//
// SSR-safety: blocks render with `opacity: 1` in the initial HTML (no
// invisible content shipped to the user). The animation only kicks in
// AFTER hydration when the IntersectionObserver hook (mounted in the
// marketing layout) adds `.tps-anim` to <html>. By that point IO has
// already classified above-the-fold blocks as in-view, so they stay
// visible without a flash; below-the-fold blocks get the gentle fade-up
// as the user scrolls into them.
//
// Editor-safety: when Puck renders the block on the editor canvas
// (`puck.isEditing === true`), we skip the wrapper entirely so the
// drag-overlay stays clean and there's no animation on every preview
// render.

import { Children, cloneElement, isValidElement } from 'react';

export function withReveal(component, animation = 'fade-up') {
  const RenderWrapped = (props) => {
    const node = component.render(props);
    // In the editor canvas, render plain — no animation chrome on top.
    if (props?.puck?.isEditing) return node;
    if (!isValidElement(node)) return node;
    // Add the data attribute the IO hook reads on the OUTER element of
    // the block so the whole section animates as one unit.
    const cls = ['tps-reveal', `tps-reveal--${animation}`, node.props.className]
      .filter(Boolean)
      .join(' ');
    return cloneElement(node, {
      className: cls,
      'data-tps-reveal': animation,
    });
  };
  return { ...component, render: RenderWrapped };
}

// Expose Children as a convenience if a block needs to wrap multiple
// roots — keeps consumers off React internals.
export const _Children = Children;
