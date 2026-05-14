// Puck config builder. Exports the default block library + a `createPuckConfig`
// factory so consumers can add their own blocks, replace categories, or strip
// the library down to what they actually need.
//
// Adding a block: drop the file under `src/blocks/`, import it here, add it
// to `defaultBlocks` + (optionally) a category. Consumers who want to extend
// the library do the same with their own files and pass them via `blocks:`.

import { Hero } from './blocks/Hero';
import { StatsStrip } from './blocks/StatsStrip';
import { SectionHeader } from './blocks/SectionHeader';
import { RichText } from './blocks/RichText';
import { PillarsRow } from './blocks/PillarsRow';
import { ApproachSteps } from './blocks/ApproachSteps';
import { ServicesGrid } from './blocks/ServicesGrid';
import { CTABanner } from './blocks/CTABanner';
import { PrinciplesList } from './blocks/PrinciplesList';
import { TwoColumn } from './blocks/TwoColumn';
import { Spacer } from './blocks/Spacer';
import { RawHtml } from './blocks/RawHtml';
import { ContactSection } from './blocks/ContactSection';
import { ImageText } from './blocks/ImageText';
import { VideoEmbed } from './blocks/VideoEmbed';
import { LogoStrip } from './blocks/LogoStrip';
import { TestimonialQuote } from './blocks/TestimonialQuote';
import { TestimonialGrid } from './blocks/TestimonialGrid';
import { FAQ } from './blocks/FAQ';
import { Timeline } from './blocks/Timeline';
import { NewsletterSignup } from './blocks/NewsletterSignup';
import { TeamGrid } from './blocks/TeamGrid';
import { Banner } from './blocks/Banner';
import { ArticleFeatured } from './blocks/ArticleFeatured';
import { ArticleGrid } from './blocks/ArticleGrid';
import { ArticleList } from './blocks/ArticleList';
import { IconCards } from './blocks/IconCards';
import { MetricCards } from './blocks/MetricCards';
import { ImageOverlayCards } from './blocks/ImageOverlayCards';
import { PricingTable } from './blocks/PricingTable';
import { PricingComparison } from './blocks/PricingComparison';
import { AwardsBar } from './blocks/AwardsBar';
import { CountUpStats } from './blocks/CountUpStats';
import { ImageGallery } from './blocks/ImageGallery';
import { ImageCaption } from './blocks/ImageCaption';
import { InlineCTA } from './blocks/InlineCTA';
import { AnnouncementBar } from './blocks/AnnouncementBar';
import { Quote } from './blocks/Quote';
import { CodeBlock } from './blocks/CodeBlock';
import { KeyValueList } from './blocks/KeyValueList';
import { StepsVertical } from './blocks/StepsVertical';
import { TabsBlock } from './blocks/Tabs';
import { AccordionBlock } from './blocks/AccordionBlock';
import { SocialLinks } from './blocks/SocialLinks';
import { ContactInfo } from './blocks/ContactInfo';
import { MapEmbed } from './blocks/MapEmbed';
import { EventsList } from './blocks/EventsList';
import { Divider } from './blocks/Divider';
import { ThreeColumn } from './blocks/ThreeColumn';
import { PressMentions } from './blocks/PressMentions';
import { Container } from './blocks/Container';
import { withReveal } from './withReveal';
import BlockThumbnail, { BLOCK_DESCRIPTIONS } from './BlockThumbnail';

// Default reveal animation per block. Heavier "section" blocks fade up;
// secondary cards/grids do a gentler scale-in. Layout primitives stay static.
const DEFAULT_REVEAL = {
  Hero: 'fade-up',
  SectionHeader: 'fade-up',
  CTABanner: 'fade-up',
  Banner: null,
  RichText: 'fade-up',
  PrinciplesList: 'fade-up',
  TwoColumn: 'fade-up',
  ImageText: 'fade-up',
  StatsStrip: 'scale-in',
  PillarsRow: 'fade-up',
  ApproachSteps: 'fade-up',
  ServicesGrid: 'fade-up',
  TeamGrid: 'fade-up',
  LogoStrip: 'scale-in',
  TestimonialQuote: 'fade-up',
  TestimonialGrid: 'fade-up',
  FAQ: 'fade-up',
  Timeline: 'fade-up',
  VideoEmbed: 'scale-in',
  ContactSection: 'fade-up',
  NewsletterSignup: 'fade-up',
  ArticleFeatured: 'fade-up',
  ArticleGrid: 'fade-up',
  ArticleList: 'fade-up',
  IconCards: 'fade-up',
  MetricCards: 'fade-up',
  ImageOverlayCards: 'fade-up',
  PricingTable: 'fade-up',
  PricingComparison: 'fade-up',
  AwardsBar: 'fade-up',
  CountUpStats: 'fade-up',
  ImageGallery: 'fade-up',
  ImageCaption: 'fade-up',
  InlineCTA: 'fade-up',
  AnnouncementBar: null,
  Quote: 'fade-up',
  CodeBlock: 'fade-up',
  KeyValueList: 'fade-up',
  StepsVertical: 'fade-up',
  TabsBlock: 'fade-up',
  AccordionBlock: 'fade-up',
  SocialLinks: 'scale-in',
  ContactInfo: 'fade-up',
  MapEmbed: 'fade-up',
  EventsList: 'fade-up',
  Divider: null,
  ThreeColumn: 'fade-up',
  PressMentions: 'scale-in',
  Container: 'fade-up',
  Spacer: null,
  RawHtml: null,
};

export const defaultBlocks = {
  Hero,
  SectionHeader,
  CTABanner,
  Banner,
  RichText,
  PrinciplesList,
  TwoColumn,
  ImageText,
  StatsStrip,
  PillarsRow,
  ApproachSteps,
  ServicesGrid,
  TeamGrid,
  LogoStrip,
  TestimonialQuote,
  TestimonialGrid,
  FAQ,
  Timeline,
  VideoEmbed,
  ContactSection,
  NewsletterSignup,
  ArticleFeatured,
  ArticleGrid,
  ArticleList,
  IconCards,
  MetricCards,
  ImageOverlayCards,
  PricingTable,
  PricingComparison,
  AwardsBar,
  CountUpStats,
  ImageGallery,
  ImageCaption,
  InlineCTA,
  AnnouncementBar,
  Quote,
  CodeBlock,
  KeyValueList,
  StepsVertical,
  TabsBlock,
  AccordionBlock,
  SocialLinks,
  ContactInfo,
  MapEmbed,
  EventsList,
  Divider,
  ThreeColumn,
  PressMentions,
  Container,
  Spacer,
  RawHtml,
};

// Sidebar grouping for Puck's components panel. Authors browse by category.
export const defaultCategories = {
  'Page sections': {
    components: ['Hero', 'SectionHeader', 'CTABanner', 'Banner', 'AnnouncementBar', 'InlineCTA'],
  },
  Content: {
    components: ['RichText', 'PrinciplesList', 'TwoColumn', 'ThreeColumn', 'ImageText', 'Quote', 'KeyValueList', 'Container', 'CodeBlock'],
  },
  Cards: {
    components: ['IconCards', 'MetricCards', 'ImageOverlayCards'],
  },
  Pricing: {
    components: ['PricingTable', 'PricingComparison'],
  },
  Lists: {
    components: ['StatsStrip', 'CountUpStats', 'PillarsRow', 'ApproachSteps', 'StepsVertical', 'ServicesGrid', 'TeamGrid'],
  },
  Articles: {
    components: ['ArticleFeatured', 'ArticleGrid', 'ArticleList'],
  },
  Trust: {
    components: ['LogoStrip', 'PressMentions', 'AwardsBar', 'TestimonialQuote', 'TestimonialGrid'],
  },
  Interactive: {
    components: ['FAQ', 'AccordionBlock', 'TabsBlock', 'Timeline', 'EventsList'],
  },
  Media: {
    components: ['VideoEmbed', 'ImageGallery', 'ImageCaption', 'MapEmbed'],
  },
  Forms: {
    components: ['ContactSection', 'NewsletterSignup', 'ContactInfo', 'SocialLinks'],
  },
  Layout: {
    components: ['Spacer', 'Divider', 'RawHtml'],
  },
};

function prettyName(name) {
  return String(name || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2');
}

// Default Puck overrides — replaces the drawer item with our block-card UI
// (preview + name + description) backed by BlockThumbnail.
export const defaultOverrides = {
  drawerItem: ({ name }) => {
    const label = prettyName(name);
    const desc = BLOCK_DESCRIPTIONS[name] || '';
    return (
      <div className="tps-block-card" title={desc}>
        <div className="tps-block-card__preview">
          <BlockThumbnail name={name} />
        </div>
        <div className="tps-block-card__text">
          <div className="tps-block-card__name">{label}</div>
          {desc && <div className="tps-block-card__desc">{desc}</div>}
        </div>
      </div>
    );
  },
};

// Default empty Puck payload — used when no saved data exists for a page yet.
export const emptyPuckData = {
  root: { props: { title: '' } },
  content: [],
  zones: {},
};

// Puck v0.20 keys every component in content[] by props.id (it's the lookup
// into indexes.nodes). Seed/CMS payloads that omit ids — or that re-use the
// same id across instances — cause Layer/DropZoneChild renders to crash with
// "Cannot read properties of undefined (reading 'data')" and silently merge
// dropped blocks into a single ghost node. We normalize defensively here so
// hosts can author plain `{ type, props: {} }` entries without ceremony.
function makeBlockId(type) {
  const suffix =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${type || 'block'}-${suffix}`;
}

export function normalizePuckData(input) {
  if (!input || typeof input !== 'object') return input;
  if (!Array.isArray(input.content)) return input;
  let mutated = false;
  const seen = new Set();
  const content = input.content.map((item) => {
    if (!item || typeof item !== 'object') return item;
    const props = item.props || {};
    const existing = typeof props.id === 'string' && props.id ? props.id : '';
    if (existing && !seen.has(existing)) {
      seen.add(existing);
      return item;
    }
    const id = makeBlockId(item.type);
    seen.add(id);
    mutated = true;
    return { ...item, props: { ...props, id } };
  });
  return mutated ? { ...input, content } : input;
}

// Factory: builds a Puck config from defaults + caller overrides. Consumers
// can extend `blocks`, replace `categories`, or pass `reveal: null` to skip
// the scroll-reveal wrapping entirely.
//
// `defaults` is the brand-injection point: a record keyed by block name whose
// values shallow-merge over each block's intrinsic `defaultProps` when the
// component first lands in the canvas. Lets hosts ship tenant-specific copy
// (from DB or a static file) without forking the package's block files.
// Shallow merge — pass the full replacement array for `items` / `stages` etc.
//
// Signature kept deliberately small. Tweak via spread; don't pass options we
// can derive (e.g. categories use whatever component names exist in blocks).
export function createPuckConfig({
  blocks = defaultBlocks,
  categories = defaultCategories,
  reveal = DEFAULT_REVEAL,
  defaults,
  root = { fields: { title: { type: 'text', label: 'Page label (admin only)' } } },
} = {}) {
  const components = {};
  for (const [name, block] of Object.entries(blocks)) {
    const animation = reveal && reveal[name];
    const override = defaults && defaults[name];
    const withDefaults = override
      ? { ...block, defaultProps: { ...(block.defaultProps || {}), ...override } }
      : block;
    components[name] = animation ? withReveal(withDefaults, animation) : withDefaults;
  }
  return { components, categories, root };
}
