// StudioContext — the single dependency-injection surface that block components
// read from. Lets blocks stay framework-agnostic: a Next.js host can pass
// `next/link`; a Vite host can pass a React Router `Link`; a server-only
// renderer can leave it unset and fall back to plain `<a>`.
//
// Design rule: every entry in `StudioContextValue` MUST have a sensible
// no-op default so a block can be used without the host configuring anything.

import { createContext, useContext } from 'react';

const DefaultLink = ({ href, children, ...rest }) => (
  <a href={href} {...rest}>{children}</a>
);

const noop = () => {};

const notConfigured = (name) => async () => {
  throw new Error(
    `[page-studio] ${name}() called but no implementation was provided via <PageStudioProvider>.`,
  );
};

const DEFAULTS = {
  // Framework-agnostic link component. Host passes next/link, RR Link, etc.
  Link: DefaultLink,
  // Site-wide brand/contact metadata. Read by blocks that surface contact info.
  site: { email: '', phone: '', social: {} },
  // Service / product catalogue. Used by ServicesGrid and ContactSection's
  // "areas of interest" select. Default: empty so blocks render gracefully.
  services: [],
  // Async function the form blocks call to submit a lead. Throws by default
  // — surfaces a clear message instead of failing silently if a host
  // accidentally drops a ContactSection on a page without wiring submitLead.
  submitLead: notConfigured('submitLead'),
  // Same shape — newsletter signups. Hosts can point both at the same backend.
  subscribeNewsletter: notConfigured('subscribeNewsletter'),
  // First-party analytics hook. Default no-op so dropping an instrumented
  // block in a host that doesn't track anything is silent.
  track: noop,
};

const StudioContext = createContext(DEFAULTS);

export function PageStudioProvider({ value, children }) {
  const merged = { ...DEFAULTS, ...(value || {}) };
  return <StudioContext.Provider value={merged}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  return useContext(StudioContext);
}

// Convenience wrapper so block code can do
//   import { StudioLink as Link } from '../StudioLink';
// and keep their JSX virtually unchanged.
export function StudioLink({ href, children, ...rest }) {
  const { Link } = useStudio();
  return <Link href={href} {...rest}>{children}</Link>;
}
