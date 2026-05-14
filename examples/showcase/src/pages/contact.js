// Contact page — Hero (simple) + the all-in-one ContactSection, plus
// supporting blocks that show the host's other channels.

export const contact = {
  slug: 'contact',
  title: 'Contact',
  summary: 'Hero, ContactSection, contact info, map, social, newsletter.',
  data: {
    root: { props: { title: 'Contact' } },
    content: [
      {
        type: 'Hero',
        props: {
          eyebrow: 'Contact',
          heading_html: 'Say hello.',
          lede:
            'Tell us what you’re making and where you are in it. Most replies go out within a business day.',
          primary_cta_label: '',
          secondary_cta_label: '',
          variant: 'simple',
          align: 'left',
        },
      },
      { type: 'ContactSection', props: {} },
      {
        type: 'ContactInfo',
        props: {
          eyebrow: 'Other ways to reach us',
          heading: 'Direct lines',
          email: 'hello@showcase.example',
          phone: '+1 (555) 012-3456',
          address: '14 Penberth Mews\nBristol BS1 4ER, UK',
          hours: 'Mon–Fri · 9am–6pm GMT',
          background: 'soft',
        },
      },
      {
        type: 'MapEmbed',
        props: {
          embed_url:
            'https://www.openstreetmap.org/export/embed.html?bbox=-2.6005%2C51.4520%2C-2.5800%2C51.4630&layer=mapnik',
          caption: 'A short walk from Temple Meads station.',
          height: 420,
        },
      },
      {
        type: 'SocialLinks',
        props: {
          label: 'Follow along',
          align: 'center',
          items: [
            { network: 'linkedin', href: 'https://www.linkedin.com/' },
            { network: 'twitter', href: 'https://x.com/' },
            { network: 'github', href: 'https://github.com/' },
            { network: 'youtube', href: 'https://www.youtube.com/' },
          ],
          background: 'soft',
        },
      },
      { type: 'NewsletterSignup', props: {} },
    ],
    zones: {},
  },
}
