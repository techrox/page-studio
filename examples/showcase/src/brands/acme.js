// Acme Co — corporate / enterprise voice. Pretend mid-market SaaS. The
// counterpoint to Lumin: heavier register, blue palette, more cautious copy.

export const acmeDefaults = {
  Hero: {
    eyebrow: 'Acme Co · Established 1997',
    heading_html: 'Solutions that <em>scale</em>.',
    lede:
      'Enterprise-grade tooling trusted by teams worldwide. Acme has powered mission-critical workflows for nearly three decades.',
    primary_cta_label: 'Request a demo',
    primary_cta_href: '/pages/contact',
    secondary_cta_label: 'Browse capabilities',
    secondary_cta_href: '/pages/services',
    align: 'left',
    variant: 'landing',
  },
  SectionHeader: {
    eyebrow: 'Our platform',
    heading_html: 'Built for teams that can’t afford downtime.',
  },
  CTABanner: {
    tagline: 'TRUSTED AT SCALE',
    heading_html: 'Ready to standardize<br />across your organization?',
    body:
      'Talk to our enterprise team. We’ll walk through your requirements and put you in touch with reference customers.',
    button_label: 'Request a demo',
    button_href: '/pages/contact',
    background: 'soft',
  },
  PillarsRow: {
    columns: 3,
    items: [
      { icon: 'SafetyCertificateOutlined', title: 'Enterprise-grade security', text: 'SOC 2 Type II, ISO 27001, and HIPAA-compliant by default.' },
      { icon: 'CloudServerOutlined', title: '99.99% uptime SLA', text: 'Multi-region failover and 24/7 monitoring keep operations steady.' },
      { icon: 'TeamOutlined', title: 'Dedicated success', text: 'Every enterprise account gets a named CSM and quarterly business reviews.' },
    ],
  },
  ApproachSteps: {
    items: [
      { n: '01', title: 'Assess', text: 'Discovery workshops to map your existing systems and gaps.' },
      { n: '02', title: 'Plan', text: 'Phased rollout aligned with your procurement and compliance cycles.' },
      { n: '03', title: 'Deploy', text: 'White-glove implementation with dedicated solution architects.' },
      { n: '04', title: 'Support', text: 'Continuous enablement, training, and account management.' },
    ],
  },
  PrinciplesList: {
    eyebrow: 'How we operate',
    heading_html: 'Engineered for the enterprise.',
    lede: 'Three commitments that shape every decision we make.',
    label: 'OUR COMMITMENTS:',
    items: [
      { text: 'Security and compliance reviewed quarterly, not annually' },
      { text: 'Reference architectures documented for every supported deployment' },
      { text: 'Support response times measured, published, and contractually backed' },
    ],
  },
  ContactSection: {
    hero_eyebrow: 'Contact sales',
    hero_heading: 'Let’s talk about your rollout.',
    hero_lede:
      'Share a few details about your team and timeline. An enterprise account executive will reach out within one business day.',
    sidebar_heading: 'Enterprise inquiries',
    response_label: 'RESPONSE TIME',
    response_body: 'Within one business day. Same-day for existing customers.',
    form_submit_label: 'Request a demo',
  },
  TestimonialQuote: {
    quote:
      'Acme has been our system of record for six years. The platform has scaled with us through three acquisitions and a global expansion.',
    author_name: 'David Chen',
    author_role: 'VP of Operations',
    author_company: 'Continental Logistics',
  },
  Banner: {
    variant: 'dark',
    label: 'EVENT',
    title: 'Acme Summit · Sept 18–20, Chicago',
    body: 'Two days of customer talks, hands-on labs, and the roadmap reveal.',
    link_label: 'Reserve your seat',
    link_href: '/pages/contact',
  },
}

export const acmeBranding = {
  id: 'acme',
  name: 'Acme Co',
  description: 'Corporate enterprise voice. Navy palette.',
  primaryColor: '#1E40AF',
  accentColor: '#EAB308',
  inkColor: '#0F172A',
}
