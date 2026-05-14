// Services page — capability-focused. Header, capability grid, metrics,
// pricing, testimonial, FAQ, and inline + closing CTAs.

export const services = {
  slug: 'services',
  title: 'Services',
  summary: 'Capabilities grid, metrics, pricing, testimonial, FAQ, CTAs.',
  data: {
    root: { props: { title: 'Services' } },
    content: [
      {
        type: 'SectionHeader',
        props: {
          eyebrow: 'What we do',
          heading_html: 'Capabilities, <em>end to end</em>.',
          lede:
            'A short list of practices we’ve done long enough to do well. Pick one or string them together.',
          align: 'center',
          background: 'white',
          spacing: 'generous',
        },
      },
      {
        type: 'IconCards',
        props: {
          columns: 4,
          items: [
            { icon: 'BulbOutlined', title: 'Discovery', body: 'Workshops, research, and a written plan you can act on.' },
            { icon: 'AppstoreOutlined', title: 'Product design', body: 'IA, flows, and high-fidelity UI.' },
            { icon: 'ToolOutlined', title: 'Engineering', body: 'Web, mobile, and back-end. Production from day one.' },
            { icon: 'BarChartOutlined', title: 'Analytics', body: 'Tracking plans and dashboards your team will read.' },
            { icon: 'TeamOutlined', title: 'Team coaching', body: 'Embedded design and engineering with your team.' },
            { icon: 'SafetyOutlined', title: 'Audit & review', body: 'Independent reviews of a system already in flight.' },
            { icon: 'CloudOutlined', title: 'Infrastructure', body: 'Pragmatic cloud setups. No vendor lock-in for its own sake.' },
            { icon: 'CustomerServiceOutlined', title: 'Long-term support', body: 'A retainer for ongoing care after launch.' },
          ],
          background: 'soft',
        },
      },
      {
        type: 'MetricCards',
        props: {
          eyebrow: 'By the numbers',
          heading: 'What good looks like.',
          items: [
            { value: '120+', label: 'Projects shipped', delta: '+18 YoY', trend: 'up' },
            { value: '4.9/5', label: 'Average review', delta: 'across 84 surveys', trend: 'none' },
            { value: '8 wks', label: 'Median time to launch', delta: '−2 from 2024', trend: 'down' },
            { value: '92%', label: 'Repeat-client rate', delta: '+4 pts', trend: 'up' },
          ],
          background: 'white',
        },
      },
      {
        type: 'PricingTable',
        props: {
          eyebrow: 'Engagement models',
          heading: 'Three ways to work with us.',
          tiers: [
            {
              name: 'Sprint',
              price: '£14k',
              period: '/ 2 weeks',
              description: 'A fixed-scope two-week sprint. Best for discovery or a focused build.',
              features: 'Defined scope and deliverable\nSingle squad of two\nWorking session every other day\nWritten wrap-up at the end',
              cta_label: 'Book a sprint',
              cta_href: '/pages/contact',
              highlighted: false,
            },
            {
              name: 'Engagement',
              price: '£12k',
              period: '/ week',
              description: 'Embedded with your team for a defined block of months. Most common.',
              features: 'Dedicated squad of three to five\nWeekly demos and async updates\nRoadmap and risk tracking\nOptional post-engagement retainer',
              cta_label: 'Start a project',
              cta_href: '/pages/contact',
              highlighted: true,
            },
            {
              name: 'Retainer',
              price: '£6k',
              period: '/ month',
              description: 'Ongoing care after launch. Evolution, security, and on-call cover.',
              features: 'Monthly improvements backlog\nQuarterly review\nSecurity and dependency updates\nSame-day response on Severity 1',
              cta_label: 'Discuss a retainer',
              cta_href: '/pages/contact',
              highlighted: false,
            },
          ],
          background: 'soft',
        },
      },
      { type: 'TestimonialQuote', props: {} },
      { type: 'FAQ', props: {} },
      {
        type: 'InlineCTA',
        props: {
          headline: 'Have a project in mind?',
          body: 'Tell us where you are — we’ll write back within a business day.',
          button_label: 'Get in touch',
          button_href: '/pages/contact',
          background: 'primary',
        },
      },
    ],
    zones: {},
  },
}
