// Home page — full marketing landing. Mixes brand-overridden blocks
// (Hero, PillarsRow, ApproachSteps, CTABanner, TestimonialQuote) with
// content-rich neutral blocks so the page feels finished out of the box.

export const home = {
  slug: 'home',
  title: 'Home',
  summary: 'Landing — hero, announcement, stats, pillars, process, proof, FAQ, CTA.',
  data: {
    root: { props: { title: 'Home' } },
    content: [
      {
        type: 'Banner',
        props: {
          variant: 'info',
          label: 'NEW',
          title: 'Page Studio v0.4 is shipping next week',
          body: 'Drag-and-drop, brand defaults, and an SSR-safe renderer.',
          link_label: 'Read the release notes',
          link_href: '/pages/about',
        },
      },
      { type: 'Hero', props: {} },
      {
        type: 'LogoStrip',
        props: {
          heading: 'Trusted by teams shipping production marketing sites',
          items: [
            { name: 'Northwind' },
            { name: 'Acme Co' },
            { name: 'Lumin Labs' },
            { name: 'Vector AI' },
            { name: 'Brightline' },
            { name: 'Helix' },
          ],
          background: 'soft',
        },
      },
      {
        type: 'StatsStrip',
        props: {
          items: [
            { value: '50+', label: 'Production blocks' },
            { value: '4', label: 'NPM packages' },
            { value: 'SSR', label: 'Safe by default' },
            { value: 'MIT', label: 'Licensed' },
          ],
          background: 'white',
        },
      },
      { type: 'PillarsRow', props: {} },
      { type: 'ApproachSteps', props: {} },
      {
        type: 'MetricCards',
        props: {
          eyebrow: 'By the numbers',
          heading: 'What teams ship with Page Studio.',
          items: [
            { value: '8min', label: 'Median time to first edit', delta: 'from npm install', trend: 'none' },
            { value: '50+', label: 'Production blocks', delta: 'and counting', trend: 'up' },
            { value: '0', label: 'Backend services required', delta: 'pages are plain JSON', trend: 'none' },
            { value: '< 60kb', label: 'Renderer payload', delta: 'gzipped', trend: 'down' },
          ],
          background: 'soft',
        },
      },
      { type: 'TestimonialQuote', props: {} },
      { type: 'FAQ', props: {} },
      { type: 'CTABanner', props: {} },
    ],
    zones: {},
  },
}
