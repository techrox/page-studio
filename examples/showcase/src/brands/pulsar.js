// Pulsar — a dark-by-default vendor: green accents on near-black, AI-studio
// voice. Demonstrates two independent things:
//   1. A brand palette (--tps-primary / --tps-accent) set via the
//      data-brand CSS rule in styles.css.
//   2. A default *theme* (`theme: 'dark'` on the branding) — the showcase
//      flips data-tps-theme to dark when this brand is active, so the whole
//      surface re-paints near-black. The user can still toggle it to light.
//
// Note there are no `background:'dark'` props on the blocks here: darkness is
// a theme concern now, not a per-block one. The same defaults render light or
// dark depending on the active theme, which is the point — a vendor owns a
// default theme but isn't hard-wired to it.

export const pulsarDefaults = {
  Hero: {
    eyebrow: 'Pulsar',
    heading_html: 'Intelligent automation, <em>built for outcomes</em>.',
    lede:
      'We design, train, and ship AI systems that take real work off your team — measured, monitored, and yours to keep.',
    primary_cta_label: 'Book a demo',
    primary_cta_href: '/pages/contact',
    secondary_cta_label: 'See our work',
    secondary_cta_href: '/pages/services',
    align: 'left',
    variant: 'landing',
  },
  SectionHeader: {
    eyebrow: 'What we do',
    heading_html: 'From idea to deployed model.',
  },
  CTABanner: {
    tagline: 'LET’S BUILD',
    heading_html: 'Put AI to work<br />on something that matters.',
    body: 'Tell us where the friction is. We’ll come back with a plan and a prototype.',
    button_label: 'Start a project',
    button_href: '/pages/contact',
  },
  IconCards: {
    eyebrow: 'Solutions',
    heading: 'Where teams put us to work.',
    columns: 3,
    items: [
      { icon: 'RocketOutlined', title: 'Applied ML', body: 'Models trained on your data, evaluated against your metrics.' },
      { icon: 'ThunderboltOutlined', title: 'Automation', body: 'Pipelines that retire repetitive work end to end.' },
      { icon: 'BarChartOutlined', title: 'Decision support', body: 'Forecasts and signals your team will actually act on.' },
      { icon: 'SafetyCertificateOutlined', title: 'Governance', body: 'Auditable, monitored systems — no black boxes.' },
      { icon: 'BulbOutlined', title: 'Research', body: 'We prototype the hard ideas before you commit.' },
      { icon: 'TeamOutlined', title: 'Enablement', body: 'We hand the keys over and train your people.' },
    ],
  },
  ApproachSteps: {
    items: [
      { n: '01', title: 'Scope', text: 'We map the problem and agree on what success measures.' },
      { n: '02', title: 'Prototype', text: 'A working model in weeks, not quarters.' },
      { n: '03', title: 'Deploy', text: 'Production rollout with monitoring from day one.' },
      { n: '04', title: 'Hand off', text: 'Documentation and training so the system is yours.' },
    ],
  },
  MetricCards: {
    eyebrow: 'Achievements',
    heading: 'The numbers behind the work.',
    items: [
      { value: '120+', label: 'Models shipped to production', delta: '+34 this year', trend: 'up' },
      { value: '40%', label: 'Median manual-work reduction', delta: 'across engagements', trend: 'up' },
      { value: '6 wk', label: 'Idea to first prototype', delta: '−3 wk vs avg.', trend: 'up' },
      { value: '99.95%', label: 'Inference uptime', delta: '', trend: 'none' },
    ],
  },
  TeamGrid: {
    eyebrow: 'Mentors',
    heading: 'The people behind the work.',
  },
  TestimonialQuote: {
    quote:
      'Pulsar shipped a model that now handles a third of our triage. Six weeks in, it was already paying for itself.',
    author_name: 'Priya Nair',
    author_role: 'Head of Operations',
    author_company: 'Northwind Health',
  },
}

export const pulsarBranding = {
  id: 'pulsar',
  name: 'Pulsar',
  description: 'Green-on-black AI studio. Dark by default.',
  primaryColor: '#22C55E',
  accentColor: '#4ADE80',
  inkColor: '#0A0A0A',
  // Default theme for this vendor. The showcase seeds the light/dark toggle
  // from here; brands without a `theme` default to light.
  theme: 'dark',
}
