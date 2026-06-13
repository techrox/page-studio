// Pulsar — a stacked sample page for the green-on-black AI-studio vendor.
// hero → achievements → solutions → approach → mentors → goal → events → CTA.
//
// No per-block `background:'dark'` here: the page inherits whatever theme is
// active (data-tps-theme on the showcase root). Pick the "Pulsar" brand and it
// renders near-black + green; toggle the theme to light and the same layout
// renders light. Darkness is a theme, not baked into the page.

export const pulsar = {
  slug: 'pulsar',
  title: 'Pulsar',
  summary: 'Stacked demo — hero, stats, solutions, approach, mentors, goal, events, CTA.',
  data: {
    root: { props: { title: 'Pulsar' } },
    content: [
      {
        type: 'Hero',
        props: {
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
      },
      {
        type: 'MetricCards',
        props: {
          eyebrow: 'Achievements',
          heading: 'The numbers behind the work.',
          items: [
            { value: '120+', label: 'Models shipped to production', delta: '+34 this year', trend: 'up' },
            { value: '40%', label: 'Median manual-work reduction', delta: 'across engagements', trend: 'up' },
            { value: '6 wk', label: 'Idea to first prototype', delta: '−3 wk vs avg.', trend: 'up' },
            { value: '99.95%', label: 'Inference uptime', delta: '', trend: 'none' },
          ],
        },
      },
      {
        type: 'IconCards',
        props: {
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
      },
      {
        type: 'IconCards',
        props: {
          eyebrow: 'Approach',
          heading: 'How an engagement runs.',
          columns: 4,
          items: [
            { icon: 'BulbOutlined', title: 'Scope', body: 'Map the problem and agree on what success measures.' },
            { icon: 'ThunderboltOutlined', title: 'Prototype', body: 'A working model in weeks, not quarters.' },
            { icon: 'RocketOutlined', title: 'Deploy', body: 'Production rollout with monitoring from day one.' },
            { icon: 'TeamOutlined', title: 'Hand off', body: 'Documentation and training so the system is yours.' },
          ],
        },
      },
      {
        type: 'TeamGrid',
        props: {
          eyebrow: 'Mentors',
          heading: 'The people behind the work.',
          columns: 3,
          members: [
            { name: 'Dr. Anita Rao', role: 'Chief Scientist', bio: 'Fifteen years in applied ML. Leads research and model strategy.', image_url: '', linkedin: '' },
            { name: 'Marcus Lee', role: 'Head of Engineering', bio: 'Builds the pipelines that take models from notebook to production.', image_url: '', linkedin: '' },
            { name: 'Sofia Alvarez', role: 'ML Ops Lead', bio: 'Keeps every deployed system monitored, audited, and honest.', image_url: '', linkedin: '' },
          ],
        },
      },
      {
        type: 'ImageText',
        props: {
          eyebrow: 'Our goal',
          heading: 'AI you can hand to your own team.',
          body:
            'We do not build dependencies. Every system ships with documentation, training, and the monitoring to run it without us. The goal is simple: leave you with something measurable that you fully own.',
          image_url: '',
          image_alt: '',
          image_position: 'right',
          cta_label: 'How we work',
          cta_href: '/pages/about',
        },
      },
      {
        type: 'ArticleFeatured',
        props: {
          eyebrow: 'Spotlight',
          tag: 'EVENT',
          headline: 'Pulsar Summit — a day on production AI.',
          excerpt:
            'Customer talks, hands-on labs, and a look at what we are shipping next. One day, in person and online.',
          image_url: '',
          image_alt: '',
          author: 'Pulsar',
          date: 'Sep 2026',
          read_minutes: '1 day',
          link_label: 'Reserve a seat',
          link_href: '/pages/contact',
          image_position: 'right',
        },
      },
      {
        type: 'EventsList',
        props: {
          eyebrow: 'Upcoming',
          heading: 'Where we’ll be next.',
          items: [
            { date_short: 'JUL 18', date_long: 'July 18, 2026', title: 'Workshop: evaluating LLM systems', body: 'A practical session on metrics that actually predict production quality.', venue: 'Online · 90 min', cta_label: 'Register', cta_href: '#' },
            { date_short: 'AUG 09', date_long: 'August 9, 2026', title: 'Office hours: ML in regulated industries', body: 'Bring a problem; leave with an approach.', venue: 'Online · 60 min', cta_label: 'RSVP', cta_href: '#' },
            { date_short: 'SEP 20', date_long: 'September 20, 2026', title: 'Pulsar Summit', body: 'Customer talks, labs, and the roadmap reveal.', venue: 'Bengaluru', cta_label: 'Reserve', cta_href: '#' },
          ],
        },
      },
      {
        type: 'CTABanner',
        props: {
          tagline: 'LET’S BUILD',
          heading_html: 'Put AI to work<br />on something that matters.',
          body: 'Tell us where the friction is. We’ll come back with a plan and a prototype.',
          button_label: 'Start a project',
          button_href: '/pages/contact',
        },
      },
    ],
    zones: {},
  },
}
