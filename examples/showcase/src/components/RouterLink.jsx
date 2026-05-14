// Thin shim that forwards block CTAs to react-router's Link for in-app
// navigation. The block library expects a component shaped like
// `<Link href="…">children</Link>` (matching next/link's signature); RR
// uses `to="…"`, so we adapt here.
//
// External URLs and anchor links pass through to a plain <a> so the
// browser handles them natively. Same for empty hrefs (rendered as
// non-interactive spans so the block doesn't error).

import { Link as RRLink } from 'react-router-dom'

export default function RouterLink({ href, children, ...rest }) {
  if (!href) {
    return <span {...rest}>{children}</span>
  }
  const isExternal = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
  const isAnchor = href.startsWith('#')
  if (isExternal || isAnchor) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <RRLink to={href} {...rest}>
      {children}
    </RRLink>
  )
}
