// Lumin Labs — punchy startup voice. Pretend small studio of designers
// and engineers. Used to demonstrate the per-block `defaults` override
// (shallow-merged into each block's defaultProps when it lands on the
// canvas / renders).

export const luminDefaults = {
  Hero: {
    eyebrow: 'Lumin Labs',
    heading_html: 'Build with <em>intent</em>.',
    lede:
      'A small team shipping thoughtful tools for people who care about the details.',
    primary_cta_label: 'See the work',
    primary_cta_href: '/pages/services',
    secondary_cta_label: 'About us',
    secondary_cta_href: '/pages/about',
    align: 'left',
    variant: 'landing',
  },
  SectionHeader: {
    eyebrow: 'What we make',
    heading_html: 'Software that gets out of the way.',
  },
  CTABanner: {
    tagline: 'READY WHEN YOU ARE',
    heading_html: 'Let’s build something <em>together</em>.',
    body: 'Start a conversation — we reply within a day.',
    button_label: 'Get in touch',
    button_href: '/pages/contact',
    background: 'soft',
  },
  PillarsRow: {
    columns: 3,
    items: [
      { icon: 'BulbOutlined', title: 'Clarity first', text: 'We strip a problem down to its smallest expression before we touch a keyboard.' },
      { icon: 'ToolOutlined', title: 'Craft matters', text: 'Pixel-honest UI, well-named functions, tests that read like docs.' },
      { icon: 'ThunderboltOutlined', title: 'Ship weekly', text: 'Small, reversible releases beat heroic launches every time.' },
    ],
  },
  ApproachSteps: {
    items: [
      { n: '01', title: 'Listen', text: 'We learn the shape of the problem in your words.' },
      { n: '02', title: 'Sketch', text: 'Lo-fi flows over hi-fi designs. Iterate fast.' },
      { n: '03', title: 'Build', text: 'Production code on day one — no throwaway prototypes.' },
      { n: '04', title: 'Refine', text: 'We stay after launch, polishing what users actually touch.' },
    ],
  },
  PrinciplesList: {
    eyebrow: 'How we work',
    heading_html: 'Small team.<br />Big intent.',
    lede: 'A handful of principles we keep coming back to.',
    label: 'EVERY PROJECT IS:',
    items: [
      { text: 'Designed for the person doing the work, not the org chart' },
      { text: 'Documented enough for the next person to pick it up' },
      { text: 'Reversible — easy to roll back, easy to evolve' },
    ],
  },
  ContactSection: {
    hero_eyebrow: 'Hello',
    hero_heading: 'Tell us what you’re making.',
    hero_lede:
      'We take on a small number of projects each quarter. The earlier we hear from you, the better.',
    sidebar_heading: 'Get in touch',
    response_label: 'TYPICAL REPLY',
    response_body: 'Within one business day, often faster.',
    form_submit_label: 'Send',
  },
  TestimonialQuote: {
    quote:
      'Lumin made our product feel inevitable. Three weeks in, we shipped something we’d been failing to articulate for a year.',
    author_name: 'Maya Patel',
    author_role: 'Founder',
    author_company: 'Notebrew',
  },
  Banner: {
    variant: 'info',
    label: 'NEW',
    title: 'We’re open for Q3 projects',
    body: 'Two slots left for engagements starting in July.',
    link_label: 'See the work',
    link_href: '/pages/services',
  },
}

export const luminBranding = {
  id: 'lumin',
  name: 'Lumin Labs',
  description: 'Punchy indie-studio voice. Violet palette.',
  primaryColor: '#6D28D9',
  accentColor: '#F472B6',
  inkColor: '#1E1B4B',
}
