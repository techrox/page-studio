# @techrox/page-studio-blocks

50 production-ready content blocks + the Puck config builder + the StudioProvider context.

Shared by both `@techrox/page-studio` (editor) and `@techrox/page-studio-renderer` (public render).

```bash
pnpm add @techrox/page-studio-blocks
pnpm add @puckeditor/core antd @ant-design/icons   # peers
```

## Block catalogue

| Category | Blocks |
|---|---|
| **Page sections** | Hero, SectionHeader, CTABanner, Banner, AnnouncementBar, InlineCTA |
| **Content** | RichText, PrinciplesList, TwoColumn, ThreeColumn, ImageText, Quote, KeyValueList, Container, CodeBlock |
| **Cards** | IconCards, MetricCards, ImageOverlayCards |
| **Pricing** | PricingTable, PricingComparison |
| **Lists** | StatsStrip, CountUpStats, PillarsRow, ApproachSteps, StepsVertical, ServicesGrid, TeamGrid |
| **Articles** | ArticleFeatured, ArticleGrid, ArticleList |
| **Trust** | LogoStrip, PressMentions, AwardsBar, TestimonialQuote, TestimonialGrid |
| **Interactive** | FAQ, AccordionBlock, TabsBlock, Timeline, EventsList |
| **Media** | VideoEmbed, ImageGallery, ImageCaption, MapEmbed |
| **Forms** | ContactSection, NewsletterSignup, ContactInfo, SocialLinks |
| **Layout** | Spacer, Divider, RawHtml |

Each block is a Puck-shaped object: `{ label, fields, defaultProps, render }`.

## Usage

```jsx
import { createPuckConfig, PageStudioProvider } from '@techrox/page-studio-blocks';
import '@techrox/page-studio-blocks/styles.css';

const config = createPuckConfig();   // all 50 blocks + reveal animations
```

To swap or extend blocks:

```jsx
import { createPuckConfig, defaultBlocks, Hero } from '@techrox/page-studio-blocks';
import { MyBlock } from './my-block';

const config = createPuckConfig({
  blocks: {
    ...defaultBlocks,
    Hero: MyCustomHero,   // override
    MyBlock,              // add
  },
  categories: {
    ...defaultCategories,
    Custom: { components: ['MyBlock'] },
  },
});
```

## StudioProvider

Several blocks need host-provided primitives at render time. Wrap your editor *and* your renderer:

```jsx
import { PageStudioProvider } from '@techrox/page-studio-blocks';
import NextLink from 'next/link';

<PageStudioProvider value={{
  Link: NextLink,                                    // optional, default <a>
  services: [{ slug, short, eyebrow, summary, icon }],
  site: { email, phone, social: { linkedin } },
  submitLead: async (payload) => { /* POST to your backend */ },
  subscribeNewsletter: async (payload) => { /* POST */ },
  track: (eventType, props) => analytics.capture(eventType, props),
}}>
  {/* <PageStudio /> or <PageStudioRender /> */}
</PageStudioProvider>
```

| Key | Type | Default | Used by |
|---|---|---|---|
| `Link` | `Component<{ href, children, ... }>` | `<a>` | Any block with links (Hero, CTABanner, ServicesGrid, …) |
| `services` | `Service[]` | `[]` | `ServicesGrid`, `ContactSection` |
| `site` | `{ email, phone, social }` | `{ email: '', phone: '', social: {} }` | `ContactSection` |
| `submitLead` | `(payload) => Promise<void>` | throws | `ContactSection` |
| `subscribeNewsletter` | `(payload) => Promise<void>` | throws | `NewsletterSignup` |
| `track` | `(type, props) => void` | no-op | `ContactSection` (and any host-extended blocks) |

Service shape:

```ts
type Service = {
  slug: string;
  short: string;        // short label, shown in cards + the dropdown
  eyebrow?: string;
  summary?: string;
  icon: React.ComponentType;
};
```

## Required host CSS

Blocks reference typography/layout classes the host provides. The full list:

| Class | Purpose |
|---|---|
| `.tps-section`, `.tps-section-soft` | Standard section wrapper + soft-background variant |
| `.tps-container` | Max-width centered container |
| `.tps-hero`, `.tps-hero-inner` | Hero block's gradient-halo variant |
| `.tps-service-hero` | ContactSection's hero region |
| `.tps-eyebrow` | Small caps eyebrow text |
| `.tps-h1`, `.tps-h2`, `.tps-h3` | Brand heading sizes |
| `.tps-lede` | Lede paragraph |
| `.tps-form-card` | ContactSection form card |
| `.tps-service-icon` | Wrapper for service icons in ServicesGrid |

CSS variables (with `--psd-*` defaults in the package's styles.css):

| Variable | Default |
|---|---|
| `--psd-primary` | `#0F766E` |
| `--psd-primary-dark` | `#0B5550` |
| `--psd-accent` | `#F59E0B` |
| `--psd-ink` | `#0F172A` |
| `--psd-muted` | `#64748B` |
| `--psd-line` | `#E2E8F0` |
| `--psd-bg-soft` | `#F8FAFC` |
| `--psd-radius` | `8px` |

Many blocks also read `--tps-*` legacy variables for backwards compatibility with the original Page Studio host — alias these to your brand if you don't want to rewrite block code.

## Exports

- `createPuckConfig({ blocks?, categories?, reveal?, root? })`
- `defaultBlocks`, `defaultCategories`, `defaultOverrides`, `emptyPuckData`
- `PageStudioProvider`, `useStudio`, `StudioLink`
- `withReveal(block, animation)` — wrap a block with a scroll-reveal animation
- `BlockThumbnail`, `BLOCK_DESCRIPTIONS` — picker preview helpers
- Every block by name (e.g. `Hero`, `RichText`, `Spacer`) for cherry-picking

## License

MIT.
