// About page — narrative-shaped. Hero + principles + history + team +
// timeline + awards + count-up stats + testimonial grid + CTA.

export const about = {
  slug: 'about',
  title: 'About',
  summary: 'Story, principles, team, history, awards, voices, CTA.',
  data: {
    root: { props: { title: 'About' } },
    content: [
      {
        type: 'Hero',
        props: {
          eyebrow: 'About',
          heading_html: 'A small team. A <em>clear</em> way of working.',
          lede:
            'We come from product, design, and operations. We build the kind of teams we wish we’d worked on.',
          primary_cta_label: 'See our work',
          primary_cta_href: '/pages/services',
          secondary_cta_label: 'Get in touch',
          secondary_cta_href: '/pages/contact',
          variant: 'simple',
          align: 'left',
        },
      },
      { type: 'PrinciplesList', props: {} },
      {
        type: 'TwoColumn',
        props: {
          left_heading: 'Where we started',
          left_body:
            'A handful of friends doing freelance work for clients we believed in. The kind of projects where you want to put your name on the result.',
          right_heading: 'Where we are now',
          right_body:
            'A studio of eight, working with growing teams across software, hardware, and operations. The same care, more capacity.',
          background: 'white',
        },
      },
      {
        type: 'CountUpStats',
        props: {
          eyebrow: 'A decade in',
          heading: 'A few things we’re proud of.',
          items: [
            { value: 120, suffix: '+', label: 'Projects shipped' },
            { value: 32, label: 'Teams we’ve worked with' },
            { value: 14, suffix: ' yrs', label: 'In practice' },
            { value: 92, suffix: '%', label: 'Repeat clients' },
          ],
          background: 'soft',
        },
      },
      { type: 'TeamGrid', props: {} },
      { type: 'Timeline', props: {} },
      {
        type: 'AwardsBar',
        props: {
          heading: 'Awards and accreditations',
          items: [
            { title: 'Studio of the Year', body: 'Design Week, finalist', year: '2025' },
            { title: 'Top 50 Indie Studios', body: 'WebDesigner Depot', year: '2024' },
            { title: 'ISO 27001', body: 'Information security certified', year: '2024' },
            { title: 'B Corp', body: 'Certified since 2022', year: '2022' },
          ],
          background: 'white',
        },
      },
      { type: 'TestimonialGrid', props: {} },
      { type: 'CTABanner', props: {} },
    ],
    zones: {},
  },
}
