// Techrox — the in-house brand the page-studio packages ship under. Crisp
// product-led copy with a confident technology register. Used as the
// out-of-the-box brand on the showcase so visitors see the package's own
// identity first before exploring the per-tenant overrides.

export const techroxDefaults = {
  Hero: {
    eyebrow: 'Techrox · Page Studio',
    heading_html: 'Marketing pages your team can <em>actually</em> ship.',
    lede:
      'A schema-first block library and visual editor that drop into any React app. Bring your brand, your CMS, your stack — keep the speed.',
    primary_cta_label: 'Try the editor',
    primary_cta_href: '/editor',
    secondary_cta_label: 'Browse the blocks',
    secondary_cta_href: '/blocks',
    align: 'left',
    variant: 'landing',
  },
  SectionHeader: {
    eyebrow: 'Why teams pick Techrox',
    heading_html: 'A page builder that respects your codebase.',
  },
  CTABanner: {
    tagline: 'OPEN-SOURCE · MIT',
    heading_html: 'Spin up a brand-aware page in <em>minutes</em>.',
    body: 'Install the packages, drop in the renderer, and start composing. No backend required to start.',
    button_label: 'See the quickstart',
    button_href: '/pages/services',
    background: 'soft',
  },
  PillarsRow: {
    columns: 3,
    items: [
      { icon: 'AppstoreOutlined', title: 'Block-first', text: 'Fifty plus production blocks covering heroes, pricing, articles, contact — all themable.' },
      { icon: 'ApiOutlined', title: 'Headless-ready', text: 'Pages serialise to JSON. Render them anywhere with the SSR-safe renderer.' },
      { icon: 'BgColorsOutlined', title: 'Per-tenant defaults', text: 'Same blocks, different brand. Pass a defaults object — the editor and renderer pick it up.' },
    ],
  },
  ApproachSteps: {
    items: [
      { n: '01', title: 'Install', text: 'pnpm add @techrox/page-studio-blocks and a renderer of your choice.' },
      { n: '02', title: 'Theme', text: 'Override the CSS variables and pass your brand-defaults map.' },
      { n: '03', title: 'Compose', text: 'Drop the editor wherever your CMS lives. Pages are plain JSON.' },
      { n: '04', title: 'Render', text: 'Serve the JSON through PageStudioRender — server or client, your call.' },
    ],
  },
  PrinciplesList: {
    eyebrow: 'How we build',
    heading_html: 'Predictable.<br />Composable.<br />Boring on purpose.',
    lede: 'A short list of rules we hold the packages to.',
    label: 'EVERY BLOCK IS:',
    items: [
      { text: 'SSR-safe — no window references in the render path' },
      { text: 'Schema-driven — fields and defaults declared, never inferred' },
      { text: 'Style-tokenised — colours, radii, and spacing through CSS variables' },
    ],
  },
  ContactSection: {
    hero_eyebrow: 'Get in touch',
    hero_heading: 'Talk to the team behind Page Studio.',
    hero_lede:
      'Open-source support, custom block development, and integration help for teams putting the packages into production.',
    sidebar_heading: 'Project enquiries',
    response_label: 'TYPICAL REPLY',
    response_body: 'Within one business day, Monday to Friday.',
    form_submit_label: 'Send enquiry',
  },
  TestimonialQuote: {
    quote:
      'Techrox replaced a homegrown CMS and a stack of bespoke React components with one block library. Our marketing team ships pages without filing tickets.',
    author_name: 'Priya Iyer',
    author_role: 'Head of Engineering',
    author_company: 'Northwind Studios',
  },
  Banner: {
    variant: 'info',
    label: 'NEW',
    title: 'Page Studio v0.4 is out',
    body: 'Drag-and-drop, brand defaults, and an SSR-safe renderer.',
    link_label: 'Read the release notes',
    link_href: '/pages/about',
  },
}

export const techroxBranding = {
  id: 'techrox',
  name: 'Techrox',
  description: 'Page Studio default — product-led technology brand.',
  primaryColor: '#0B60D8',
  accentColor: '#F59E0B',
  inkColor: '#0F172A',
}
