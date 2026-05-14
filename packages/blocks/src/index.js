// Public surface for @techrox/page-studio-blocks.
//
// Three groups of exports:
//   1. The Puck config builder + defaults (what most consumers want).
//   2. The block dictionary + helpers, for fine-grained extension.
//   3. The context provider + hook, for hosts that inject Link, services,
//      analytics, etc. into the block tree.

export {
  createPuckConfig,
  defaultBlocks,
  defaultCategories,
  defaultOverrides,
  emptyPuckData,
  normalizePuckData,
  applyConfigDefaults,
} from './config.jsx';

export { PageStudioProvider, useStudio, StudioLink } from './context.jsx';

export { withReveal } from './withReveal.jsx';

export {
  default as BlockThumbnail,
  BLOCK_DESCRIPTIONS,
} from './BlockThumbnail.jsx';

// Re-export every block by name so consumers can cherry-pick. Importing the
// whole library is fine in practice — tsup tree-shakes anything not reached
// by the consumer's import graph.
export { Hero } from './blocks/Hero.jsx';
export { SectionHeader } from './blocks/SectionHeader.jsx';
export { CTABanner } from './blocks/CTABanner.jsx';
export { Banner } from './blocks/Banner.jsx';
export { RichText } from './blocks/RichText.jsx';
export { PrinciplesList } from './blocks/PrinciplesList.jsx';
export { TwoColumn } from './blocks/TwoColumn.jsx';
export { ImageText } from './blocks/ImageText.jsx';
export { StatsStrip } from './blocks/StatsStrip.jsx';
export { PillarsRow } from './blocks/PillarsRow.jsx';
export { ApproachSteps } from './blocks/ApproachSteps.jsx';
export { ServicesGrid } from './blocks/ServicesGrid.jsx';
export { TeamGrid } from './blocks/TeamGrid.jsx';
export { LogoStrip } from './blocks/LogoStrip.jsx';
export { TestimonialQuote } from './blocks/TestimonialQuote.jsx';
export { TestimonialGrid } from './blocks/TestimonialGrid.jsx';
export { FAQ } from './blocks/FAQ.jsx';
export { Timeline } from './blocks/Timeline.jsx';
export { VideoEmbed } from './blocks/VideoEmbed.jsx';
export { ContactSection } from './blocks/ContactSection.jsx';
export { NewsletterSignup } from './blocks/NewsletterSignup.jsx';
export { ArticleFeatured } from './blocks/ArticleFeatured.jsx';
export { ArticleGrid } from './blocks/ArticleGrid.jsx';
export { ArticleList } from './blocks/ArticleList.jsx';
export { IconCards } from './blocks/IconCards.jsx';
export { MetricCards } from './blocks/MetricCards.jsx';
export { ImageOverlayCards } from './blocks/ImageOverlayCards.jsx';
export { PricingTable } from './blocks/PricingTable.jsx';
export { PricingComparison } from './blocks/PricingComparison.jsx';
export { AwardsBar } from './blocks/AwardsBar.jsx';
export { CountUpStats } from './blocks/CountUpStats.jsx';
export { ImageGallery } from './blocks/ImageGallery.jsx';
export { ImageCaption } from './blocks/ImageCaption.jsx';
export { InlineCTA } from './blocks/InlineCTA.jsx';
export { AnnouncementBar } from './blocks/AnnouncementBar.jsx';
export { Quote } from './blocks/Quote.jsx';
export { CodeBlock } from './blocks/CodeBlock.jsx';
export { KeyValueList } from './blocks/KeyValueList.jsx';
export { StepsVertical } from './blocks/StepsVertical.jsx';
export { TabsBlock } from './blocks/Tabs.jsx';
export { AccordionBlock } from './blocks/AccordionBlock.jsx';
export { SocialLinks } from './blocks/SocialLinks.jsx';
export { ContactInfo } from './blocks/ContactInfo.jsx';
export { MapEmbed } from './blocks/MapEmbed.jsx';
export { EventsList } from './blocks/EventsList.jsx';
export { Divider } from './blocks/Divider.jsx';
export { ThreeColumn } from './blocks/ThreeColumn.jsx';
export { PressMentions } from './blocks/PressMentions.jsx';
export { Container } from './blocks/Container.jsx';
export { Spacer } from './blocks/Spacer.jsx';
export { RawHtml } from './blocks/RawHtml.jsx';
